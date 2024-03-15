import axios, { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import { RedisClientType } from 'redis';

interface UserInfo {
    [key: string]: any;
}

export interface IKeycloakService {
    getUserInfo(token: string, hospitalId: string): Promise<UserInfo>;
}

@injectable()
export class KeycloakService implements IKeycloakService {
    private axiosInstances: { [key: string]: AxiosInstance } = {};

    public constructor(@inject('KeycloakBaseUri') private readonly keycloakBaseUri: string, @inject('RedisClient') private readonly redisClient: RedisClientType) {
        if (!this.keycloakBaseUri) {
            throw new Error(`Keycloak base URI is not provided.`);
        }
        if (!this.redisClient) {
            throw new Error(`Redis client is not injected.`);
        }
    }

    private createAxiosInstanceForHospital(hospitalId: string): AxiosInstance {
        return axios.create({
            baseURL: `${this.keycloakBaseUri}/realms/${hospitalId}`,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    private getAxiosInstance(hospitalId: string): AxiosInstance {
        if (!this.axiosInstances[hospitalId]) {
            this.axiosInstances[hospitalId] = this.createAxiosInstanceForHospital(hospitalId);
        }
        return this.axiosInstances[hospitalId];
    }
    public async getUserInfo(token: string, hospitalId: string): Promise<UserInfo> {
        if (!token) {
            throw new Error(`Token is not provided.`);
        }

        if (!hospitalId) {
            throw new Error(`Hospital ID is not provided.`);
        }
        const cacheKey = `userinfo_endpoint:${hospitalId}`;
        let userInfoEndpoint = await this.redisClient.get(cacheKey);

        if (!userInfoEndpoint) {
            const axiosInstance = this.getAxiosInstance(hospitalId);
            const openidConfigResponse = await axiosInstance.get('/.well-known/openid-configuration');
            userInfoEndpoint = openidConfigResponse.data.userinfo_endpoint;

            if (!userInfoEndpoint) {
                throw new Error(`userinfo_endpoint for hospitalId ${hospitalId} could not be found.`);
            }

            await this.redisClient.set(cacheKey, userInfoEndpoint, { EX: 60 * 60 });
        }

        const userInfoResponse = await axios.get(userInfoEndpoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return userInfoResponse.data;
    }

}