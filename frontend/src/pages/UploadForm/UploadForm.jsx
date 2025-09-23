import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [convertedUrl, setConvertedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    setConvertedUrl("");
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/convert`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      setConvertedUrl(`${import.meta.env.VITE_API_URL}${res.data.url}`);
    } catch (err) {
      console.error(err);
      alert("Conversion failed. Please try again.");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "50px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Upload PDF/DOCX → Convert to Kruti Dev 055
      </h2>

      <input
        type="file"
        accept=".pdf,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: loading ? "#999" : "#4caf50",
          color: "#fff",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s",
        }}
      >
        {loading ? `Uploading... ${progress}%` : "Convert"}
      </button>

      {loading && (
        <div
          style={{
            marginTop: "20px",
            width: "100%",
            height: "10px",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#4caf50",
              transition: "width 0.3s",
            }}
          ></div>
        </div>
      )}

      {convertedUrl && !loading && (
        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          <a
            href={convertedUrl}
            download
            style={{
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor: "#2196f3",
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "none",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1976d2")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#2196f3")}
          >
            Download Converted File
          </a>
        </div>
      )}
    </div>
  );
}
