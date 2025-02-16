import express from "express";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes";
import generateEmbeddingsRoutes from "./routes/generate-embeddings.routes";
import chatbotRagStrategyAndLlmModeloRoutes from "./routes/chatbot-rag-strategy-and-llm-modelo.routes";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/health", healthRoutes);
app.use("/generate-embeddings", generateEmbeddingsRoutes);
app.use("/chatbot", chatbotRagStrategyAndLlmModeloRoutes);

// Obtener puerto de variables de entorno
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Iniciar servidor
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log(`Entorno: ${NODE_ENV}`);
  });
};

// Manejar errores de inicialización
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

export { app, startServer };
