# 🚀 Chatbot con RAG y MongoDB Atlas Vector Search

Este proyecto implementa un chatbot con **Retrieval-Augmented Generation (RAG)** utilizando **LangChain** y **MongoDB Atlas Vector Search**. El chatbot permite buscar propiedades inmobiliarias mediante **embeddings generados con OpenAI**, almacenados en una base de datos vectorial en MongoDB Atlas.

---

## 📌 **Características del Proyecto**

- ✅ **RAG (Retrieval-Augmented Generation)** para mejorar respuestas sin reentrenar modelos.
- ✅ **MongoDB Atlas Vector Search** para realizar búsquedas semánticas.
- ✅ **Memoria de conversación con LangChain** para mejorar la experiencia del usuario.
- ✅ **Embeddings con OpenAI** para mejorar la comprensión de consultas.
- ✅ **Estructura modular con Express y TypeScript**.
- ✅ **Fácil escalabilidad y extensibilidad**.

---

## 📂 **Estructura del Proyecto**

```
📦 nodejs-typescript-backend
 ┣ 📂 src
 ┃ ┣ 📂 controllers
 ┃ ┣ 📂 middlewares
 ┃ ┣ 📂 routes
 ┃ ┃ ┣ 📜 chatbot-rag-strategy-and-llm-modelo.routes.ts
 ┃ ┃ ┣ 📜 generate-embeddings.routes.ts
 ┃ ┃ ┣ 📜 health.routes.ts
 ┃ ┣ 📜 index.ts
 ┃ ┣ 📜 server.ts
 ┣ 📜 .env
 ┣ 📜 package.json
 ┣ 📜 tsconfig.json
 ┗ 📜 README.md
```

---

## ⚙️ **Configuración de MongoDB Atlas para Vector Search**

Para que MongoDB Atlas soporte búsquedas vectoriales, sigue estos pasos:

### **1️⃣ Crear la Base de Datos y la Colección**

1. Ingresa a [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Crea un **Cluster** en MongoDB Atlas si aún no tienes uno.
3. Accede a **Database > Collections** y crea una base de datos llamada `real_estate_db`.
4. Crea una colección dentro de la base de datos con el nombre `properties`.

### **2️⃣ Configurar el Índice Vectorial**

1. Ve a **Indexes** dentro de la colección `properties`.
2. Crea un nuevo índice de tipo **Vector Search** con la siguiente configuración:
   ```json
   {
     "mappings": {
       "dynamic": true,
       "fields": {
         "embedding": {
           "dimensions": 1536,
           "similarity": "cosine",
           "type": "knnVector"
         }
       }
     }
   }
   ```
3. Asegúrate de que el campo **embedding** se usará para almacenar los embeddings generados con OpenAI.

---

## 🚀 **Cómo Ejecutar el Proyecto**

### **1️⃣ Configurar Variables de Entorno**

Crea un archivo `.env` en la raíz del proyecto con los siguientes valores:

```env
ATLAS_URI=<TU_MONGO_ATLAS_CONNECTION_STRING>
OPENAI_API_KEY=<TU_OPENAI_API_KEY>
PORT=7070
```

### **2️⃣ Instalar Dependencias**

```bash
npm install
```

### **3️⃣ Ejecutar el Servidor**

```bash
npm run dev
```

El servidor correrá en `http://localhost:7070`.

---

## 🏡 **Endpoints Disponibles**

### 📌 **Generar Embeddings y Cargar en MongoDB**

```http
POST /generate-embeddings
```

Carga los datos de `data.json` en la base de datos, generando embeddings con OpenAI y almacenándolos en **MongoDB Atlas**.

### 📌 **Buscar Propiedades y Consultar el Chatbot**

```http
POST /chatbot-rag-strategy-and-llm-modelo
```

**Body:**

```json
{
  "query": "Me gustaría ver propiedades cerca de Polanco, tengo 3M de presupuesto",
  "sessionId": "usuario-123"
}
```

El chatbot consultará la base de datos y devolverá recomendaciones basadas en la consulta.

---

## 🔮 **Mejoras Futuras**

✅ **Persistencia del Historial de Conversación** 🗄️

- Actualmente, la memoria se mantiene solo durante la sesión. Se mejorará almacenando el historial en MongoDB.

✅ **Convertir en un Agent AI** 🤖

- Se explorará la integración con [LangChain Agents](https://js.langchain.com/docs/modules/agents/) para permitir un flujo de conversación más dinámico.

✅ **Soporte para Fine-Tuning de OpenAI** 🎯

- Evaluar si el **fine-tuning** de un modelo específico ayudaría a mejorar la precisión y reducir costos de inferencia.

---

## 📖 **Fuentes y Referencias**

- 📌 **MongoDB Atlas Vector Search**: [Documentación Oficial](https://www.mongodb.com/docs/atlas/)
- 📌 **LangChain para Chatbots**: [Guía Oficial](https://js.langchain.com/docs/tutorials/chatbot/)
- 📌 **LangChain RAG con MongoDB**: [Ejemplo](https://js.langchain.com/docs/tutorials/llm_chain/)
- 📌 **OpenAI API para Embeddings**: [Docs](https://platform.openai.com/docs/guides/embeddings)

---

## ✨ **Contribuciones**

MIT License - Eres libre de usar y modificar este código. 🚀
