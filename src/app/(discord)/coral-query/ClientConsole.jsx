"use client";

import React, { useState } from 'react';
import { executeSQL } from '@/lib/coralSimulator';
import styles from '@/styles/coral.module.css';
import * as Icons from '@/components/Icons';

export default function ClientConsole({ profile, servers }) {
  const [activeTab, setActiveTab] = useState('query'); // 'query' | 'config'
  const [sqlQuery, setSqlQuery] = useState("SELECT name, member_count, online_count FROM discord_servers WHERE member_count > 50 ORDER BY member_count DESC LIMIT 5");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const dataContext = { profile, servers };

  const handleRunQuery = () => {
    setError(null);
    setResult(null);
    
    // Simulate query loading delay
    setTimeout(() => {
      const res = executeSQL(sqlQuery, dataContext);
      if (res.error) {
        setError(res.error);
      } else {
        setResult(res);
      }
    }, 200);
  };

  const selectQuickQuery = (q) => {
    setSqlQuery(q);
    setError(null);
    setResult(null);
  };

  const schema = [
    {
      name: "discord_profile",
      description: "OAuth User Identity Profile",
      columns: [
        { name: "id", type: "VARCHAR" },
        { name: "username", type: "VARCHAR" },
        { name: "global_name", type: "VARCHAR" },
        { name: "email", type: "VARCHAR" },
        { name: "locale", type: "VARCHAR" }
      ]
    },
    {
      name: "discord_servers",
      description: "Connected Server List",
      columns: [
        { name: "id", type: "VARCHAR" },
        { name: "name", type: "VARCHAR" },
        { name: "owner", type: "INT" },
        { name: "member_count", type: "INT" },
        { name: "online_count", type: "INT" },
        { name: "premium_tier", type: "INT" }
      ]
    },
    {
      name: "github_commits",
      description: "Git commit history logs",
      columns: [
        { name: "id", type: "VARCHAR" },
        { name: "author", type: "VARCHAR" },
        { name: "message", type: "TEXT" },
        { name: "date", type: "VARCHAR" },
        { name: "additions", type: "INT" }
      ]
    },
    {
      name: "slack_messages",
      description: "Chat history archives",
      columns: [
        { name: "id", type: "VARCHAR" },
        { name: "user", type: "VARCHAR" },
        { name: "channel", type: "VARCHAR" },
        { name: "text", type: "TEXT" }
      ]
    }
  ];

  const quickQueries = [
    { label: "My Profile", sql: "SELECT username, email, locale FROM discord_profile" },
    { label: "Top Servers", sql: "SELECT name, member_count FROM discord_servers WHERE member_count > 50 ORDER BY member_count DESC LIMIT 3" },
    { label: "Git Commits", sql: "SELECT id, author, message FROM github_commits ORDER BY date DESC" },
    { label: "Cross Join", sql: "SELECT server_name, commit_author, commit_msg FROM discord_servers JOIN github_commits ON discord_servers.id = github_commits.id" }
  ];

  const sampleConfig = `# Coral Config: Pirates of the Coral-bean Specification
version: "0.1"

sources:
  - name: discord_api
    type: rest_api
    spec:
      base_url: https://discord.com/api/v10
      headers:
        Authorization: "Bearer \${DISCORD_ACCESS_TOKEN}"
      tables:
        - name: discord_profile
          path: /users/@me
        - name: discord_servers
          path: /users/@me/guilds
          
  - name: github_analyzer
    type: git_repo
    spec:
      repo_url: https://github.com/19Kushagra0/discord-analyzer
      tables:
        - name: github_commits
          path: /commits
          
  - name: firebase_analytics
    type: firestore
    spec:
      project_id: "project0-ffe20"
      credentials_json: "\${FIREBASE_KEY_JSON}"
      tables:
        - name: discord_engagement
          collection: engagement_metrics`;

  return (
    <div className={styles.layout}>
      
      {/* ── Schema Browser ────────────────────────────────────────────── */}
      <aside className={styles.schemaBrowser}>
        <div>
          <h3 className={styles.browserTitle}>
            <Icons.Compass size={14} style={{ color: '#5865F2' }} /> Schema Tables
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#949ba4', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
            Direct database projection of connected Discord API schemas.
          </p>
          <div className={styles.tableList}>
            {schema.map(table => (
              <div key={table.name}>
                <div className={styles.tableName}>
                  <Icons.PieChart size={12} /> {table.name}
                </div>
                <div className={styles.columnList}>
                  {table.columns.map(col => (
                    <div key={col.name} className={styles.columnItem}>
                      <span>{col.name}</span>
                      <span className={styles.colType}>{col.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main Panel ────────────────────────────────────────────────── */}
      <main className={styles.consoleArea}>
        
        {/* Terminal Header Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('query')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px 8px 0 0',
              background: activeTab === 'query' ? '#2b2d31' : 'transparent',
              border: 'none',
              color: activeTab === 'query' ? '#fff' : '#949ba4',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Icons.Terminal size={14} /> SQL Query Window
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px 8px 0 0',
              background: activeTab === 'config' ? '#2b2d31' : 'transparent',
              border: 'none',
              color: activeTab === 'config' ? '#fff' : '#949ba4',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Icons.Settings size={14} /> coral-config.yaml
          </button>

        </div>

        {activeTab === 'query' ? (
          <>
            {/* Editor Area */}
            <div className={styles.editorCard}>
              <div className={styles.editorHeader}>
                <span className={styles.editorTitle}>Query Console</span>
                <span style={{ fontSize: '0.7rem', color: '#80848e', fontFamily: 'monospace' }}>
                  Press Ctrl+Enter or click Run Query
                </span>
              </div>
              <textarea 
                className={styles.sqlEditor}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SELECT query..."
              />
              <div className={styles.editorFooter}>
                <div className={styles.quickQueries}>
                  {quickQueries.map(chip => (
                    <span 
                      key={chip.label} 
                      className={styles.queryChip}
                      onClick={() => selectQuickQuery(chip.sql)}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
                <button className={styles.btnRun} onClick={handleRunQuery}>
                  <Icons.Play size={14} /> Run Query
                </button>
              </div>
            </div>

            {/* Results Grid */}
            <div className={styles.resultsCard}>
              {error && (
                <div className={styles.errorText}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Icons.AlertTriangle size={14} /> SQL Evaluation Error
                  </div>
                  {error}
                </div>
              )}

              {result && (
                <div>
                  <div className={styles.resultsHeader}>
                    <div className={styles.statusIndicator}>
                      <Icons.CheckCircle2 size={14} /> Query succeeded
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#949ba4', fontFamily: 'monospace' }}>
                      Returned {result.count} rows in {result.executionTimeMs}ms
                    </span>
                  </div>

                  <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                      <thead>
                        <tr>
                          {result.columns.map(col => (
                            <th key={col}>{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, idx) => (
                          <tr key={idx}>
                            {result.columns.map(col => (
                              <td key={col}>
                                {row[col] !== null ? String(row[col]) : <span style={{ opacity: 0.3, fontStyle: 'italic' }}>NULL</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!error && !result && (
                <div className={styles.emptyState}>
                  <Icons.Terminal size={40} style={{ color: 'rgba(255,255,255,0.06)' }} />
                  <span>Execute a SQL query using the panels above to analyze API mappings.</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className={styles.editorCard} style={{ padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1rem' }}>
              Coral Data Source Binding
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#949ba4', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
              This YAML file defines how Coral binds external APIs, file servers, and databases to relational SQL tables for your agent to inspect.
            </p>
            <textarea 
              readOnly 
              className={styles.configTextarea} 
              value={sampleConfig} 
            />
          </div>
        )}
      </main>
    </div>
  );
}
