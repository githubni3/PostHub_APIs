import express, { json } from "express";
import userRouter from "./routes/user.js";
import postRouter from "./routes/post.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./middlewares/error.js";
import cors from 'cors'
import fileUpload from "express-fileupload";
import session from 'express-session';

const app = express();
config({
  path: "./data/config.env",
});
//using middleware
app.use(json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles:true
}))
app.use(
  session({
    secret: 'mySecretKey',
    resave: false,
    saveUninitialized: true
  })
);
app.use(cors({
  origin:[`https://posthubpro.netlify.app`],
  methods:["GET","POST","PUT","DELETE"],
  credentials:true
}))

// using routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);

app.get("/", (req, res) => {
  res.send("<h1>PostHub Backend is Active</h1>");
});

// using error middleware

// here whenever we call next() with the error then this errorMiddleWare will be called automatically, this functionality is provide by express
// e.g.   next(new Error("This is error"));
app.use(errorMiddleWare);

export default app;
