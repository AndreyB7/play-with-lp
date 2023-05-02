import express, {Express} from 'express';
import {Server} from "socket.io";
import {createServer} from 'http';
import * as process from "process";
import { onConnection } from "./socket/socket";
require('dotenv').config();

const app: Express = express();
const port = 3001;

const server = createServer(app);

app.get('/api/status', (req, res) => {
  res.json({api:'ok'});
})

const io = new Server(server, {
  path: '/api/socket.io',
  cors: {
    origin: process.env.CLIENT_HOST,
  }
});

io
  .of('api')
  .on('connection', (socket) => {
  console.log('socked connected', socket.id);
  onConnection(socket);
})

server.listen(port, () => {
  console.log(`> Ready on http://localhost:${ port }`)
})
