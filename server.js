const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data.json');

//Read notes
app.get('/api/notes', (req, res)=>{
    fs.readFile(dataFile, 'utf-8', (err, data)=>{
        if(err) return res.status(500).send('Error reading file');
        res.json(JSON.parse(data || '[]'));
    });
});

// Create note
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  fs.readFile(dataFile, 'utf8', (err, data) => {
    const notes = data ? JSON.parse(data) : [];
    notes.push(newNote);
    fs.writeFile(dataFile, JSON.stringify(notes), () => {
      res.status(201).json(newNote);
    });
  });
});

// Update note
app.put('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  const updatedNote = req.body;

  fs.readFile(dataFile, 'utf8', (err, data) => {
    let notes = JSON.parse(data || '[]');
    notes = notes.map(note => note.id === noteId ? updatedNote : note);
    fs.writeFile(dataFile, JSON.stringify(notes), () => {
      res.json(updatedNote);
    });
  });
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dataFile, 'utf8', (err, data) => {
    let notes = JSON.parse(data || '[]');
    notes = notes.filter(note => note.id !== noteId);
    fs.writeFile(dataFile, JSON.stringify(notes), () => {
      res.sendStatus(204);
    });
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));