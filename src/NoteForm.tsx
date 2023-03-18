import { FormEvent, useRef, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import Creatable from "react-select/creatable";
import { v4 as uuidV4 } from "uuid";

import { NoteData, Tag } from "./App";

interface NoteFormProps extends Partial<NoteData> {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
}

function NoteForm({
  title = "",
  markdown = "",
  tags = [],
  onSubmit,
  onAddTag,
  availableTags,
}: NoteFormProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const titleRef = useRef<HTMLInputElement>(null!);
  const markdownRef = useRef<HTMLTextAreaElement>(null!);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: titleRef.current.value,
      markdown: markdownRef.current.value,
      tags: selectedTags,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Stack gap={4}>
        <Row>
          <Col>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                defaultValue={title}
                required
                type="text"
                placeholder="Enter title"
                ref={titleRef}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Creatable
                onCreateOption={(label) => {
                  const newTag = { label, id: uuidV4() };
                  onAddTag(newTag);
                  setSelectedTags((prev) => [...prev, newTag]);
                }}
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
        <Form.Group controlId="markdown">
          <Form.Label>Body</Form.Label>
          <Form.Control
            defaultValue={markdown}
            required
            as="textarea"
            placeholder="Enter something"
            rows={15}
            ref={markdownRef}
          />
        </Form.Group>
        <Stack direction="horizontal" gap={2}>
          <Button type="submit" variant="primary">
            Save
          </Button>
          <Link to="..">
            <Button type="button" variant="outline-secondary">
              Cancel
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Form>
  );
}

export default NoteForm;
