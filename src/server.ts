import 'reflect-metadata';
import express from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { container } from './inversify.config';

const server = new InversifyExpressServer(container);

server.setConfig((app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
});

const app = server.build();

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
