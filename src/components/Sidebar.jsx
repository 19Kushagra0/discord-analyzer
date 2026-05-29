"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/sidebar.module.css';
import * as Icons from '@/components/Icons';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const getTabClass = (path) => {
    return pathname === path ? styles.activeTab : styles.tab;
  };

  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''}`}>
      {/* Workspace Header */}
      <div className={styles.workspaceHeader}>
        <div className={styles.workspaceInner}>
          <div className={styles.workspaceIcon}>D</div>
          <div>
            <h2 className={styles.workspaceTitle}>Discord Analyzer</h2>
            <p className={styles.workspaceSubtitle}>Personal Edition</p>
          </div>
        </div>
      </div>
      {/* Main Tabs */}
      <div className={styles.tabsContainer}>
        {/* Tab: Overview / Dashboard */}
        <Link className={getTabClass('/dashboard')} href="/dashboard" onClick={onClose}>
          <Icons.LayoutDashboard className={styles.tabIcon} />
          <span>Overview</span>
        </Link>

        {/* Tab: Personal Servers */}
        <Link className={getTabClass('/personal-servers')} href="/personal-servers" onClick={onClose}>
          <Icons.Crown className={styles.tabIcon} />
          <span>Personal Server</span>
        </Link>

        {/* Tab: Coral SQL Console */}
        <Link className={getTabClass('/coral-query')} href="/coral-query" onClick={onClose}>
          <Icons.Terminal className={styles.tabIcon} />
          <span>Coral SQL Console</span>
        </Link>

        {/* Logout Button */}
        <button
          className={styles.tab}
          style={{
            marginTop: 'auto',
            background: 'none',
            border: 'none',
            width: '100%',
            textAlign: 'left',
            outline: 'none',
          }}
          onClick={() => {
            onClose();
            signOut({ callbackUrl: '/' });
          }}
        >
          <Icons.LogOut className={styles.tabIcon} />
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
}

