import { Badge, Button, Card, Stack } from 'react-bootstrap'
import { computeCommunityStatus, crowdLabel, minutesAgo, noiseLabel } from '../utils/spotUtils'

function truncate(text, max = 80) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

export default function SpotCard({
  spot,
  checkins,
  isBookmarked,
  onToggleBookmark,
  onOpenDetails,
  isOpenNow
}) {
  const status = computeCommunityStatus(checkins, spot.noise)
  const crowdInfo = crowdLabel(status.crowd)
  const noiseInfo = noiseLabel(status.noiseNow)
  const ago = minutesAgo(status.latestTs)

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Stack direction="horizontal" className="justify-content-between align-items-start">
          <div>
            <Card.Title className="mb-1">{spot.name}</Card.Title>
            <Card.Subtitle className="text-muted">
              {spot.type} · {spot.location}
            </Card.Subtitle>
          </div>

          <Button
            variant={isBookmarked ? 'warning' : 'outline-warning'}
            onClick={onToggleBookmark}
            aria-label="bookmark"
          >
            {isBookmarked ? '★' : '☆'}
          </Button>
        </Stack>

        <div className="mt-3 d-flex flex-wrap gap-2">
          <Badge bg={crowdInfo.variant}>Community crowd: {crowdInfo.text}</Badge>
          <Badge bg={noiseInfo.variant}>Community noise now: {status.noiseNow}/5</Badge>
          <Badge bg="secondary">Reports: {status.reportCount}</Badge>
          {ago !== null ? <Badge bg="secondary">Updated {ago} min ago</Badge> : null}

          {spot.outlets ? <Badge bg="secondary">Outlets</Badge> : null}
          {spot.foodDrink ? <Badge bg="secondary">Food</Badge> : null}
          {spot.groupStudy ? <Badge bg="secondary">Group</Badge> : null}

          <Badge bg={isOpenNow ? 'success' : 'dark'}>{isOpenNow ? 'Open now' : 'May be closed'}</Badge>

          {spot.tags?.includes('user-submitted') ? <Badge bg="info">User submitted</Badge> : null}
        </div>

        {status.latestNote ? (
          <div className="mt-2 text-muted small">
            Latest note: {truncate(status.latestNote)}
          </div>
        ) : null}

        <Card.Text className="mt-3 text-muted">{spot.description}</Card.Text>

        <div className="d-flex justify-content-end">
          <Button onClick={onOpenDetails}>View details</Button>
        </div>
      </Card.Body>
    </Card>
  )
}