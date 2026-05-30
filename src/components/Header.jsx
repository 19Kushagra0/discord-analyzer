"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/header.module.css';
import * as Icons from '@/components/Icons';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const pathname = usePathname();

  // Determine dynamic title based on path
  let headerTitle = "Meridian";
  if (pathname === "/dashboard" || pathname === "/") {
    headerTitle = "Dashboard";
  } else if (pathname === "/personal-servers") {
    headerTitle = "Your Servers";
  } else if (pathname === "/coral-query") {
    headerTitle = "AI Powered Coral SQL Console";
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>
          {headerTitle}
        </Link>
      </div>
      <div className={styles.rightSection}>
        {/* <div className={styles.envPill}>
          <span className={styles.envText}>Production</span>
        </div> */}
        <button 
          aria-label="Toggle Sidebar" 
          className={`${styles.actionButton} ${styles.hamburgerButton} ${isSidebarOpen ? styles.hamburgerHidden : ''}`} 
          onClick={onToggleSidebar}
        >
          <Icons.Menu className={styles.icon} />
        </button>
      </div>
    </header>
  );
}
