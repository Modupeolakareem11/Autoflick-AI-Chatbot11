
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Menu,
  Plus,
  MessageSquare,
  Search,
  Settings,
  Paperclip,
  Send,
  Sparkles,
  Bot,
  User,
  PanelLeftClose,
  ChevronDown,
  Zap,
  CircleHelp,
  FileText,
  X,
  Trash2,
} from "lucide-react";

import {
  sendMessage as sendChatMessage,
  analyzeDocument,
  getConversations,
  getConversation,
  deleteConversation,
} from "./services/api";

import Explore from "./Explore";
import "./App.css";

const suggestions = [
  {
    title: "Write something",
    detail: "Draft emails, reports and content",
  },
  {
    title: "Understand a topic",
    detail: "Get clear explanations and ideas",
  },
  {
    title: "Help with coding",
    detail: "Debug, build and improve code",
  },
  {
    title: "Analyse documents",
    detail: "Find insights in your files",
  },
];

function App() {
  // Application navigation
  const [currentPage, setCurrentPage] = useState("chat");

  // Chat state
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  // Conversation history state
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] =
    useState(null);
  const [isHistoryLoading, setIsHistoryLoading] =
    useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // PDF state
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // --------------------------------
  // CONVERSATION HISTORY
  // --------------------------------

  const loadConversations = async () => {
    try {
      const history = await getConversations();

      setConversations(
        Array.isArray(history) ? history : []
      );
    } catch (err) {
      console.error(
        "Unable to load conversation history:",
        err
      );

      setError(
        err.message ||
        "Unable to load conversation history."
      );
    }
  };

  // Load saved conversations when the app opens.
  useEffect(() => {
    loadConversations();
  }, []);

  // --------------------------------
  // OPEN EXISTING CONVERSATION
  // --------------------------------

  const handleOpenConversation = async (conversationId) => {
    if (isSending || isHistoryLoading) return;

    setIsHistoryLoading(true);
    setError("");

    try {
      const data = await getConversation(conversationId);

      const savedMessages = Array.isArray(data.messages)
        ? data.messages
        : data.conversation?.messages || [];

      setCurrentConversationId(conversationId);

      setMessages(
        savedMessages.map((item) => ({
          role: item.role,
          content: item.content,
        }))
      );

      setMessage("");
      removeSelectedFile();
      setCurrentPage("chat");

    } catch (err) {
      console.error(
        "Unable to open conversation:",
        err
      );

      setError(
        err.message ||
        "Unable to open this conversation."
      );

    } finally {
      setIsHistoryLoading(false);
    }
  };

  // --------------------------------
  // DELETE CONVERSATION
  // --------------------------------

  const handleDeleteConversation = async (
    conversationId
  ) => {
    if (isSending) return;

    try {
      await deleteConversation(conversationId);

      setConversations((current) =>
        current.filter(
          (item) => item.id !== conversationId
        )
      );

      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
        setMessage("");
        removeSelectedFile();
      }

    } catch (err) {
      console.error(
        "Unable to delete conversation:",
        err
      );

      setError(
        err.message ||
        "Unable to delete this conversation."
      );
    }
  };

  // --------------------------------
  // PDF FILE SELECTION
  // --------------------------------

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setError("Please select a PDF document.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "Your PDF must be smaller than 10 MB."
      );

      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  // --------------------------------
  // REMOVE SELECTED PDF
  // --------------------------------

  const removeSelectedFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // --------------------------------
  // OPEN PDF FILE PICKER
  // --------------------------------

  const openDocumentPicker = () => {
    setCurrentPage("chat");
    setError("");

    fileInputRef.current?.click();
  };

  // --------------------------------
  // EXPLORE TOOL SELECTION
  // --------------------------------

  const handleSelectTool = (toolId) => {
    if (toolId === "document") {
      openDocumentPicker();
      return;
    }

    setError("This tool is coming soon.");
  };

  // --------------------------------
  // SEND CHAT OR ANALYSE PDF
  // --------------------------------

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message.trim();

    if ((!userMessage && !selectedFile) || isSending) {
      return;
    }

    const fileToAnalyze = selectedFile;
    const isDocumentRequest = Boolean(fileToAnalyze);

    const displayedMessage = isDocumentRequest
      ? userMessage ||
        `Please analyse ${fileToAnalyze.name}.`
      : userMessage;

    const userMessageObject = {
      role: "user",
      content: displayedMessage,
    };

    setMessages((current) => [
      ...current,
      userMessageObject,
    ]);

    setMessage("");
    setError("");
    setIsSending(true);

    try {
      let data;

      if (isDocumentRequest) {
        // Upload the actual PDF to Flask.
        data = await analyzeDocument(
          fileToAnalyze,
          userMessage,
          currentConversationId
        );

      } else {
        // Preserve normal conversation history.
        const conversationHistory = [
          ...messages,
          userMessageObject,
        ];

        data = await sendChatMessage(
          conversationHistory,
          currentConversationId
        );
      }

      if (!data || data.success !== true) {
        throw new Error(
          data?.error ||
          "Autoflick AI could not process your request."
        );
      }

      if (
        !data.reply ||
        typeof data.reply !== "string"
      ) {
        throw new Error(
          "Autoflick AI returned an empty response."
        );
      }

      // Keep the database conversation ID.
      if (data.conversation_id) {
        setCurrentConversationId(
          data.conversation_id
        );
      }

      // Display AI response.
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);

      // Refresh saved conversation history.
      await loadConversations();

      // Clear PDF only after successful analysis.
      if (isDocumentRequest) {
        removeSelectedFile();
      }

    } catch (err) {
      console.error(
        "Autoflick AI error:",
        err
      );

      setError(
        err.message ||
        "Unable to process your request. Please try again."
      );

    } finally {
      setIsSending(false);
    }
  };

  // --------------------------------
  // NEW CHAT
  // --------------------------------

  const startNewChat = () => {
    if (isSending) return;

    setMessages([]);
    setMessage("");
    setError("");
    setCurrentConversationId(null);

    removeSelectedFile();
    setCurrentPage("chat");
  };

  // --------------------------------
  // SUGGESTION CARDS
  // --------------------------------

  const handleSuggestion = (title) => {
    if (title === "Analyse documents") {
      openDocumentPicker();
      return;
    }

    setMessage(`${title}: `);
    setError("");
  };

  // --------------------------------
  // KEYBOARD CONTROLS
  // --------------------------------

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // --------------------------------
  // APPLICATION UI
  // --------------------------------

  return (
    <div className="app-shell">

      {/* GLOBAL PDF INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        hidden
        onChange={handleFileChange}
      />

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside className="sidebar">

          {/* BRAND */}
          <div className="brand">

            <div className="brand-mark">
              <Sparkles size={22} />
            </div>

            <div>
              <h2>
                Autoflick<span> AI</span>
              </h2>

              <small>
                INTELLIGENCE, REIMAGINED
              </small>
            </div>

            <button
              type="button"
              className="icon-button sidebar-close"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              <PanelLeftClose size={19} />
            </button>

          </div>

          {/* NEW CHAT */}
          <button
            type="button"
            className="new-chat"
            onClick={startNewChat}
            disabled={isSending}
          >
            <Plus size={18} />
            New chat
          </button>

          {/* WORKSPACE NAVIGATION */}
          <div className="sidebar-section">

            <p className="section-label">
              WORKSPACE
            </p>

            <button
              type="button"
              className={`nav-item ${
                currentPage === "chat" ? "active" : ""
              }`}
              onClick={() => {
                setCurrentPage("chat");
                setError("");
              }}
            >
              <MessageSquare size={17} />
              Chats
            </button>

            <button
              type="button"
              className={`nav-item ${
                currentPage === "explore" ? "active" : ""
              }`}
              onClick={() => {
                setCurrentPage("explore");
                setError("");
              }}
            >
              <Search size={17} />
              Explore
            </button>

          </div>

          {/* RECENT CONVERSATIONS */}
          <div className="sidebar-section recent-section">

            <p className="section-label">
              RECENT CONVERSATIONS
            </p>

            {isHistoryLoading && (
              <p className="empty-history">
                Loading conversations...
              </p>
            )}

            {conversations.length > 0 ? (

              conversations.map((conversation) => (

                <div
                  key={conversation.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "6px",
                  }}
                >

                  <button
                    type="button"
                    className="recent-chat"
                    onClick={() =>
                      handleOpenConversation(
                        conversation.id
                      )
                    }
                    disabled={
                      isHistoryLoading || isSending
                    }
                    style={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: "left",
                    }}
                    title={
                      conversation.title ||
                      "Open conversation"
                    }
                  >
                    <MessageSquare size={15} />

                    {(
                      conversation.title ||
                      "New conversation"
                    ).slice(0, 24)}

                  </button>

                  <button
                    type="button"
                    className="icon-button"
                    onClick={() =>
                      handleDeleteConversation(
                        conversation.id
                      )
                    }
                    disabled={isSending}
                    title="Delete conversation"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              ))

            ) : (

              !isHistoryLoading && (
                <p className="empty-history">
                  Your conversations will appear here.
                </p>
              )

            )}

          </div>

          {/* SIDEBAR BOTTOM */}
          <div className="sidebar-bottom">

            <button
              type="button"
              className="nav-item"
              onClick={() => {
                setError(
                  "Help and support will be available soon."
                );
              }}
            >
              <CircleHelp size={17} />
              Help &amp; support
            </button>

            <button
              type="button"
              className="nav-item"
              onClick={() => {
                setError(
                  "Settings will be available soon."
                );
              }}
            >
              <Settings size={17} />
              Settings
            </button>

            <div className="profile">

              <div className="avatar">
                AK
              </div>

              <div className="profile-info">
                <strong>Autoflick User</strong>
                <small>Personal workspace</small>
              </div>

              <ChevronDown size={16} />

            </div>

          </div>

        </aside>
      )}

      {/* MAIN WORKSPACE */}
      <main className="main-panel">

        {/* TOPBAR */}
        <header className="topbar">

          <div className="topbar-left">

            {!sidebarOpen && (

              <button
                type="button"
                className="icon-button"
                onClick={() => setSidebarOpen(true)}
                title="Open sidebar"
              >
                <Menu size={20} />
              </button>

            )}

            <span className="breadcrumb">
              Workspace
              <span>/</span>

              {currentPage === "explore"
                ? "Explore"
                : (
                  conversations.find(
                    (item) =>
                      item.id === currentConversationId
                  )?.title || "New conversation"
                )}

            </span>

          </div>

          <div className="topbar-right">

            <div className="status">
              <span />
              AI workspace
            </div>

            <button
              type="button"
              className="icon-button"
              title="Settings"
              onClick={() => {
                setError(
                  "Settings will be available soon."
                );
              }}
            >
              <Settings size={19} />
            </button>

          </div>

        </header>

        {/* PAGE CONTENT */}
        {currentPage === "explore" ? (

          <Explore
            onSelectTool={handleSelectTool}
          />

        ) : (

          <>

            {/* CHAT AREA */}
            <section className="chat-area">

              {messages.length === 0 ? (

                <div className="welcome">

                  <div className="welcome-icon">
                    <Bot size={35} />
                  </div>

                  <div className="eyebrow">
                    <span />
                    YOUR INTELLIGENT ASSISTANT
                  </div>

                  <h1>
                    What can I help you
                    <br />
                    <span>with today?</span>
                  </h1>

                  <p className="welcome-description">
                    Think, create, explore and solve problems
                    with Autoflick AI. Your intelligent
                    workspace starts here.
                  </p>

                  <div className="suggestion-grid">

                    {suggestions.map((item) => (

                      <button
                        type="button"
                        className="suggestion-card"
                        key={item.title}
                        onClick={() =>
                          handleSuggestion(item.title)
                        }
                      >
                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {item.detail}
                        </span>

                      </button>

                    ))}

                  </div>

                  {error && (
                    <div className="connection-note">
                      <Zap size={16} />
                      {error}
                    </div>
                  )}

                </div>

              ) : (

                <div className="conversation">

                  <div className="conversation-heading">

                    <span className="conversation-icon">
                      <Sparkles size={17} />
                    </span>

                    <span>
                      {conversations.find(
                        (item) =>
                          item.id === currentConversationId
                      )?.title || "New conversation"}
                    </span>

                  </div>

                  {messages.map((item, index) => (

                    <div
                      className="message-row"
                      key={index}
                    >

                      <div
                        className={`message-avatar ${item.role}`}
                      >
                        {item.role === "user" ? (
                          <User size={18} />
                        ) : (
                          <Bot size={18} />
                        )}
                      </div>

                      <div className="message-content">

                        <strong>
                          {item.role === "user"
                            ? "You"
                            : "Autoflick AI"}
                        </strong>

                        {/* FORMATTED MARKDOWN MESSAGE */}
                        <div className="markdown-content">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                          >
                            {item.content}
                          </ReactMarkdown>
                        </div>

                      </div>

                    </div>

                  ))}

                  {isSending && (

                    <div className="message-row">

                      <div className="message-avatar assistant">
                        <Bot size={18} />
                      </div>

                      <div className="message-content">

                        <strong>
                          Autoflick AI
                        </strong>

                        <p>
                          {selectedFile
                            ? "Reading and analysing your document..."
                            : "Thinking..."}
                        </p>

                      </div>

                    </div>

                  )}

                  {error && (
                    <div className="connection-note">
                      <Zap size={16} />
                      {error}
                    </div>
                  )}

                </div>

              )}

            </section>

            {/* MESSAGE COMPOSER */}
            <footer className="composer-section">

              <form
                className="composer"
                onSubmit={handleSendMessage}
              >

                {/* SELECTED PDF */}
                {selectedFile && (

                  <div className="selected-file">

                    <FileText size={18} />

                    <div className="selected-file-info">

                      <strong>
                        {selectedFile.name}
                      </strong>

                      <small>
                        PDF selected ·{" "}
                        {(
                          selectedFile.size /
                          (1024 * 1024)
                        ).toFixed(2)} MB
                      </small>

                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      title="Remove selected PDF"
                      aria-label="Remove selected PDF"
                      disabled={isSending}
                    >
                      <X size={17} />
                    </button>

                  </div>

                )}

                {/* MESSAGE INPUT */}
                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Message Autoflick AI..."
                  rows={2}
                  disabled={isSending}
                />

                {/* COMPOSER TOOLS */}
                <div className="composer-tools">

                  <div className="composer-left">

                    <button
                      type="button"
                      className="tool-button"
                      onClick={openDocumentPicker}
                      disabled={isSending}
                      title="Attach PDF document"
                    >
                      <Paperclip size={18} />
                      <span>Attach</span>
                    </button>

                    <span className="model-label">
                      <Sparkles size={14} />
                      GPT-4o mini
                    </span>

                  </div>

                  <button
                    type="submit"
                    className="send-button"
                    disabled={
                      (!message.trim() && !selectedFile) ||
                      isSending
                    }
                    title={
                      selectedFile
                        ? "Analyse document"
                        : "Send message"
                    }
                  >
                    <Send size={17} />
                  </button>

                </div>

              </form>

              {error && (
                <div className="connection-note">
                  <Zap size={16} />
                  {error}
                </div>
              )}

              <p className="disclaimer">
                Autoflick AI can make mistakes.
                Verify important information.
              </p>

            </footer>

          </>

        )}

      </main>

    </div>
  );
}

export default App;
