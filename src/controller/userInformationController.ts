import { inject } from "inversify";
import {
    controller, httpGet
} from "inversify-express-utils";
import { IKeycloakService } from "../services/keycloakService";
import { BaseHttpController } from "./baseHttpController";

@controller("/userInformation")
export class userInformationController extends BaseHttpController {

    constructor(@inject("IKeycloakService") private keycloakService: IKeycloakService) {
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

    private getToken(authorizationHeader: string) {
        const tokenArray = authorizationHeader.split('Bearer ');
        if (tokenArray.length === 2) {
            return tokenArray[1].trim();
        }
        return null;
    }
}
