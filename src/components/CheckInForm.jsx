import { Button, Col, Form, Row } from 'react-bootstrap'
import { useState } from 'react'

export default function CheckInForm({ existing, onSave }) {
  const [crowd, setCrowd] = useState(existing?.crowd || 'some')
  const [noise, setNoise] = useState(existing?.noise || 3)

  const [showNote, setShowNote] = useState(Boolean(existing?.note))
  const [note, setNote] = useState(existing?.note || '')

  const last = existing?.ts ? new Date(existing.ts).toLocaleString() : null

  function handleSave() {
    onSave(crowd, noise, note.trim())
  }

  return (
    <>
      <Row className="g-3">
        <Col md={4}>
          <Form.Label>Crowd level</Form.Label>
          <Form.Select value={crowd} onChange={(e) => setCrowd(e.target.value)}>
            <option value="empty">Empty</option>
            <option value="some">Some seats</option>
            <option value="full">Full</option>
          </Form.Select>
        </Col>

        <Col md={8}>
          <Form.Label>Noise level: {noise}</Form.Label>
          <Form.Range min={1} max={5} value={noise} onChange={(e) => setNoise(Number(e.target.value))} />
          <div className="text-muted small">1 quiet · 5 loud</div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex gap-2 align-items-center">
          <Button onClick={handleSave}>Save check-in</Button>

          <Button
            variant="outline-secondary"
            onClick={() => setShowNote((v) => !v)}
            size="sm"
          >
            {showNote ? 'Hide note' : 'Add note'}
          </Button>
        </div>

        <div className="text-muted small">{last ? `Last saved: ${last}` : 'No check-in yet'}</div>
      </div>

      {showNote ? (
        <div className="mt-3">
          <Form.Label className="mb-1">Note (optional)</Form.Label>
          <Form.Control
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="quiet today, outlets near window..."
          />
          <div className="text-muted small mt-1">
            This note will show on the spot card as the latest report.
          </div>
        </div>
      ) : null}
    </>
  )
}