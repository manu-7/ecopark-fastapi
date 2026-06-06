import { Link } from 'react-router-dom'

const activities = [
  { icon: '🚴', title: 'Duo Cycling', tags: ['Outdoor', 'Couples'], desc: 'Explore the park on a tandem bicycle through scenic nature trails winding across 194 hectares of greenery.' },
  { icon: '🌅', title: 'Morning Walk', tags: ['Wellness', 'Daily'], desc: 'Enjoy a peaceful early morning walk amidst nature. Available Mon–Fri, 5:00 AM – 8:00 AM.' },
  { icon: '⛵', title: 'High Speed Boat', tags: ['Water Sport', 'Thrill'], desc: 'Experience the thrill of a high-speed boat ride across the 42-hectare lake.' },
  { icon: '🎯', title: 'Rifle Shooting', tags: ['Sport', 'Skill'], desc: 'Test your aim at the professionally supervised rifle shooting range within the park.' },
  { icon: '🚗', title: 'Remote Car', tags: ['Fun', 'Kids'], desc: 'Drive remote-controlled cars on a dedicated track — great for kids and adults alike.' },
  { icon: '🚂', title: 'Toy Train', tags: ['Family', 'Scenic'], desc: 'Take a charming toy train ride around the park and enjoy the scenery at a leisurely pace.' },
  { icon: '👶', title: 'Baby Cycling', tags: ['Kids', 'Safe'], desc: 'Safe and fun cycling experience designed specifically for young children.' },
  { icon: '🎠', title: 'Santa Monica', tags: ['Amusement', 'All Ages'], desc: 'A classic amusement ride that the whole family can enjoy together.' },
  { icon: '🚵', title: 'Junior Cycling', tags: ['Kids', 'Outdoor'], desc: 'Cycling trails sized perfectly for junior riders to build confidence outdoors.' },
  { icon: '🛵', title: 'Baby Scooter', tags: ['Kids', 'Fun'], desc: 'Mini scooter rides for the littlest adventurers in a safe, dedicated zone.' },
  { icon: '⚡', title: 'E-Byke', tags: ['Eco-Friendly', 'Outdoor'], desc: 'Ride an electric bike around the park — a green, fun way to explore the grounds.' },
  { icon: '⛵', title: 'Floating Pontoon', tags: ['Water', 'Relaxing'], desc: 'Step onto a floating pontoon and drift peacefully across the lake waters.' },
  { icon: '🚣', title: 'Kayaking', tags: ['Water Sport', 'All Levels'], desc: 'Paddle through the serene 42-hectare lake. Suitable for all skill levels with guided assistance.' },
  { icon: '🤸', title: 'Trampoline', tags: ['Kids', 'Active'], desc: 'Bounce and flip on trampolines — a high-energy activity for kids and teenagers.' },
  { icon: '💨', title: 'Water Zorbing', tags: ['Water', 'Thrill'], desc: 'Walk on water inside giant inflatable zorb balls — a truly unique experience.' },
  { icon: '⛸️', title: 'Roller Skates', tags: ['Sport', 'Fun'], desc: 'Lace up and roll around on the dedicated roller skating rink inside the park.' },
  { icon: '🏹', title: 'Archery', tags: ['Skill', 'Sport'], desc: 'Try your hand at archery with professional equipment and trained instructors.' },
  { icon: '🌀', title: 'Land Zorbing', tags: ['Thrill', 'Outdoor'], desc: 'Roll downhill inside an inflatable ball — an adrenaline-pumping land adventure.' },
]

const tagColors = {
  'Water Sport': { bg: 'rgba(14,165,233,0.12)', color: '#38bdf8' },
  'Thrill':      { bg: 'rgba(239,68,68,0.12)',  color: '#f87171' },
  'Kids':        { bg: 'rgba(251,146,60,0.12)', color: '#fb923c' },
  'Family':      { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
  'Outdoor':     { bg: 'rgba(52,211,153,0.12)', color: '#34d399' },
  'default':     { bg: 'rgba(82,183,136,0.12)', color: '#52b788' },
}

function Tag({ label }) {
  const s = tagColors[label] || tagColors.default
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 50, letterSpacing: '0.04em' }}>
      {label}
    </span>
  )
}

export default function Adventure() {
  return (
    <div style={{ background: 'var(--cream)', minHeight: '80vh' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--leaf) 100%)', padding: '70px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--moss)' }}>18+ ACTIVITIES</span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2rem,5vw,3rem)', color: '#fff', marginTop: 10, marginBottom: 12 }}>
          Activities & Adventures
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, maxWidth: 560, margin: '0 auto 24px' }}>
          From water sports on the 42-hectare lake to cycling, archery, and zorbing — Eco Park offers thrilling experiences for every age.
        </p>
        <Link to="/book_ticket" className="btn-primary" style={{ fontSize: 15, padding: '12px 30px' }}>
          🎫 Book Entry — ₹30
        </Link>
      </div>

      {/* Activities Grid */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          {activities.map((a, i) => (
            <div key={a.title} className="card animate-fadeup" style={{ animationDelay: `${i * 0.05}s`, padding: '24px 24px 28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--leaf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                  {a.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, color: 'var(--forest)', margin: 0, marginBottom: 6 }}>{a.title}</h3>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {a.tags.map(t => <Tag key={t} label={t} />)}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{a.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 56, background: 'var(--forest)', borderRadius: 20, padding: '48px 32px' }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: '#fff', marginBottom: 12 }}>Ready to Experience It All?</h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, marginBottom: 28 }}>
            Book your entry ticket for just ₹30 and enjoy unlimited access to all thematic areas. Activity rides are priced separately at the park.
          </p>
          <Link to="/book_ticket" className="btn-primary" style={{ fontSize: 15, padding: '13px 32px' }}>
            🎫 Book Tickets Now
          </Link>
        </div>
      </div>
    </div>
  )
}
