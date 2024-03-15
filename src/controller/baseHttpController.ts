import {
    BaseHttpController as inversifyBaseHttpController
} from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";

export abstract class BaseHttpController extends inversifyBaseHttpController {
    protected okJson<T>(content: T): JsonResult {
        return this.json(content, 200);
    }

    protected unauthorizedJson<T>(content?: T): JsonResult {
        return this.json(content ?? { message: "Unauthorized" }, 401);
    }
}