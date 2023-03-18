import { useMemo, useState } from "react";
import { Form, Button, Col, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import Select from "react-select";

import { Tag, Note } from "./App";
import EditTagsModal from "./EditTagModal";
import NoteCard from "./NoteCard";

interface NoteListProps {
  availableTags: Tag[];
  notes: Note[];
  onEditTags: (tagList: Tag[]) => void;
}

function NoteList({ availableTags, notes, onEditTags }: NoteListProps) {
  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const [showEditTagsModal, setShowEditTagsModal] = useState(false);
  const handleCloseEditTagsModal = () => {
    setShowEditTagsModal(false);
  };
  const handleOpenEditTagsModal = () => {
    setShowEditTagsModal(true);
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        title === "" ||
        (note.title.toLowerCase().includes(title.toLowerCase()) &&
          (selectedTags.length === 0 ||
            selectedTags.every((tag) =>
              note.tags.some((noteTag) => noteTag.id === tag.id)
            )))
      );
    });
  }, [selectedTags, title, notes, availableTags]);

  return (
    <>
      <Row className="align-items-center mb-4">
        <Col>
          <h1>Notes</h1>
        </Col>
        <Col xs="auto">
          <Stack direction="horizontal" gap={2}>
            <Link to="/new">
              <Button variant="primary">Create</Button>
            </Link>
            <Button
              variant="outline-secondary"
              onClick={handleOpenEditTagsModal}
            >
              Edit Tags
            </Button>
          </Stack>
        </Col>
      </Row>

      <Form>
        <Row className="mb-4">
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Select
                isMulti
                value={selectedTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                options={availableTags.map((tag) => ({
                  value: tag.id,
                  label: tag.label,
                }))}
                onChange={(tags) =>
                  setSelectedTags(
                    tags.map((tag) => ({ id: tag.value, label: tag.label }))
                  )
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row xs={1} sm={2} md={3} xl={4} className="g-3">
        {filteredNotes.map((note) => {
          return (
            <Col key={note.id}>
              <NoteCard id={note.id} title={note.title} tags={note.tags} />
            </Col>
          );
        })}
      </Row>

      {showEditTagsModal && (
        <EditTagsModal
          availableTags={availableTags}
          onClose={handleCloseEditTagsModal}
          onSave={onEditTags}
        />
      )}
    </>
  );
}

export default NoteList;
