const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000; // Specify your desired port here

app.use(cors());
app.use(fileUpload());

// MongoDB connection URL and database
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'fileUploads';

// Connect to MongoDB
mongoose.connect(`${mongoURI}/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define a schema for uploaded files
const fileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now }
});

// Create a model for the uploads collection
const File = mongoose.model('uploads', fileSchema);

// Define the absolute path to your uploads folder on the desktop
const uploadDir = 'C:\\Users\\Thithiksha\\Desktop\\uploads';

// Ensure the uploads directory exists, create if not
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set static folder to serve uploaded files (optional)
app.use('/uploads', express.static(uploadDir));

// Endpoint to handle file uploads
app.post('/upload', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const uploadPath = path.join(uploadDir, file.name);

  try {
    // Move the file to the specified directory
    await file.mv(uploadPath);

    // Construct the URL to access the file
    const fileURL = `http://localhost:${PORT}/uploads/${file.name}`;

    // Create a new file document and save it to MongoDB
    const newFile = new File({ fileName: file.name, filePath: fileURL });
    await newFile.save();

    res.json({ fileName: file.name, filePath: fileURL });
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ msg: 'Failed to upload file', error: err });
  }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
