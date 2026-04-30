import { Button, Col, Modal, Row } from 'react-bootstrap'
import CheckInForm from './CheckInForm'
import {
  computeCommunityStatus,
  crowdLabel,
  isOpenNowApprox,
  minutesAgo,
  noiseLabel
} from '../utils/spotUtils'

function latestEntry(raw) {
  if (!raw) return null
  if (Array.isArray(raw)) return raw[0] || null
  if (raw.ts) return raw
  return null
}

function NoiseDots({ level }) {
  const colorClass = level <= 2 ? 'quiet' : level === 3 ? 'moderate' : 'loud'
  return (
    <span className="noise-dots" aria-label={`Noise ${level} out of 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={`noise-dot${i <= level ? ` ${colorClass}` : ''}`} />
      ))}
    </span>
  )
}

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
  const noiseLevel = status.noiseNow

  const crowdClass = {
    success: 'crowd-empty',
    warning: 'crowd-some',
    danger:  'crowd-full',
  }[crowdInfo.variant] ?? ''

  const noiseClass = noiseLevel <= 2 ? 'noise-quiet' : noiseLevel === 3 ? 'noise-moderate' : 'noise-loud'

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      dialogClassName="spot-modal"
      aria-labelledby="spot-modal-title"
    >
      <Modal.Header closeButton>
        <div>
          <div className="spot-type-pill mb-2">{spot.type}</div>
          {/* Changed from div to h2 for proper heading + added id for aria-labelledby */}
          <h2 className="modal-spot-title" id="spot-modal-title">{spot.name}</h2>
          <div className="modal-spot-meta">{spot.location}</div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Row className="g-3 mb-3">
          <Col xs={6} md={3}>
            <div className={`detail-stat-card ${crowdClass}`}>
              <div className="detail-stat-label">Community crowd</div>
              <div className="detail-stat-value">{crowdInfo.text}</div>
            </div>
          </Col>

          <Col xs={6} md={3}>
            <div className={`detail-stat-card ${noiseClass}`}>
              <div className="detail-stat-label">Noise now</div>
              <div className="detail-stat-value">
                <NoiseDots level={noiseLevel} />
                {' '}{noiseLevel}/5
              </div>
            </div>
          </Col>

          <Col xs={6} md={3}>
            <div className="detail-stat-card">
              <div className="detail-stat-label">Reports</div>
              <div className="detail-stat-value">{status.reportCount}</div>
            </div>
          </Col>

          <Col xs={6} md={3}>
            <div className={`detail-stat-card ${openNow ? 'status-open' : ''}`}>
              <div className="detail-stat-label">Status</div>
              <div className="detail-stat-value">{openNow ? 'Open now' : 'May be closed'}</div>
            </div>
          </Col>
        </Row>

        <Row className="g-3">
          <Col md={6}>
            <div className="detail-panel">
              <div className="detail-panel-title">About this spot</div>
              <p className="mb-3">{spot.description}</p>

              <div className="meta-chip-row mb-0">
                {spot.outlets    ? <span className="meta-chip">Outlets</span>             : null}
                {spot.foodDrink  ? <span className="meta-chip">Food/Drink</span>          : null}
                {spot.groupStudy ? <span className="meta-chip">Group study</span>         : null}
                {spot.wifi       ? <span className="meta-chip">WiFi</span>                : null}
                {spot.seating    ? <span className="meta-chip">Seating: {spot.seating}</span> : null}
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="detail-panel">
              <div className="detail-panel-title">Community activity</div>
              <p className="mb-2">
                {ago !== null
                  ? `Last update was ${ago} minute${ago === 1 ? '' : 's'} ago.`
                  : 'No recent community updates yet.'}
              </p>

              <p className="mb-2">Crowd: <strong>{crowdInfo.text}</strong></p>
              <p className="mb-2">Noise: <strong>{noiseInfo.text}</strong></p>

              {status.latestNote ? (
                <div className="checkin-hint mt-2">
                  Latest note: "{status.latestNote}"
                </div>
              ) : (
                <div className="checkin-hint mt-2">No recent note shared.</div>
              )}
            </div>
          </Col>

          <Col md={12}>
            <div className="detail-panel">
              <div className="detail-panel-title">Add your live update</div>
              <CheckInForm existing={latestEntry(checkins)} onSave={onSaveCheckin} />
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="justify-content-between">
        <Button className="soft-btn" onClick={onToggleBookmark}>
          {isBookmarked ? '★ Remove bookmark' : '☆ Save bookmark'}
        </Button>

        <Button className="primary-btn" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}