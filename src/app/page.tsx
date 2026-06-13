import type { Metadata } from 'next';
import UploadSection from '@/components/UploadSection';
import { Globe, Zap, QrCode, Smartphone, Monitor, Share2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'VistaSphere — 360° Virtual Tour Platform',
  description:
    'Upload a 360° GLB model and instantly generate an immersive virtual tour with QR sharing. No login. No registration. Ready in under a minute.',
};

const features = [
  {
    icon: Globe,
    title: 'Immersive 360° Tours',
    description: 'Camera placed inside your space. Visitors explore as if physically present.',
  },
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Upload your GLB file and your tour is live in under 60 seconds.',
  },
  {
    icon: QrCode,
    title: 'QR Code Included',
    description: 'Auto-generated QR code that links directly to your immersive tour.',
  },
  {
    icon: Smartphone,
    title: 'Gyroscope Controls',
    description: 'Mobile users can physically move their device to look around the space.',
  },
  {
    icon: Monitor,
    title: 'All Devices',
    description: 'Seamless experience on mobile, tablet, and desktop with fullscreen support.',
  },
  {
    icon: Share2,
    title: 'One-Click Sharing',
    description: 'Copy link, download QR, or share directly from the results page.',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div
          className="orb"
          style={{
            width: 800,
            height: 800,
            background: 'radial-gradient(circle, rgba(109,40,217,0.15) 0%, transparent 70%)',
            top: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
        <div
          className="orb"
          style={{
            width: 400,
            height: 400,
            background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
            bottom: '200px',
            right: '-100px',
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="/" className="nav-logo" aria-label="VistaSphere home">
            <div className="logo-mark">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <span>VistaSphere</span>
          </a>
          <div className="nav-actions">
            <a href="#upload-section" className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
              Upload Tour
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="container">
          <div className="hero-badge animate-fade-in-up" aria-label="Feature badge">
            <span className="badge-dot" aria-hidden="true" />
            No login required · Free to use
          </div>

          <h1
            id="hero-heading"
            className="heading-xl animate-fade-in-up delay-1"
            style={{ maxWidth: 780, margin: '24px auto 20px' }}
          >
            Explore Spaces
            <br />
            <span style={{ color: 'var(--accent)' }}>From Anywhere.</span>
          </h1>

          <p
            className="animate-fade-in-up delay-2"
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 48px',
              lineHeight: 1.7,
            }}
          >
            Upload a 360° GLB model and instantly generate an immersive
            virtual tour with QR sharing. Ready in under a minute.
          </p>

          {/* Upload Card */}
          <div
            className="upload-card animate-fade-in-up delay-3"
            id="upload-section"
            aria-label="Upload section"
          >
            <UploadSection />
          </div>

          {/* Stats */}
          <div className="stats-row animate-fade-in-up delay-4">
            {[
              { label: 'Upload time', value: '< 60s' },
              { label: 'File support', value: 'GLB' },
              { label: 'Devices', value: 'All' },
              { label: 'Login required', value: 'None' },
            ].map((stat) => (
              <div key={stat.label} className="stat-item">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section" aria-labelledby="features-heading">
        <div className="container">
          <h2
            id="features-heading"
            className="heading-md"
            style={{ textAlign: 'center', marginBottom: '12px' }}
          >
            Everything you need
          </h2>
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '56px' }}>
            Built for spaces, venues, properties, and experiences of any kind.
          </p>

          <div className="features-grid" role="list">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="feature-card animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
                role="listitem"
              >
                <div className="feature-icon" aria-hidden="true">
                  <feature.icon size={20} strokeWidth={1.5} />
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" aria-labelledby="how-heading">
        <div className="container" style={{ maxWidth: 680 }}>
          <h2 id="how-heading" className="heading-md" style={{ textAlign: 'center', marginBottom: '48px' }}>
            How it works
          </h2>
          <div className="steps-list">
            {[
              { step: '01', title: 'Upload your GLB', desc: 'Drag and drop your room, venue, or space as a GLB 3D model.' },
              { step: '02', title: 'Instant processing', desc: 'We generate a unique URL, place the camera inside your space, and create a QR code.' },
              { step: '03', title: 'Share everywhere', desc: 'Copy the link, download the QR, or share directly. Anyone can explore from any device.' },
            ].map((item, i) => (
              <div key={item.step} className="step-item">
                <div className="step-number" aria-hidden="true">{item.step}</div>
                {i < 2 && <div className="step-connector" aria-hidden="true" />}
                <div className="step-content">
                  <h3 style={{ fontWeight: 600, marginBottom: '6px' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-labelledby="cta-heading">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 id="cta-heading" className="heading-lg" style={{ marginBottom: '16px' }}>
            Ready to create your tour?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '36px', fontSize: '1.05rem' }}>
            No registration. No payment. Just upload and share.
          </p>
          <a href="#upload-section" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
            Upload Your Space
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <div className="container footer-inner">
          <a href="/" className="nav-logo" aria-label="VistaSphere home" style={{ fontSize: '0.9rem' }}>
            <div className="logo-mark" style={{ width: 28, height: 28 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.5" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            VistaSphere
          </a>
          <div className="footer-content">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0 0 8px' }}>
              AI-Powered 360° Virtual Tour & QR Sharing Platform
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <a
                href="mailto:tanishqjoshi200507@gmail.com"
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/tanishq-joshi-9921b3285/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
              >
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/tanishq_joshi_05/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 24px;
          border-bottom: 1px solid var(--border);
          background: rgba(8, 8, 8, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1rem;
          color: var(--text-primary);
          text-decoration: none;
          letter-spacing: -0.02em;
        }
        .logo-mark {
          width: 32px;
          height: 32px;
          background: var(--accent);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .hero {
          position: relative;
          z-index: 1;
          padding: 140px 0 80px;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: rgba(109, 40, 217, 0.1);
          border: 1px solid rgba(109, 40, 217, 0.25);
          border-radius: 9999px;
          font-size: 0.8rem;
          color: #a78bfa;
          font-weight: 500;
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .upload-card {
          background: var(--background-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 40px;
          max-width: 600px;
          margin: 0 auto 48px;
          position: relative;
          overflow: hidden;
        }
        .upload-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
        }
        .upload-section {}
        .dropzone {
          border: 2px dashed var(--border-active);
          border-radius: var(--radius-lg);
          padding: 48px 24px;
          cursor: pointer;
          transition: all var(--transition);
          position: relative;
          overflow: hidden;
        }
        .dropzone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(109,40,217,0.05) 0%, transparent 70%);
          opacity: 0;
          transition: opacity var(--transition);
        }
        .dropzone:hover, .dropzone-active {
          border-color: var(--accent);
          background: rgba(109, 40, 217, 0.04);
        }
        .dropzone:hover::before, .dropzone-active::before {
          opacity: 1;
        }
        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        .dropzone-icon {
          width: 56px;
          height: 56px;
          background: rgba(109, 40, 217, 0.1);
          border: 1px solid rgba(109, 40, 217, 0.2);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          margin-bottom: 4px;
        }
        .dropzone-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .dropzone-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
        .dropzone-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: 9999px;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .upload-progress {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
        }
        .upload-error {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 20px;
          background: rgba(239, 68, 68, 0.05);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: var(--radius-md);
        }
        .upload-success {
          text-align: center;
        }
        .success-checks {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .url-display {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: var(--background-secondary);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 24px;
          text-align: left;
        }
        .url-text {
          flex: 1;
          font-size: 0.82rem;
          color: var(--accent);
          font-family: 'SF Mono', 'Fira Code', monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .url-copy-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: color var(--transition);
          flex-shrink: 0;
        }
        .url-copy-btn:hover { color: var(--text-primary); }
        .qr-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }
        .qr-image {
          width: 140px;
          height: 140px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          object-fit: contain;
          background: white;
          padding: 4px;
        }
        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition);
          text-decoration: none;
          border: none;
        }
        .action-btn-primary {
          background: var(--accent);
          color: white;
        }
        .action-btn-primary:hover { background: var(--accent-bright); }
        .action-btn-secondary {
          background: var(--background-secondary);
          border: 1px solid var(--border-active);
          color: var(--text-primary);
        }
        .action-btn-secondary:hover { background: rgba(255,255,255,0.04); }
        .reset-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: color var(--transition);
        }
        .reset-btn:hover { color: var(--text-secondary); }

        /* Stats */
        .stats-row {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        /* Features */
        .features-section {
          position: relative;
          z-index: 1;
          padding: 80px 0;
          border-top: 1px solid var(--border);
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        .feature-card {
          padding: 28px;
          background: var(--background-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          transition: border-color var(--transition), transform var(--transition);
        }
        .feature-card:hover {
          border-color: var(--border-active);
          transform: translateY(-2px);
        }
        .feature-icon {
          width: 40px;
          height: 40px;
          background: rgba(109, 40, 217, 0.1);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent);
          margin-bottom: 16px;
        }

        /* How it works */
        .how-section {
          position: relative;
          z-index: 1;
          padding: 80px 0;
          border-top: 1px solid var(--border);
        }
        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .step-item {
          display: flex;
          gap: 20px;
          align-items: flex-start;
          position: relative;
          padding-bottom: 32px;
        }
        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--background-card);
          border: 1px solid var(--border-active);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent);
          flex-shrink: 0;
          font-family: 'SF Mono', monospace;
          position: relative;
          z-index: 1;
        }
        .step-connector {
          position: absolute;
          left: 19px;
          top: 40px;
          width: 1px;
          height: calc(100% - 8px);
          background: var(--border);
        }
        .step-content {
          padding-top: 8px;
          flex: 1;
        }

        /* CTA */
        .cta-section {
          position: relative;
          z-index: 1;
          padding: 100px 0;
          border-top: 1px solid var(--border);
        }

        /* Footer */
        .footer {
          border-top: 1px solid var(--border);
          padding: 32px 24px;
        }
        .footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
        }

        @media (max-width: 640px) {
          .upload-card { padding: 24px 16px; }
          .stats-row { gap: 24px; }
          .action-grid { grid-template-columns: 1fr; }
          .success-checks { flex-direction: column; align-items: center; }
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}


