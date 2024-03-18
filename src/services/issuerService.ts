import {inject, injectable} from 'inversify';
import {RedisClientType} from 'redis';
import {IIssuerRepository} from '../repositories/issuerRepository';

export interface IIssuerService {
  isValidIssuer(iss: string): Promise<boolean>;
}

@injectable()
export class IssuerService implements IIssuerService {
  constructor(
    @inject('RedisClient') private readonly redisClient: RedisClientType,
    @inject('IIssuerRepository') private issuerRepository: IIssuerRepository
  ) {
    this.initializeIssuersInRedis();
  }

  private async initializeIssuersInRedis(): Promise<void> {
    const keys = await this.redisClient.keys('issuer:*');
    for (const key of keys) {
      await this.redisClient.del(key);
    }
    const issuers = await this.issuerRepository.findAll();
    for (const issuer of issuers) {
      await this.redisClient.set(
        `issuer:${issuer.iss}`,
        JSON.stringify(issuer)
      );
    }
    console.log('Issuers have been reinitialized in Redis.');
  }

  async isValidIssuer(iss: string): Promise<boolean> {
    const validIssuer = await this.redisClient.get(`issuer:${iss}`);
    return !!validIssuer;
  }
}
