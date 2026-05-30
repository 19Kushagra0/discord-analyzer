import React from 'react';
import styles from '@/styles/dashboard.module.css';

export default function Loading() {
  return (
    <div className={styles.container}>
      {/* Page Header Skeleton */}
      <div className={styles.pageHeader}>
        <div>
          <div className={`${styles.skeleton} ${styles.skeletonTitle}`} style={{ width: '200px' }} />
          <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '320px', height: '12px' }} />
        </div>
      </div>

      {/* Hero Profile Card Skeleton */}
      <div className={styles.profileCard} style={{ overflow: 'hidden', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Banner shimmer */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '110px',
          background: 'rgba(255,255,255,0.02)', overflow: 'hidden'
        }} />

        <div style={{ position: 'relative', paddingTop: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', flexWrap: 'wrap' }}>
            {/* Avatar Circle */}
            <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '90px', height: '90px', border: '4px solid #1e1f22', marginTop: '-30px' }} />
            
            {/* Name placeholders */}
            <div style={{ marginBottom: '0.5rem', flex: 1 }}>
              <div className={`${styles.skeleton}`} style={{ width: '180px', height: '24px', marginBottom: '6px' }} />
              <div className={`${styles.skeleton}`} style={{ width: '100px', height: '14px' }} />
            </div>
            
            {/* Status pills placeholder */}
            <div style={{ display: 'flex', gap: '0.5rem', marginLeft: 'auto', marginBottom: '0.5rem' }}>
              <div className={`${styles.skeleton}`} style={{ width: '70px', height: '24px', borderRadius: '12px' }} />
              <div className={`${styles.skeleton}`} style={{ width: '70px', height: '24px', borderRadius: '12px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column layout grid */}
      <div className={styles.layoutGrid}>
        
        {/* Left Column: Account Details Skeleton */}
        <div className={styles.mainColumn}>
          <div className={styles.skeletonFeedCard}>
            <div className={styles.feedHeader}>
              <div className={`${styles.skeleton}`} style={{ width: '120px', height: '16px' }} />
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className={`${styles.skeleton}`} style={{ width: '100px', height: '14px' }} />
                  <div className={`${styles.skeleton}`} style={{ width: '150px', height: '14px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Status Skeletons */}
        <div className={styles.sideColumn}>
          <div className={styles.skeletonCard} style={{ gap: '1rem' }}>
            <div className={`${styles.skeleton}`} style={{ width: '100px', height: '14px' }} />
            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
              <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '32px', height: '32px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className={`${styles.skeleton}`} style={{ width: '140px', height: '14px' }} />
                <div className={`${styles.skeleton}`} style={{ width: '200px', height: '10px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0' }}>
              <div className={`${styles.skeleton} ${styles.skeletonCircle}`} style={{ width: '32px', height: '32px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div className={`${styles.skeleton}`} style={{ width: '120px', height: '14px' }} />
                <div className={`${styles.skeleton}`} style={{ width: '180px', height: '10px' }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
