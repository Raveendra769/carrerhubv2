import React, { useState } from "react";
import axios from "axios";

const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      alert("Uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files ? e.target.files[0] : null)
        }
      />
      <button onClick={handleUpload}>Upload Resume</button>
    </div>
  );
};

export default UploadResume;