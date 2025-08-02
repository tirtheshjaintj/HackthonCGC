import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./helpers/db.helper.js";
import { errorHandler } from "./helpers/error.helper.js";
import "dotenv/config";
import homeRouter from "./routes/index.js";

const allowedOrigins = [
    "*",
    process.env.FRONTEND_URL
];

const app = express();

const corsOptions = {
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
connectDB();


const port = process.env.PORT;


import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"
import reportRouter from "./routes/report.route.js"
app.use('/user',userRouter);
app.use('/admin' , adminRouter)
app.use('/report' , reportRouter)



app.get("/", (req, res) => {
    return res.send("Working Fine");
});


app.use("/api", homeRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

