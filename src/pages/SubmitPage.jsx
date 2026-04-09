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
      hours: { mon:[0,0], tue:[0,0], wed:[0,0], thu:[0,0], fri:[0,0], sat:[0,0], sun:[0,0] },
      createdAt: s.ts
    }
    setUserSpots((prev) => [spot, ...prev])
  }

  function clearAll() {
    setUserSpots([])
  }

  return (
    <Container className="py-3">
      <h2 className="mb-1">Submit</h2>
      <div className="text-muted mb-3">
        Submitted spots become part of Explore immediately. Stored locally for this prototype.
      </div>

      <SubmissionForm onSubmit={addUserSpot} />

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title className="mb-0">My Submitted Spots</Card.Title>
            <Button variant="outline-danger" size="sm" onClick={clearAll} disabled={userSpots.length === 0}>
              Clear
            </Button>
          </div>

          {userSpots.length === 0 ? (
            <div className="text-muted mt-3">No submitted spots yet.</div>
          ) : (
            <div className="mt-3 d-flex flex-column gap-2">
              {userSpots.map((s) => (
                <div key={s.id} className="border rounded p-2 bg-light">
                  <div className="fw-semibold">{s.name} <span className="text-muted">({s.type})</span></div>
                  <div className="text-muted small">{s.location} · Base noise {s.noise}/5</div>
                  <div className="text-muted small">
                    {s.outlets ? 'Outlets' : 'No outlets'} · {s.foodDrink ? 'Food' : 'No food'} · {s.groupStudy ? 'Group ok' : 'Solo'}
                  </div>
                  <div className="text-muted small">This spot is now visible on Explore.</div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}