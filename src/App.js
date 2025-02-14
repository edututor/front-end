import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [company, setCompany] = useState("");
  const [uploadResponse, setUploadResponse] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !company) {
      alert("Please select a file and enter a company name.");
      return;
    }

    const formData = new FormData();
    formData.append("company_name", company);
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setUploadResponse(data);

      if (response.ok) {
        console.log("Upload successful:", data);
        handlePreprocess(data.file_url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handlePreprocess = async (fileUrl) => {
    try {
      const response = await fetch("http://localhost:8000/api/preprocess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_url: fileUrl, company_name: company }),
      });

      const data = await response.json();
      console.log("Preprocessing response:", data);
    } catch (error) {
      console.error("Error starting preprocessing:", error);
    }
  };

  return (
    <div>
      <h2>Upload and Process Document</h2>
      <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload & Process</button>
      {uploadResponse && <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>}
    </div>
  );
}

export default FileUpload;

