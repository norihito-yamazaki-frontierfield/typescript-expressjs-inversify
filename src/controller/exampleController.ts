import express from 'express';
import {inject} from 'inversify';
import {
  interfaces,
  controller,
  httpGet,
  httpPost,
  httpPut,
  request,
  requestBody,
  response,
  requestParam,
} from 'inversify-express-utils';
import {IExampleService} from '../services/exampleService';

@controller('/example')
export class ExampleController implements interfaces.Controller {
  constructor(
    @inject('IExampleService') private exampleService: IExampleService
  ) {}

  @httpGet('/:key')
  private async list(
    @requestParam('key') key: string,
    @response() res: express.Response
  ) {
    try {
      const message = await this.exampleService.getMessage(key);
      res.json({key, message});
    } catch (error) {
      res.status(500).send('An error occurred while fetching the message.');
    }
  }

  @httpPost('/')
  private async create(
    @request() req: express.Request,
    @response() res: express.Response
  ) {
    const {key, value} = req.body;
    if (!key || !value) {
      return res.status(400).send('Key and value are required.');
    }
    try {
      await this.exampleService.setMessage(key, value);
      return res.status(201).send('Message set successfully.');
    } catch (error) {
      return res
        .status(500)
        .send('An error occurred while setting the message.');
    }
  }

  @httpPut('/:key')
  private async update(
    @requestParam('key') key: string,
    @requestBody() body: {value: string},
    @response() res: express.Response
  ) {
    const {value} = body;
    if (!value) {
      return res.status(400).send('Value is required.');
    }
    try {
      await this.exampleService.setMessage(key, value);
      return res.send('Message updated successfully.');
    } catch (error) {
      return res
        .status(500)
        .send('An error occurred while updating the message.');
    }
  }
}
