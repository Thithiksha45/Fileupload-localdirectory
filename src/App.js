import React from 'react';
import FileUpload from './components/FileUpload';
import './styles.css'; // Import your styles

function App() {
  return (
    <div className="app-container">
      <div className="app-header">
        <h1>File Upload to Local Server</h1>
      </div>
      <div className="app-content">
        <FileUpload />
      </div>
    </div>
  );
}

export default App;
