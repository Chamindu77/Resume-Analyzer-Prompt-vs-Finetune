import React, { useState } from "react";
import Chatbot from "./Chatbot";
import ScoreCard from "./ScoreCard";

const AnalysisChatTabs = ({ results }) => {
  const [activeTab, setActiveTab] = useState("analysis");

  // Tab icon SVGs
  const analysisIcon = (
    <span className="tab-icon">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="11" width="18" height="2" rx="1" fill="#3f51b5" />
        <rect x="3" y="5" width="12" height="2" rx="1" fill="#7ed6ff" />
        <rect x="3" y="17" width="6" height="2" rx="1" fill="#7ed6ff" />
      </svg>
    </span>
  );
  const chatIcon = (
    <span className="tab-icon">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="4" y="6" width="16" height="10" rx="2" fill="#7ed6ff" />
        <path d="M8 18H16L12 22L8 18Z" fill="#3f51b5" />
      </svg>
    </span>
  );

  // Indicator bar position logic
  //   const tabCount = 2;
  //   const activeIndex = activeTab === "analysis" ? 0 : 1;
  //   const indicatorStyle = {
  //     width: '80px',
  //     left: `calc(${activeIndex * 50 + activeIndex * 80}px)`,
  //   };

  return (
    <div className="analysis-chat-tabs">
      <div className="tab-header" style={{ position: "relative" }}>
        <button
          className={activeTab === "analysis" ? "active" : ""}
          onClick={() => setActiveTab("analysis")}
        >
          {analysisIcon}
          Analysis
        </button>
        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          {chatIcon}
          Chat
        </button>
        <div
          className="tab-indicator"
          style={{
            width: "120px",
            left: activeTab === "analysis" ? "calc(16%)" : "calc(56%)",
            background: "#3f51b5",
          }}
        />
      </div>
      <div className="tab-content">
        {activeTab === "analysis" ? (
          <>
            <ScoreCard
              overall={
                typeof results.score === "number"
                  ? results.score
                  : typeof results.score === "string"
                  ? parseInt(results.score)
                  : 0
              }
              requirements={
                typeof results.requirements_score === "number"
                  ? results.requirements_score
                  : typeof results.requirements_score === "string"
                  ? parseInt(results.requirements_score)
                  : 0
              }
              keywords={
                typeof results.keywords_score === "number"
                  ? results.keywords_score
                  : typeof results.keywords_score === "string"
                  ? parseInt(results.keywords_score)
                  : 0
              }
              ats={
                typeof results.ats_score === "number"
                  ? isNaN(results.ats_score)
                    ? 0
                    : results.ats_score
                  : typeof results.ats_score === "string"
                  ? isNaN(parseInt(results.ats_score))
                    ? 0
                    : parseInt(results.ats_score)
                  : 0
              }
              overallAmount={results.score}
              requirementsAmount={results.requirements_score}
              keywordsAmount={results.keywords_score}
              atsAmount={results.ats_score}
            />
            {/* Matching & Missing Skills Section */}
            {results.matching_skills && (
              <div
                style={{
                  background: "#22223b",
                  borderRadius: "1em",
                  padding: "1.2em 1.5em",
                  marginBottom: "1.5rem",
                  boxShadow: "0 6px 32px rgba(40, 60, 120, 0.18)",
                }}
              >
                <h3
                  style={{
                    textAlign: "left",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    marginBottom: "1rem !important",
                    color: "#e0e0e0",
                    paddingLeft: "2rem",
                  }}
                >
                  Matching & Missing Skills
                </h3>
                <div className="analysis-section-skills analysis-section-recommend">
                  {(() => {
                    const match = results.matching_skills.match(
                      /Match Count: `([\d/]+)`[\s\S]*?✅ Matching Skills:[\s\S]*?- ([\s\S]*?)Miss Count: `([\d/]+)`[\s\S]*?❌ Missing Skills:[\s\S]*?- ([\s\S]*)/
                    );
                    if (match) {
                      const matching = match[2]
                        .split(/\n\s*- /)
                        .map((s) => s.trim())
                        .filter(Boolean);
                      const missing = match[4]
                        .split(/\n\s*- /)
                        .map((s) => s.trim())
                        .filter(Boolean);
                      return (
                        <div
                          style={{
                            display: "flex",
                            gap: "2rem",
                            justifyContent: "center",
                          }}
                        >
                          <div className="analysis-skill-col">
                            <span style={{ fontWeight: "bold" }}>
                              Matching Skills
                            </span>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                marginTop: "0.3rem",
                              }}
                            >
                              {matching.map((skill, i) => (
                                <span key={i} className="tag tag-match">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="analysis-skill-col">
                            <span style={{ fontWeight: "bold" }}>
                              Missing Skills
                            </span>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                                marginTop: "0.3rem",
                              }}
                            >
                              {missing.map((skill, i) => (
                                <span key={i} className="tag tag-miss">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <pre style={{ whiteSpace: "pre-wrap" }}>
                        {results.matching_skills}
                      </pre>
                    );
                  })()}
                </div>
              </div>
            )}
            {/* Recommendations Section */}
            {results.recommendations && (
              <div className="analysis-section-recommend">
                <h3 style={{ marginBottom: "0.7rem" }}>
                  Professional Recommendations
                </h3>
                <ul style={{ paddingLeft: "1.2rem" }}>
                  {(Array.isArray(results.recommendations)
                    ? results.recommendations
                    : typeof results.recommendations === "string"
                    ? results.recommendations
                        .split(/\n|•|-|\*/)
                        .map((r) => r.trim())
                        .filter(Boolean)
                    : []
                  ).map((rec, i) => (
                    <li
                      key={i}
                      style={{
                        marginBottom: "0.5rem",
                        fontSize: "0.9em",
                        color: "#e0e0e0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          marginRight: "0.5em",
                          color: "#e0e0e0",
                          fontSize: "0.9em",
                        }}
                      >
                        ✔️
                      </span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <Chatbot
            resume={results.resume}
            jobTitle={results.job_title}
            jobDescription={results.job_description}
            analysisResult={results.analysis_result}
          />
        )}
      </div>
    </div>
  );
};

export default AnalysisChatTabs;
