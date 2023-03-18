import {
  Navigate,
  Outlet,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Note } from "./App";

interface NoteLayoutProps {
  notes: Note[];
}

export const useNote = () => {
  return useOutletContext<Note>();
};

function NoteLayout({ notes }: NoteLayoutProps) {
  const { id } = useParams();
  const note = notes.find((note) => note.id === id);

  if (!note) return <Navigate to="/" replace />;

  return <Outlet context={note} />;
}

export default NoteLayout;
