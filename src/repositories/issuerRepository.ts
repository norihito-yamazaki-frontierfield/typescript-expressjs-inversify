import {injectable, inject} from 'inversify';
import {DbContext} from '../infrastructure/database/dbContext';
import {FieldPacket, RowDataPacket} from 'mysql2';

export interface IIssuer {
  iss: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IIssuerRepository {
  findAll(): Promise<IIssuer[]>;
}

@injectable()
export class IssuerRepository implements IIssuerRepository {
  constructor(@inject(DbContext) private dbContext: DbContext) {}

  async findAll(): Promise<IIssuer[]> {
    const [rows] = (await this.dbContext
      .getPool()
      .query('SELECT * FROM issuers')) as [RowDataPacket[], FieldPacket[]];

    return rows.map(
      (row): IIssuer => ({
        iss: row.iss,
        name: row.name,
        created_at: row.created_at,
        updated_at: row.updated_at,
      })
    );
  }
}
