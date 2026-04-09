import { Badge, Button, Modal } from 'react-bootstrap'
import CheckInForm from './CheckInForm'
import { computeCommunityStatus, crowdLabel, isOpenNowApprox, minutesAgo, noiseLabel } from '../utils/spotUtils'

export default function SpotDetailModal({
  show,
  onHide,
  spot,
  checkins,
  isBookmarked,
  onToggleBookmark,
  onSaveCheckin
}) {
  if (!spot) return null

  const openNow = isOpenNowApprox(spot)
  const status = computeCommunityStatus(checkins, spot.noise)
  const crowdInfo = crowdLabel(status.crowd)
  const noiseInfo = noiseLabel(status.noiseNow)
  const ago = minutesAgo(status.latestTs)

  const latestEntry = Array.isArray(checkins) ? checkins[0] : (checkins?.ts ? checkins : null)

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{spot.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="text-muted">
          {spot.type} · {spot.location}
        </div>

        <div className="mt-3 d-flex flex-wrap gap-2">
          <Badge bg={crowdInfo.variant}>Community crowd: {crowdInfo.text}</Badge>
          <Badge bg={noiseInfo.variant}>Community noise now: {status.noiseNow}/5</Badge>
          <Badge bg="secondary">Reports: {status.reportCount}</Badge>
          {ago !== null ? <Badge bg="secondary">Updated {ago} min ago</Badge> : null}
          <Badge bg={openNow ? 'success' : 'dark'}>{openNow ? 'Open now' : 'May be closed'}</Badge>
        </div>

        <p className="mt-3 mb-2">{spot.description}</p>

        <hr />
        <h6 className="mb-2">Add your check-in (you directly report noise)</h6>
        <CheckInForm existing={latestEntry} onSave={onSaveCheckin} />
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Button variant={isBookmarked ? 'warning' : 'outline-warning'} onClick={onToggleBookmark}>
          {isBookmarked ? 'Bookmarked ★' : 'Bookmark ☆'}
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}