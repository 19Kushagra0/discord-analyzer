import React from 'react';
import Link from 'next/link';
import styles from '@/styles/header.module.css';
import * as Icons from '@/components/Icons';

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.logo} style={{ textDecoration: 'none' }}>Meridian</Link>
        {/* Command Bar (Sunken) */}
        <div className={styles.searchBar}>
          <Icons.Search className={styles.searchIcon} />
          <input className={styles.searchInput} placeholder="Search prompts, evals, or logs... (⌘K)" type="text" />
        </div>
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

