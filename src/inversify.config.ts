import 'reflect-metadata';
import { Container } from 'inversify';
import { IExampleService, ExampleService } from './services/exampleService';
import './controller/exampleController'
import './controller/userInformationController'
import { createClient } from 'redis';
import { IKeycloakService, KeycloakService } from './services/keycloakService';

// todo:move config
const keycloakBaseUri = 'http://localhost:8080';

const container = new Container();
container.bind<IExampleService>('IExampleService').to(ExampleService);
container.bind<IKeycloakService>('IKeycloakService').to(KeycloakService);
container.bind('KeycloakBaseUri').toConstantValue(keycloakBaseUri);

const redisClient = createClient({
    // todo:move config
    url: 'redis://localhost:6379'
});
redisClient.connect();
container.bind('RedisClient').toConstantValue(redisClient);


export { container };