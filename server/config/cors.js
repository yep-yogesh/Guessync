import cors from 'cors';

const allowedOrigins = process.env.ALLOWED_ORIGINS ?
  process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) :
  [];

// Express CORS middleware
export const corsMiddleware = () =>
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

// Socket.IO CORS config
export const socketCorsConfig = {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
};

export const getAllowedOrigins = () => allowedOrigins;