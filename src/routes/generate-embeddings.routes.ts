import { Router, Request, Response } from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { Document } from "@langchain/core/documents";

import * as fs from "fs";
import * as path from "path";

config();

const ATLAS_URI = process.env.ATLAS_URI;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const execute = async () => {
  if (!ATLAS_URI || !OPENAI_API_KEY) {
    throw new Error(
      "Faltan las variables de entorno ATLAS_URI o OPENAI_API_KEY"
    );
  }

  // Leer el archivo JSON
  const filePath = path.join(__dirname, "..", "data.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const properties = JSON.parse(jsonData);

  // Conectar a MongoDB Atlas
  const client = new MongoClient(ATLAS_URI);
  await client.connect();
  const database = client.db("real_estate_db");
  const collection = database.collection("properties");

  // **Eliminar documentos existentes antes de cargar nuevos**
  const count = await collection.countDocuments();
  if (count > 0) {
    console.log(
      `⚠️ Eliminando ${count} documentos existentes en la colección...`
    );
    await collection.deleteMany({});
    console.log("✅ Colección limpia. Cargando nuevos datos...");
  }

  // **Configuración de la colección para `MongoDBAtlasVectorSearch`**
  const dbConfig = {
    collection: collection,
    indexName: "vector_index",
    textKey: "description",
    embeddingKey: "embedding",
  };

  // **Instancia del generador de embeddings**
  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

  // **Paso 1: Filtrar y generar descripciones válidas**
  const propertiesDTO = properties.map((property: any) => {
    const description = `${property.neighborhood}, ${property.municipality}, ${property.state}, ${property.country}, ${property.textBed} habitaciones, ${property.textBath} baños, ${property.textHalfBath} medios baños, Precio: ${property.currentPrice}`;

    return {
      currentPrice: property.currentPrice,
      // previousPrice: property.previousPrice,
      // discountPercentage: property.discountPercentage,
      country: property.country,
      state: property.state,
      municipality: property.municipality,
      neighborhood: property.neighborhood,
      // street: property.street,
      // street_number: property.street_number,
      // textBed: property.textBed,
      // textBath: property.textBath,
      // textHalfBath: property.textHalfBath,
      // textCrossDimensions: property.textCrossDimensions,
      // textGarage: property.textGarage,
      description,
    };
  });

  const docs = propertiesDTO.map(
    (property: any) =>
      new Document({
        pageContent: property.description, // Esto va a `textKey` en LangChain
        metadata: {
          currentPrice: property.currentPrice,
          country: property.country,
          state: property.state,
          municipality: property.municipality,
          neighborhood: property.neighborhood,
        },
      })
  );

  await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, dbConfig);

  await client.close();
};

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    await execute();
    res.status(200).json({
      status: "OK",
      message:
        "✅ Datos cargados exitosamente en la colección de MongoDB Atlas con embeddings.",
    });
  } catch (error: any) {
    console.error("❌ Error en el endpoint:", error);
    res.status(500).json({
      status: "ERROR",
      message: "❌ Error al cargar datos en MongoDB Atlas.",
      error: error.message,
    });
  }
});

export default router;
