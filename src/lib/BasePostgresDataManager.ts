/* eslint-disable no-useless-catch */
/* eslint-disable new-cap */
import sql, { concatSql, joinSql } from './sql-tag';
import { PoolClient, QueryConfig, QueryResult } from 'pg';
import { DatabaseConnectionError } from './error';
import { DatabaseConnectionManager } from './DatabaseConnectionManager';
import { DatasourceConfig } from './DatasourceConfig';

// Don't parse dates into `Date` objects; keep as string
// const PG_DATE_OID = 1082;
// types.setTypeParser(PG_DATE_OID, v => v);

const snakeToCamel = (s: string) => s.replace(/_(.)/g, (m, c) => c.toUpperCase());
const camelToSnake = (s: string) => s.replace(/([a-z])([^a-z])/g, (m, c1, c2) => `${c1}_${c2.toLowerCase()}`);

export type ValueOrOther<T, U> = {
    [P in keyof T]: T[P] | U;
}
export type AllowStrings<T> = ValueOrOther<T, string>;

export abstract class BasePostgresDataManager<T /* extends { [k: string]: any } */> {
    private connectionManager: DatabaseConnectionManager;

    protected abstract getDatabaseConfigurations(): DatasourceConfig;

    protected abstract getAwsConfiguration(): any;

    /**
     * Name of the database table for this model
     */
    protected abstract tableName: string;

    // TODO: add logging support
    // protected abstract logger?: Logger;

    // TODO: do we need to check the type of the value? i.e. don't include functions
    private readonly fieldMap = new Map(Object.keys(new this.tConstructor({})).map(k => [k, camelToSnake(k)] as [keyof T, string]));

    /**
     * A comma-separated list of the database columns for this table
     * Useful in SELECT and INSERT clauses
     */
    protected readonly fields = Array.from(this.fieldMap.values()).join(', ');

    /**
     * A comma-separated list of the database columns for this table with AS statements mapping to camelCase names
     * Useful in RETURNING clauses
     */
    protected readonly fieldsAsCamel = Array.from(this.fieldMap.entries()).map(e => `${e[1]} AS "${e[0]}"`).join(', ');

    /**
     * Get a comma-separated list of an object's values, in parameterized QueryConfig format and in the same order as `this.fields`
     * Useful in the VALUES clause of an INSERT statement
     * @param t
     */
    protected values(t: AllowStrings<T>): QueryConfig {
      const vals = Array.from(this.fieldMap.keys()).map(k => sql`${t[k]}`);
      return joinSql(vals, ', ');
    }

    /**
     * Get a comma-separated list of field value assignments, in parameterized QueryConfig format
     * Useful in the SET clause of an UPDATE statement
     * @param t
     */
    protected fieldsEqualValues(t: Partial<AllowStrings<T>>): QueryConfig {
      const vals = Array.from(this.fieldMap.entries())
        .filter(e => t[e[0]] !== undefined)
        .map(e => concatSql(`${e[1]} =`, sql`${t[e[0]]}`));
      return joinSql(vals, ', ');
    }

    constructor(private readonly tConstructor: new (t: { [k: string]: any }) => T) {
      this.connectionManager = new DatabaseConnectionManager();
    }

    /**
     * Get a client from the pool
     */
    protected async getClient(query: QueryConfig): Promise<PoolClient> {
      const sqlOperation = query.text.search(/select/i) === 0 ? 'Read' : 'Write';

      try {
        return await this.connectionManager.getDbConnection(sqlOperation, this.getDatabaseConfigurations(), this.getAwsConfiguration());
      } catch (e) {
        throw new DatabaseConnectionError('Error getting client database connection', e);
      }
    }

    /**
     * Execute a query and release the client back to the pool
     * @param query
     */
    protected async execute(query: QueryConfig): Promise<QueryResult> {
      const client = await this.getClient(query);
      try {
        return await client.query(query);
      } catch (e) {
        // TODO: throw a custom error or just pass it on?
        // logger.error(e);
        // throw new InternalServerError({ description: 'Error querying database', body: e.stack });
        throw e;
      } finally {
        client.release(new Error());
      }
    }

    /**
     * Execute a query and map the returned rows to T
     * @param query
     */
    protected async executeAndMap(query: QueryConfig): Promise<T[]> {
      const result = await this.execute(query);
      return result.rows.map(r => new this.tConstructor(r));
    }

    /**
     * Test the database connection and existence of the table
     */
    public async testConnection(): Promise<boolean> {
      const query = concatSql(`SELECT NOW() FROM ${this.tableName} LIMIT 1`);
      await this.execute(query);
      return true;
    }

    // -------------------------------------------------------------------------
    // Convenience helpers for simple queries
    // Potential improvement: generate WHERE clause given an object.
    //      - could constrain keys
    //      - would only work for equality though
    // -------------------------------------------------------------------------

