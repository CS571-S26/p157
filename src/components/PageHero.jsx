export default function PageHero({ kicker, title, subtitle, children }) {
  return (
    <section className="hero-panel mb-4">
      <div className="page-kicker">{kicker}</div>
      <div className="d-lg-flex justify-content-between align-items-start gap-4">
        <div>
          <h1 className="page-title page-title-sm">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>

        {children}
      </div>
    </section>
  )
}