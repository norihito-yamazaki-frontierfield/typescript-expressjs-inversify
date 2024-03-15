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

    @httpGet("/:keycloak_user_id")
    public async getDb(@requestParam("keycloak_user_id") keycloak_user_id: string) {
        const user = await this.userRepository.findById(keycloak_user_id);

        if (user) {
            return this.okJson(user);
        } else {
            return this.notFound();
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
