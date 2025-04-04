import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";

//* Importing Routes in server.js *//
import routes from "./routes/routes.js";

//* Importing Database Connection *//
import connectDb from "./db/database.js";

import MongoStore from "connect-mongo";

//? For ES modules ?//
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//* Connecting app to express *//
const app = express();
dotenv.config();

//* Middlewares *//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../editor/dist")));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

//* CORS Configuration *//
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

//* Session Configuration *//
app.use(
  session({
    secret: process.env.SESSION || "editortestcode",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  })
);

//* Adding Routes *//
app.use(routes);

//* Error Handler *//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

//* Connecting frontend build *//
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../editor/dist/index.html"));
});

//* Database Connection *//
connectDb(process.env.MONGO_URL);

//* Server Start *//
const PORT = process.env.PORT || 3002;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
