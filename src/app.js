import"dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();


app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json({ limit: "16kb", host: "0.0.0.0" }));
app.use(express.urlencoded({ extended: true, limit: "16kb", host: '0.0.0.0' }));
app.use(express.static("public"));
app.use(cookieParser());

// Import and use the user routes
import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import itemRouter from "./routes/items.routes.js"
app.use("/api/v1/items" , itemRouter)




export { app };
