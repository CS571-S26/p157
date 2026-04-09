import { Col, Container, Row } from 'react-bootstrap'
import { useMemo, useState } from 'react'
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
    return allSpots.filter((s) => set.has(s.id))
  }, [bookmarks, allSpots])

  function removeBookmark(id) {
    setBookmarks((prev) => prev.filter((x) => x !== id))
  }

  function saveCheckin(id, crowd, noise, note) {
    setCheckins((prev) => {
      const raw = prev[id]
      const arr = Array.isArray(raw) ? raw : (raw && raw.ts ? [raw] : [])
      const next = [{ crowd, noise, note, ts: Date.now() }, ...arr].slice(0, 30)
      return { ...prev, [id]: next }
    })
  }

  return (
    <Container className="py-3">
      <h2 className="mb-1">Bookmarks</h2>
      <div className="text-muted mb-3">Your favorites are saved locally.</div>

      <Row className="g-3">
        {bookmarkedSpots.length === 0 ? (
          <Col>
            <div className="border rounded p-3 bg-white text-muted">
              No bookmarks yet. Go to Explore and tap ☆ to save a spot.
            </div>
          </Col>
        ) : null}

        {bookmarkedSpots.map((s) => (
          <Col key={s.id} md={6} lg={4}>
            <SpotCard
              spot={s}
              checkins={checkins[s.id] || null}
              isOpenNow={isOpenNowApprox(s)}
              isBookmarked={true}
              onToggleBookmark={() => removeBookmark(s.id)}
              onOpenDetails={() => setSelected(s)}
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