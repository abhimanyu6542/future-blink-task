# MERN AI Flow

A full-stack AI prompt playground built with MongoDB, Express, React, Node.js, React Flow, and TailwindCSS. Type a prompt into the input node, hit **Run Flow**, and see the AI response appear in the result node — connected by an animated edge.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | TailwindCSS |
| Flow UI | React Flow (@xyflow/react) |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| AI | OpenRouter API (free models) |

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org) v18 or higher
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [OpenRouter](https://openrouter.ai) account and API key


---

## Step 1 — Get Your OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai) and create a free account
2. Navigate to **Keys** and click **Create Key**
3. Copy the key — it starts with `sk-or-...`
4. Go to [openrouter.ai/settings/privacy](https://openrouter.ai/settings/privacy) and enable **"Allow free endpoints that may publish prompts"** — this is required to use free models

---

## Step 2 — Set Up the Backend

```bash
cd mern-ai-flow/backend
npm install
```

Create your `.env` file:
```

Open `.env` and fill in your values:

```env
OPENROUTER_API_KEY=sk-or-your-key-here
MONGODB_URI=mongodb://localhost:27017/mern-ai-flow
PORT=5000
```

If you're using MongoDB Atlas, your URI looks like:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mern-ai-flow
```

Start the backend dev server:

```bash
npm run dev
```

You should see:

```
Server running on http://localhost:5000
MongoDB connected
```

---

## Step 3 — Set Up the Frontend

Open a new terminal:

```bash
cd mern-ai-flow/frontend
npm install
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Using the App

### The Canvas

When the page loads you'll see two nodes connected by an animated purple line:

- **Input Prompt** (left, indigo border) — where you type your question
- **AI Response** (right, green border) — where the answer appears

### Running a Prompt

1. Click inside the **Input Prompt** node textarea
2. Type your question
3. Click **Run Flow** in the top-right header
4. A spinner appears inside the Result node while the AI is thinking
5. The answer populates the Result node when ready

### Saving to MongoDB

Once you have a response, click **Save** in the header. The prompt and response are stored in your MongoDB `conversations` collection. The button shows **Saved ✓** on success.

---

## Example Prompts to Try

**General knowledge**
```
What is the capital of France?
```

**Explain a concept**
```
Explain how JWT authentication works in simple terms.
```

**Write code**
```
Write a TypeScript function that debounces another function by 300ms.
```

**Creative**
```
Write a two-sentence horror story about a software bug.
```

**Summarize**
```
Summarize the differences between SQL and NoSQL databases in 3 bullet points.
```

---

## API Endpoints

| Method | Route | Description |
|---|---|---|
| POST | `/api/ask-ai` | Send a prompt, get AI response |
| POST | `/api/save` | Save prompt + response to MongoDB |
| GET | `/api/history` | Fetch last 20 saved conversations |

### POST `/api/ask-ai`

Request:
```json
{ "prompt": "What is the capital of France?" }
```

Response:
```json
{ "answer": "The capital of France is Paris." }
```

### POST `/api/save`

Request:
```json
{
  "prompt": "What is the capital of France?",
  "response": "The capital of France is Paris."
}
```

Response:
```json
{ "message": "Saved successfully", "id": "665f1a2b3c4d5e6f7a8b9c0d" }
```

---

## Free AI Models Used

The backend tries these models in order, falling back if one is unavailable:

1. `meta-llama/llama-3.3-70b-instruct:free`
2. `google/gemma-3-27b-it:free`
3. `mistralai/mistral-small-3.1-24b-instruct:free`
4. `nousresearch/hermes-3-llama-3.1-405b:free`

---

## Troubleshooting

**"No endpoints found" error**
→ Enable free endpoints in your [OpenRouter privacy settings](https://openrouter.ai/settings/privacy)

**MongoDB connection error**
→ Make sure MongoDB is running locally (`mongod`) or your Atlas URI is correct

**Textarea loses focus while typing**
→ Already fixed — the input node manages its own local state independently of React Flow

**CORS error in browser**
→ Make sure the backend is running on port 5000 and the Vite proxy in `vite.config.ts` is pointing to `http://localhost:5000`
