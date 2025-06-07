import express, { Express, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app: Express = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // client's address
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3001;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from the server!');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 