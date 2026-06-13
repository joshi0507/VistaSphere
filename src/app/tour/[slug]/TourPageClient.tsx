'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Share2, QrCode, ArrowLeft, Copy, Download, CheckCircle, Eye } from 'lucide-react';

const TourViewer = dynamic(() => import('@/components/TourViewer'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#080808',
        gap: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: '#7c3aed',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Loading tour…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
    </div>
  ),
});

interface TourData {
  id: string;
  title: string;
  slug: string;
  fileUrl: string;
  qrUrl: string;
  description: string;
  viewCount: number;
  createdAt: string;
}

export default function TourPageClient({ tour }: { tour: TourData }) {
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const tourUrl = `${baseUrl}/tour/${tour.slug}`;

  // Count view
  useEffect(() => {
    if (!viewCounted) {
      fetch(`/api/tours/${tour.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementView: true }),
      }).catch(() => {});
      setViewCounted(true);
    }
  }, [tour.slug, viewCounted]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(tourUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!tour.qrUrl) return;
    const link = document.createElement('a');
    link.href = tour.qrUrl;
    link.download = `${tour.slug}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080808',
        overflow: 'hidden',
      }}
    >
      {/* Fullscreen Viewer */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <TourViewer fileUrl={tour.fileUrl} />
      </div>

      {/* Top Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        {/* Back + Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          <a
            href="/"
            aria-label="Back to VistaSphere"
            id="back-btn"
            style={{
              width: 36,
              height: 36,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'background 200ms',
            }}
          >
            <ArrowLeft size={16} />
          </a>
          <div>
            <p
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'white',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {tour.title}
            </p>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={10} />
              {tour.viewCount + 1} views
            </p>
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={() => setShowPanel(!showPanel)}
          aria-label="Share tour"
          aria-expanded={showPanel}
          id="share-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.8rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background 200ms',
            pointerEvents: 'auto',
          }}
        >
          <Share2 size={14} />
          Share
        </button>
      </div>

      {/* Share Panel */}
      {showPanel && (
        <div
          style={{
            position: 'absolute',
            top: 68,
            right: 16,
            width: 280,
            background: 'rgba(15,15,15,0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 20,
            zIndex: 30,
            animation: 'fadeInUp 0.25s ease both',
          }}
          role="dialog"
          aria-label="Share panel"
        >
          <p
            style={{
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: 14,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Share this tour
          </p>

          {/* URL */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8,
              padding: '10px 12px',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                flex: 1,
                fontSize: '0.75rem',
                color: '#a78bfa',
                fontFamily: 'monospace',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {tourUrl}
            </span>
            <button
              onClick={copyLink}
              id="panel-copy-btn"
              aria-label="Copy tour link"
              style={{
                background: 'none',
                border: 'none',
                color: copied ? '#10b981' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: '2px',
                flexShrink: 0,
              }}
            >
              {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            </button>
          </div>

          {/* QR Code */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <img
              src={tour.qrUrl}
              alt={`QR code for ${tour.title}`}
              style={{
                width: 120,
                height: 120,
                borderRadius: 8,
                background: 'white',
                padding: 4,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              onClick={copyLink}
              id="panel-copy-btn-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                background: 'rgba(109,40,217,0.15)',
                border: '1px solid rgba(109,40,217,0.3)',
                borderRadius: 8,
                color: '#a78bfa',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 200ms',
              }}
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button
              onClick={handleDownloadQR}
              id="panel-download-qr"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '10px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.78rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 200ms',
              }}
            >
              <Download size={13} />
              Get QR
            </button>
          </div>

          <button
            onClick={() => setShowPanel(false)}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              fontSize: '1.2rem',
              lineHeight: 1,
              padding: '2px 6px',
            }}
            aria-label="Close share panel"
          >
            ×
          </button>
        </div>
      )}

      {/* VistaSphere branding watermark */}
      <a
        href="/"
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: 'rgba(255,255,255,0.3)',
          textDecoration: 'none',
          fontSize: '0.72rem',
          fontWeight: 500,
          pointerEvents: 'auto',
          zIndex: 10,
          transition: 'color 200ms',
        }}
        id="branding-link"
        aria-label="Powered by VistaSphere"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="4" ry="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="2" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        VistaSphere
      </a>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
