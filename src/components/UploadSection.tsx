'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, CheckCircle, Link2, Download, ExternalLink, Share2, Copy, AlertCircle, FileType } from 'lucide-react';

interface TourResult {
  id: string;
  title: string;
  slug: string;
  fileUrl: string;
  qrUrl: string;
  tourUrl: string;
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function UploadSection() {
  const [state, setState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<TourResult | null>(null);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setError('Please upload a .glb file.');
      return;
    }

    if (file.size > 500 * 1024 * 1024) {
      setError('File too large. Maximum size is 500MB.');
      return;
    }

    setSelectedFile(file);
    setError('');
    setState('uploading');
    setProgress(0);

    // Simulate progress during upload
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + Math.random() * 8;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setState('uploading');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(90);
      setState('processing');

      await new Promise((r) => setTimeout(r, 600));
      setProgress(100);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      await new Promise((r) => setTimeout(r, 300));
      setState('success');
      setResult(data.tour);
    } catch (err) {
      clearInterval(progressInterval);
      setState('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const copyLink = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.tourUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setState('idle');
    setProgress(0);
    setSelectedFile(null);
    setResult(null);
    setError('');
    setCopied(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  if (state === 'success' && result) {
    return (
      <div className="upload-success animate-fade-in-up" id="upload-success">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="success-ring" style={{ margin: '0 auto 16px' }}>
            <CheckCircle size={28} color="var(--success)" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>
            Tour Created!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {result.title} is live and ready to share.
          </p>
        </div>

        {/* Checklist */}
        <div className="success-checks">
          {['Tour Generated', 'Share Link Created', 'QR Code Created'].map((item) => (
            <div key={item} className="check-item">
              <CheckCircle size={14} color="var(--success)" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* URL Display */}
        <div className="url-display">
          <span className="url-text">{result.tourUrl}</span>
          <button onClick={copyLink} className="url-copy-btn" title="Copy link">
            {copied ? <CheckCircle size={14} color="var(--success)" /> : <Copy size={14} />}
          </button>
        </div>

        {/* QR Code */}
        <div className="qr-display">
          <img
            src={result.qrUrl}
            alt={`QR code for ${result.title}`}
            className="qr-image"
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '8px' }}>
            Scan to open tour on any device
          </p>
        </div>

        {/* Actions */}
        <div className="action-grid">
          <a
            href={result.tourUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action-btn action-btn-primary"
            id="open-tour-btn"
          >
            <ExternalLink size={16} />
            Open Tour
          </a>
          <button onClick={copyLink} className="action-btn action-btn-secondary" id="copy-link-btn">
            <Link2 size={16} />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <a
            href={result.qrUrl}
            download={`${result.slug}-qr.png`}
            className="action-btn action-btn-secondary"
            id="download-qr-btn"
          >
            <Download size={16} />
            Download QR
          </a>
          <button
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({ title: result.title, url: result.tourUrl });
              } else {
                copyLink();
              }
            }}
            className="action-btn action-btn-secondary"
            id="share-tour-btn"
          >
            <Share2 size={16} />
            Share Tour
          </button>
        </div>

        <button onClick={reset} className="reset-btn" id="upload-another-btn">
          Upload another tour
        </button>
      </div>
    );
  }

  return (
    <div className="upload-section" id="upload-section">
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="file-input"
        aria-label="Upload GLB file"
      />

      {state === 'idle' && (
        <div
          className={`dropzone ${dragOver ? 'dropzone-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Drop zone for GLB file upload"
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          id="dropzone"
        >
          <div className="dropzone-content">
            <div className="dropzone-icon">
              <Upload size={28} strokeWidth={1.5} />
            </div>
            <h3 className="dropzone-title">Drop your GLB file here</h3>
            <p className="dropzone-subtitle">
              or click to browse files
            </p>
            <div className="dropzone-badge">
              <FileType size={12} />
              <span>.glb supported · up to 500MB</span>
            </div>
          </div>
        </div>
      )}

      {(state === 'uploading' || state === 'processing') && (
        <div className="upload-progress" id="upload-progress">
          <div className="progress-icon">
            <div className="animate-spin" style={{
              width: 40, height: 40,
              border: '2px solid var(--border)',
              borderTopColor: 'var(--accent)',
              borderRadius: '50%',
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {selectedFile?.name}
              </span>
              <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 600 }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '6px' }}>
              {state === 'uploading' ? 'Uploading model…' : 'Generating tour & QR code…'}
            </p>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="upload-error animate-fade-in" id="upload-error">
          <AlertCircle size={20} color="var(--error)" />
          <div>
            <p style={{ fontWeight: 600, marginBottom: '2px' }}>Upload failed</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{error}</p>
          </div>
          <button onClick={reset} className="btn-secondary" style={{ marginLeft: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
