import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast,{Toaster} from 'react-hot-toast';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const serverUrl = 'http://192.168.29.38:5000';

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${serverUrl}/files`);
      setFiles(res.data);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return toast.error('Please select a file first.');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`${serverUrl}/upload`, formData);
      toast.success('File uploaded successfully!');
      fetchFiles();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error('Upload failed');
    }
  };

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [files]);

  return (
    <>

    <Toaster />
    <div className="app-container dark">
      <div className="header">
        <h1>📤 File Share</h1>
      </div>
      <div className="upload-section">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="file-input"
        />
        <button onClick={handleUpload} className="upload-btn">
          Upload
        </button>
      </div>
      <div className="file-list-container">
        <h2>📂 Available Files</h2>
        <ul className="file-list">
  {files.map((file, index) => (
    <li key={index} style={{ '--i': index }}>
      <a
        href={`${serverUrl}/${file}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {file}
      </a>
    </li>
  ))}
</ul>

      </div>
    </div>
  </>
  );
}

export default App;
