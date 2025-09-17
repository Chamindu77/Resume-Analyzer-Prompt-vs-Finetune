import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = ({ resume, jobTitle, jobDescription, analysisResult }) => {
  // Remove open state, always show chat interface in chat tab
  const [messages, setMessages] = useState([
    { text: "Hi! Ask me anything about your uploaded resume.", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, isUser: true }]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          resume,
          job_title: jobTitle,
          job_description: jobDescription,
          analysis_result: analysisResult,
        }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { text: data.reply || "No response.", isUser: false },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { text: "Error: " + err, isUser: false },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <div className="chatbot-window">
      {/* <div className="chatbot-header">
        <span>Resume Chatbot</span>
      </div> */}
      <div className="chatbot-messages">
        {messages.map((msg, i) =>
          msg.isUser ? (
            <div key={i} className="chatbot-msg-row user-row">
              <div className="chatbot-msg-user">{msg.text}</div>
            </div>
          ) : (
            <div key={i} className="chatbot-msg-row bot-row">
              <div className="bot-icon" style={{ marginRight: "0.6em" }}>
                <img
                  src="../../public/bot.png"
                  alt="bot"
                  style={{ width: "28px", height: "28px" }}
                />
                {/* <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="14" cy="14" r="14" fill="#7ed6ff"/>
                  <ellipse cx="14" cy="17" rx="7" ry="4" fill="#23234a"/>
                  <circle cx="11" cy="13" r="1.5" fill="#23234a"/>
                  <circle cx="17" cy="13" r="1.5" fill="#23234a"/>
                </svg> */}
              </div>
              <div className="chatbot-msg-bot">{msg.text}</div>
            </div>
          )
        )}
        {loading && (
          <div className="chatbot-msg-row bot-row">
            <div className="bot-icon" style={{ marginRight: "0.6em" }}>
              <img
                src="../../public/bot.png"
                alt="bot"
                style={{ width: "28px", height: "28px" }}
              />
              {/* <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14" cy="14" r="14" fill="#7ed6ff" />
                <ellipse cx="14" cy="17" rx="7" ry="4" fill="#23234a" />
                <circle cx="11" cy="13" r="1.5" fill="#23234a" />
                <circle cx="17" cy="13" r="1.5" fill="#23234a" />
              </svg> */}
            </div>
            <div className="chatbot-msg-bot">Thinking...</div>
          </div>
        )}
      </div>
      <div className="chatbot-input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.7em 1em",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="11" cy="11" r="11" fill="#7ed6ff" />
            <path
              d="M7 11L15 11"
              stroke="#23234a"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M11 7L15 11L11 15"
              stroke="#23234a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
