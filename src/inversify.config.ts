import 'reflect-metadata';
import { Container } from 'inversify';
import { IExampleService, ExampleService } from './services/exampleService';
import './controller/exampleController'

const container = new Container();
container.bind<IExampleService>('IExampleService').to(ExampleService);

export { container };
