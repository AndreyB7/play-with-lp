"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import SocketHandler from './socket';
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server();
const app = (0, express_1.default)();
const port = 3001;
app.get('/api/socket', (req, res) => {
    console.log('socket');
    //SocketHandler(req,res);
});
io.on('connection', () => {
    console.log('socked connected');
});
app.listen(port, () => {
    //if (err) throw err
    console.log(`> Ready on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map