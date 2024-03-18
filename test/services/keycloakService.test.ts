import redisMock, {RedisClientType} from 'redis-mock';
import {KeycloakService} from '../../src/services/keycloakService';

jest.mock('redis', () => jest.requireActual('redis-mock'));

const mockRedisClient = redisMock.createClient() as unknown as RedisClientType;

describe('KeycloakService', () => {
  const keycloakBaseUri = 'https://keycloak.example.com';

  beforeEach(() => {});

  it('should throw error if Keycloak base URI or Redis client is not provided', () => {
    expect(() => new KeycloakService('', mockRedisClient)).toThrow();
    expect(
      () =>
        new KeycloakService(keycloakBaseUri, mockRedisClient as RedisClientType)
    ).not.toThrow();
  });
});
