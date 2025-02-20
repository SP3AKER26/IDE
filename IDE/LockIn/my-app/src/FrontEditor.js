import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

const BACKEND_URL = "http://127.0.0.1:5000";

const App = () => {
  const [code, setCode] = useState("// Type your code here...");
  const [output, setOutput] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/get_snippet`)
      .then((response) => response.json())
      .then((data) => {
        if (data.code) setCode(data.code);
      })
      .catch((error) => console.error("Error fetching snippet:", error));
  }, []);

  const saveCode = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/save_snippet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "ivan", code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Server Error: ${data.error || "Unknown Error"}`);
      }

      console.log("✅ Code snippet saved successfully!");
    } catch (error) {
      console.error("❌ Error saving snippet:", error);
    }
  };

  const runCode = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/run_code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      setOutput(data.output || "Error executing code");
    } catch (error) {
      setOutput("Error executing code");
      console.error("Error running code:", error);
    }
  };

  return (
    <div style={{ height: "100vh", background: "#0d1117", display: "flex", flexDirection: "column" }}>
      
      {/* ✅ Taskbar at the Top */}
      <div
        style={{
          background: "#161b22",
          padding: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #30363d",
        }}
      >
        <button
          onClick={() => window.location.href = 'http://localhost:5173/technical/1'} // ✅ Navigate back
          style={{
            padding: "10px",
            backgroundColor: "#30363d",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
         Back
        </button>
        <h2 style={{ color: "#fff", margin: 0 }}>CritiCheck Terminal</h2>
        <div style={{ width: "80px" }} /> {/* Spacer for centering */}
      </div>

      {/* ✅ Main Content Layout */}
      <div style={{ display: "flex", flex: 1 }}>
        
        {/* 📌 Instructions Panel */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            color: "#fff",
            backgroundColor: "#161b22",
            fontSize: "16px",
            borderRight: "2px solid #30363d",
            overflowY: "auto",
          }}
        >
          <h2>📌 Instructions</h2>
          <p>
            - Implement a menu-driven system using a switch statement.<br />
            - Use functions for deposit, withdraw, and balance display.<br />
            - Store account details using arrays.<br />
            - Use loops for repeated operations and input validation.<br />
            - Click "Run Code" to execute it.<br />
            - The output will appear on the right.
          </p>
          <h3>✅ Example:</h3>
          <pre
            style={{
              backgroundColor: "#0d1117",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "14px",
            }}
          >
            {`print("Hello, World!")`}
          </pre>
        </div>

        {/* 📌 Code Editor */}
        <div style={{ flex: 2, padding: "10px" }}>
          <Editor
            height="80vh"
            theme="vs-dark"
            defaultLanguage="python"
            value={code}
            onChange={(newValue) => setCode(newValue)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              autoClosingBrackets: "always",
            }}
          />
          <button
            onClick={() => {
              runCode();
              saveCode();
            }}
            style={{
              marginTop: "10px",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              width: "100%",
            }}
          >
            Run Code
          </button>
        </div>

        {/* 📌 Output Panel */}
        <div
          style={{
            flex: 1,
            padding: "10px",
            color: "#fff",
            backgroundColor: "#161b22",
            fontSize: "16px",
            borderLeft: "2px solid #30363d",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default App;
