import React from 'react';
import styles from '@/styles/landing.module.css';
import { ArrowRight } from '@/components/Icons';
import Link from 'next/link';

export default function Page() {
  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <a className={styles.logo} href="https://withcoral.com/">CoralStats</a>
          <div className={styles.navLinks}>
            {/* <a className={styles.navLink} href="#">Features</a> */}
            <a className={styles.navLink} href="#">Coral Specs</a>
            <a className={styles.navLink} href="https://www.linkedin.com/posts/wemakedevs_tag-a-builder-who-needs-to-see-this-activity-7464515586690162688-WsX_?utm_source=share&utm_medium=member_desktop&rcm=ACoAAFYbBqkB1cT9VzpOSd9sNfjRa148-D8i2tU">Hackathon</a>
            <a className={styles.navLink} href="https://github.com/19Kushagra0/discord-analyzer">GitHub</a>
          </div>
        </div>
        <div className={styles.navActions}>
          {/* <a className={styles.navLoginLink} href="#">Log in</a> */}
          <Link className={styles.navConnectBtn} href="/login">Connect Discord</Link>
        </div>
      </nav>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            Pirates of the Coral-bean Hackathon
          </div>
          <h1 className={styles.heroTitle}>
            Stop guessing why your<br />Discord server is dying.
          </h1>
          <p className={styles.heroSubtitle}>
            We use the <strong>Coral Data Layer</strong> to securely fetch your community metrics, and an <strong>AI Community Manager</strong> to instantly tell you why engagement dropped—and exactly how to fix it.
          </p>
          <div className={styles.heroActions}>
            <Link href="/login" className={styles.primaryBtn}>
              Analyze My Server
              <ArrowRight size={18} />
            </Link>
            <Link href="https://github.com/withcoral/coral" className={styles.secondaryBtn}>
              View Open Source Bounty
            </Link>
          </div>
          <div className={styles.dividerSection}>
            <p className={styles.dividerText}>Powered by the modern AI stack</p>
            <div className={styles.logoGrid}>
              <span className={styles.logoText}>Coral</span>
              <span className={styles.logoText}>Vercel AI SDK</span>
              <span className={styles.logoText}>Next.js 16</span>
              <span className={styles.logoText}>Supabase</span>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Section */}
        <section className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h2 className={styles.previewTitle}>Your AI Community Command Center.</h2>
            <p className={styles.previewSubtitle}>Monitor member growth, track message volume, and let our AI diagnose engagement drops in real-time, all fetched via custom Coral APIs.</p>
          </div>
          <div className={styles.mockupContainer}>
            <div className={styles.mockupWindow}>
              {/* Mac Window Chrome */}
              <div className={styles.mockupHeader}>
                <div className={styles.dotRed} />
                <div className={styles.dotYellow} />
                <div className={styles.dotGreen} />
                <div className={styles.mockupUrl}>app.coralstats.dev</div>
              </div>
              {/* Dashboard Mockup Image Placeholder */}
              <div className={styles.mockupImageWrapper}>
                <img alt="Dashboard Preview" className={styles.mockupImage} src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkPQZWpES_KIgBGZt0Reafk1myJH-ned8EC1QmCDvmRZRS6aD8lFRneIu4xkh_x_x2MzJKaG_jrJVm-my90nebvtG7MFX0k0mo4DYi03-wSmDg6HbsA2n-5i4SbFdFtfiNNjdhgWVOL2ajVULpge8yceMtQYbLOdib8PhpmPfCAmSc1DeKTg6qeBv8jv6QTVc0Qz7k6ObR4IoOOqjerf1f6ab05MzkvlVN0Q0PE0Rh0SgHZnOLdz5q5y-lRD9heNexBlyJ-81oQeuU" />
                <div className={styles.mockupOverlay} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}