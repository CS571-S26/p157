import { Col, Container, Row } from 'react-bootstrap'
import { useEffect, useMemo, useState } from 'react'
import baseSpots from '../data/spots.json'
import SpotFilters from '../components/SpotFilters'
import SpotCard from '../components/SpotCard'
import SpotDetailModal from '../components/SpotDetailModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { computeCommunityStatus, isOpenNowApprox } from '../utils/spotUtils'

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    q: '',
    maxNoise: 5,
    outlets: false,
    foodDrink: false,
    groupStudy: false,
    openNow: false
  })

  const [bookmarks, setBookmarks] = useLocalStorage('ssf_bookmarks', [])
  const [checkins, setCheckins] = useLocalStorage('ssf_checkins', {})
  const [userSpots] = useLocalStorage('ssf_user_spots', [])
  const [selected, setSelected] = useState(null)

  const [tick, setTick] = useState(0)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'ssf_checkins' || e.key === 'ssf_user_spots' || e.key === 'ssf_bookmarks') {
        setTick((t) => t + 1)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const allSpots = useMemo(() => {
    return [...userSpots, ...baseSpots]
  }, [userSpots, tick])

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()

    return allSpots
      .filter((s) => {
        const status = computeCommunityStatus(checkins[s.id], s.noise)
        return status.noiseNow <= filters.maxNoise
      })
      .filter((s) => (filters.outlets ? s.outlets : true))
      .filter((s) => (filters.foodDrink ? s.foodDrink : true))
      .filter((s) => (filters.groupStudy ? s.groupStudy : true))
      .filter((s) => (filters.openNow ? isOpenNowApprox(s) : true))
      .filter((s) => {
        if (!q) return true
        const blob = `${s.name} ${s.type} ${s.location} ${(s.tags || []).join(' ')}`.toLowerCase()
        return blob.includes(q)
      })
  }, [filters, allSpots, checkins, tick])

  function toggleBookmark(id) {
    setBookmarks((prev) => {
      const set = new Set(prev)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      return Array.from(set)
    })
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
      <h2 className="mb-1">Explore</h2>
      <div className="text-muted mb-3">
        Community noise is directly reported by users (1 quiet–5 loud) and aggregated from recent check-ins.
      </div>

      <SpotFilters filters={filters} setFilters={setFilters} />

      <Row className="g-3">
        {filtered.length === 0 ? (
          <Col>
            <div className="border rounded p-3 bg-white text-muted">
              No results. Try relaxing filters or changing search.
            </div>
          </Col>
        ) : null}

        {filtered.map((s) => (
          <Col key={s.id} md={6} lg={4}>
            <SpotCard
              spot={s}
              checkins={checkins[s.id] || null}
              isOpenNow={isOpenNowApprox(s)}
              isBookmarked={bookmarks.includes(s.id)}
              onToggleBookmark={() => toggleBookmark(s.id)}
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
        isBookmarked={selected ? bookmarks.includes(selected.id) : false}
        onToggleBookmark={() => selected && toggleBookmark(selected.id)}
        onSaveCheckin={(crowd, noise, note) => selected && saveCheckin(selected.id, crowd, noise, note)}
      />
    </Container>
  )
}