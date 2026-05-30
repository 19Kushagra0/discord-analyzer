"use client";

import React, { useState } from 'react';
import * as Icons from '@/components/Icons';
import DemoModal from './DemoModal';

export default function ConnectDemoButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          padding: '8px 16px',
          backgroundColor: '#5865F2',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '0.825rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(88,101,242,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4752c4'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#5865F2'}
      >
        <Icons.Activity size={14} />
        <span>Connect your server</span>
      </button>

      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
