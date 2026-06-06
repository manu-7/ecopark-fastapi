import { Link } from 'react-router-dom'

const stats = [
  ['194 ha', 'Total Park Area'],
  ['42 ha', 'Lake & Water Body'],
  ['18+', 'Activities'],
  ['₹30', 'Entry Ticket'],
]

const thematicAreas = [
  { icon: '🌴', title: 'Tropical Rain Forest', desc: 'Walk through a lush simulated rainforest with exotic flora.' },
  { icon: '🏡', title: 'Bengal Village', desc: 'Experience the rustic charm of rural Bengal life and culture.' },
  { icon: '🗿', title: 'Seven Wonders', desc: 'Replicas of the Seven Wonders of the World in one place.' },
  { icon: '🍎', title: 'Fruits Garden', desc: 'A vibrant garden with a variety of seasonal and tropical fruits.' },
  { icon: '🦌', title: 'Harinalaya', desc: 'A dedicated deer sanctuary within the park grounds.' },
  { icon: '🦋', title: 'Butterfly Garden', desc: 'A magical enclosure filled with hundreds of butterfly species.' },
  { icon: '🌿', title: 'Bamboo Garden', desc: 'Serene pathways through towering bamboo groves.' },
  { icon: '🌱', title: 'Herbal Garden', desc: 'Medicinal and aromatic plants cultivated in a dedicated zone.' },
  { icon: '🎭', title: 'Mask Garden', desc: 'An artistic garden decorated with colourful tribal masks.' },
  { icon: '🗽', title: 'Sculpture Garden', desc: 'Open-air sculptures and art installations across the lawns.' },
  { icon: '🎡', title: "Eco Children's Park", desc: 'A fun-filled area designed specially for young visitors.' },
  { icon: '⛳', title: 'Golf Area', desc: 'A well-maintained golf zone for a relaxed sporting experience.' },
]

