"use client";

import React, { useState } from 'react';
import DemoModal from './DemoModal';
import { Bot } from 'lucide-react';

export default function InviteBotButton({ isDemo, clientId, guildId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e) => {
    if (isDemo) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=66560&scope=bot&guild_id=${guildId}`;

  return (
    <>
      <a
        href={isDemo ? "#" : inviteUrl}
        onClick={handleClick}
        target={isDemo ? undefined : "_blank"}
        rel={isDemo ? undefined : "noopener noreferrer"}
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '10px',
          background: '#5865F2',
          border: '1px solid #4752c4',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer',
        }}
      >
        <Bot size={13} /> Invite Bot
      </a>

      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
