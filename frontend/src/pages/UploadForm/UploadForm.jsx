import { useState } from "react";
import axios from "axios";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setLoading(true);
    setProgress(0);
    setDownloadLink(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("begin", 1); // or 0 depending on conversion

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/convert`,
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

      // Store response link + size
      setDownloadLink(res.data.url);
      setFileSize(res.data.size);
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
        Upload DOCX → Convert Kruti Dev / Unicode
      </h2>

      <input
        type="file"
        accept=".docx"
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

      {/* Show download button when ready */}
      {downloadLink && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>✅ File converted successfully ({(fileSize / 1024).toFixed(1)} KB)</p>
          <a
            href={`${import.meta.env.VITE_API_URL}${downloadLink}`}
            download="converted.docx"
            style={{
              display: "inline-block",
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor: "#2196f3",
              color: "#fff",
              fontWeight: "bold",
              textDecoration: "none",
              transition: "background-color 0.3s",
            }}
            target="_blank"
          >
            ⬇️ Download File
          </a>
        </div>
      )}
    </div>
  );
}
