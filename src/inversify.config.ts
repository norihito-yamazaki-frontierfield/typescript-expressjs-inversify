import 'reflect-metadata';
import { Container } from 'inversify';
import { IExampleService, ExampleService } from './services/exampleService';
import './controller/exampleController'
import { createClient } from 'redis';

const container = new Container();
container.bind<IExampleService>('IExampleService').to(ExampleService);

const redisClient = createClient({
    // todo:move config
    url: 'redis://localhost:6379'
});
redisClient.connect();
container.bind('RedisClient').toConstantValue(redisClient);


export { container };