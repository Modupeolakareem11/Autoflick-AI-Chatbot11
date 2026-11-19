# Autoflick AI Chatbot

An AI-powered conversational assistant built with React, Python Flask, OpenAI and MySQL.

## Overview

Autoflick AI is a full-stack AI chatbot designed to provide intelligent conversations, document analysis and persistent chat history through a modern web interface.

## Features

- AI-powered conversations using OpenAI GPT-4o mini.
- Automatic conversation title generation.
- Persistent conversation and message storage using MySQL.
- View, continue and delete previous conversations.
- PDF document upload and text-based analysis.
- Markdown rendering for structured AI responses.
- Flask REST API backend.
- React and Vite frontend.
- Backend streaming endpoint for progressive AI responses.

**Note:** The streaming endpoint is implemented in the backend; frontend streaming integration is still pending.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | CSS |
| Backend | Python, Flask |
| AI integration | OpenAI API |
| AI model | GPT-4o mini |
| Database | MySQL |
| ORM | Flask-SQLAlchemy |
| Database driver | PyMySQL |
| PDF processing | pypdf |
| Markdown | react-markdown, remark-gfm |
| Version control | Git and GitHub |

## Architecture

1. The React frontend provides the chat interface and user interactions.
2. The Flask backend exposes API endpoints for chat, document analysis and conversation management.
3. The OpenAI API processes user prompts and generates responses.
4. MySQL stores conversations and messages.
5. The PDF processing service extracts readable text from uploaded documents and sends it for AI analysis.

## Project Structure

```text
Autoflick-AI-Chatbot/
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── Explore.jsx
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   └── chat.py
│   ├── app.py
│   ├── extensions.py
│   ├── models.py
│   ├── requirements.txt
│   └── .env
│
├── .gitignore
└── README.md
```

## Local Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Autoflick-AI-Chatbot
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
```

Activate the environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure your private `.env` file with your OpenAI API key and MySQL database connection.

### 3. Start the backend

```bash
python app.py
```

### 4. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

## Security

- API credentials must remain in local environment variables.
- Never commit `.env` files.
- Configure production credentials separately from development credentials.
- Apply appropriate authentication and access controls before multi-user production deployment.

## Current Development Status

- React frontend and Flask backend implemented.
- OpenAI chat integration implemented.
- MySQL conversation persistence implemented.
- Automatic conversation titles implemented.
- PDF text extraction and analysis implemented.
- Markdown response rendering implemented.
- Backend streaming endpoint implemented.
- Frontend streaming integration and production deployment remain future tasks.

## Future Improvements

- Complete frontend streaming integration.
- Retrieval-Augmented Generation (RAG) for document knowledge retrieval.
- User authentication and authorization.
- Multi-user workspaces.
- Usage monitoring and deployment.

---
**Project:** Autoflick AI Chatbot
**Developer:** Autoflick AI
**Category:** Generative AI / Full-Stack Software Engineering