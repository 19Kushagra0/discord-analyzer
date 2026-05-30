"use client";

import React, { useEffect, useState } from 'react';
import { X, ShieldAlert, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DemoModal({ isOpen, onClose }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <div style={{
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
      animation: 'fadeIn 0.25s ease-out',
    }}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-card {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Modal Container */}
      <div 
        className="modal-card"
        style={{
          width: '90%',
          maxWidth: '460px',
          background: 'rgba(30, 31, 34, 0.95)',
          border: '1px solid rgba(88, 101, 242, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(88, 101, 242, 0.1)',
          padding: '2rem 1.75rem 1.75rem',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#949ba4',
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
            e.currentTarget.style.color = '#949ba4';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={18} />
        </button>

        {/* Glow Icon Header */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(88, 101, 242, 0.2), rgba(255, 115, 250, 0.2))',
          border: '1px solid rgba(88, 101, 242, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem',
          boxShadow: '0 0 20px rgba(88, 101, 242, 0.15)',
        }}>
          <ShieldAlert size={32} style={{ color: '#ff73fa' }} />
        </div>

        {/* Modal Title */}
        <h3 style={{
          margin: '0 0 0.75rem',
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
        }}>
          Demo Mode Restriction
        </h3>

        {/* Modal Description */}
        <p style={{
          margin: '0 0 1.75rem',
          fontSize: '0.9rem',
          color: '#949ba4',
          lineHeight: '1.5',
        }}>
          To get your real Discord server details and invite the custom analytics bot to your guilds, please exit demo mode and login with your Discord account.
        </p>

        {/* Buttons Row */}
        <div style={{
          display: 'flex',
          width: '100%',
          gap: '0.75rem',
        }}>
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
            Stay in Demo
          </button>
          
          <button
            onClick={handleLogin}
            style={{
              flex: 1,
              padding: '10px 16px',
              backgroundColor: '#5865F2',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(88, 101, 242, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background-color 0.2s, transform 0.1s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4752c4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5865F2'}
          >
            <LogIn size={14} />
            <span>Login & Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
