"use client";

import React from 'react';
import * as Icons from '@/components/Icons';
import styles from '@/styles/dashboard.module.css';

export default function WipeButton() {
  const handleWipe = () => {
    alert("To revoke this app's access to your servers and delete all stored tokens, simply click 'Log Out' or go to your Discord User Settings > Authorized Apps and deauthorize 'Discord Analyzer'. We do not cache or persist your server lists.");
  };

  return (
    <button
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '5px 12px',
        background: 'rgba(242,63,67,0.08)',
        border: '1px solid rgba(242,63,67,0.2)',
        borderRadius: '6px',
        color: '#f23f43',
        fontSize: '0.75rem',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
      onClick={handleWipe}
    >
      <Icons.Trash2 size={12} /> Wipe Details
    </button>
  );
}
