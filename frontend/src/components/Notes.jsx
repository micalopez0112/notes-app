import React from "react";
import { useState, useEffect } from "react";
import "./Notes.css";
import { MdDelete, MdOutlineUnarchive } from "react-icons/md";
import { FaEdit, FaArchive } from "react-icons/fa";
import { TiTick } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({
    content: "",
    archived: false,
    categories: [],
  });
  const [filter, setFilter] = useState("all");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [category, setCategory] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [addCategoryNoteId, setAddCategoryNoteId] = useState(null);
  const [uniqueCategories, setUniqueCategories] = useState([]);

  const backendURL = "http://localhost:5000/api/notes/";

  const fetchNotes = async () => {
    try {
      const response = await fetch(backendURL);
      const data = await response.json();
      setNotes(data);
      getCategories(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  function getCategories(notes) {
    const allCategories = new Set();
    if (notes) {
      notes.forEach((note) => {
        note.categories.forEach((cat) => {
          allCategories.add(cat);
        });
      });
      setUniqueCategories(Array.from(allCategories));
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSelectFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleContentChange = (e) => {
    setEditContent({ ...editContent, [e.target.name]: e.target.value });
  };

  const handleAddNote = async () => {
    try {
      if (!formData.content) {
        console.error("Content is required");
        return;
      }
      const response = await fetch(backendURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        setFormData({
          content: "",
          archived: false,
          categories: [],
        });
      } else {
        console.error("Error adding note:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding note:", error.message);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const response = await fetch(`${backendURL}${noteId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
      } else {
        console.error("Error deleting note:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting note:", error.message);
    }
  };

  const handleUpdateNote = async () => {
    try {
      const response = await fetch(`${backendURL}${editContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: editContent.content,
        }),
      });

      if (response.ok) {
        const updatedNotes = notes.map((note) =>
          note.id === editContent.id
            ? { ...note, content: editContent.content }
            : note
        );
        setNotes(updatedNotes);
        setEditingNoteId(null);
      } else {
        console.error("Error updating note:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating note:", error.message);
    }
  };

  const handleEditNote = (note) => {
    setEditContent({ ...note });
    setEditingNoteId(note.id);
  };

  const handleAddCategoty = (noteId) => {
    setAddCategoryNoteId(noteId);
  };

  const handleCancelEdit = () => {
    setFormData({
      content: "",
      archived: false,
      categories: [],
    });
    setEditingNoteId(null);
  };
  const cancelAddingCategory = () => {
    setAddCategoryNoteId(null);
  };

  const addCategory = (noteId) => {
    if (!categoryInput) {
      return;
    }

    try {
      const updatedNotes = notes.map((note) =>
        note.id === noteId
          ? { ...note, categories: [...note.categories, categoryInput] }
          : note
      );
      setNotes(updatedNotes);

      setUniqueCategories(
        (prevUniqueCategories) =>
          new Set([...prevUniqueCategories, categoryInput])
      );

      fetch(`${backendURL}${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: updatedNotes.find((note) => note.id === noteId)
            .categories,
        }),
      });

      setAddCategoryNoteId(null);
      setCategoryInput("");
    } catch (error) {
      console.error("Error adding category:", error.message);
    }
  };

  const isEditing = (noteId) => noteId === editingNoteId;

  const isAddingCategory = (noteId) => noteId === addCategoryNoteId;

  const handleToggleArchive = async (noteId, isArchived) => {
    try {
      const response = await fetch(`${backendURL}${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          archived: !isArchived,
        }),
      });

      if (response.ok) {
        const updatedNotes = notes.map((note) =>
          note.id === noteId ? { ...note, archived: !isArchived } : note
        );
        setNotes(updatedNotes);
      } else {
        console.error("Error updating archive status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating archive status:", error.message);
    }
  };

  const handleDeleteCategory = async (noteId, categoryToDelete) => {
    try {
      const response = await fetch(
        `${backendURL}${noteId}/categories/${categoryToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const updatedNotes = notes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                categories: note.categories.filter(
                  (cat) => cat !== categoryToDelete
                ),
              }
            : note
        );
        setNotes(updatedNotes);
      } else {
        console.error("Error deleting category:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting category:", error.message);
    }
  };

  function filters() {
    return (
      <div className="filters-container">
        <label className="filters">Filters:</label>
        <div className="active-categories-filters">
          <select
            className="filter"
            value={filter}
            onChange={(e) => handleSelectFilter(e.target.value)}
          >
            <option value="all">All Notes</option>
            <option value="archived">Archived Notes</option>
            <option value="notArchived">Active Notes</option>
          </select>
          <select
            className="filter"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {Array.from(uniqueCategories).map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  const filteredNotes = notes.filter((note) => {
    if (filter === "archived") {
      return note.archived && (!category || note.categories.includes(category));
    } else if (filter === "notArchived") {
      return (
        !note.archived && (!category || note.categories.includes(category))
      );
    } else {
      return !category || note.categories.includes(category);
    }
  });

  const handleCategoryInputChange = (e) => {
    setCategoryInput(e.target.value);
  };

  return (
    <>
      <div className="notes-container">
        <div className="title-dropdown">
          <div className="app-title">Notes</div>
        </div>

        <div className="add-note-container">
          <textarea
            className="note-content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
          ></textarea>

          <FaPlus className="add-button" onClick={handleAddNote} />
        </div>

        {filters()}

        <div className="notes">
          {filteredNotes.map((note) => (
            <div key={note.id} className="note">
              {isEditing(note.id) && (
                <>
                  <label>Content:</label>
                  <textarea
                    name="content"
                    value={editContent.content}
                    onChange={handleContentChange}
                  ></textarea>
                  <div className="save-cancel-container">
                    <TiTick className="tick icon" onClick={handleUpdateNote} />
                    <RxCross2
                      className="cancel icon"
                      onClick={handleCancelEdit}
                    />
                  </div>
                </>
              )}
              {!isEditing(note.id) && (
                <>
                  <div className="edit-icon-container">
                    <FaEdit
                      className="white icon"
                      onClick={() => handleEditNote(note)}
                    />
                  </div>

                  <div className="note-body">
                    <div className="note-text">{note.content}</div>

                    <div className="categories-container">
                      {note.categories.length > 0 && (
                        <div className="categories-title">Categories:</div>
                      )}
                      <div className="categories-list">
                        {note.categories.map((category, index) => (
                          <div key={index} className="category-container">
                            <div>{category}</div>
                            <RxCross2
                              className="delete-category"
                              onClick={() =>
                                handleDeleteCategory(note.id, category)
                              }
                            />
                          </div>
                        ))}
                      </div>

                      {isAddingCategory(note.id) && (
                        <>
                          <input
                            type="text"
                            value={categoryInput}
                            onChange={handleCategoryInputChange}
                          />
                          <div className="save-cancel-container">
                            <TiTick
                              className="tick icon"
                              onClick={() => addCategory(note.id)}
                            />

                            <RxCross2
                              className="cancel icon"
                              onClick={() => cancelAddingCategory(note.id)}
                            />
                          </div>
                        </>
                      )}
                      <button
                        className="add-category"
                        onClick={() => handleAddCategoty(note.id)}
                      >
                        Add category
                      </button>
                    </div>
                  </div>

                  <div className="delete-archive-container">
                    <MdDelete
                      onClick={() => handleDeleteNote(note.id)}
                      className="white icon"
                    />

                    <div
                      onClick={() =>
                        handleToggleArchive(note.id, note.archived)
                      }
                    >
                      {note.archived ? (
                        <MdOutlineUnarchive className="white icon" />
                      ) : (
                        <FaArchive className="white icon" />
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
