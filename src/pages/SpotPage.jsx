import { Badge, Button, Card, Container, ListGroup, Stack } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import baseSpots from '../data/spots.json'
import CheckInForm from '../components/CheckInForm'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { computeCommunityStatus, crowdLabel, isOpenNowApprox, minutesAgo, noiseLabel } from '../utils/spotUtils'

export default function SpotPage() {
  const { id } = useParams()

  const [bookmarks, setBookmarks] = useLocalStorage('ssf_bookmarks', [])
  const [checkins, setCheckins] = useLocalStorage('ssf_checkins', {})
  const [userSpots] = useLocalStorage('ssf_user_spots', [])

  const allSpots = [...userSpots, ...baseSpots]
  const spot = allSpots.find((s) => s.id === id)

  if (!spot) {
    return (
      <Container className="py-3">
        <h2 className="ssf-page-title mb-1">Spot not found</h2>
        <div className="ssf-subtitle mb-3">This spot may have been deleted.</div>
        <Button as={Link} to="/">Back to Explore</Button>
      </Container>
    )
  }

  const isBookmarked = bookmarks.includes(spot.id)
  const openNow = isOpenNowApprox(spot)
  const status = computeCommunityStatus(checkins[spot.id], spot.noise)
  const crowdInfo = crowdLabel(status.crowd)
  const noiseInfo = noiseLabel(status.noiseNow)
  const ago = minutesAgo(status.latestTs)

  const recentEntries = Array.isArray(checkins[spot.id]) ? checkins[spot.id].slice(0, 6) : []

  function toggleBookmark() {
    setBookmarks((prev) => {
      const set = new Set(prev)
      if (set.has(spot.id)) set.delete(spot.id)
      else set.add(spot.id)
      return Array.from(set)
    })
  }

  function saveCheckin(crowd, noise, note) {
    setCheckins((prev) => {
      const raw = prev[spot.id]
      const arr = Array.isArray(raw) ? raw : (raw && raw.ts ? [raw] : [])
      const next = [{ crowd, noise, note, ts: Date.now() }, ...arr].slice(0, 30)
      return { ...prev, [spot.id]: next }
    })
  }

  return (
    <Container className="py-3">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <h2 className="ssf-page-title mb-1">{spot.name}</h2>
          <div className="ssf-subtitle">{spot.type} · {spot.location}</div>
        </div>
        <div className="d-flex gap-2">
          <Button variant={isBookmarked ? 'warning' : 'outline-warning'} onClick={toggleBookmark}>
            {isBookmarked ? 'Bookmarked ★' : 'Bookmark ☆'}
          </Button>
          <Button as={Link} to="/" variant="outline-secondary">Back</Button>
        </div>
      </div>

      <Card className="mt-3">
        <Card.Body>
          <div className="d-flex flex-wrap gap-2">
            <Badge bg={crowdInfo.variant}>Community crowd: {crowdInfo.text}</Badge>
            <Badge bg={noiseInfo.variant}>Community noise now: {status.noiseNow}/5</Badge>
            <Badge bg="secondary">Reports: {status.reportCount}</Badge>
            {ago !== null ? <Badge bg="secondary">Updated {ago} min ago</Badge> : null}
            <Badge bg={openNow ? 'success' : 'dark'}>{openNow ? 'Open now' : 'May be closed'}</Badge>
            {spot.tags?.includes('user-submitted') ? <Badge bg="info">User submitted</Badge> : null}
          </div>

          <p className="mt-3 mb-2">{spot.description}</p>

          <div className="text-muted small">
            {spot.outlets ? 'Outlets available' : 'No outlets'} ·{' '}
            {spot.foodDrink ? 'Food/drink nearby' : 'No food/drink'} ·{' '}
            {spot.groupStudy ? 'Group-friendly' : 'Better for solo work'}
          </div>
        </Card.Body>
      </Card>

      <Card className="mt-3">
        <Card.Body>
          <h5 className="mb-2">Add a check-in</h5>
          <div className="text-muted small mb-3">
            You directly report noise (1 quiet to 5 loud). The card and filters update immediately.
          </div>
          <CheckInForm existing={recentEntries[0] || null} onSave={saveCheckin} />
        </Card.Body>
      </Card>

      <Card className="mt-3">
        <Card.Body>
          <h5 className="mb-2">Recent reports</h5>
          {recentEntries.length === 0 ? (
            <div className="text-muted">No reports yet. Be the first to check in.</div>
          ) : (
            <ListGroup variant="flush">
              {recentEntries.map((e, idx) => (
                <ListGroup.Item key={idx}>
                  <Stack direction="horizontal" className="justify-content-between">
                    <div className="text-muted small">
                      {new Date(e.ts).toLocaleString()}
                    </div>
                    <div className="text-muted small">
                      Crowd: {e.crowd} · Noise: {e.noise}/5
                    </div>
                  </Stack>
                  {e.note ? <div className="mt-1">{e.note}</div> : null}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}