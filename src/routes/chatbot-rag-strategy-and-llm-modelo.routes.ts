import { Router, Request, Response } from "express";
import { config } from "dotenv";
import { MongoClient } from "mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { ConversationChain } from "langchain/chains";
import { BufferMemory, ChatMessageHistory } from "langchain/memory"; // ✅ Corrección: Importar ChatMessageHistory

config();

const ATLAS_URI = process.env.ATLAS_URI;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Mapeo de sesiones a memoria para cada usuario
const memorySessions = new Map<string, BufferMemory>();

// Función para obtener o crear la memoria de una sesión
const getMemory = (sessionId: string) => {
  if (!memorySessions.has(sessionId)) {
    memorySessions.set(
      sessionId,
      new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
        chatHistory: new ChatMessageHistory(), // ✅ Agregar chatHistory explícitamente
      })
    );
  }
  return memorySessions.get(sessionId)!;
};

// Función para ejecutar la búsqueda de propiedades
const execute = async (query: string) => {
  if (!ATLAS_URI || !OPENAI_API_KEY) {
    throw new Error(
      "Faltan las variables de entorno ATLAS_URI o OPENAI_API_KEY"
    );
  }

  const client = new MongoClient(ATLAS_URI);
  await client.connect();
  const database = client.db("real_estate_db");
  const collection = database.collection("properties");

  const dbConfig = {
    collection,
    indexName: "vector_index",
    textKey: "description",
    embeddingKey: "embedding",
  };

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

  console.log(`🔍 Buscando propiedades similares a: ${query}`);

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, dbConfig);
  const results = await vectorStore.similaritySearch(query, 5);

  const formattedResults = results.map((doc) => ({
    property_id: doc.metadata?.property_id ?? "Desconocido",
    description: doc.pageContent,
    country: doc.metadata?.country ?? "Desconocido",
    state: doc.metadata?.state ?? "Desconocido",
    municipality: doc.metadata?.municipality ?? "Desconocido",
    neighborhood: doc.metadata?.neighborhood ?? "Desconocido",
    currentPrice: doc.metadata?.currentPrice ?? "Desconocido",
  }));

  await client.close();
  return formattedResults;
};

// Función para generar la respuesta del chatbot con memoria
const generateResponse = async (query: string, sessionId: string) => {
  const memory = getMemory(sessionId);

  // ✅ Verificar la memoria antes de hacer la consulta al LLM
  console.log(`📌 Memoria antes de la consulta para sesión: ${sessionId}`);
  console.log(await memory.chatHistory.getMessages());

  const chat = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,
    temperature: 0.7,
  });

  const promptTemplate = new PromptTemplate({
    template: `
    Eres un asesor de bienes raíces altamente capacitado y amigable.
    Tu objetivo es ayudar a los usuarios a encontrar la propiedad ideal basándote en sus necesidades
    y responder de manera clara y natural.

    ## Información del Cliente:
    - **Consulta actual:** "{input}"
    - **Historial de conversación:** {history}

    ## Consideraciones:
    - Recuerda lo que el usuario ha preguntado previamente.
    - Si ha buscado propiedades antes, haz referencia a esas opciones.
    - Si el usuario aún no ha decidido, ayúdalo a comparar opciones y sugiere agendar una visita.
    - Mantén un tono amigable y claro.

    ## Respuesta:
    Genera una respuesta natural, manteniendo el contexto del usuario y sugiriendo las mejores opciones.
    `,
    inputVariables: ["input", "history"],
  });

  const conversation = new ConversationChain({
    llm: chat,
    prompt: promptTemplate,
    memory,
  });

  const response = await conversation.call({ input: query });

  // ✅ Guardar en memoria correctamente
  await memory.saveContext({ input: query }, { output: response.response });

  // ✅ Verificar la memoria después de la consulta
  console.log(`📌 Memoria después de la consulta para sesión: ${sessionId}`);
  console.log(await memory.chatHistory.getMessages());

  return response.response;
};

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { query, sessionId } = req.body;
  if (!query || !sessionId) {
    res.status(400).json({
      status: "ERROR",
      message: "❌ Falta la consulta o sessionId en el body",
    });
    return;
  }

  try {
    const formattedResults = await execute(query);
    const aiResponse = await generateResponse(query, sessionId);

    res.status(200).json({
      status: "OK",
      message: "✅ Respuesta generada exitosamente.",
      results: formattedResults,
      chatbotResponse: aiResponse,
    });
  } catch (error: any) {
    console.error("❌ Error en la búsqueda:", error);
    res.status(500).json({
      status: "ERROR",
      message: "❌ Error al procesar la búsqueda.",
      error: error.message,
    });
  }
});

export default router;
