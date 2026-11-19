
import {
  FileText,
  Code,
  Video,
  Search,
  ArrowUpRight,
  Sparkles,
  Layers,
  Brain,
} from "lucide-react";

const tools = [
  {
    id: "document",
    title: "Document AI",
    description: "Upload, read, analyse and summarise PDF documents.",
    category: "PRODUCTIVITY",
    icon: FileText,
    status: "Available",
    available: true,
  },
  {
    id: "coding",
    title: "Coding Assistant",
    description: "Generate code, debug errors and improve your applications.",
    category: "DEVELOPMENT",
    icon: Code,
    status: "Coming soon",
    available: false,
  },
  {
    id: "video",
    title: "Video Script Generator",
    description: "Create engaging scripts for AI-generated videos.",
    category: "CONTENT CREATION",
    icon: Video,
    status: "Coming soon",
    available: false,
  },
  {
    id: "search",
    title: "Semantic Search",
    description: "Search documents and retrieve contextually relevant results.",
    category: "RESEARCH",
    icon: Search,
    status: "Coming soon",
    available: false,
  },
];

function Explore({ onSelectTool }) {
  return (
    <div className="explore-page">
      <div className="explore-heading">
        <div className="explore-eyebrow">
          <Sparkles size={15} />
          AUTOfLICK AI WORKSPACE
        </div>

        <h1>
          Explore AI <span>tools.</span>
        </h1>

        <p>
          Discover intelligent tools designed to help you create,
          analyse, research and build.
        </p>
      </div>

      <div className="explore-overview">
        <div className="explore-overview-icon">
          <Brain size={25} />
        </div>

        <div>
          <strong>Your AI workspace</strong>
          <p>
            One platform. Multiple intelligent capabilities.
          </p>
        </div>

        <div className="explore-overview-decoration">
          <Layers size={36} />
        </div>
      </div>

      <div className="explore-section-heading">
        <div>
          <h2>Discover tools</h2>
          <p>Choose a tool to get started.</p>
        </div>

        <span>{tools.length} tools</span>
      </div>

      <div className="explore-grid">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              type="button"
              className={`explore-card ${
                tool.available ? "available" : "coming-soon"
              }`}
              key={tool.id}
              onClick={() => {
                if (tool.available) {
                  onSelectTool(tool.id);
                }
              }}
              disabled={!tool.available}
            >
              <div className="explore-card-top">
                <div className="explore-tool-icon">
                  <Icon size={23} />
                </div>

                <ArrowUpRight size={18} className="explore-arrow" />
              </div>

              <span className="explore-category">
                {tool.category}
              </span>

              <h3>{tool.title}</h3>

              <p>{tool.description}</p>

              <div className="explore-card-bottom">
                <span
                  className={
                    tool.available
                      ? "tool-status active"
                      : "tool-status"
                  }
                >
                  <span />
                  {tool.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="explore-footer">
        <Sparkles size={16} />
        More intelligent tools are coming to Autoflick AI.
      </div>
    </div>
  );
}

export default Explore;
