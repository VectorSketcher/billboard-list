import { PoolClient, QueryConfig, QueryResult } from 'pg';
import sql, { concatSql } from '../lib/sql-tag';

const snakeToCamel = (s: string) => s.replace(/_(.)/g, (m, c) => c.toUpperCase());
const camelToSnake = (s: string) => s.replace(/([a-z])([^a-z])/g, (m, c1, c2) => `${c1}_${c2.toLowerCase()}`);

export type ValueOrOther<T, U> = {
    [P in keyof T]: T[P] | U;
}
export type AllowStrings<T> = ValueOrOther<T, string>;

type NewType = any;

export function selectQuery(filterAndOrder?: string | QueryConfig,
  selectParams?: Partial<AllowStrings<NewType>>,
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
    filter = this.fieldsEqualValuesCustom(filterParams);
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
export function select(filterAndOrder?: string | QueryConfig,
  selectParams?: Partial<AllowStrings<NewType>>,
  filterParams?: Partial<AllowStrings<NewType>>,
  orderParams?: any,
  pagingParams?: any): Promise<NewType[]> {
  const query = this.selectQuery(filterAndOrder, selectParams, filterParams, orderParams, pagingParams);
  return this.executeAndMap(query);
}
