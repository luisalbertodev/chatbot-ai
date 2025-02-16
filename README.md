# Chatbot RAG con LangChain y MongoDB Atlas

Este proyecto implementa un chatbot basado en la estrategia Retrieval-Augmented Generation (RAG) utilizando **LangChain**, **MongoDB Atlas Vector Search** y **OpenAI GPT**. El chatbot busca propiedades inmobiliarias en una base de datos vectorial y responde en lenguaje natural con memoria de sesión.

## 📌 Tecnologías Utilizadas

- **Node.js** con **Express.js** para la API.
- **LangChain** para la integración con modelos de lenguaje y recuperación de información.
- **MongoDB Atlas Vector Search** para la búsqueda semántica de propiedades.
- **OpenAI GPT** para la generación de respuestas naturales.
- **BufferMemory** para la gestión de memoria en la conversación.

## 📂 Estructura del Proyecto

```
nodejs-typescript-backend/
│── dist/  # Archivos compilados
│── node_modules/  # Dependencias
│── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   │   ├── chatbot-rag-strategy-and-llm-modelo.routes.ts  # Chatbot con RAG y memoria
│   │   ├── generate-embeddings.routes.ts  # Generación de embeddings
│   │   ├── health.routes.ts  # Ruta de salud
│   ├── data.json  # Datos de prueba
│   ├── index.ts
│   ├── server.ts
│── .env  # Configuración de entorno
│── package.json  # Dependencias del proyecto
│── tsconfig.json  # Configuración de TypeScript
```

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/tu-repo/chatbot-rag.git
cd chatbot-rag
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env` basado en `.env.example` y definir las siguientes variables:

```env
ATLAS_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net
OPENAI_API_KEY=sk-xxxxx
PORT=7070
```

### 4️⃣ Ejecutar el proyecto

```bash
npm run dev
```

---

## 📌 Endpoints Disponibles

### 🔹 **Chatbot con RAG y LLM**

#### **POST** `/api/chatbot`

Busca propiedades y responde con contexto.

**Request Body:**

```json
{
  "query": "Quiero una casa en Polanco",
  "sessionId": "user-123"
}
```

**Response:**

```json
{
  "status": "OK",
  "message": "✅ Respuesta generada exitosamente.",
  "results": [{ "property_id": "1", "description": "..." }],
  "chatbotResponse": "He encontrado propiedades en Polanco..."
}
```

---

### 🔹 **Generación de Embeddings**

#### **POST** `/api/generate-embeddings`

Carga propiedades en la base de datos y genera embeddings.

**Response:**

```json
{
  "status": "OK",
  "message": "✅ Datos cargados exitosamente en MongoDB Atlas."
}
```

---

## 📚 Recursos de Referencia

Este proyecto está basado en las siguientes fuentes:

- **Tutorial de Chatbots con LangChain:** [LangChain Docs](https://js.langchain.com/docs/tutorials/chatbot/)
- **MongoDB Atlas Vector Search:** [MongoDB Docs](https://www.mongodb.com/docs/atlas/vector-search/)
- **LLMChain en LangChain:** [LangChain LLMChain](https://js.langchain.com/docs/tutorials/llm_chain)

---

## 📌 Mejoras Futuras

1️⃣ **Persistencia de conversaciones en la base de datos**: Actualmente, la memoria del chatbot solo se mantiene en sesión. Se mejorará para almacenar el historial en MongoDB y recuperarlo en futuras interacciones.

2️⃣ **Implementación de un Agent AI**: Se iterará el chatbot para convertirlo en un agente autónomo, utilizando la arquitectura de agentes de LangChain. [Referencia](https://js.langchain.com/docs/tutorials/chatbot/)

3️⃣ **Optimización de búsqueda en MongoDB Atlas**: Se evaluará la mejora en el ranking de resultados y filtrado de propiedades más relevantes.

---

## 💡 Contribuciones

Si deseas contribuir con mejoras o reportar errores, por favor abre un issue o envía un PR.

---

## ⚖️ Licencia

MIT License - Eres libre de usar y modificar este código. 🚀
