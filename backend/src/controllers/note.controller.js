const Note = require("../model/notes.model");

//Get all notes for a user
async function getNotes(req,res){
    try{
        const notes = await Note.find({ userId: req.user.id });
        res.json(notes);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
};

//Create a new note
async function createNote(req,res){
    try{
        const{ title, description } = req.body;
        const newNote = new Note({
            userId: req.user.id,
            title,
            description
        });
        await newNote.save();
        res.status(201).json({ message: "Note created successfully", note: newNote });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}

    //Update a note
    async function updateNote(req,res){
        try{
            const { id } = req.params;
            const { title, description } = req.body;
            const note = await Note.findByIdAndUpdate(id, { title, description }, { new: true });
            res.json({ message: "Note updated successfully", note });
        }
        catch(err){
            res.status(500).json({ error: err.message });
        }
    };

    //Delete a note
    async function deleteNote(req,res){
        try{
            const { id } = req.params;
            await Note.findByIdAndDelete(id);
            res.json({ message: "Note deleted successfully" });
        }
        catch(err){
            res.status(500).json({ error: err.message });
        }
}

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};