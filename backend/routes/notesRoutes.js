const express = require("express");
const router = express.Router();
const Note = require("../models/noteModel");

// ADD NOTE
router.post("/api/notes", async (req, res) => {
  try {
    const { content, archived } = req.body;

    const newNote = await Note.create({
      content,
      archived,
    });

    res.status(201).json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating note" });
  }
});

// GET NOTES

router.get("/api/notes", async (req, res) => {
  try {
    const allNotes = await Note.findAll();
    res.status(200).json(allNotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error getting notes" });
  }
});

// DELETE NOTE

router.delete("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const noteToDelete = await Note.findByPk(noteId);
    if (noteToDelete) {
      await noteToDelete.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting note" });
  }
});

//EDIT AND ARCHIVE NOTE
router.put("/api/notes/:id", async (req, res) => {
  try {
    const noteId = req.params.id;
    const { content, archived, categories } = req.body;

    const noteToUpdate = await Note.findByPk(noteId);

    if (noteToUpdate) {
      if (content) {
        noteToUpdate.content = content;
      }
      if (archived !== undefined) {
        noteToUpdate.archived = archived;
      }

      if (categories) {
        noteToUpdate.categories = categories;
      }

      await noteToUpdate.save();
      res.status(200).json(noteToUpdate);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating note" });
  }
});

//DELETE CATEGORY
router.delete("/api/notes/:id/categories/:category", async (req, res) => {
  try {
    const noteId = req.params.id;
    const categoryToDelete = req.params.category;

    const noteToUpdate = await Note.findByPk(noteId);

    if (noteToUpdate) {
      const updatedCategories = noteToUpdate.categories.filter(
        (category) => category !== categoryToDelete
      );

      await noteToUpdate.update({ categories: updatedCategories });

      res.status(200).json(noteToUpdate);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating note" });
  }
});

module.exports = router;
