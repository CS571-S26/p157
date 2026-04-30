import { Button, Card, Col, Form, Row } from 'react-bootstrap'

export default function SpotFilters({ filters, setFilters, sortBy, setSortBy, onReset }) {
  function update(partial) {
    setFilters({ ...filters, ...partial })
  }

  return (
    <Card className="section-panel border-0 mb-4">
      <Card.Body className="p-0">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>Filter and sort</div>
            <div style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.95rem' }}>
              Tight filters, fast decisions.
            </div>
          </div>

          <Button className="soft-btn" onClick={onReset}>Reset</Button>
        </div>

        <Row className="g-4">
          <Col md={6}>
            <Form.Group controlId="filterSearch">
              <Form.Label>Search</Form.Label>
              <Form.Control
                value={filters.q}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Try: library, quiet, union..."
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="filterMaxNoise">
              <Form.Label htmlFor="filterMaxNoise">Max noise (1 to 5): {filters.maxNoise}</Form.Label>
              <Form.Range
                id="filterMaxNoise"
                min={1}
                max={5}
                value={filters.maxNoise}
                onChange={(e) => update({ maxNoise: Number(e.target.value) })}
              />
              <div style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.9rem' }}>
                Uses community-reported noise when available.
              </div>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Check
              id="filterOutlets"
              type="switch"
              label="Outlets"
              checked={filters.outlets}
              onChange={(e) => update({ outlets: e.target.checked })}
            />
          </Col>

          <Col md={3}>
            <Form.Check
              id="filterFoodDrink"
              type="switch"
              label="Food/Drink"
              checked={filters.foodDrink}
              onChange={(e) => update({ foodDrink: e.target.checked })}
            />
          </Col>

          <Col md={3}>
            <Form.Check
              id="filterGroupStudy"
              type="switch"
              label="Group study"
              checked={filters.groupStudy}
              onChange={(e) => update({ groupStudy: e.target.checked })}
            />
          </Col>

          <Col md={3}>
            <Form.Check
              id="filterOpenNow"
              type="switch"
              label="Open now"
              checked={filters.openNow}
              onChange={(e) => update({ openNow: e.target.checked })}
            />
          </Col>

          <Col md={6}>
            <Form.Group controlId="filterSortBy">
              <Form.Label>Sort by</Form.Label>
              <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recommended">Recommended</option>
                <option value="updated">Most recently updated</option>
                <option value="quiet">Quietest first</option>
                <option value="popular">Most reports</option>
                <option value="alphabetical">Alphabetical</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6} className="d-flex align-items-end">
            <div style={{ color: 'var(--muted)', fontWeight: 700, fontSize: '0.92rem' }}>
              Recommended favors open spots, lower noise, and active community updates.
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}