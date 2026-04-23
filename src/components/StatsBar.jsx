import { Card, Col, Row } from 'react-bootstrap'

export default function StatsBar({ total, showing, bookmarks, userSpots, reports }) {
  const items = [
    { label: 'Total spots', value: total },
    { label: 'Showing', value: showing },
    { label: 'Bookmarks', value: bookmarks },
    { label: 'User submitted', value: userSpots },
    { label: 'Recent reports', value: reports }
  ]

  return (
    <Card className="mb-3">
      <Card.Body>
        <Row className="g-3">
          {items.map((it) => (
            <Col key={it.label} xs={6} md>
              <div className="ssf-stat-label">{it.label}</div>
              <div className="ssf-stat-value">{it.value}</div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  )
}