/* eslint-disable no-useless-constructor */
import { DatasourceConfig } from './DatasourceConfig';
import { PoolClient, Pool } from 'pg';
import { DatabaseConnectionError, DatasourceConfigurationError } from './error';

export interface ConnectionString {
    user: string;
    password: string;
    port: number;
    host: string;
    database: string;
}

const AWS = require('aws-sdk');
const NodeCache = require('node-cache');
const connectionsCache = new NodeCache({ stdTTL: 120, checkperiod: 15 });

export class DatabaseConnectionManager {
  constructor() { }

  /**
     *
     * Establishes a database connection from the connection pool. First it attempts to do so
     * from a cached instance of the pool otherwise fetches from PG helper.
     *
     */
  public async getDbConnection(sqlOperation: string, datasourceConfig: DatasourceConfig, secretsConfig: any): Promise<PoolClient> {
    try {
      return await this.getConnectionPoolConfigAsync(sqlOperation, datasourceConfig, secretsConfig).then((connPool) => {
        return connPool.connect();
      });
    } catch (e) {
      connectionsCache.flushAll();
      throw new DatabaseConnectionError('Problem establishing database connection', e);
    }
  }

  /**
     *
     * Fetches a connection from the PG helper with the proviced credentials.
     *
     */
  private async getConnectionPoolConfigAsync(sqlOperation: string, config: DatasourceConfig, secretsConfig: any) {
    const connectionPool = connectionsCache.get(`${config.name}_${sqlOperation}`);

    if (connectionPool) {
      return connectionPool;
    } else {
      return this.getPoolConfiguration(sqlOperation, config, secretsConfig).then((poolConfig) => {
        const pool = new Pool(poolConfig);

        connectionsCache.set(`${config.name}_${sqlOperation}`, pool);

        return pool;
      });
    }
  }

  /*
    * Retrieve the Connection information from AWS secret manager.
    */
  private async getPoolConfiguration(sqlOperation: string, config: DatasourceConfig, awsConfig: any): Promise<ConnectionString> {
    const params = {
      SecretId: process.env.DB_SECRET,
      VersionStage: 'AWSCURRENT'
    };

    const secretsmanager = new AWS.SecretsManager(awsConfig);
    const awspromise = await secretsmanager.getSecretValue(params).promise();
    const output = JSON.parse(awspromise.SecretString);
    return {
      user: output.username,
      password: output.password,
      port: output.port,
      host: sqlOperation === 'Read' ? output.hostReadOnly : output.host,
      database: config.database
    };
  }
}
