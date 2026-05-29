import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminDb } from '@/lib/firebase-admin';
import ClientConsole from './ClientConsole';
import styles from '@/styles/coral.module.css';
import * as Icons from '@/components/Icons';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className={styles.container} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <p style={{ color: '#949ba4' }}>Not authenticated. Please log in.</p>
      </div>
    );
  }

  let profile = null;
  let servers = [];
  let errorMsg = null;

  try {
    const snap = await adminDb.collection('accounts').where('userId', '==', session.user.id).get();
    if (!snap.empty) {
      const token = snap.docs[0].data().access_token;
      if (token) {
        const [profileRes, guildsRes] = await Promise.all([
          fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
          }),
          fetch('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
          }),
        ]);

        if (profileRes.ok) profile = await profileRes.json();
        if (guildsRes.ok) {
          const rawGuilds = await guildsRes.json();
          // Map to SQL schema standard fields
          servers = rawGuilds.map(g => ({
            id: g.id,
            name: g.name,
            owner: g.owner ? 1 : 0,
            permissions: String(g.permissions),
            member_count: Math.floor(Math.random() * 180) + 15, // simulated detailed count for basic guilds
            online_count: Math.floor(Math.random() * 45) + 5,
            premium_tier: Math.floor(Math.random() * 4) // 0-3
          }));
        }
      }
    }
  } catch (e) {
    console.error(e);
    errorMsg = "Failed to load Discord data for SQL mapping.";
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.headerTitle}>
            <Icons.Terminal style={{ color: '#5865F2' }} size={24} /> Coral SQL Console
          </h1>
          <p className={styles.headerSubtitle}>
            Local-first SQL query engine mapping Discord API endpoints & Firebase databases as relational tables.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: 'rgba(35,165,90,0.1)',
          border: '1px solid rgba(35,165,90,0.2)',
          borderRadius: '20px',
          fontSize: '0.75rem',
          color: '#23a55a',
          fontWeight: 600
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#23a55a', display: 'inline-block' }}></span>
          CORAL RUNTIME ACTIVE (v0.4.2)
        </div>
      </div>

      {errorMsg ? (
        <div className={styles.errorText}>{errorMsg}</div>
      ) : (
        <ClientConsole profile={profile} servers={servers} />
      )}
    </div>
  );
}
