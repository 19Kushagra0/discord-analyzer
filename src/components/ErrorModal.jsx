"use client";

import React, { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

/**
 * Reusable ErrorModal
 *
 * Props:
 *  - isOpen    {boolean}  Whether the modal is visible
 *  - onClose   {fn}       Callback to close the modal
 *  - title     {string}   Modal heading  (default: "Something went wrong")
 *  - message   {string}   Error detail text
 *  - onRetry   {fn}       Optional retry callback; shows a "Try Again" button when provided
 */
export default function ErrorModal({
  isOpen,
  onClose,
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(10, 10, 12, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        animation: 'errorFadeIn 0.25s ease-out',
      }}
    >
      <style>{`
        @keyframes errorFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes errorScaleUp {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .error-modal-card {
          animation: errorScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Modal Card — stop propagation so clicking inside doesn't close */}
      <div
        className="error-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '460px',
          background: 'rgba(28, 20, 20, 0.97)',
          border: '1px solid rgba(242, 63, 66, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.65), 0 0 30px rgba(242,63,66,0.08)',
          padding: '2rem 1.75rem 1.75rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close error modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#6d7078',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s, background-color 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#6d7078';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={18} />
        </button>

        {/* Glow Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(242,63,66,0.2), rgba(255,160,70,0.12))',
          border: '1px solid rgba(242, 63, 66, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 0 24px rgba(242, 63, 66, 0.18)',
        }}>
          <AlertTriangle size={30} style={{ color: '#f23f42' }} />
        </div>

        {/* Title */}
        <h3 style={{
          margin: '0 0 0.6rem',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
        }}>
          {title}
        </h3>

        {/* Message */}
        <p style={{
          margin: '0 0 1.75rem',
          fontSize: '0.875rem',
          color: '#949ba4',
          lineHeight: '1.55',
          maxWidth: '340px',
        }}>
          {message}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', width: '100%', gap: '0.75rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#4e5058',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#6d6f78'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4e5058'}
          >
            Dismiss
          </button>

          {onRetry && (
            <button
              onClick={() => { onRetry(); onClose(); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                backgroundColor: '#f23f42',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(242, 63, 66, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.2s, transform 0.1s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c93436'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f23f42'}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
