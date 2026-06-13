import Link from 'next/link';

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        fontFamily: 'Inter, sans-serif',
        color: '#f5f5f5',
      }}
    >
      <p style={{ color: '#555', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
        404
      </p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 12 }}>
        Tour not found
      </h1>
      <p style={{ color: '#888', marginBottom: 36, fontSize: '0.95rem', maxWidth: 360 }}>
        This tour may have been removed or the link is incorrect.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 24px',
          background: '#6d28d9',
          color: 'white',
          borderRadius: 12,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
        }}
      >
        Back to VistaSphere
      </Link>
    </main>
  );
}
