const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const os = require('os');
const qr = require('qrcode');

const app = express();
const port = 5000;

app.use(cors());
app.use(fileUpload());
app.use(express.static('shared_files'));

const folderPath = './shared_files';
if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

app.post('/upload', (req, res) => {
    if (!req.files || !req.files.file) return res.status(400).send('No file uploaded.');
    let file = req.files.file;
    file.mv(`${folderPath}/${file.name}`, (err) => {
        if (err) return res.status(500).send(err);
        res.send('File uploaded successfully!');
    });
});

app.get('/files', (req, res) => {
    fs.readdir(folderPath, (err, files) => {
        if (err) return res.status(500).send(err);
        res.json(files);
    });
});

app.listen(port, '0.0.0.0', () => {  // Listen on all interfaces
    console.log(`Server running at http://${getLocalIP()}:${port}`);
});

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (let name in interfaces) {
        for (let iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) return iface.address;
        }
    }
    return 'localhost';
}
