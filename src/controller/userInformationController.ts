import { inject } from "inversify";
import {
    controller, httpGet,
    requestParam
} from "inversify-express-utils";
import { IKeycloakService } from "../services/keycloakService";
import { BaseHttpController } from "./baseHttpController";
import { IUserRepository } from "../repositories/userRepository";

@controller("/userInformation")
export class userInformationController extends BaseHttpController {

    constructor(@inject("IKeycloakService") private keycloakService: IKeycloakService,
        @inject("IUserRepository") private userRepository: IUserRepository) {
        super();
    }

    @httpGet("/")
    public async get() {
        const authHeader = this.httpContext.request.headers["authorization"];
        if (!authHeader) {
            return this.unauthorizedJson("Unauthorized: No token provided or token is improperly formatted.");
        }

        const token = this.getToken(authHeader);
        if (!token) {
            return this.unauthorizedJson("Unauthorized: No token provided or token is improperly formatted.");
        }

        const target_realm = "local-realm";
        const result = await this.keycloakService.getUserInfo(token, target_realm);

        return this.okJson(result);
    }

    @httpGet("/enrich")
    public async getEnrich() {
        const authHeader = this.httpContext.request.headers["authorization"];
        if (!authHeader) {
            return this.unauthorizedJson("Unauthorized: No token provided or token is improperly formatted.");
        }

        const token = this.getToken(authHeader);
        if (!token) {
            return this.unauthorizedJson("Unauthorized: No token provided or token is improperly formatted.");
        }

        const target_realm = "local-realm";
        let userInfo = await this.keycloakService.getUserInfo(token, target_realm);

        if (!userInfo || !userInfo.sub) {
            return this.badRequest("UserInfo from Keycloak is missing or does not have a sub property.");
        }

        const user = await this.userRepository.findById(userInfo.sub);

        if (user) {
            userInfo = { ...userInfo, ...user };
            return this.okJson(userInfo);
        } else {
            return this.badRequest("User not found in the repository.");
        }

    }

    private getToken(authorizationHeader: string) {
        const tokenArray = authorizationHeader.split('Bearer ');
        if (tokenArray.length === 2) {
            return tokenArray[1].trim();
        }
        return null;
    }
}
