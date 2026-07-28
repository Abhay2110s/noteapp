const Note = require('../model/notes.model');

async function getNotes(req, res) {
try {
    const notes = await Note.find({ userId: req.user.id }).sort({ _id: -1 });
    res.json(notes);
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

async function createNote(req, res) {
try {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const newNote = new Note({
        userId: req.user.id,
        title,
        description,
    });

    await newNote.save();
    res.status(201).json({ message: 'Note created successfully', note: newNote });
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

async function updateNote(req, res) {
try {
    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const note = await Note.findOne({ _id: id, userId: req.user.id });
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }

    note.title = title;
    note.description = description;
    await note.save();

    res.json({ message: 'Note updated successfully', note });
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

async function deleteNote(req, res) {
try {
    const { id } = req.params;
    const deletedNote = await Note.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!deletedNote) {
        return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
} catch (err) {
    res.status(500).json({ error: err.message });
}
}

module.exports = {
getNotes,
createNote,
updateNote,
deleteNote,
};