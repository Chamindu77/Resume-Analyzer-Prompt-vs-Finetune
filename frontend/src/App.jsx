import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisModal from "./components/AnalysisModal";
import ScoreCard from "./components/ScoreCard";
import RequirementsCard from "./components/RequirementsCard";
import KeywordsCard from "./components/KeywordsCard";
// import PreviousScans from './components/PreviousScans';
import InstructionsCard from "./components/InstructionsCard";
import "./App.css";

function App() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [scans, setScans] = useState([]);

  const handleAnalyze = async (data) => {
    setAnalyzing(true);
    try {
      // Upload resume file
      const formData = new FormData();
      formData.append("file", data.resumeFile);
      const uploadRes = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setAnalyzing(false);
        alert(uploadData.error || "Resume upload failed");
        return;
      }

      // Send analysis request
      const analyzeRes = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume: uploadData.filepath, // If backend expects file path
          job_title: data.model,
          job_description: data.jobDescription,
        }),
      });
      const result = await analyzeRes.json();

      // Fetch additional data from other endpoints using full file path
      const [keywordsRes, scoresRes, requirementsRes, previousRes] =
        await Promise.all([
          fetch(
            `http://localhost:5000/keywords?filename=${encodeURIComponent(
              uploadData.filepath
            )}`
          ),
          fetch(
            `http://localhost:5000/scores?filename=${encodeURIComponent(
              uploadData.filepath
            )}&job_title=${encodeURIComponent(
              data.model
            )}&job_description=${encodeURIComponent(data.jobDescription)}`
          ),
          fetch("http://localhost:5000/requirements"),
          fetch("http://localhost:5000/previous"),
        ]);
      const keywordsData = await keywordsRes.json();
      const scoresData = await scoresRes.json();
      const requirementsData = await requirementsRes.json();
      const previousData = await previousRes.json();

      // Merge all results
      setResults({
        ...result,
        keywords: keywordsData.keywords || [],
        score: scoresData.overall_score || 0,
        requirements_score: scoresData.keyword_score || 0,
        keywords_score: scoresData.ats_score || 0,
        requirements: requirementsData.requirements || [],
        previousScans: previousData.previous_scans || [],
      });
      setScans([
        ...scans,
        {
          fileName: data.resumeFile.name,
          date: new Date().toLocaleDateString(),
          score: scoresData.overall_score || 0,
          model: data.model,
        },
      ]);
    } catch (err) {
      alert("Error analyzing resume: " + err);
    }
    setAnalyzing(false);
  };

  return (
    <div className="app-bg">
      <HeroSection />
      <div
        className="main-section"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        <div id="resume-upload-section" style={{ width: "30%" }}>
          <ResumeUpload onAnalyze={handleAnalyze} />
          {/* <PreviousScans scans={scans} /> */}
        </div>
        <div style={{ width: "65%" }}>
          <AnalysisModal
            open={analyzing}
            onCancel={() => setAnalyzing(false)}
          />
          {!results ? (
            <InstructionsCard />
          ) : (
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
                overallAmount={results.score}
                requirementsAmount={results.requirements_score}
                keywordsAmount={results.keywords_score}
              />
              {/* Show Gemini matching skills and recommendations */}
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
                      // Parse Gemini output for tags
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
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
