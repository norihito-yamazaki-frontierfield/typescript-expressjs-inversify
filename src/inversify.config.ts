import 'reflect-metadata';
import {Container} from 'inversify';
import {IExampleService, ExampleService} from './services/exampleService';
import './controller/exampleController';
import './controller/userInformationController';
import {createClient} from 'redis';
import {IKeycloakService, KeycloakService} from './services/keycloakService';
import {DbContext} from './infrastructure/database/dbContext';
import {IUserRepository, UserRepository} from './repositories/userRepository';

// todo:move config
const keycloakBaseUri = 'http://localhost:8080';

const container = new Container();
container
  .bind<IExampleService>('IExampleService')
  .to(ExampleService)
  .inSingletonScope();
container
  .bind<IKeycloakService>('IKeycloakService')
  .to(KeycloakService)
  .inSingletonScope();
container.bind('KeycloakBaseUri').toConstantValue(keycloakBaseUri);

container.bind<DbContext>(DbContext).toSelf().inSingletonScope();
// todo:move config
container.bind<string>('DBHost').toConstantValue('localhost');
container.bind<string>('DBUser').toConstantValue('local-db-user');
container.bind<string>('DBPassword').toConstantValue('password');
container.bind<string>('DBName').toConstantValue('my_custom_db');

container
  .bind<IUserRepository>('IUserRepository')
  .to(UserRepository)
  .inSingletonScope();

const redisClient = createClient({
  // todo:move config
  url: 'redis://localhost:6379',
});
redisClient.connect();
container.bind('RedisClient').toConstantValue(redisClient);

export {container};
