"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const process = __importStar(require("process"));
const socket_1 = require("./socket/socket");
require('dotenv').config();
const app = (0, express_1.default)();
const port = 3001;
const server = (0, http_1.createServer)(app);
app.get('/', (req, res) => {
    res.json({ api: 'ok' });
});
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_HOST,
    }
});
io.on('connection', (socket) => {
    console.log('socked connected', socket.id);
    (0, socket_1.onConnection)(socket);
});
server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map