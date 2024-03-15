import {injectable, inject} from 'inversify';
import {DbContext} from '../infrastructure/database/dbContext';
import {RowDataPacket} from 'mysql2';

export interface ICompany {
  id: number;
  name: string;
}

export interface IOffice {
  id: number;
  company_id: number;
  name: string;
}

export interface IUser {
  id: number;
  keycloak_user_id: string;
  name: string;
  email?: string;
  company_id: number;
  office_id: number;
  company?: ICompany;
  office?: IOffice;
}

export interface IUserRepository {
  findById(keycloak_user_id: string): Promise<IUser | null>;
}
@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(DbContext) private dbContext: DbContext) {}

  public async findById(keycloak_user_id: string): Promise<IUser | null> {
    const query = `
            SELECT users.*, companies.id AS companyId, companies.name AS companyName, 
            offices.id AS officeId, offices.company_id AS officeCompanyId, offices.name AS officeName
            FROM users
            JOIN companies ON users.company_id = companies.id
            JOIN offices ON users.office_id = offices.id
            WHERE users.keycloak_user_id = ?
        `;

    const [rows] = (await this.dbContext
      .getPool()
      .query(query, [keycloak_user_id])) as [RowDataPacket[], any];

    if (rows.length > 0) {
      const row = rows[0];
      const user: IUser = {
        id: row.id,
        keycloak_user_id: row.keycloak_user_id,
        name: row.name,
        email: row.email,
        company_id: row.companyId,
        office_id: row.officeId,
        company: {
          id: row.companyId,
          name: row.companyName,
        },
        office: {
          id: row.officeId,
          company_id: row.officeCompanyId,
          name: row.officeName,
        },
      };

      return user;
    }

    return null;
  }
}
