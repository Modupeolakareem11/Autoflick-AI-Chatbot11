# Autoflick AI Chatbot

### Full-Stack Generative AI Chatbot

Autoflick AI Chatbot is a full-stack conversational AI application designed to provide intelligent responses, manage conversation history, and analyze uploaded PDF documents using OpenAI's GPT-4o mini model.

The platform combines a modern React frontend with a Python Flask backend and MySQL database to deliver an interactive AI-powered chat experience.

---

## Project Overview

Autoflick AI Chatbot demonstrates the integration of Generative AI into a full-stack software application.

The application allows users to interact with an AI assistant, maintain conversation history, retrieve previous conversations, and submit PDF documents for AI-powered text analysis.

## Key Features

- **AI-Powered Conversations:** Intelligent responses using OpenAI GPT-4o mini.
- **Conversation Management:** Create, save, retrieve, and delete conversations.
- **Automatic Conversation Titles:** Generate descriptive titles for new conversations.
- **PDF Document Analysis:** Upload PDF documents, extract their text, and submit the content for AI analysis.
- **Markdown Response Rendering:** Display structured responses with headings, lists, code blocks, and formatted content.
- **MySQL Database Integration:** Persist conversation records and messages.
- **REST API Backend:** Flask-powered endpoints connecting the frontend and backend.
- **Streaming API Endpoint:** Backend Server-Sent Events (SSE) support for streaming responses. Frontend streaming integration is a planned improvement.

---

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js |
| Build Tool | Vite |
| Programming Language | JavaScript |
| Styling | CSS3 |
| Backend | Python, Flask |
| AI Model | OpenAI GPT-4o mini |
| Database | MySQL |
| ORM | Flask-SQLAlchemy |
| PDF Processing | pypdf |
| Markdown Rendering | React Markdown |
| API Communication | REST API |
| Version Control | Git and GitHub |

---

## System Architecture

The application follows a client-server architecture.

**Frontend**
- React.js user interface.
- Chat interface and conversation management.
- PDF upload interface.
- API communication with the Flask backend.

**Backend**
- Flask REST API.
- OpenAI API integration.
- Conversation and message management.
- PDF text extraction and analysis.
- Database operations.

**Database**
- MySQL database.
- Conversations table.
- Messages table.

### Application Workflow

1. User submits a message through the React interface.
2. The frontend sends the request to the Flask backend.
3. Flask processes the request and communicates with OpenAI.
4. OpenAI generates a response.
5. The backend saves the conversation and message records in MySQL.
6. The response is returned to the frontend and displayed to the user.

---

## Project Structure

```text
autoflick-ai-chatbot/
│
├── backend/
│   ├── app.py
│   ├── extensions.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routes/
│   │   └── chat.py
│   └── services/
│       └── ai_service.py
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Explore.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## Installation and Setup

### Prerequisites

Ensure you have installed:

- Python 3.12 or compatible version.
- Node.js and npm.
- MySQL Server.
- Git.
- An OpenAI API key.

### 1. Clone the Repository

```bash
git clone https://github.com/Modupeolakareem11/Autoflick-AI-Chatbot11.git
```

```bash
cd Autoflick-AI-Chatbot11
```

### 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the backend folder.

Configure your environment variables:

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=mysql+pymysql://username:password@localhost/autoflick_ai
```

Replace the placeholders with your actual credentials.

**Never upload your `.env` file or API keys to GitHub.**

### 4. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE autoflick_ai;
```

Configure your database connection in the backend environment.

The application uses Flask-SQLAlchemy to manage database models and tables.

### 5. Start the Backend

From the backend directory:

```bash
python app.py
```

###
