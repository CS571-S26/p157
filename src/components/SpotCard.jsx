import { Button, Card } from 'react-bootstrap'
import { computeCommunityStatus, crowdLabel, minutesAgo, noiseLabel } from '../utils/spotUtils'

function spotTypeClass(type) {
  return `spot-card-${String(type).toLowerCase().replace(/\s+/g, '-')}`
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
  const ago = minutesAgo(status.latestTs)

  const crowdClass = {
    success: 'crowd-empty',
    warning: 'crowd-some',
    danger:  'crowd-full',
  }[crowdInfo.variant] ?? ''

  const noiseLevel = status.noiseNow
  const noiseClass = noiseLevel <= 2 ? 'noise-quiet' : noiseLevel === 3 ? 'noise-moderate' : 'noise-loud'

  return (
    <Card className={`spot-card ${spotTypeClass(spot.type)} border-0`}>
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <div style={{ minWidth: 0 }}>
            <div className="spot-type-pill">{spot.type}</div>
            {/* Changed from div to h2 for proper heading structure */}
            <h2 className="spot-card-title">{spot.name}</h2>
            <div className="spot-card-meta">{spot.location}</div>
          </div>

          <Button
            className={`bookmark-btn${isBookmarked ? ' bookmarked' : ''}`}
            variant="light"
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? `Remove bookmark for ${spot.name}` : `Add bookmark for ${spot.name}`}
          >
            {isBookmarked ? '★' : '☆'}
          </Button>
        </div>

        <div className="status-grid">
          <div className={`status-chip ${crowdClass}`}>
            <span className="status-label">Crowd</span>
            <span className="status-value">{crowdInfo.text}</span>
          </div>

          <div className={`status-chip ${noiseClass}`}>
            <span className="status-label">Noise</span>
            <span className="status-value">
              <NoiseDots level={noiseLevel} />
              {' '}{noiseLevel}/5
            </span>
          </div>
        </div>

        <div className="meta-chip-row">
          <span className="meta-chip">Reports {status.reportCount}</span>
          {spot.outlets   ? <span className="meta-chip">Outlets</span>   : null}
          {spot.foodDrink ? <span className="meta-chip">Food/Drink</span> : null}
          {spot.groupStudy ? <span className="meta-chip">Group</span>    : null}
          <span className={`meta-chip ${isOpenNow ? 'open' : 'closed'}`}>
            {isOpenNow ? 'Open now' : 'May be closed'}
          </span>
        </div>

        <div className="spot-description">{spot.description}</div>

        <div className="spot-card-footer mt-auto">
          <div className="spot-update">
            {ago !== null ? `Updated ${ago} min ago` : 'No live reports yet'}
          </div>

          <Button className="spot-primary-btn" onClick={onOpenDetails}>
            View details
          </Button>
        </div>
      </Card.Body>
    </Card>
  )
}