import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Server as HttpServer } from 'http';
import { Server  } from 'socket.io';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controller/auth.js";
import { createPost } from "./controller/posts.js";
import { verifytoken } from "./middleware/auth.js";
import Message from "./models/message.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();



// const corsOptions = {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     credentials: true,
//     optionSuccessStatus: 200
// };
// // app.options('*', cors()); // Preflight request handler

// app.use(cors(corsOptions));
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// File storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("I am in Multer");
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      console.log(file.originalname);
        cb(null,`${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Set up routes
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifytoken, upload.single("picture"), createPost);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);


// Set up Socket.IO
const server = HttpServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend origin
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  socket.on('join', ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on('message', async ({ userId, friendId, text }) => {
    const newMessage = new Message({ sender: userId, recipient: friendId, text });
    await newMessage.save();
    const roomId = [userId, friendId].sort().join('_');
    io.to(roomId).emit('message', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
  mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })
      .then(() => {
          server.listen(PORT, () => console.log(`Server Port:${PORT}`));
      })
      .catch((error) => console.log(`${error} did not connect`));
