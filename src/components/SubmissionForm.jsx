import { useState } from 'react'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'

export default function SubmissionForm({ onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    type: 'Library',
    location: '',
    noise: 3,
    outlets: false,
    foodDrink: false,
    groupStudy: true,
    note: ''
  })

  const [errors, setErrors] = useState({})

  function update(partial) {
    setForm({ ...form, ...partial })
  }

  function validate() {
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Name is required.'
    if (!form.location.trim()) nextErrors.location = 'Location is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit() {
    if (!validate()) return

    onSubmit({
      ...form,
      id: crypto.randomUUID(),
      ts: Date.now()
    })

    setForm({
      name: '',
      type: 'Library',
      location: '',
      noise: 3,
      outlets: false,
      foodDrink: false,
      groupStudy: true,
      note: ''
    })

    setErrors({})
  }

  return (
    <Card className="section-panel border-0 mb-4">
      <Card.Body className="p-0">
        <div className="filter-header">
          <div>
            <div className="filter-title">Suggest a new study spot</div>
            <div className="filter-subtitle">
              Submitted spots are saved on your device and appear on Explore right away.
            </div>
          </div>
        </div>

        <Row className="g-4">
          <Col md={6}>
            <Form.Group controlId="submitSpotName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                isInvalid={!!errors.name}
                placeholder="Example: Humanities Reading Room"
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="submitSpotType">
              <Form.Label>Type</Form.Label>
              <Form.Select value={form.type} onChange={(e) => update({ type: e.target.value })}>
                <option>Library</option>
                <option>Cafe</option>
                <option>Building Lounge</option>
                <option>Classroom</option>
                <option>Student Union</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="submitSpotLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={form.location}
                onChange={(e) => update({ location: e.target.value })}
                isInvalid={!!errors.location}
                placeholder="Building name or street address"
              />
              <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="submitSpotNoise">
              <Form.Label htmlFor="submitSpotNoise">Base noise: {form.noise}</Form.Label>
              <Form.Range
                id="submitSpotNoise"
                min={1}
                max={5}
                value={form.noise}
                onChange={(e) => update({ noise: Number(e.target.value) })}
              />
              <div className="filter-chip-note">
                This is the default noise level before community updates come in.
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Label>Amenities</Form.Label>
            <div className="d-flex flex-column gap-2" role="group" aria-label="Amenities">
              <Form.Check
                id="submitSpotOutlets"
                label="Outlets available"
                checked={form.outlets}
                onChange={(e) => update({ outlets: e.target.checked })}
              />
              <Form.Check
                id="submitSpotFoodDrink"
                label="Food or drink allowed"
                checked={form.foodDrink}
                onChange={(e) => update({ foodDrink: e.target.checked })}
              />
              <Form.Check
                id="submitSpotGroupStudy"
                label="Good for group study"
                checked={form.groupStudy}
                onChange={(e) => update({ groupStudy: e.target.checked })}
              />
            </div>
          </Col>

          <Col md={12}>
            <Form.Group controlId="submitSpotNote">
              <Form.Label>Extra note (optional)</Form.Label>
              <Form.Control
                value={form.note}
                onChange={(e) => update({ note: e.target.value })}
                placeholder="Anything helpful for other students"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button className="primary-btn" onClick={handleSubmit}>
            Submit new spot
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}