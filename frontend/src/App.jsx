import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import ResumeUpload from "./components/ResumeUpload";
import AnalysisModal from "./components/AnalysisModal";
import ScoreCard from "./components/ScoreCard";
import RequirementsCard from "./components/RequirementsCard";
import KeywordsCard from "./components/KeywordsCard";
// import PreviousScans from './components/PreviousScans';
import InstructionsCard from "./components/InstructionsCard";
import AnalysisChatTabs from "./components/AnalysisChatTabs";
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
        score:
          result.score !== undefined && result.score !== null
            ? result.score
            : scoresData.overall_score || 0,
        // Calculate keyword score from Gemini's matching_skills string if available
        keywords_score: (() => {
          if (typeof result.matching_skills === "string") {
            const match = result.matching_skills.match(
              /Match Count: `([0-9]+)\/(\d+)`/
            );
            if (match) {
              const matched = parseInt(match[1], 10);
              const total = parseInt(match[2], 10);
              if (total > 0) return Math.round((matched / total) * 100);
            }
          }
          return scoresData.keyword_score || 0;
        })(),
        ats_score:
          result.ats_score_value !== undefined &&
          result.ats_score_value !== null
            ? result.ats_score_value
            : scoresData.ats_score || 0,
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
            <AnalysisChatTabs results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
