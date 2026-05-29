import React from 'react';
import styles from '@/styles/sidebar.module.css';
import * as Icons from '@/components/Icons';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <nav className={`${styles.sidebar} ${isOpen ? styles.mobileOpen : ''}`}>
      {/* Workspace Header */}
      <div className={styles.workspaceHeader}>
        <div className={styles.workspaceInner}>
          <div className={styles.workspaceIcon}>M</div>
          <div>
            <h2 className={styles.workspaceTitle}>Workspace</h2>
            <p className={styles.workspaceSubtitle}>Enterprise Tier</p>
          </div>
        </div>
      </div>
      {/* Main Tabs */}
      <div className={styles.tabsContainer}>
        {/* Active Tab: Overview */}
        <a className={styles.activeTab} href="#" onClick={onClose}>
          <Icons.LayoutDashboard className={styles.tabIcon} />
          <span>Overview</span>
        </a>
        {/* <a className={styles.tab} href="#" onClick={onClose}>
          <Icons.Activity className={styles.tabIcon} />
          <span>Observability</span>
        </a>
        <a className={styles.tab} href="#" onClick={onClose}>
          <Icons.Terminal className={styles.tabIcon} />
          <span>Prompts</span>
        </a>
        <a className={styles.tab} href="#" onClick={onClose}>
          <Icons.BarChart2 className={styles.tabIcon} />
          <span>Evals</span>
        </a>
        <a className={styles.tab} href="#" onClick={onClose}>
          <Icons.Key className={styles.tabIcon} />
          <span>API Keys</span>
        </a>
        <a className={styles.tab} href="#" onClick={onClose}>
          <Icons.Users className={styles.tabIcon} />
          <span>Team</span>
        </a>
        <a className={styles.tab} href="#" onClick={onClose}>
          <Icons.Settings className={styles.tabIcon} />
          <span>Settings</span>
        </a> */}
      </div>
      {/* User Bar Footer */}
      {/* <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <Icons.PieChart className={styles.footerIcon} />
          <span className={styles.footerText}>Usage: 84%</span>
        </div>
        <Icons.UserCircle className={styles.footerIcon} />
      </div> */}
    </nav>
  );
}

