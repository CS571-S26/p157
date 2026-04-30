import { useEffect, useMemo, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import baseSpots from '../data/spots.json'
import SpotFilters from '../components/SpotFilters'
import SpotCard from '../components/SpotCard'
import SpotDetailModal from '../components/SpotDetailModal'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { computeCommunityStatus, isOpenNowApprox } from '../utils/spotUtils'
import PageHero from '../components/PageHero'
import SummaryCard from '../components/SummaryCard'

function normalizeEntries(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (raw.ts) return [raw]
  return []
}

function recommendedScore(spot, status) {
  let score = 0

  if (isOpenNowApprox(spot)) score += 4
  score += Math.max(0, 6 - status.noiseNow)
  score += Math.min(status.reportCount, 5)

  if (status.crowd === 'some') score += 2
  if (status.crowd === 'empty') score += 1

  return score
}

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    q: '',
    maxNoise: 5,
    outlets: false,
    foodDrink: false,
    groupStudy: false,
    openNow: false
  })

  const [sortBy, setSortBy] = useState('recommended')
  const [bookmarks, setBookmarks] = useLocalStorage('ssf_bookmarks', [])
  const [checkins, setCheckins] = useLocalStorage('ssf_checkins', {})
  const [userSpots] = useLocalStorage('ssf_user_spots', [])
  const [selected, setSelected] = useState(null)
  const [, setTick] = useState(0)

  useEffect(() => {
    function onStorage(e) {
      if (
        e.key === 'ssf_checkins' ||
        e.key === 'ssf_user_spots' ||
        e.key === 'ssf_bookmarks'
      ) {
        setTick((t) => t + 1)
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const allSpots = useMemo(() => [...userSpots, ...baseSpots], [userSpots])

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()

    const result = allSpots
      .filter((spot) => {
        const status = computeCommunityStatus(checkins[spot.id], spot.noise)
        return status.noiseNow <= filters.maxNoise
      })
      .filter((spot) => (filters.outlets ? spot.outlets : true))
      .filter((spot) => (filters.foodDrink ? spot.foodDrink : true))
      .filter((spot) => (filters.groupStudy ? spot.groupStudy : true))
      .filter((spot) => (filters.openNow ? isOpenNowApprox(spot) : true))
      .filter((spot) => {
        if (!q) return true
        const blob = `${spot.name} ${spot.type} ${spot.location} ${(spot.tags || []).join(' ')}`.toLowerCase()
        return blob.includes(q)
      })

    result.sort((a, b) => {
      const statusA = computeCommunityStatus(checkins[a.id], a.noise)
      const statusB = computeCommunityStatus(checkins[b.id], b.noise)

      if (sortBy === 'updated') return (statusB.latestTs || 0) - (statusA.latestTs || 0)
      if (sortBy === 'quiet') return statusA.noiseNow - statusB.noiseNow
      if (sortBy === 'popular') return statusB.reportCount - statusA.reportCount
      if (sortBy === 'alphabetical') return a.name.localeCompare(b.name)

      return recommendedScore(b, statusB) - recommendedScore(a, statusA)
    })

    return result
  }, [allSpots, filters, sortBy, checkins])

  const stats = useMemo(() => {
    const recentReports = Object.values(checkins).reduce((sum, raw) => {
      return sum + normalizeEntries(raw).length
    }, 0)

    return {
      totalSpots: allSpots.length,
      visible: filtered.length,
      bookmarks: bookmarks.length,
      userSubmitted: userSpots.length,
      recentReports
    }
  }, [allSpots.length, filtered.length, bookmarks.length, userSpots.length, checkins])

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
      const arr = Array.isArray(raw) ? raw : raw?.ts ? [raw] : []
      const next = [{ crowd, noise, note, ts: Date.now() }, ...arr].slice(0, 30)
      return { ...prev, [id]: next }
    })
  }

  function resetFilters() {
    setFilters({
      q: '',
      maxNoise: 5,
      outlets: false,
      foodDrink: false,
      groupStudy: false,
      openNow: false
    })
    setSortBy('recommended')
  }

  return (
    <Container className="page-shell">
      <PageHero
        kicker="Live campus discovery"
        title="Find a study spot that fits right now"
        subtitle="Browse libraries, lounges, cafes, and student spaces. Use community check-ins to see where it is quieter, more crowded, or newly active."
      >
        <div className="hero-note">
          This is a front-end prototype. Bookmarks, check-ins, and submissions are stored
          locally in the browser.
        </div>
      </PageHero>

      <Row className="g-3 mt-3 mb-4">
        <Col xs={6} md={2}>
          <SummaryCard label="Total spots" value={stats.totalSpots} />
        </Col>

        <Col xs={6} md={2}>
          <SummaryCard label="Showing" value={stats.visible} />
        </Col>

        <Col xs={6} md={2}>
          <SummaryCard label="Bookmarks" value={stats.bookmarks} />
        </Col>

        <Col xs={6} md={3}>
          <SummaryCard label="User submitted" value={stats.userSubmitted} />
        </Col>

        <Col xs={12} md={3}>
          <SummaryCard label="Community reports" value={stats.recentReports} />
        </Col>
      </Row>

      <SpotFilters
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onReset={resetFilters}
      />

      <Row className="g-4">
        {filtered.length === 0 ? (
          <Col>
            <div className="empty-state">
              <h2 className="empty-state-title mb-2">No spots match your filters</h2>
              <div>Try relaxing a few filters or resetting the search.</div>
            </div>
          </Col>
        ) : null}

        {filtered.map((spot) => (
          <Col key={spot.id} md={6} xl={4}>
            <SpotCard
              spot={spot}
              checkins={checkins[spot.id] || null}
              isOpenNow={isOpenNowApprox(spot)}
              isBookmarked={bookmarks.includes(spot.id)}
              onToggleBookmark={() => toggleBookmark(spot.id)}
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
        isBookmarked={selected ? bookmarks.includes(selected.id) : false}
        onToggleBookmark={() => selected && toggleBookmark(selected.id)}
        onSaveCheckin={(crowd, noise, note) => selected && saveCheckin(selected.id, crowd, noise, note)}
      />
    </Container>
  )
}