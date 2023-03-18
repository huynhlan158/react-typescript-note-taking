import { useEffect, useState } from "react";
import { Modal, Form, Stack, Row, Col, Button } from "react-bootstrap";
import { Tag } from "./App";

interface EditTagsModalProps {
  availableTags: Tag[];
  onClose: () => void;
  onSave: (tagList: Tag[]) => void;
}
function EditTagsModal({ availableTags, onClose, onSave }: EditTagsModalProps) {
  const [tempAvailableTags, setTempAvailabeTags] = useState(availableTags);

  const handleDeleteTag = (id: string) => {
    setTempAvailabeTags((prevTempTags) => {
      return prevTempTags.filter((tag) => tag.id !== id);
    });
  };

  const handleUpdateTag = (id: string, label: string) => {
    setTempAvailabeTags((prevTempTags) => {
      return prevTempTags.map((tag) => {
        if (tag.id === id) {
          return { ...tag, label };
        } else {
          return tag;
        }
      });
    });
  };

  const handleSave = () => {
    onSave(tempAvailableTags);
    onClose();
  };

  useEffect(() => {
    console.log({ tempAvailableTags, availableTags });
  }, [tempAvailableTags]);

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Tags</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Stack gap={2}>
            {tempAvailableTags.map((tag) => (
              <Row key={tag.id}>
                <Col>
                  <Form.Control
                    defaultValue={tag.label}
                    required
                    type="text"
                    onChange={(e) => handleUpdateTag(tag.id, e.target.value)}
                  />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeleteTag(tag.id)}
                  >
                    &times;
                  </Button>
                </Col>
              </Row>
            ))}
          </Stack>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTagsModal;
