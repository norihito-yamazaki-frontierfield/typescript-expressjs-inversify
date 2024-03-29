import 'reflect-metadata';
import express from 'express';
import {InversifyExpressServer} from 'inversify-express-utils';
import {container} from './inversify.config';

// todo:move config
const port = 3000;

const configFn = (app: express.Application) => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
};

const errorConfigFn = (app: express.Application) => {
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: express.NextFunction
    ) => {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    }
  );
};

const callback = () => {
  console.log(`Server running on http://localhost:${port}`);
};

const server = new InversifyExpressServer(container, null, {
  rootPath: '/api/v1',
});

server
  .setConfig(configFn)
  .setErrorConfig(errorConfigFn)
  .build()
  .listen(port, 'localhost', callback);

// next:have
// keycloackへのjwtを使ってuserinfo取得
// mysql users からデータ取得
