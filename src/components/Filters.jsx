export default function Filters({ filters, setFilters }) {
  function update(partial) {
    setFilters({ ...filters, ...partial });
  }

  return (
    <div className="card">
      <div className="row">
        <label className="label">
          Search
          <input
            className="input"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder="Try: library, union, quiet..."
          />
        </label>

        <label className="label">
          Max noise (1 quiet to 5 loud)
          <input
            className="input"
            type="range"
            min="1"
            max="5"
            value={filters.maxNoise}
            onChange={(e) => update({ maxNoise: Number(e.target.value) })}
          />
          <div className="hint">Current: {filters.maxNoise}</div>
        </label>
      </div>

      <div className="row">
        <label className="check">
          <input
            type="checkbox"
            checked={filters.outlets}
            onChange={(e) => update({ outlets: e.target.checked })}
          />
          Outlets
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={filters.foodDrink}
            onChange={(e) => update({ foodDrink: e.target.checked })}
          />
          Food/Drink
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={filters.groupStudy}
            onChange={(e) => update({ groupStudy: e.target.checked })}
          />
          Group study
        </label>

        <label className="check">
          <input
            type="checkbox"
            checked={filters.openNow}
            onChange={(e) => update({ openNow: e.target.checked })}
          />
          Open now (approx)
        </label>
      </div>
    </div>
  );
}
