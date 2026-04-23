import { useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'

function noiseText(noise) {
  if (noise <= 2) return 'Quiet'
  if (noise === 3) return 'Moderate'
  return 'Loud'
}

export default function CheckInForm({ existing, onSave }) {
  const [crowd, setCrowd] = useState(existing?.crowd || 'some')
  const [noise, setNoise] = useState(existing?.noise || 3)
  const [note, setNote] = useState(existing?.note || '')

  useEffect(() => {
    setCrowd(existing?.crowd || 'some')
    setNoise(existing?.noise || 3)
    setNote(existing?.note || '')
  }, [existing])

  const last = existing?.ts ? new Date(existing.ts).toLocaleString() : null

  function handleSave() {
    onSave(crowd, noise, note.trim())
  }

  return (
    <div className="checkin-panel">
      <Row className="g-3">
        <Col md={5}>
          <Form.Label>Crowd level</Form.Label>
          <Form.Select value={crowd} onChange={(e) => setCrowd(e.target.value)}>
            <option value="empty">Empty</option>
            <option value="some">Some seats</option>
            <option value="full">Full</option>
          </Form.Select>
        </Col>

        <Col md={7}>
          <Form.Label>Noise level: {noise} ({noiseText(noise)})</Form.Label>
          <Form.Range
            min={1}
            max={5}
            value={noise}
            onChange={(e) => setNoise(Number(e.target.value))}
          />
          <div className="checkin-hint">You report the current noise directly. 1 is quiet, 5 is loud.</div>
        </Col>

        <Col md={12}>
          <Form.Label>Optional note</Form.Label>
          <Form.Control
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Example: quieter on the upper floor, a lot of outlets near the windows"
          />
        </Col>
      </Row>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">
        <div className="checkin-hint">
          {last ? `Last saved ${last}` : 'No check-in yet. Be the first to report.'}
        </div>

        <Button className="spot-primary-btn" onClick={handleSave}>
          Save check-in
        </Button>
      </div>
    </div>
  )
}