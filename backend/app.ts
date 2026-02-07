import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import cookieparser from 'cookie-parser';
import APIRoutes from "./routes/api";
import AuthRoutes from "./routes/login";
import { requestFile } from "./functions";

const app = express();

// Configurar origenes permitidos para CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://frontend:3000',  // Docker internal
  process.env.URL?.replace(/\/api\/?$/, ''),  // URL publica sin /api
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins as string[],
  credentials: true,
  exposedHeaders: ["set-cookie"]
}));
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

// Health check endpoint para Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// read static files
app.use(express.static(path.join(__dirname, "..", "..", "dist")));

export default app;