    /**
     * Construct a query to count records
     * @param where
     */
    protected countQuery(where?: string | QueryConfig): QueryConfig {
      return concatSql(`SELECT COUNT(*) FROM ${this.tableName}`, where);
    }

    /**
     * Count the number of records in the database table
     * @param where
     */
    protected async count(where?: string | QueryConfig): Promise<number> {
      const query = this.countQuery(where);
      const result = await this.execute(query);
      // node-postgres keeps COUNT() value a string because it's an int8 and JS can't handle 64-bit numbers. parsing it anyway for now...
      return parseInt(result.rows[0].count, 10);
    }

    /**
     * Construct a query to select records
     * @param filterAndOrder
     * @param selectParams
     * @param filterParams
     * @param orderParams
     * @param pagingParams
     */
    protected selectQuery(filterAndOrder?: string | QueryConfig,
      selectParams?: Partial<AllowStrings<T>>,
      filterParams?: any,
      orderParams?: any,
      pagingParams?: any): QueryConfig {
      let filter;
      let select;
      let order;
      if (filterParams) {
        Object.keys(filterParams).forEach(key => {
          if (!filterParams[key]) {
            delete filterParams[key];
          }
        });
        if (orderParams) {
          const fieldMap = Object.keys(orderParams).map(k => [k, camelToSnake(k), orderParams[k]]);
          order = fieldMap.map(e => `${e[1]} ${e[2]}`).join(', ');
        }
      }
      filterAndOrder = concatSql(!!filter && 'WHERE',
        !!filter && filter,
        !!filterAndOrder && filterAndOrder,
        !!order && 'ORDER BY',
        !!order && order,
        !!pagingParams && `LIMIT ${pagingParams.limit} OFFSET ${pagingParams.offset}`
      );
      if (selectParams) {
        const fieldMap = Object.keys(selectParams).map(k => [k, camelToSnake(k)]);
        select = fieldMap.map(e => `${e[1]} AS "${e[0]}"`).join(', ');
      }

      return concatSql(`SELECT ${select || this.fieldsAsCamel} FROM ${this.tableName}`, filterAndOrder);
    }

    /**
     * Select records
     * @param filterAndOrder may include WHERE, ORDER, LIMIT and OFFSET clauses
     */
    protected select(filterAndOrder?: string | QueryConfig,
      selectParams?: Partial<AllowStrings<T>>,
      filterParams?: Partial<AllowStrings<T>>,
      orderParams?: any,
      pagingParams?: any): Promise<T[]> {
      const query = this.selectQuery(filterAndOrder, selectParams, filterParams, orderParams, pagingParams);
      return this.executeAndMap(query);
    }

    /**
     * Construct a query to insert records
     * @param obj
     */
    protected insertQuery(...objs: AllowStrings<T>[]): QueryConfig {
      return concatSql(
            `INSERT INTO ${this.tableName} (${this.fields}) VALUES`,
            ...objs.map((obj, i, arr) => concatSql('(', this.values(obj), i < arr.length - 1 ? '),' : ')')),
            `RETURNING ${this.fieldsAsCamel}`
      );
    }

    /**
     * Insert and return records
     * @param obj
     */
    protected insert(...objs: AllowStrings<T>[]): Promise<T[]> {
      const query = this.insertQuery(...objs);
      return this.executeAndMap(query);
    }

    /**
     * Construct a query to update records
     * @param obj
     * @param where
     * @param returnFields
     */
    protected updateQuery(obj: Partial<AllowStrings<T>>, where?: string | QueryConfig, returnFields?: Partial<AllowStrings<T>>): QueryConfig {
      let returnClause = `RETURNING ${this.fieldsAsCamel}`;
      if (!!returnFields && Object.keys(returnFields).length > 0) {
        const fieldMap = Object.keys(returnFields).map(k => [k, camelToSnake(k)]);
        const fieldString = fieldMap.map(e => `${e[1]} AS "${e[0]}"`).join(', ');
        returnClause = `RETURNING ${fieldString}`;
      }
      return concatSql(`UPDATE ${this.tableName} SET`, this.fieldsEqualValues(obj), where, returnClause);
    }

    /**
     * Update and return records
     * @param obj
     * @param where
     * @param returnFields
     */
    protected update(obj: Partial<AllowStrings<T>>, where?: string | QueryConfig, returnFields?: Partial<AllowStrings<T>>): Promise<T[]> {
      const query = this.updateQuery(obj, where, returnFields);
      return this.executeAndMap(query);
    }

    /**
     * Construct a query to delete records
     * @param where
     */
    protected deleteQuery(where?: string | QueryConfig): QueryConfig {
      return concatSql(
            `DELETE FROM ${this.tableName}`,
            where,
            `RETURNING ${this.fieldsAsCamel}`
      );
    }

    /**
     * Delete and return records
     * @param where
     */
    protected delete(where?: string | QueryConfig): Promise<T[]> {
      const query = this.deleteQuery(where);
      return this.executeAndMap(query);
    }
}
