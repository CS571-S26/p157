import { Card, Col, Form, Row } from 'react-bootstrap'

export default function SortBar({ sortBy, setSortBy }) {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="g-3 align-items-end">
          <Col md={6}>
            <Form.Label className="mb-1">Sort</Form.Label>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="updated">Most recently updated</option>
              <option value="noiseAsc">Community noise (low to high)</option>
              <option value="noiseDesc">Community noise (high to low)</option>
              <option value="reports">Most reports</option>
              <option value="name">Name (A to Z)</option>
            </Form.Select>
          </Col>
          <Col md={6} className="text-muted small">
            Sorting uses community status computed from recent check-ins.
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}