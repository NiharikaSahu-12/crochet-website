import { FaInstagram, FaEnvelope, FaWhatsapp } from 'react-icons/fa'
import { INSTAGRAM_DM_URL, INSTAGRAM_HANDLE, WHATSAPP_NUMBER, EMAIL, getWhatsAppOrderUrl } from '../../utils/instagram'

const values = [
  { emoji: '🧶', title: 'Handcrafted', desc: 'Every stitch placed with intention.' },
  { emoji: '🌿', title: 'Ethical Yarn', desc: 'Soft, premium, responsibly sourced.' },
  { emoji: '🎨', title: 'Fully Custom', desc: 'Your color, your size, your way.' },
  { emoji: '💌', title: 'Gift Ready', desc: 'Wrapped with love, always.' },
]

export default function AboutPage() {
  return (
    <div
      style={{ fontFamily: "'Lora', Georgia, serif" }}
      className="w-full overflow-hidden"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Playfair+Display:wght@700;900&display=swap');
        .about-hero-title { font-family: 'Playfair Display', serif; }
        .thread-divider {
          display: flex; align-items: center; gap: 1rem; margin: 0 auto;
        }
        .thread-divider::before, .thread-divider::after {
          content: ''; flex: 1; height: 1px; background: #d4a88a;
        }
        .card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(180,110,60,0.13); }
        .stitch-border {
          border: 2.5px dashed #e8c9a8;
          border-radius: 24px;
        }
        .btn-warm {
          background: #b85c2a;
          color: #fff7f0;
          border-radius: 999px;
          padding: 0.75rem 2rem;
          font-family: 'Lora', serif;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s, transform 0.15s;
          text-decoration: none;
        }
        .btn-warm:hover { background: #9a4a1f; transform: scale(1.03); }
        .btn-outline-warm {
          background: transparent;
          color: #b85c2a;
          border: 2px solid #b85c2a;
          border-radius: 999px;
          padding: 0.7rem 1.8rem;
          font-family: 'Lora', serif;
          font-weight: 600;
          font-size: 0.95rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          text-decoration: none;
        }
        .btn-outline-warm:hover { background: #b85c2a; color: #fff7f0; }
        .wavy-line {
          width: 60px; height: 6px;
          background: repeating-linear-gradient(
            90deg, #e8a96a 0px, #e8a96a 8px, transparent 8px, transparent 12px
          );
          border-radius: 3px;
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        style={{ background: 'linear-gradient(160deg, #fdf5ec 0%, #fef9f0 60%, #fff 100%)' }}
        className="relative px-6 py-24 text-center"
      >
        {/* Decorative yarn blobs */}
        <div style={{
          position: 'absolute', top: 40, left: '8%', width: 120, height: 120,
          background: 'radial-gradient(circle, #f5d8b8 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: 30, right: '10%', width: 160, height: 160,
          background: 'radial-gradient(circle, #f9e4c8 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <p style={{ color: '#b85c2a', fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1rem' }}>
          Handmade with heart
        </p>
        <h1
          className="about-hero-title"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: '#2d1a0e', lineHeight: 1.15, marginBottom: '1.5rem', fontWeight: 900 }}
        >
          Cozy, one loop<br />
          <span style={{ color: '#b85c2a', fontStyle: 'italic' }}>at a time.</span>
        </h1>
        <p style={{ color: '#7a5035', fontSize: '1.1rem', maxWidth: 480, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
          TheCozzyLoops creates handcrafted crochet pieces — each one unique, each one made to be loved.
        </p>
        <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="btn-warm">
          <FaInstagram size={17} /> Say hello
        </a>
      </section>

      {/* ── STORY ── */}
      <section style={{ background: '#fff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}
          className="flex-col-on-mobile">
          <style>{`@media(max-width:640px){.flex-col-on-mobile{grid-template-columns:1fr!important;gap:2rem!important;}}`}</style>

          {/* Image placeholder */}
          <div style={{ aspectRatio: '4/5', overflow: 'hidden', position: 'relative' }}>
            <img
              src="/images/crochet-main.jpg"
              alt="TheCozzyLoops crochet work"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 30 }}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentNode.style.background = 'linear-gradient(135deg, #fdebd5, #fdf5e8)'
                e.target.parentNode.style.display = 'flex'
                e.target.parentNode.style.alignItems = 'center'
                e.target.parentNode.style.justifyContent = 'center'
                e.target.parentNode.style.fontSize = '6rem'
                e.target.parentNode.innerHTML += '<span>🧶</span>'
              }}
            />
          </div>

          <div>
            <div className="wavy-line" style={{ marginBottom: '1.2rem' }} />
            <h2
              className="about-hero-title"
              style={{ fontSize: '2.4rem', color: '#2d1a0e', fontWeight: 700, marginBottom: '1.2rem', lineHeight: 1.25 }}
            >
              Our story
            </h2>
            <p style={{ color: '#7a5035', lineHeight: 1.85, marginBottom: '1rem', fontSize: '1.05rem' }}>
              What started as a quiet creative passion became something much more — a small studio where every piece is made by hand, never rushed, never mass-produced.
            </p>
            <p style={{ color: '#7a5035', lineHeight: 1.85, fontSize: '1.05rem', marginBottom: '2rem' }}>
              We believe in slow-made things. In the kind of care you can actually feel.
            </p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section style={{ background: '#fdf5ec', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="thread-divider" style={{ maxWidth: 360, marginBottom: '0.75rem' }}>
            <span style={{ color: '#b85c2a', fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              What we stand for
            </span>
          </div>
          <h2
            className="about-hero-title"
            style={{ textAlign: 'center', fontSize: '2.2rem', color: '#2d1a0e', fontWeight: 700, marginBottom: '3rem' }}
          >
            Made different, on purpose
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
            {values.map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="card-lift"
                style={{
                  background: '#fff',
                  border: '1.5px solid #eed9c4',
                  borderRadius: 20,
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'default'
                }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>{emoji}</div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#2d1a0e', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  {title}
                </h3>
                <p style={{ color: '#9a6245', fontSize: '0.9rem', lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#fff', padding: '4rem 1.5rem', borderTop: '1px solid #f0dece', borderBottom: '1px solid #f0dece' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', textAlign: 'center' }}>
          {[
            { val: '100%', label: 'Handmade' },
            { val: 'Custom', label: 'Orders welcome' },
            { val: '💕', label: 'Made with love' },
          ].map(({ val, label }) => (
            <div key={label}>
              <div className="about-hero-title" style={{ fontSize: '3rem', color: '#b85c2a', fontWeight: 900, lineHeight: 1 }}>{val}</div>
              <p style={{ color: '#9a6245', marginTop: '0.4rem', fontFamily: "'Lora', serif", fontSize: '0.95rem' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(150deg, #fdf5ec 0%, #fff 100%)', padding: '6rem 1.5rem', textAlign: 'center' }}>
        <div className="wavy-line" style={{ margin: '0 auto 1.5rem' }} />
        <h2
          className="about-hero-title"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#2d1a0e', fontWeight: 900, marginBottom: '1rem' }}
        >
          Ready to get cozy?
        </h2>
        <p style={{ color: '#7a5035', fontSize: '1.05rem', marginBottom: '2.5rem', maxWidth: 420, margin: '0 auto 2.5rem' }}>
          Browse the collection or order something custom — just for you.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <a
            href={`mailto:${EMAIL}`}
            className="btn-warm"
            style={{ background: '#d4a574' }}
          >
            <FaEnvelope size={17} /> Email Us
          </a>
          <a href={INSTAGRAM_DM_URL} target="_blank" rel="noopener noreferrer" className="btn-warm">
            <FaInstagram size={17} /> Message on Instagram
          </a>
          <a
            href={getWhatsAppOrderUrl(null, WHATSAPP_NUMBER)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-warm"
            style={{ background: '#25A047' }}
          >
          <FaWhatsapp size={17} /> Order on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}