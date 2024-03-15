import {inject, injectable} from 'inversify';
import {RedisClientType} from 'redis';

export interface IExampleService {
  setMessage(key: string, value: string): Promise<void>;
  getMessage(key: string): Promise<string>;
}
@injectable()
export class ExampleService implements IExampleService {
  private redisClient: RedisClientType;

  public constructor(@inject('RedisClient') redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  public async setMessage(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  public async getMessage(key: string): Promise<string> {
    const value = await this.redisClient.get(key);
    return value ?? '';
  }
}
