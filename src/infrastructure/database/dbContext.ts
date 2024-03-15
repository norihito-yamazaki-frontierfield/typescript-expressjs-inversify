import mysql from 'mysql2/promise';
import {inject, injectable} from 'inversify';

@injectable()
export class DbContext {
  private connectionPool: mysql.Pool;

  constructor(
    @inject('DBHost') private host: string,
    @inject('DBUser') private user: string,
    @inject('DBPassword') private password: string,
    @inject('DBName') private database: string
  ) {
    this.connectionPool = mysql.createPool({
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.database,
      waitForConnections: true,
      connectionLimit: 10,
    });
  }

  getPool(): mysql.Pool {
    return this.connectionPool;
  }
}
