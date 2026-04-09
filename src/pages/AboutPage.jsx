import { Card, Container } from 'react-bootstrap'

export default function AboutPage() {
  return (
    <Container className="py-3">
      <h2 className="mb-3">About</h2>

      <Card>
        <Card.Body>
          <p className="mb-2">
            Study Spot Finder is a UI-focused prototype for quickly finding study locations on campus.
          </p>
          <p className="mb-2">
            It uses a curated static dataset and stores interactions (bookmarks, check-ins, submissions) locally in the browser.
          </p>
          <p className="mb-0 text-muted">
            Next steps: expand data, add sorting, improve accessibility, and refine responsive layout.
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}