import { useMemo, useState } from 'react';
import spots from './data/spots.json';
import Filters from './components/Filters';
import SpotCard from './components/SpotCard';
import { useLocalStorage } from './hooks/useLocalStorage';
import './styles.css';

function getDayKey(d) {
  const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return keys[d.getDay()];
}

function isOpenNowApprox(spot) {
  const now = new Date();
  const dayKey = getDayKey(now);
  const range = spot.hours?.[dayKey];
  if (!range || range[0] === 0 && range[1] === 0) return false;
  const hour = now.getHours();
  const [start, end] = range;
  return hour >= start && hour < end;
}

export default function App() {
  const [tab, setTab] = useState('list'); // list | bookmarks
  const [filters, setFilters] = useState({
    q: '',
    maxNoise: 5,
    outlets: false,
    foodDrink: false,
    groupStudy: false,
    openNow: false,
  });

  const [bookmarks, setBookmarks] = useLocalStorage('ssf_bookmarks', []);
  const [checkins, setCheckins] = useLocalStorage('ssf_checkins', {}); // { [id]: { crowd, note, ts } }
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();

    return spots
      .filter((s) => s.noise <= filters.maxNoise)
      .filter((s) => (filters.outlets ? s.outlets : true))
      .filter((s) => (filters.foodDrink ? s.foodDrink : true))
      .filter((s) => (filters.groupStudy ? s.groupStudy : true))
      .filter((s) => (filters.openNow ? isOpenNowApprox(s) : true))
      .filter((s) => {
        if (!q) return true;
        const blob = `${s.name} ${s.type} ${s.location} ${(s.tags || []).join(' ')}`.toLowerCase();
        return blob.includes(q);
      });
  }, [filters]);

  const bookmarkedSpots = useMemo(() => {
    const set = new Set(bookmarks);
    return spots.filter((s) => set.has(s.id));
  }, [bookmarks]);

  function toggleBookmark(id) {
    setBookmarks((prev) => {
      const set = new Set(prev);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return Array.from(set);
    });
  }

  function saveCheckin(id, crowd, note) {
    setCheckins((prev) => ({
      ...prev,
      [id]: { crowd, note, ts: Date.now() },
    }));
  }

  const listToShow = tab === 'bookmarks' ? bookmarkedSpots : filtered;

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">Study Spot Finder</h1>
          <div className="subtitle">Front-end prototype with local interactions</div>
        </div>

        <nav className="tabs">
          <button className={tab === 'list' ? 'tab active' : 'tab'} onClick={() => setTab('list')}>
            All Spots
          </button>
          <button className={tab === 'bookmarks' ? 'tab active' : 'tab'} onClick={() => setTab('bookmarks')}>
            Bookmarks ({bookmarks.length})
          </button>
        </nav>
      </header>

      <main className="main">
        {tab === 'list' ? (
          <Filters filters={filters} setFilters={setFilters} />
        ) : (
          <div className="card">
            <div className="muted">Your bookmarked spots are saved in localStorage.</div>
          </div>
        )}

        <div className="grid">
          {listToShow.length === 0 ? (
            <div className="card">
              <div className="spotName">No results</div>
              <div className="muted">Try relaxing filters or changing your search.</div>
            </div>
          ) : null}

          {listToShow.map((s) => (
            <SpotCard
              key={s.id}
              spot={s}
              isBookmarked={bookmarks.includes(s.id)}
              onToggleBookmark={() => toggleBookmark(s.id)}
              onOpenDetails={() => setSelected(s)}
            />
          ))}
        </div>
      </main>

      {selected ? (
        <div className="modalBackdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modalTop">
              <div>
                <div className="spotName">{selected.name}</div>
                <div className="muted">{selected.type} · {selected.location}</div>
              </div>
              <button className="btn" onClick={() => setSelected(null)}>Close</button>
            </div>

            <div className="section">
              <div className="pillRow">
                <span className="pill">Noise: {selected.noise}/5</span>
                {selected.outlets ? <span className="pill">Outlets</span> : null}
                {selected.foodDrink ? <span className="pill">Food</span> : null}
                {selected.groupStudy ? <span className="pill">Group</span> : null}
                <span className="pill">{isOpenNowApprox(selected) ? 'Open now (approx)' : 'May be closed'}</span>
              </div>

              <div className="muted" style={{ marginTop: 8 }}>
                Tags: {(selected.tags || []).join(', ')}
              </div>
            </div>

            <div className="section">
              <h2 className="h2">Check-in (local prototype)</h2>

              <CheckinForm
                existing={checkins[selected.id]}
                onSave={(crowd, note) => saveCheckin(selected.id, crowd, note)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CheckinForm({ existing, onSave }) {
  const [crowd, setCrowd] = useState(existing?.crowd || 'some');
  const [note, setNote] = useState(existing?.note || '');

  const last = existing?.ts ? new Date(existing.ts).toLocaleString() : null;

  return (
    <div className="card">
      <div className="row">
        <label className="label">
          Crowd level
          <select className="input" value={crowd} onChange={(e) => setCrowd(e.target.value)}>
            <option value="empty">Empty</option>
            <option value="some">Some seats</option>
            <option value="full">Full</option>
          </select>
        </label>

        <label className="label">
          Quick note (optional)
          <input
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="quiet today, outlets near window..."
          />
        </label>
      </div>

      <div className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="btnPrimary" onClick={() => onSave(crowd, note)}>
          Save check-in
        </button>
        <div className="muted">{last ? `Last saved: ${last}` : 'No check-in yet'}</div>
      </div>
    </div>
  );
}
