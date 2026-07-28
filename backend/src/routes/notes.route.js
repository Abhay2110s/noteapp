const express = require("express");
const router = express.Router();

const noteController = require("../controllers/note.controller");
const verifyToken = require("../middleware/auth.middleware");

// Get all notes for a user
router.get("/", verifyToken, noteController.getNotes);

// Create a new note
router.post("/", verifyToken, noteController.createNote);

// Update a note
router.put("/:id", verifyToken, noteController.updateNote);

// Delete a note
router.delete("/:id", verifyToken, noteController.deleteNote);