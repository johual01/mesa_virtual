import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieparser from 'cookie-parser';
import APIRoutes from "./routes/api";
import AuthRoutes from "./routes/login";
import { requestFile } from "./functions";

const app = express();

app.use(cors({origin: ['http://localhost:3000'], credentials: true, exposedHeaders: ["set-cookie"]}));
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(cookieparser());

//rutas de consulta
app.use("/api", APIRoutes);

//rutas de autenticacion
app.use('/auth', AuthRoutes);

app.use("/files", express.static(path.join(__dirname, "files")))

app.get('/dynamicFiles/:id', requestFile)

// read static files
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

export default app;
