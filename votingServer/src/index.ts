import * as express from 'express';
import { Logger } from './config/logger';
import { SomeController } from './api/v1/controllers/some.controller';

var cors = require('cors')
const { uuid } = require('uuidv4');
const { WebSocketServer } = require('ws');
const http = require('http');

// Spinning the HTTP server and the WebSocket server.
const clients = {};

export async function start(): Promise<express.Application> {

    const app: express.Application = express();

    app.use(express.json());

    const controller = new SomeController(clients);

    //app.use(cors({ origin: ['http://localhost:3000'] })); 

    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    app.post('/v1/admin', async (req, res) => {
        res.send(await controller.loginAdmin(req))
    });

    app.post('/v1/login', async (req, res) => {
        res.send(await controller.loginUser(req))
    });

    app.post('/v1/vote', async (req, res) => {
        res.send(await controller.userVote(req))
    });

    app.post('/v1/maxVotes', async (req, res) => {
        res.send(await controller.setMaxVotes(req))
    });

    app.post('/v1/skip', async (req, res) => {
        res.send(await controller.skipVote(req))
    });

    app.post('/v1/next', async (req, res) => {
        res.send(await controller.next(req))
    });

    app.post('/v1/reset', async (req, res) => {
        res.send(await controller.reset(req))
    });

    app.post('/v1/remove', async (req, res) => {
        res.send(await controller.remove(req))
    });

    app.post('/v1/politic', async (req, res) => {
        res.send(await controller.politic(req))
    });

    app.locals.server = await app.listen(3001);

    const server = http.createServer();
    const wsServer = new WebSocketServer({ server });

    wsServer.on('connection', function (connection) {
        // Generate a unique code for every user
        const userId: string = uuid();
        console.log(`Recieved a new connection.`);

        // Store the new connection and handle messages
        clients[userId] = { client: connection };
        console.log(`${userId} connected.`);

        connection.send(JSON.stringify({ userId: userId }));
    });

    const port = 3002;
    server.listen(port, () => {
        console.log(`WebSocket server is running on port ${port}`);
    });

    return app;
}

Logger.appStarting();
start()
    .then(Logger.appRunning)
    .catch(Logger.appStartFailed);
