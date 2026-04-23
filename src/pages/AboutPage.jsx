import { Col, Container, Row } from 'react-bootstrap'

export default function AboutPage() {
  return (
    <Container className="page-shell">
      <section className="hero-panel mb-4">
        <div className="page-kicker">About the project</div>
        <h1 className="page-title page-title-sm">Study Spot Finder</h1>
        <p className="page-subtitle">
          Study Spot Finder is a responsive web app concept for UW-Madison students who need a
          place to work between classes without wasting time walking somewhere that does not fit.
        </p>
      </section>

      <Row className="g-4">
        <Col md={6}>
          <div className="about-card">
            <h5>What users can do</h5>
            <p>
              Students can browse study spots, filter by amenities and noise, save bookmarks,
              submit new places, and share live check-ins about current crowd and noise conditions.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="about-card">
            <h5>Interactive focus</h5>
            <p>
              The core interaction is the live check-in system. Users do not just consume
              information. They also update the current crowd and noise so the experience feels dynamic.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="about-card">
            <h5>Current scope</h5>
            <p>
              This is a front-end prototype built with React, React Router, React Bootstrap, and
              localStorage. It uses a curated dataset plus user-submitted spots stored locally.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="about-card">
            <h5>Next steps</h5>
            <p>
              Future improvements could include a real shared backend, user accounts, map
              integration, accessibility refinements, and stronger campus-specific data.
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}