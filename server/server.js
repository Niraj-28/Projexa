const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server wrapping Express application
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Basic Socket.io handler
io.on('connection', (socket) => {
  console.log(`Client socket connected: ${socket.id}`);

  // Join a room based on companyId for multi-tenant notifications
  socket.on('join_company_room', (companyId) => {
    socket.join(companyId);
    console.log(`Socket ${socket.id} joined company room: ${companyId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client socket disconnected: ${socket.id}`);
  });
});

// Bind io instance to app so it can be accessed in controllers
app.set('io', io);

// Start listening
server.listen(PORT, () => {
  console.log(`WorkArea server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
