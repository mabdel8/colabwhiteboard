import express, { Express, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { connectToDatabase } from './utils/db';
import { Db } from 'mongodb';
import config from './config';

let db: Db;

async function startServer() {
  db = await connectToDatabase();

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

    socket.on('join-room', async (roomId) => {
      socket.join(roomId);
      console.log(`A user joined room: ${roomId}`);

      const drawings = await db.collection('drawings').find({ roomId }).toArray();
      socket.emit('initial-drawings', drawings);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('drawing', async (data) => {
      await db.collection('drawings').insertOne(data);
      socket.to(data.roomId).emit('drawing', data);
    });
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

startServer(); 