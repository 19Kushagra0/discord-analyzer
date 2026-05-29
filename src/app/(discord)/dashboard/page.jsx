import React from 'react';
import styles from '@/styles/dashboard.module.css';
import * as Icons from '@/components/Icons';

export default function Page() {
  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.headerTitle}>Overview</h1>
          <p className={styles.headerSubtitle}>Last updated 12s ago</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.buttonSecondary}>
            Last 7 days <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
          </button>
          <button className={styles.buttonPrimary}>
            + New Prompt
          </button>
        </div>
      </div>

      {/* Section 1: System Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusItems}>
          <div className={styles.statusItem}>
            <div className={styles.activeDot} />
            <span className={styles.statusLabel}>All systems operational</span>
          </div>
          <div className={styles.statusDivider} />
          <div className={styles.statusItem}>
            <div className={styles.dot} />
            <span className={styles.statusLabelVariant}>API</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.dot} />
            <span className={styles.statusLabelVariant}>Models</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.dot} />
            <span className={styles.statusLabelVariant}>Evals</span>
          </div>
          <div className={styles.statusItem}>
            <div className={styles.dot} />
            <span className={styles.statusLabelVariant}>Webhooks</span>
          </div>
        </div>
        <a className={styles.statusLink} href="#">
          Status page →
        </a>
      </div>

      {/* Section 2: Quick Action Rail */}
      <div className={styles.actionRail}>
        <button className={styles.railButton}>
          <Icons.Plus className={styles.iconAdd} />
          <span>New Prompt</span>
        </button>
        <button className={styles.railButton}>
          <Icons.Play className={styles.iconPlay} />
          <span>Run Eval</span>
        </button>
        <button className={styles.railButton}>
          <span className={styles.railButtonKeyboard}>⌘</span>
          <span>Playground</span>
        </button>
        <button className={styles.railButton}>
          <span className={styles.railButtonKeyboard}>≡</span>
          <span>View Logs</span>
        </button>
        <button className={styles.railButton}>
          <span className={styles.railButtonKeyboard}>⌘K</span>
          <span>Quick Command</span>
        </button>
      </div>

      {/* Section 3: Two-column Layout */}
      <div className={styles.layoutGrid}>
        {/* Left Column (64%) */}
        <div className={styles.mainColumn}>
          {/* Metrics Strip */}
          <div className={styles.metricsStrip}>
            {/* Metric 1 */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Total Requests (24h)</h3>
              <div className={styles.cardValueRow}>
                <span className={styles.cardValue}>1.24M</span>
                <span className={styles.changePositive}>+12.4%</span>
              </div>
              <div className={styles.sparkline}>
                <div className={styles.barPrimary} style={{ height: '40%' }} />
                <div className={styles.barPrimary} style={{ height: '60%' }} />
                <div className={styles.barPrimary} style={{ height: '45%' }} />
                <div className={styles.barPrimary} style={{ height: '80%' }} />
                <div className={styles.barPrimary} style={{ height: '75%' }} />
                <div className={styles.barPrimaryActive} style={{ height: '95%' }} />
              </div>
            </div>
            {/* Metric 2 */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Avg Latency</h3>
              <div className={styles.cardValueRow}>
                <span className={styles.cardValue}>245<span className={styles.cardValueUnit}>ms</span></span>
                <span className={styles.changeWarning}>-2.1%</span>
              </div>
              <div className={styles.sparkline}>
                <div className={styles.barYellow} style={{ height: '80%' }} />
                <div className={styles.barYellow} style={{ height: '75%' }} />
                <div className={styles.barYellow} style={{ height: '85%' }} />
                <div className={styles.barYellow} style={{ height: '90%' }} />
                <div className={styles.barYellow} style={{ height: '60%' }} />
                <div className={styles.barYellowActive} style={{ height: '55%' }} />
              </div>
            </div>
            {/* Metric 3 */}
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Eval Pass Rate</h3>
              <div className={styles.cardValueRow}>
                <span className={styles.cardValue}>94.2%</span>
                <span className={styles.changePositive}>+0.8%</span>
              </div>
              <div className={styles.sparkline}>
                <div className={styles.barGreen} style={{ height: '90%' }} />
                <div className={styles.barGreen} style={{ height: '92%' }} />
                <div className={styles.barGreen} style={{ height: '91%' }} />
                <div className={styles.barGreen} style={{ height: '94%' }} />
                <div className={styles.barGreen} style={{ height: '93%' }} />
                <div className={styles.barGreenActive} style={{ height: '95%' }} />
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className={styles.feedCard}>
            <div className={styles.feedHeader}>
              <div className={styles.feedHeaderLeft}>
                <h2 className={styles.feedTitle}>Activity</h2>
                <span className={styles.liveBadge}>
                  <span className={styles.liveDot} /> LIVE
                </span>
              </div>
            </div>
            <div className={styles.feedList}>
              {/* Event 1 */}
              <div className={styles.feedItem}>
                <div className={styles.statusLineGreen} />
                <div className={styles.feedItemContent}>
                  <p className={styles.feedItemTitle}>Eval run #47 completed</p>
                  <p className={styles.feedItemDesc}>Dataset 'customer-support-v2' processed 10,000 rows. Pass rate: 96%.</p>
                </div>
                <span className={styles.feedItemTime}>2m ago</span>
              </div>
              {/* Event 2 */}
              <div className={styles.feedItem}>
                <div className={styles.statusLineBlue} />
                <div className={styles.feedItemContent}>
                  <p className={styles.feedItemTitle}>Prompt deployed</p>
                  <p className={styles.feedItemDesc}>
                    <span className={styles.codePrimary}>sys_classifier_v3</span> was promoted to Production by Sarah J.
                  </p>
                </div>
                <span className={styles.feedItemTime}>15m ago</span>
              </div>
              {/* Event 3 */}
              <div className={styles.feedItem}>
                <div className={styles.statusLineYellow} />
                <div className={styles.feedItemContent}>
                  <p className={styles.feedItemTitle}>Rate limit warning</p>
                  <p className={styles.feedItemDesc}>OpenAI GPT-4 usage approaching 90% of allocated TPM limit for project 'Marketing'.</p>
                </div>
                <span className={styles.feedItemTime}>1h ago</span>
              </div>
              {/* Event 4 */}
              <div className={styles.feedItem}>
                <div className={styles.statusLineGray} />
                <div className={styles.feedItemContent}>
                  <p className={styles.feedItemTitle}>API Key Rotated</p>
                  <p className={styles.feedItemDesc}>
                    Key ending in <code className={styles.codeInline}>...8f9a</code> was rotated automatically.
                  </p>
                </div>
                <span className={styles.feedItemTime}>3h ago</span>
              </div>
            </div>
            <div className={styles.feedFooter}>
              <a className={styles.feedFooterLink} href="#">View full activity log →</a>
            </div>
          </div>
        </div>

        {/* Right Column (36%) */}
        <div className={styles.sideColumn}>
          {/* Usage Overview */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Usage Overview</h2>
            <div className={styles.progressList}>
              {/* Progress 1 */}
              <div>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>API Requests</span>
                  <span className={styles.progressValue}>1.24M / 2M</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFillPrimary} style={{ width: '62%' }} />
                </div>
              </div>
              {/* Progress 2 */}
              <div>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Tokens Generated</span>
                  <span className={styles.progressValue}>8.4B / 10B</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFillYellow} style={{ width: '84%' }} />
                </div>
              </div>
              {/* Progress 3 */}
              <div>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Eval Runs</span>
                  <span className={styles.progressValue}>47 / 100</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFillGreen} style={{ width: '47%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Smart Alerts */}
          <div className={styles.alertsList}>
            <h2 className={styles.alertsLabel}>Smart Alerts</h2>
            <div className={styles.alertYellow}>
              <Icons.AlertTriangle className={styles.alertIconYellow} />
              <div>
                <h4 className={styles.alertTitleYellow}>Token Usage High</h4>
                <p className={styles.alertDescYellow}>Project 'Marketing' is at 87% of its monthly token budget.</p>
              </div>
            </div>
            <div className={styles.alertBlue}>
              <Icons.Info className={styles.alertIconBlue} />
              <div>
                <h4 className={styles.alertTitleBlue}>New Model Available</h4>
                <p className={styles.alertDescBlue}>Claude 3.5 Sonnet is now available in your region.</p>
              </div>
            </div>
          </div>

          {/* Scheduled Runs */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Scheduled Evals</h2>
            <div className={styles.scheduledList}>
              <div className={styles.scheduledRow}>
                <div className={styles.scheduledRowLeft}>
                  <Icons.Clock className={styles.scheduledIcon} />
                  <div>
                    <p className={styles.scheduledTitle}>Nightly Regression</p>
                    <p className={styles.scheduledTime}>00:00 UTC</p>
                  </div>
                </div>
                <span className={styles.activeBadge}>ACTIVE</span>
              </div>
              <div className={styles.scheduledRow}>
                <div className={styles.scheduledRowLeft}>
                  <Icons.Clock className={styles.scheduledIcon} />
                  <div>
                    <p className={styles.scheduledTitle}>Weekly Safety Check</p>
                    <p className={styles.scheduledTime}>Sun, 02:00 UTC</p>
                  </div>
                </div>
                <span className={styles.activeBadge}>ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
