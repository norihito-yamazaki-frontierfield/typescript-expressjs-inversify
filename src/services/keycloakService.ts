import {inject, injectable} from 'inversify';
import {RedisClientType} from 'redis';
import {decodeJwt} from 'jose';

interface UserInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface IKeycloakService {
  getUserInfo(token: string): Promise<UserInfo>;
}

@injectable()
export class KeycloakService implements IKeycloakService {
  public constructor(
    @inject('KeycloakBaseUri') private readonly keycloakBaseUri: string,
    @inject('RedisClient') private readonly redisClient: RedisClientType
  ) {
    if (!this.keycloakBaseUri) {
      throw new Error('Keycloak base URI is not provided.');
    }
    if (!this.redisClient) {
      throw new Error('Redis client is not injected.');
    }
  }

  private decodeToken(token: string) {
    return decodeJwt(token);
  }

  private async getUserInfoEndpoint(issuer: string): Promise<string> {
    const cacheKey = `userinfo_endpoint:${issuer}`;
    const cachedEndpoint = await this.redisClient.get(cacheKey);

    if (cachedEndpoint) return cachedEndpoint;

    const response = await fetch(`${issuer}/.well-known/openid-configuration`);
    if (!response.ok) throw new Error('Failed to fetch OpenID configuration.');

    const {userinfo_endpoint: userinfoEndpoint} = await response.json();
    if (!userinfoEndpoint)
      throw new Error(
        `userinfo_endpoint for issuer ${issuer} could not be found.`
      );

    await this.redisClient.set(cacheKey, userinfoEndpoint, {EX: 60 * 60});
    return userinfoEndpoint;
  }

  public async getUserInfo(token: string): Promise<UserInfo> {
    if (!token) throw new Error('Token is not provided.');

    const decodedToken = this.decodeToken(token);
    if (!decodedToken.iss) {
      throw new Error('Issuer (iss) is not present in the token.');
    }
    const issuer = decodedToken.iss; // この時点で issuer は string 型として確実に扱えます

    const userInfoEndpoint = await this.getUserInfoEndpoint(issuer);

    const response = await fetch(userInfoEndpoint, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (!response.ok) throw new Error('Failed to fetch user info.');

    return response.json();
  }
}
