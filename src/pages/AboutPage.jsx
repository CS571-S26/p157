import { Col, Container, Row } from 'react-bootstrap'
import PageHero from '../components/PageHero'

export default function AboutPage() {
  return (
    <Container className="page-shell">
      <PageHero
        kicker="About the project"
        title="Study Spot Finder"
        subtitle="Study Spot Finder is a responsive web app concept for UW-Madison students who need a place to work between classes without wasting time walking somewhere that does not fit."
      />

      <Row className="g-4">
        <Col md={6}>
          <div className="about-card">
            <h2 className="about-card-heading">What users can do</h2>
            <p>
              Students can browse study spots, filter by amenities and noise, save bookmarks,
              submit new places, and share live check-ins about current crowd and noise conditions.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="about-card">
            <h2 className="about-card-heading">Interactive focus</h2>
            <p>
              The core interaction is the live check-in system. Users do not just consume
              information. They also update the current crowd and noise so the experience feels dynamic.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="about-card">
            <h2 className="about-card-heading">Current scope</h2>
            <p>
              This is a front-end prototype built with React, React Router, React Bootstrap, and
              localStorage. It uses a curated dataset plus user-submitted spots stored locally.
            </p>
          </div>
        </Col>

        <Col md={6}>
          <div className="about-card">
            <h2 className="about-card-heading">Next steps</h2>
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