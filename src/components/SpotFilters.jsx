import { Card, Col, Form, Row } from 'react-bootstrap'

export default function SpotFilters({ filters, setFilters }) {
  function update(partial) {
    setFilters({ ...filters, ...partial })
  }

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>Search</Form.Label>
            <Form.Control
              value={filters.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Try: library, quiet, union..."
            />
          </Col>

          <Col md={6}>
            <Form.Label>Max noise (1 quiet to 5 loud): {filters.maxNoise}</Form.Label>
            <Form.Range
              min={1}
              max={5}
              value={filters.maxNoise}
              onChange={(e) => update({ maxNoise: Number(e.target.value) })}
            />
          </Col>

          <Col md={3}>
            <Form.Check
              type="checkbox"
              label="Outlets"
              checked={filters.outlets}
              onChange={(e) => update({ outlets: e.target.checked })}
            />
          </Col>
          <Col md={3}>
            <Form.Check
              type="checkbox"
              label="Food/Drink"
              checked={filters.foodDrink}
              onChange={(e) => update({ foodDrink: e.target.checked })}
            />
          </Col>
          <Col md={3}>
            <Form.Check
              type="checkbox"
              label="Group study"
              checked={filters.groupStudy}
              onChange={(e) => update({ groupStudy: e.target.checked })}
            />
          </Col>
          <Col md={3}>
            <Form.Check
              type="checkbox"
              label="Open now (approx)"
              checked={filters.openNow}
              onChange={(e) => update({ openNow: e.target.checked })}
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}