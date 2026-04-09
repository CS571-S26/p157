import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useState } from 'react'

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
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.location.trim()) e.location = 'Location is required.'
    setErrors(e)
    return Object.keys(e).length === 0
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
    <Card className="mb-3">
      <Card.Body>
        <Card.Title className="mb-3">Suggest a new spot (local prototype)</Card.Title>

        <Row className="g-3">
          <Col md={6}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label>Type</Form.Label>
            <Form.Select value={form.type} onChange={(e) => update({ type: e.target.value })}>
              <option>Library</option>
              <option>Cafe</option>
              <option>Building Lounge</option>
              <option>Classroom</option>
              <option>Student Union</option>
            </Form.Select>
          </Col>

          <Col md={12}>
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={form.location}
              onChange={(e) => update({ location: e.target.value })}
              isInvalid={!!errors.location}
              placeholder="Building name or address"
            />
            <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label>Noise (1 to 5): {form.noise}</Form.Label>
            <Form.Range min={1} max={5} value={form.noise} onChange={(e) => update({ noise: Number(e.target.value) })} />
          </Col>

          <Col md={6} className="d-flex align-items-end">
            <div className="d-flex flex-wrap gap-3">
              <Form.Check label="Outlets" checked={form.outlets} onChange={(e) => update({ outlets: e.target.checked })} />
              <Form.Check label="Food/Drink" checked={form.foodDrink} onChange={(e) => update({ foodDrink: e.target.checked })} />
              <Form.Check label="Group study" checked={form.groupStudy} onChange={(e) => update({ groupStudy: e.target.checked })} />
            </div>
          </Col>

          <Col md={12}>
            <Form.Label>Extra note (optional)</Form.Label>
            <Form.Control
              value={form.note}
              onChange={(e) => update({ note: e.target.value })}
              placeholder="Anything helpful for other students"
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </Card.Body>
    </Card>
  )
}