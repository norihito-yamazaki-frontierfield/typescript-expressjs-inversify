import { injectable } from "inversify";

export interface IExampleService {
    getMessage(): string;
}
@injectable()
export class ExampleService implements IExampleService {
    public getMessage(): string {
        return 'Hello, Inversify!';
    }
}