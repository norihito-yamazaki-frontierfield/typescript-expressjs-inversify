import express from 'express';
import { inject, injectable } from 'inversify';
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam } from "inversify-express-utils";
import { IExampleService } from '../services/exampleService';

@controller("")
export class ExampleController implements interfaces.Controller {

    constructor(@inject("IExampleService") private exampleService: IExampleService) { }

    @httpGet("/")
    public index(@request() req: express.Request, @response() res: express.Response): string {
        return `${this.exampleService.getMessage()}`
    }
}