const highlights = [
  { icon: '🚣', title: 'Kayaking', desc: 'Paddle across the 42-hectare lake.' },
  { icon: '💨', title: 'Water Zorbing', desc: 'Roll on water in giant inflatable balls.' },
  { icon: '🚂', title: 'Toy Train', desc: 'A scenic ride through the park.' },
  { icon: '🚴', title: 'Duo Cycling', desc: 'Cycle through nature trails together.' },
  { icon: '🏹', title: 'Archery', desc: 'Test your aim at the archery range.' },
  { icon: '⛵', title: 'High Speed Boat', desc: 'Thrilling boat ride on the lake.' },
]

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, rgba(10,30,18,0.75) 0%, rgba(26,61,43,0.55) 60%, rgba(10,30,18,0.82) 100%), url(/images/hero-sec.jpg) center/cover no-repeat',
        }} />
        <div style={{ position: 'absolute', top: '10%', right: '8%', width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(149,213,178,0.15)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '15%', right: '12%', width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(149,213,178,0.1)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', textAlign: 'center', padding: '0 20px', maxWidth: 720 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(82,183,136,0.18)', border: '1px solid rgba(82,183,136,0.35)', borderRadius: 50, padding: '6px 16px', marginBottom: 24 }}>
            <span style={{ fontSize: 13 }}>🌿</span>
            <span style={{ color: '#95d5b2', fontSize: 13, fontWeight: 500, letterSpacing: '0.05em' }}>PRAKRITI TIRTHA — NEW TOWN, KOLKATA</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.4rem,6vw,4.2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
            A Joyride Amidst<br />Greenery
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 'clamp(15px,2vw,17px)', lineHeight: 1.75, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
            One of the largest urban parks in India — 194 hectares of lush greenery, a 42-hectare lake, thematic gardens, and 18+ activities at New Town, Rajarhat, Kolkata.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book_ticket" className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
              🎫 Book Tickets — ₹30
            </Link>
            <Link to="/adventure" className="btn-outline" style={{ fontSize: 16, padding: '14px 36px', color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.4)' }}>
              Explore Activities
            </Link>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.5 }}>
          <span style={{ fontSize: 12, color: '#fff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #fff, transparent)' }} />
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────── */}
      <section style={{ background: 'var(--forest)', padding: '28px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, textAlign: 'center' }}>
          {stats.map(([num, label]) => (
            <div key={label} style={{ padding: '12px 0' }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, color: 'var(--moss)', fontWeight: 700 }}>{num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────── */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage)' }}>ABOUT ECO PARK</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', color: 'var(--forest)', marginTop: 10, marginBottom: 20, lineHeight: 1.3 }}>
              Kolkata's Largest Urban Green Space
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
              Eco Park (Prakriti Tirtha) in Action Area II of New Town is one of the largest open spaces in Kolkata. The site is spread across 194 hectares including a 42-hectare water body with an island.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: 15, marginBottom: 28 }}>
              The park was developed to re-establish a healthy, self-sustaining ecosystem while serving as a premier city-level recreational destination. The Biswa Bangla Convention Centre stands to its north.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/book_ticket" className="btn-primary" style={{ fontSize: 14 }}>Book Entry Ticket</Link>
              <Link to="/adventure" className="btn-outline" style={{ fontSize: 14 }}>See All Activities</Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🕕', title: 'Timing', val: 'Tue–Sun: 12 PM – 8:30 PM\nMon–Fri (Morning): 5 AM – 8 AM' },
              { icon: '🎫', title: 'Entry Fee', val: '₹30 per person\n(Children under 3 free)' },
              { icon: '📍', title: 'Location', val: 'Major Arterial Rd, Action Area II\nNew Town, Kolkata 700156' },
              { icon: '📞', title: 'Contact', val: '+91 33 2706 4010\ncurator@ecoparknewtown.com' },
            ].map(c => (
              <div key={c.title} style={{ background: 'var(--cream)', borderRadius: 14, padding: '20px 18px', border: '1px solid var(--leaf)' }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontWeight: 700, color: 'var(--forest)', fontSize: 13, marginBottom: 6 }}>{c.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:700px){.about-grid{grid-template-columns:1fr !important}}`}</style>
      </section>

      {/* ── Popular Activities ────────────────── */}
      <section style={{ padding: '80px 20px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage)' }}>AMUSEMENTS</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--forest)', marginTop: 8, marginBottom: 12 }}>Popular Activities</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>From water sports to cycling trails — there's something exciting for every visitor.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20 }}>
            {highlights.map((a, i) => (
              <div key={a.title} className="card animate-fadeup" style={{ animationDelay: `${i * 0.08}s`, padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 14 }}>{a.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: 'var(--forest)', marginBottom: 8 }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/adventure" className="btn-primary" style={{ fontSize: 14 }}>View All 18+ Activities →</Link>
          </div>
        </div>
      </section>

      {/* ── Thematic Areas ───────────────────── */}
      <section style={{ padding: '80px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--sage)' }}>EXPLORE</span>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: 'var(--forest)', marginTop: 8, marginBottom: 12 }}>Thematic Areas</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>Twelve distinct zones, each offering a unique experience within the park.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20 }}>
            {thematicAreas.map((t, i) => (
              <div key={t.title} className="card animate-fadeup" style={{ animationDelay: `${i * 0.06}s`, display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 20px' }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <h4 style={{ fontWeight: 700, color: 'var(--forest)', fontSize: 14, marginBottom: 5 }}>{t.title}</h4>
                  <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timing & Rules CTA ───────────────── */}
      <section style={{ background: 'var(--forest)', padding: '70px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.6rem)', color: '#fff', marginBottom: 16 }}>
            Plan Your Visit Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
            Open Tuesday to Sunday · 12:00 PM – 8:30 PM<br />
            Morning Walk: Monday to Friday · 5:00 AM – 8:00 AM<br />
            Entry: ₹30 per person
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book_ticket" className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>🎫 Book Tickets Now</Link>
            <Link to="/contact" className="btn-outline" style={{ fontSize: 15, padding: '13px 32px', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.35)' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
