import { useMemo, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import baseSpots from '../data/spots.json'
import SpotCard from '../components/SpotCard'
import SpotDetailModal from '../components/SpotDetailModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { isOpenNowApprox } from '../utils/spotUtils'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useLocalStorage('ssf_bookmarks', [])
  const [checkins, setCheckins] = useLocalStorage('ssf_checkins', {})
  const [userSpots] = useLocalStorage('ssf_user_spots', [])
  const [selected, setSelected] = useState(null)

  const allSpots = useMemo(() => [...userSpots, ...baseSpots], [userSpots])

  const bookmarkedSpots = useMemo(() => {
    const set = new Set(bookmarks)
    return allSpots.filter((spot) => set.has(spot.id))
  }, [bookmarks, allSpots])

  function removeBookmark(id) {
    setBookmarks((prev) => prev.filter((value) => value !== id))
  }

  function saveCheckin(id, crowd, noise, note) {
    setCheckins((prev) => {
      const raw = prev[id]
      const arr = Array.isArray(raw) ? raw : raw?.ts ? [raw] : []
      const next = [{ crowd, noise, note, ts: Date.now() }, ...arr].slice(0, 30)
      return { ...prev, [id]: next }
    })
  }

  return (
    <Container className="page-shell">
      <section className="hero-panel mb-4">
        <div className="page-kicker">Saved spots</div>
        <h1 className="page-title page-title-sm">Your bookmarks</h1>
        <p className="page-subtitle">
          Keep a personal shortlist of study spaces you want to return to.
        </p>
      </section>

      <Row className="g-4">
        {bookmarkedSpots.length === 0 ? (
          <Col>
            <div className="empty-state">
              <h4 className="mb-2">No bookmarks yet</h4>
              <div>Go to Explore and save a few places you want to keep track of.</div>
            </div>
          </Col>
        ) : null}

        {bookmarkedSpots.map((spot) => (
          <Col key={spot.id} md={6} xl={4}>
            <SpotCard
              spot={spot}
              checkins={checkins[spot.id] || null}
              isOpenNow={isOpenNowApprox(spot)}
              isBookmarked={true}
              onToggleBookmark={() => removeBookmark(spot.id)}
              onOpenDetails={() => setSelected(spot)}
            />
          </Col>
        ))}
      </Row>

      <SpotDetailModal
        show={!!selected}
        onHide={() => setSelected(null)}
        spot={selected}
        checkins={selected ? (checkins[selected.id] || null) : null}
        isBookmarked={true}
        onToggleBookmark={() => selected && removeBookmark(selected.id)}
        onSaveCheckin={(crowd, noise, note) => selected && saveCheckin(selected.id, crowd, noise, note)}
      />
    </Container>
  )
}