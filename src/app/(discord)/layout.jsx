"use client";

import React, { useState, Suspense } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import styles from '@/styles/layout.module.css';

export default function DiscordLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <Suspense fallback={null}>
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      </Suspense>
      {isSidebarOpen && (
        <div className={styles.backdrop} onClick={closeSidebar} />
      )}
      <main className={styles.main}>
        {children}
      </main>
    </>
  );
}

