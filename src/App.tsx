import React, { useEffect, useMemo } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { v4 as uuidV4 } from "uuid";

import NewNote from "./NewNote";
import { useLocalStorage } from "./useLocalStorage";
import "bootstrap/dist/css/bootstrap.min.css";
import NoteList from "./NoteList";
import NoteLayout from "./NoteLayout";
import Note from "./Note";
import EditNote from "./EditNote";

export interface Tag {
  id: string;
  label: string;
}

export interface RawNoteData {
  title: string;
  markdown: string;
  tagIds: string[];
}

export interface NoteData {
  title: string;
  markdown: string;
  tags: Tag[];
}

export interface Note extends NoteData {
  id: string;
}

export interface RawNote extends RawNoteData {
  id: string;
}

function App() {
  const navigate = useNavigate();
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", []);
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", []);

  const notesWithTags = useMemo(() => {
    return notes.map((note) => ({
      ...note,
      tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
    }));
  }, [notes, tags]);

  const handleCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        { ...data, id: uuidV4(), tagIds: tags.map((tag) => tag.id) },
      ];
    });

    navigate("..");
  };

  const handleUpdateNote = (id: string, { tags, ...data }: NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map((note) => {
        if (note.id === id) {
          return { ...note, ...data, tagIds: tags.map((tag) => tag.id) };
        }
        return note;
      });
    });

    navigate("..");
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter((note) => note.id !== id);
    });
  };

  const handleAddTag = (tag: Tag) => {
    setTags((prev) => [...prev, tag]);
  };

  const handleEditTags = (tagList: Tag[]) => setTags(tagList);

  return (
    <Container className="my-4">
      <Routes>
        <Route
          path="/"
          element={
            <NoteList
              availableTags={tags}
              notes={notesWithTags}
              onEditTags={handleEditTags}
            />
          }
        />
        <Route
          path="/new"
          element={
            <NewNote
              onSubmit={handleCreateNote}
              onAddTag={handleAddTag}
              availableTags={tags}
            />
          }
        />
        <Route path="/:id" element={<NoteLayout notes={notesWithTags} />}>
          <Route index element={<Note onDeleteNote={handleDeleteNote} />} />
          <Route
            path="edit"
            element={
              <EditNote
                onSubmit={handleUpdateNote}
                onAddTag={handleAddTag}
                availableTags={tags}
              />
            }
          />
        </Route>
        <Route path="#" element={<Navigate to="/" />} />
      </Routes>
    </Container>
  );
}

export default App;
