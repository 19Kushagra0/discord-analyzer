import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminDb } from '@/lib/firebase-admin';
import AskGrokClient from './AskGrokClient';
import styles from '@/styles/coral.module.css';
import * as Icons from '@/components/Icons';
import { ensureDemoDataSeeded } from '@/lib/seedDemoData';
import { redirect } from 'next/navigation';

export default async function Page({ searchParams }) {
  const resolvedParams = await searchParams;
  const isDemo = resolvedParams?.demo === 'true';
  const session = isDemo ? { user: { id: 'demo_user' } } : await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  let profile = null;
  let servers = [];
  let errorMsg = null;

  if (isDemo) {
    await ensureDemoDataSeeded(adminDb);
    try {
      const [profileSnap, guildsSnap, detailsSnap] = await Promise.all([
        adminDb.collection('demo_data').doc('profile').get(),
        adminDb.collection('demo_data').doc('guilds').get(),
        adminDb.collection('demo_data').doc('guild_details').get()
      ]);
      profile = profileSnap.exists ? profileSnap.data() : null;
      
      const rawGuilds = guildsSnap.exists ? (guildsSnap.data().list || []) : [];
      const details = detailsSnap.exists ? detailsSnap.data() : {};
      
      servers = rawGuilds.map(g => {
        const det = details[g.id] || {};
        return {
          id: g.id,
          name: g.name,
          owner: g.owner ? 1 : 0,
          permissions: String(g.permissions || "0"),
          member_count: det.approximate_member_count || g.member_count || 100,
          online_count: det.approximate_presence_count || Math.floor((det.approximate_member_count || 100) * 0.3),
          premium_tier: det.premium_tier || 0
        };
      });
    } catch (e) {
      console.error("Error loading SQL demo data from Firestore:", e);
      errorMsg = "Failed to load database demo data.";
    }
  } else {
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
              member_count: Math.floor(Math.random() * 180) + 15,
              online_count: Math.floor(Math.random() * 45) + 5,
              premium_tier: Math.floor(Math.random() * 4)
            }));
          }
        }
      }
    } catch (e) {
      console.error(e);
      errorMsg = "Failed to load Discord data for SQL mapping.";
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.headerTitle}>
            <Icons.MessageSquare style={{ color: '#5865F2' }} size={24} /> Ask Grok
          </h1>
          <p className={styles.headerSubtitle}>
            Translate plain English into live Coral SQL queries and get detailed Discord/Git analytics explained with wit.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: 'rgba(255, 94, 58, 0.1)',
          border: '1px solid rgba(255, 94, 58, 0.2)',
          borderRadius: '20px',
          fontSize: '0.75rem',
          color: '#ff5e3a',
          fontWeight: 600
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5e3a', display: 'inline-block' }}></span>
          GROK AI COGNITIVE ACTIVE
        </div>
      </div>

      {errorMsg ? (
        <div className={styles.errorText}>{errorMsg}</div>
      ) : (
        <AskGrokClient profile={profile} servers={servers} />
      )}
    </div>
  );
}
