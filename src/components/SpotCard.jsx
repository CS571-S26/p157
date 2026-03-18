export default function SpotCard({
  spot,
  isBookmarked,
  onToggleBookmark,
  onOpenDetails,
}) {
  return (
    <div className="spot">
      <div className="spotTop">
        <div>
          <div className="spotName">{spot.name}</div>
          <div className="muted">{spot.type} · {spot.location}</div>
        </div>

        <button className="btn" onClick={onToggleBookmark} aria-label="Toggle bookmark">
          {isBookmarked ? '★' : '☆'}
        </button>
      </div>

      <div className="pillRow">
        <span className="pill">Noise: {spot.noise}/5</span>
        {spot.outlets ? <span className="pill">Outlets</span> : null}
        {spot.foodDrink ? <span className="pill">Food</span> : null}
        {spot.groupStudy ? <span className="pill">Group</span> : null}
      </div>

      <div className="spotBottom">
        <button className="btnPrimary" onClick={onOpenDetails}>
          View details
        </button>
      </div>
    </div>
  );
}
