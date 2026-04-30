import { Button, Card, Container } from 'react-bootstrap'
import { useLocalStorage } from '../hooks/useLocalStorage'
import SubmissionForm from '../components/SubmissionForm'

export default function SubmitPage() {
  const [userSpots, setUserSpots] = useLocalStorage('ssf_user_spots', [])

  function addUserSpot(s) {
    const spot = {
      id: s.id,
      name: s.name,
      type: s.type,
      location: s.location,
      noise: s.noise,
      outlets: s.outlets,
      foodDrink: s.foodDrink,
      groupStudy: s.groupStudy,
      wifi: true,
      seating: 'Unknown',
      description: s.note ? `User submitted: ${s.note}` : 'User submitted spot',
      tags: ['user-submitted'],
      hours: { mon: [0, 0], tue: [0, 0], wed: [0, 0], thu: [0, 0], fri: [0, 0], sat: [0, 0], sun: [0, 0] },
      createdAt: s.ts
    }

    setUserSpots((prev) => [spot, ...prev])
  }

  function clearAll() {
    setUserSpots([])
  }

  return (
    <Container className="page-shell">
      <section className="hero-panel mb-4">
        <div className="page-kicker">Contribute</div>
        <h1 className="page-title page-title-sm">Submit a new study spot</h1>
        <p className="page-subtitle">
          Know a quiet corner or overlooked lounge? Add it here so it appears on Explore.
        </p>
      </section>

      <SubmissionForm onSubmit={addUserSpot} />

      <Card className="section-panel border-0">
        <Card.Body className="p-0">
          <div className="filter-header">
            <div>
              <div className="filter-title">My submitted spots</div>
              <div className="filter-subtitle">
                These are stored locally in this prototype and appear immediately on Explore.
              </div>
            </div>

            <Button className="soft-btn" onClick={clearAll} disabled={userSpots.length === 0}>
              Clear all
            </Button>
          </div>

          {userSpots.length === 0 ? (
            <div className="empty-state">
              <h2 className="empty-state-title mb-2">No submissions yet</h2>
              <div>Your submitted spots will appear here after you add one.</div>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {userSpots.map((spot) => (
                <div key={spot.id} className="submission-list-item">
                  <div className="submission-list-title">
                    {spot.name} <span className="text-muted">({spot.type})</span>
                  </div>

                  <div className="submission-list-meta mb-1">
                    {spot.location} · Base noise {spot.noise}/5
                  </div>

                  <div className="submission-list-meta">
                    {spot.outlets ? 'Outlets' : 'No outlets'} ·
                    {' '}
                    {spot.foodDrink ? 'Food/drink' : 'No food/drink'} ·
                    {' '}
                    {spot.groupStudy ? 'Good for groups' : 'Better for solo work'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}