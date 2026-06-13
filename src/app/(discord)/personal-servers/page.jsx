import React from 'react';
import styles from '@/styles/dashboard.module.css';
import serverStyles from '@/styles/personal-servers.module.css';
import * as Icons from '@/components/Icons';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminDb } from '@/lib/firebase-admin';
import WipeButton from '@/components/WipeButton';
import ConnectDemoButton from '@/components/ConnectDemoButton';
import { ensureDemoDataSeeded } from '@/lib/seedDemoData';
import InviteBotButton from '@/components/InviteBotButton';
import { redirect } from 'next/navigation';

// ── Helpers ─────────────────────────────────────────────────────────────────

// Snowflake → Date
function snowflakeToDate(id) {
  return new Date(Number(BigInt(id) >> 22n) + 1420070400000);
}

// Human-readable age from Date
function ageString(date) {
  const now = new Date();
  let y = now.getFullYear() - date.getFullYear();
  let m = now.getMonth() - date.getMonth();
  let d = now.getDate() - date.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const parts = [];
  if (y > 0) parts.push(`${y}y`);
  if (m > 0) parts.push(`${m}mo`);
  if (d > 0 && y === 0) parts.push(`${d}d`);
  return parts.length ? parts.join(' ') : 'Today';
}

// Full permission list — ALL 40 Discord permissions
function decodePermissions(bitfield) {
  const p = BigInt(bitfield);
  const all = [
    { bit: 1n << 0n,  label: 'Create Invite',            cat: 'general' },
    { bit: 1n << 1n,  label: 'Kick Members',              cat: 'member'  },
    { bit: 1n << 2n,  label: 'Ban Members',               cat: 'member'  },
    { bit: 1n << 3n,  label: 'Administrator',             cat: 'danger'  },
    { bit: 1n << 4n,  label: 'Manage Channels',           cat: 'manage'  },
    { bit: 1n << 5n,  label: 'Manage Server',             cat: 'manage'  },
    { bit: 1n << 6n,  label: 'Add Reactions',             cat: 'general' },
    { bit: 1n << 7n,  label: 'View Audit Log',            cat: 'general' },
    { bit: 1n << 9n,  label: 'View Channel',              cat: 'general' },
    { bit: 1n << 10n, label: 'Send Messages',             cat: 'text'    },
    { bit: 1n << 11n, label: 'Send TTS Messages',         cat: 'text'    },
    { bit: 1n << 12n, label: 'Manage Messages',           cat: 'manage'  },
    { bit: 1n << 13n, label: 'Embed Links',               cat: 'text'    },
    { bit: 1n << 14n, label: 'Attach Files',              cat: 'text'    },
    { bit: 1n << 15n, label: 'Read Message History',      cat: 'text'    },
    { bit: 1n << 16n, label: 'Mention Everyone',          cat: 'danger'  },
    { bit: 1n << 17n, label: 'Use External Emojis',       cat: 'text'    },
    { bit: 1n << 18n, label: 'View Guild Insights',       cat: 'general' },
    { bit: 1n << 20n, label: 'Connect (Voice)',           cat: 'voice'   },
    { bit: 1n << 21n, label: 'Speak (Voice)',             cat: 'voice'   },
    { bit: 1n << 22n, label: 'Mute Members',              cat: 'voice'   },
    { bit: 1n << 23n, label: 'Deafen Members',            cat: 'voice'   },
    { bit: 1n << 24n, label: 'Move Members',              cat: 'voice'   },
    { bit: 1n << 25n, label: 'Use Voice Activity',        cat: 'voice'   },
    { bit: 1n << 26n, label: 'Change Nickname',           cat: 'general' },
    { bit: 1n << 27n, label: 'Manage Nicknames',          cat: 'manage'  },
    { bit: 1n << 28n, label: 'Manage Roles',              cat: 'manage'  },
    { bit: 1n << 29n, label: 'Manage Webhooks',           cat: 'manage'  },
    { bit: 1n << 30n, label: 'Manage Expressions',        cat: 'manage'  },
    { bit: 1n << 31n, label: 'Use Application Commands',  cat: 'text'    },
    { bit: 1n << 32n, label: 'Request To Speak',          cat: 'voice'   },
    { bit: 1n << 33n, label: 'Manage Events',             cat: 'manage'  },
    { bit: 1n << 34n, label: 'Manage Threads',            cat: 'manage'  },
    { bit: 1n << 35n, label: 'Create Public Threads',     cat: 'text'    },
    { bit: 1n << 36n, label: 'Create Private Threads',    cat: 'text'    },
    { bit: 1n << 37n, label: 'Use External Stickers',     cat: 'text'    },
    { bit: 1n << 38n, label: 'Send Messages In Threads',  cat: 'text'    },
    { bit: 1n << 39n, label: 'Use Embedded Activities',   cat: 'voice'   },
    { bit: 1n << 40n, label: 'Moderate Members',          cat: 'member'  },
    { bit: 1n << 41n, label: 'View Creator Monetization', cat: 'general' },
  ];
  return all.filter(perm => (p & perm.bit) === perm.bit);
}

// Category colour map for permission chips
const CAT_STYLES = {
  danger:  { bg: 'rgba(242,63,67,0.10)',  color: '#f23f43', border: 'rgba(242,63,67,0.25)'  },
  manage:  { bg: 'rgba(255,171,26,0.10)', color: '#ffab1a', border: 'rgba(255,171,26,0.25)' },
  member:  { bg: 'rgba(240,178,36,0.10)', color: '#f0b232', border: 'rgba(240,178,36,0.25)' },
  voice:   { bg: 'rgba(88,101,242,0.10)', color: '#7289da', border: 'rgba(88,101,242,0.25)' },
  text:    { bg: 'rgba(35,165,90,0.10)',  color: '#3ba55d', border: 'rgba(35,165,90,0.25)'  },
  general: { bg: 'rgba(255,255,255,0.05)',color: '#b9bbbe', border: 'rgba(255,255,255,0.10)' },
};

// Channel type → icon component & label
function channelTypeInfo(type) {
  switch (type) {
    case 0:  return { iconName: 'Hash',      label: 'Text Channel',    color: '#80848e' };
    case 2:  return { iconName: 'Radio',     label: 'Voice Channel',   color: '#80848e' };
    case 4:  return { iconName: 'Folder',    label: 'Category',        color: '#fff'    };
    case 5:  return { iconName: 'Megaphone', label: 'Announcement',    color: '#80848e' };
    case 10: return { iconName: 'Lock',      label: 'News Thread',     color: '#80848e' };
    case 11: return { iconName: 'Lock',      label: 'Public Thread',   color: '#80848e' };
    case 12: return { iconName: 'Lock',      label: 'Private Thread',  color: '#80848e' };
    case 13: return { iconName: 'Mic2',      label: 'Stage Channel',   color: '#80848e' };
    case 15: return { iconName: 'LayoutGrid',label: 'Forum Channel',   color: '#80848e' };
    case 16: return { iconName: 'Tv',        label: 'Media Channel',   color: '#80848e' };
    default: return { iconName: 'HelpCircle',label: `Type ${type}`,   color: '#80848e' };
  }
}

// Feature → { label, iconName, colour }
function decodeFeature(f) {
  const MAP = {
    COMMUNITY:                     { label: 'Community Server',       iconName: 'Globe',      color: '#23a55a' },
    VERIFIED:                      { label: 'Verified',               iconName: 'CheckCircle2', color: '#23a55a' },
    PARTNERED:                     { label: 'Discord Partner',        iconName: 'Link2',      color: '#5865F2' },
    DISCOVERABLE:                  { label: 'Server Discovery',       iconName: 'Search',     color: '#5865F2' },
    FEATURABLE:                    { label: 'Featurable',             iconName: 'Star',       color: '#ffab1a' },
    INVITE_SPLASH:                 { label: 'Custom Invite Splash',   iconName: 'Rocket',     color: '#7289da' },
    BANNER:                        { label: 'Server Banner',          iconName: 'LayoutGrid', color: '#7289da' },
    ANIMATED_ICON:                 { label: 'Animated Icon',          iconName: 'Zap',        color: '#ff73fa' },
    ANIMATED_BANNER:               { label: 'Animated Banner',        iconName: 'Tv',         color: '#ff73fa' },
    VANITY_URL:                    { label: 'Vanity URL',             iconName: 'Link2',      color: '#ffab1a' },
    WELCOME_SCREEN_ENABLED:        { label: 'Welcome Screen',         iconName: 'Users',      color: '#23a55a' },
    MEMBER_VERIFICATION_GATE_ENABLED:{ label: 'Membership Screening', iconName: 'Shield',     color: '#f0b232' },
    PREVIEW_ENABLED:               { label: 'Server Preview',         iconName: 'Search',     color: '#949ba4' },
    MONETIZATION_ENABLED:          { label: 'Monetization',           iconName: 'TrendingUp', color: '#ffab1a' },
    MORE_STICKERS:                 { label: 'More Sticker Slots',     iconName: 'Tag',        color: '#ff73fa' },
    MORE_EMOJI:                    { label: 'Extra Emoji Slots',      iconName: 'Flame',      color: '#ff73fa' },
    TICKETED_EVENTS_ENABLED:       { label: 'Ticketed Events',        iconName: 'Globe',      color: '#5865F2' },
    ROLE_SUBSCRIPTIONS_ENABLED:    { label: 'Role Subscriptions',     iconName: 'Crown',      color: '#ff73fa' },
    NEWS:                          { label: 'News Channels',          iconName: 'Megaphone',  color: '#949ba4' },
    ENABLED_DISCOVERABLE_BEFORE:   { label: 'Had Discovery',          iconName: 'Radio',      color: '#949ba4' },
    BOT_DEVELOPER_PORTAL:          { label: 'Bot Dev Portal',         iconName: 'Settings',   color: '#7289da' },
  };
  return MAP[f] || { label: f.split('_').map(w => w[0] + w.slice(1).toLowerCase()).join(' '), iconName: 'Tag', color: '#949ba4' };
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function Page({ searchParams }) {
  const resolvedParams = await searchParams;
  const isDemo = resolvedParams?.demo === 'true';
  const session = isDemo ? { user: { id: 'demo_user' } } : await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  let ownedServers = [];
  let channelMap = {};  // { [guildId]: channel[] }
  let guildDetailMap = {}; // { [guildId]: details }
  let rolesMap = {}; // { [guildId]: roles[] }
  let engagementMap = {}; // { [guildId]: activeMembers[] }
  let errorMsg = null;

  if (isDemo) {
    await ensureDemoDataSeeded(adminDb);
    try {
      const [ownedSnap, detailSnap, rolesSnap, channelSnap, engagementSnap] = await Promise.all([
        adminDb.collection('demo_data').doc('owned_servers').get(),
        adminDb.collection('demo_data').doc('guild_details').get(),
        adminDb.collection('demo_data').doc('roles').get(),
        adminDb.collection('demo_data').doc('channels').get(),
        adminDb.collection('demo_data').doc('engagement').get()
      ]);

      ownedServers = ownedSnap.exists ? (ownedSnap.data().list || []) : [];
      guildDetailMap = detailSnap.exists ? detailSnap.data() : {};
      rolesMap = rolesSnap.exists ? rolesSnap.data() : {};
      channelMap = channelSnap.exists ? channelSnap.data() : {};
      engagementMap = engagementSnap.exists ? engagementSnap.data() : {};
    } catch (e) {
      console.error("Error loading demo servers from Firestore:", e);
      errorMsg = "Failed to load database demo data.";
    }
  } else {
    try {
      const snap = await adminDb.collection('accounts').where('userId', '==', session.user.id).get();
      if (!snap.empty) {
        const token = snap.docs[0].data().access_token;
        if (token) {
          const guildsRes = await fetch('https://discord.com/api/users/@me/guilds', {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 60 },
          });
          if (guildsRes.ok) {
            const all = await guildsRes.json();
            ownedServers = all.filter(g => g.owner);

            const botToken = process.env.DISCORD_BOT_TOKEN;
            if (botToken && ownedServers.length > 0) {
              // Step 1: Fetch Channels, Details, and Roles in parallel for all guilds
              const primaryFetches = await Promise.all(
                ownedServers.map(async (g) => {
                  const headers = { Authorization: `Bot ${botToken}` };
                  try {
                    const [chRes, detRes, rolesRes] = await Promise.all([
                      fetch(`https://discord.com/api/v10/guilds/${g.id}/channels`, { headers, next: { revalidate: 60 } }),
                      fetch(`https://discord.com/api/v10/guilds/${g.id}?with_counts=true`, { headers, next: { revalidate: 60 } }),
                      fetch(`https://discord.com/api/v10/guilds/${g.id}/roles`, { headers, next: { revalidate: 60 } }),
                    ]);

                    const channels = chRes.ok ? await chRes.json() : [];
                    const details = detRes.ok ? await detRes.json() : null;
                    const roles = rolesRes.ok ? await rolesRes.json() : [];

                    return { id: g.id, channels, details, roles };
                  } catch (e) {
                    console.error(`Error in bot fetches for guild ${g.id}:`, e);
                    return { id: g.id, channels: [], details: null, roles: [] };
                  }
                })
              );

              // Step 2: Fetch Engagement Data for text channels in parallel
              const engagementFetches = await Promise.all(
                primaryFetches.map(async (f) => {
                  if (!f.channels || f.channels.length === 0) return { id: f.id, engagement: [] };

                  // Get up to 5 text channels
                  const textChannels = f.channels.filter(c => c.type === 0).slice(0, 5);
                  if (textChannels.length === 0) return { id: f.id, engagement: [] };

                  const headers = { Authorization: `Bot ${botToken}` };
                  const messageFetches = await Promise.all(
                    textChannels.map(async (ch) => {
                      try {
                        const res = await fetch(`https://discord.com/api/v10/channels/${ch.id}/messages?limit=100`, { headers, next: { revalidate: 60 } });
                        if (res.ok) {
                          return await res.json();
                        }
                      } catch (e) {
                        console.error(`Failed to fetch messages for channel ${ch.id}:`, e);
                      }
                      return [];
                    })
                  );

                  const userMessageCounts = {};
                  messageFetches.forEach((msgs) => {
                    if (!Array.isArray(msgs)) return;
                    msgs.forEach((m) => {
                      if (!m.author || m.author.bot) return;
                      const authorKey = m.author.global_name || m.author.username;
                      if (!userMessageCounts[authorKey]) {
                        userMessageCounts[authorKey] = {
                          username: authorKey,
                          count: 0,
                          avatar: m.author.avatar ? `https://cdn.discordapp.com/avatars/${m.author.id}/${m.author.avatar}.png?size=64` : null,
                          tag: m.author.username,
                        };
                      }
                      userMessageCounts[authorKey].count += 1;
                    });
                  });

                  const sorted = Object.values(userMessageCounts)
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                  return { id: f.id, engagement: sorted };
                })
              );

              // Assign mapping collections
              primaryFetches.forEach((f) => {
                const raw = Array.isArray(f.channels) ? f.channels : [];
                channelMap[f.id] = raw.sort((a, b) => {
                  if (a.type === 4 && b.type !== 4) return -1;
                  if (a.type !== 4 && b.type === 4) return 1;
                  return (a.position ?? 0) - (b.position ?? 0);
                });
                guildDetailMap[f.id] = f.details;
                rolesMap[f.id] = f.roles;
              });

              engagementFetches.forEach((ef) => {
                engagementMap[ef.id] = ef.engagement;
              });
            }
          } else {
            errorMsg = `Discord API error (${guildsRes.status}). Try logging out.`;
          }
        } else {
          errorMsg = 'No access token found. Try logging out and back in.';
        }
      } else {
        errorMsg = 'No linked account found. Try logging out and back in.';
      }
    } catch (e) {
      console.error(e);
      errorMsg = 'Failed to load server data.';
    }
  }

  if (errorMsg) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.headerTitle}>Personal Servers</h1>
            <p className={styles.headerSubtitle}>Manage your owned Discord guilds</p>
          </div>
        </div>
        <div className={styles.feedCard} style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icons.AlertTriangle style={{ color: '#f23f43', flexShrink: 0 }} />
          <span style={{ color: '#949ba4' }}>{errorMsg}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      {isDemo && (
        <div style={{
          borderLeft: '3px solid #5865F2',
          background: 'rgba(88,101,242,0.06)',
          borderRadius: '0 8px 8px 0',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <Icons.Crown style={{ color: '#5865F2', flexShrink: 0 }} size={16} />
            <p style={{ margin: 0, color: '#949ba4', fontSize: '0.8125rem' }}>
              <span style={{ color: '#dbdee1', fontWeight: 600 }}>Demo Mode</span>
              {' — '}
              Interact with mock Coral metrics and ask Grok anything.
            </p>
          </div>
          <ConnectDemoButton />
        </div>
      )}

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.headerTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Icons.Crown size={20} style={{ color: '#ffd700' }} /> Your Servers
          </h1>
          <p className={styles.headerSubtitle}>
            {ownedServers.length} owned guild{ownedServers.length !== 1 ? 's' : ''}{isDemo ? ' · Demo Mode' : ''}
          </p>
        </div>
      </div>

      {ownedServers.length === 0 ? (
        <div className={styles.feedCard} style={{ padding: '4rem', textAlign: 'center' }}>
          <Icons.Compass size={52} style={{ color: '#80848e', marginBottom: '1rem', opacity: 0.4 }} />
          <h3 style={{ margin: 0, color: '#fff', fontSize: '1.25rem' }}>No Owned Servers Found</h3>
          <p style={{ margin: '8px 0 0', color: '#949ba4', fontSize: '0.9rem' }}>
            You do not own any Discord servers, or the guilds permission was not granted.
          </p>
        </div>
      ) : (
        ownedServers.map((server) => {
          const iconUrl  = server.icon  ? `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png?size=256`  : null;
          const perms    = decodePermissions(server.permissions);
          const features = (server.features || []).map(decodeFeature);
          const created  = snowflakeToDate(server.id);
          const createdStr = created.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          const age = ageString(created);

          const details = guildDetailMap[server.id];
          const roles = rolesMap[server.id] || [];
          const engagement = engagementMap[server.id] || [];
          const displayedRoles = roles
            .filter(r => r.id !== server.id && r.name !== '@everyone')
            .sort((a, b) => b.position - a.position);

          // Group permissions by category
          const grouped = {};
          for (const perm of perms) {
            (grouped[perm.cat] = grouped[perm.cat] || []).push(perm.label);
          }
          const CAT_LABELS = {
            danger: { label: 'Danger Permissions', icon: <Icons.AlertTriangle size={12} style={{ color: CAT_STYLES.danger.color }} /> },
            manage: { label: 'Management',          icon: <Icons.Settings size={12}      style={{ color: CAT_STYLES.manage.color }} /> },
            member: { label: 'Member Controls',     icon: <Icons.Users size={12}          style={{ color: CAT_STYLES.member.color }} /> },
            voice:  { label: 'Voice Permissions',   icon: <Icons.Mic2 size={12}           style={{ color: CAT_STYLES.voice.color }}  /> },
            text:   { label: 'Text & Channels',     icon: <Icons.Hash size={12}           style={{ color: CAT_STYLES.text.color }}   /> },
            general:{ label: 'General',             icon: <Icons.Key size={12}            style={{ color: CAT_STYLES.general.color }}/> },
          };
          const CAT_ORDER = ['danger', 'manage', 'member', 'voice', 'text', 'general'];

          return (
            <div key={server.id} style={{ marginBottom: '2rem' }}>

              {/* ── Discord-style Server Card ──────────────────────────────── */}
              <div className={serverStyles.serverCard}>

                {/* Banner / Cover */}
                <div className={serverStyles.serverBanner}>
                  {/* Server icon floats on the banner */}
                  <div className={serverStyles.serverIconContainer}>
                    {iconUrl ? (
                      <img src={iconUrl} alt={server.name} className={serverStyles.serverIcon} />
                    ) : (
                      <div className={serverStyles.serverIconPlaceholder}>
                        {[...server.name][0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Server Name + meta row */}
                <div className={serverStyles.serverMeta}>
                  <div className={serverStyles.metaHeader}>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                        {server.name}
                      </h2>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#80848e', fontFamily: 'monospace' }}>
                        ID: {server.id}
                      </p>
                    </div>
                    <div className={serverStyles.metaBadgeRow}>
                      <InviteBotButton
                        isDemo={isDemo}
                        clientId={process.env.DISCORD_CLIENT_ID}
                        guildId={server.id}
                      />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: '#ffd700', padding: '4px 10px', borderRadius: '10px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.18)' }}>
                        <Icons.Crown size={11} style={{ color: '#ffd700' }} /> OWNER
                      </span>
                      {features.find(f => f.label === 'Verified') && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: '#23a55a', padding: '4px 10px', borderRadius: '10px', background: 'rgba(35,165,90,0.08)', border: '1px solid rgba(35,165,90,0.18)' }}>
                          <Icons.CheckCircle2 size={11} /> VERIFIED
                        </span>
                      )}
                      {features.find(f => f.label === 'Discord Partner') && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', fontWeight: 700, color: '#5865F2', padding: '4px 10px', borderRadius: '10px', background: 'rgba(88,101,242,0.08)', border: '1px solid rgba(88,101,242,0.18)' }}>
                          <Icons.Link2 size={11} /> PARTNER
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick stats bar */}
                  <div className={serverStyles.statsRow}>
                    {[
                      { icon: <Icons.Clock size={14} />,    label: 'Created',     value: createdStr },
                      { icon: <Icons.Activity size={14} />, label: 'Server Age',  value: age },
                      { icon: <Icons.Key size={14} />,      label: 'Permissions', value: `${perms.length} granted` },
                      { icon: <Icons.Compass size={14} />,  label: 'Features',    value: features.length > 0 ? `${features.length} active` : 'None' },
                    ].map(({ icon, label, value }) => (
                      <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#80848e', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {icon} {label}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#dbdee1', fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {details && (
                    <div className={serverStyles.detailsRow}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(88, 101, 242, 0.1)',
                        border: '1px solid rgba(88, 101, 242, 0.2)',
                        color: '#7289da',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}>
                        <Icons.Users size={12} />
                        <span>{details.approximate_member_count?.toLocaleString() || 0} Members</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(35, 165, 90, 0.1)',
                        border: '1px solid rgba(35, 165, 90, 0.2)',
                        color: '#3ba55d',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3ba55d', display: 'inline-block' }}></span>
                        <span>{details.approximate_presence_count?.toLocaleString() || 0} Online</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 115, 250, 0.1)',
                        border: '1px solid rgba(255, 115, 250, 0.2)',
                        color: '#ff73fa',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                      }}>
                        <Icons.Crown size={12} style={{ color: '#ff73fa' }} />
                        <span>Level {details.premium_tier || 0} ({details.premium_subscription_count || 0} Boosts)</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Inner 2-col layout ─────────────────────────────────── */}
                <div className={serverStyles.innerGrid}>

                  {/* Left: Permissions by category */}
                  <div className={serverStyles.permsCol}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#80848e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Your Permissions ({perms.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {CAT_ORDER.filter(cat => grouped[cat]).map(cat => {
                        const cs = CAT_STYLES[cat];
                        return (
                          <div key={cat}>
                        <p style={{ margin: '0 0 0.4rem', fontSize: '0.72rem', color: cs.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                              {CAT_LABELS[cat].icon} {CAT_LABELS[cat].label}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                              {grouped[cat].map(label => (
                                <span key={label} style={{
                                  fontSize: '0.72rem', fontWeight: 600,
                                  padding: '3px 8px', borderRadius: '6px',
                                  background: cs.bg, color: cs.color,
                                  border: `1px solid ${cs.border}`,
                                  whiteSpace: 'nowrap',
                                }}>
                                  {label}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Server Features */}
                  <div className={serverStyles.featuresCol}>
                    <h4 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#80848e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Server Features ({features.length})
                    </h4>
                      {features.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#4e5058' }}>No premium features active.</p>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#4e5058', lineHeight: 1.5 }}>
                          Features like Community mode, Vanity URLs, Server Banner, or Partner status will appear here once enabled.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {features.map((feat, i) => {
                          const FeatIcon = Icons[feat.iconName] || Icons.Tag;
                          return (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'center', gap: '0.625rem',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}>
                              <FeatIcon size={14} style={{ color: feat.color, flexShrink: 0 }} />
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: feat.color }}>{feat.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Roles Section */}
                <div className={serverStyles.rolesSection}>
                  <h4 style={{ margin: '0 0 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#80848e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Icons.Tag size={13} style={{ color: '#949ba4' }} /> Roles ({displayedRoles.length})
                  </h4>
                  {roles.length === 0 ? (
                    <div style={{ color: '#80848e', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icons.Info size={14} />
                      <span>Invite the bot to unlock role visualization.</span>
                    </div>
                  ) : displayedRoles.length === 0 ? (
                    <div style={{ color: '#80848e', fontSize: '0.82rem' }}>
                      No custom roles defined.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {displayedRoles.map((r) => {
                        const roleColor = r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#b9bbbe';
                        const rRed = r.color ? parseInt(roleColor.slice(1,3), 16) : 255;
                        const rGreen = r.color ? parseInt(roleColor.slice(3,5), 16) : 255;
                        const rBlue = r.color ? parseInt(roleColor.slice(5,7), 16) : 255;
                        const roleBg = `rgba(${rRed}, ${rGreen}, ${rBlue}, 0.08)`;
                        const roleBorder = `rgba(${rRed}, ${rGreen}, ${rBlue}, 0.22)`;
                        
                        return (
                          <div key={r.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: roleBg,
                            border: `1px solid ${roleBorder}`,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: roleColor,
                            whiteSpace: 'nowrap',
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: roleColor, display: 'inline-block' }}></span>
                            <span>{r.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* ── Channel List (Bot-powered) ──────────────────────── */}
                {(() => {
                  const channels = channelMap[server.id] || [];
                  // Group by parent category
                  const categories = channels.filter(c => c.type === 4);
                  const uncategorised = channels.filter(c => c.type !== 4 && !c.parent_id);

                  const renderChannel = (ch) => {
                    const info = channelTypeInfo(ch.type);
                    const ChIcon = Icons[info.iconName] || Icons.Hash;
                    return (
                      <div key={ch.id} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '4px 12px 4px 32px',
                        borderRadius: '4px',
                        cursor: 'default',
                      }}>
                        <ChIcon size={14} style={{ color: '#80848e', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.825rem', color: '#80848e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {ch.name}
                        </span>
                        {ch.nsfw && (
                          <span style={{ fontSize: '0.65rem', color: '#f23f43', background: 'rgba(242,63,67,0.1)', border: '1px solid rgba(242,63,67,0.2)', borderRadius: '4px', padding: '1px 5px', flexShrink: 0 }}>
                            18+
                          </span>
                        )}
                      </div>
                    );
                  };

                  return (
                    <div className={serverStyles.channelsSection}>
                      {/* Header */}
                      <div className={serverStyles.channelsHeader}>
                        <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#80848e', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                           <Icons.Radio size={13} style={{ color: '#949ba4' }} /> Channels ({channels.filter(c => c.type !== 4).length})
                        </h4>
                        {channels.length === 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#f0b232', background: 'rgba(240,178,36,0.1)', border: '1px solid rgba(240,178,36,0.2)', borderRadius: '6px', padding: '2px 8px' }}>
                            Bot not in server yet
                          </span>
                        )}
                      </div>

                      {channels.length === 0 ? (
                        <div style={{ padding: '0.75rem 1.5rem 1.25rem', color: '#4e5058', fontSize: '0.82rem', lineHeight: 1.5 }}>
                          No channel data available. The bot needs access to this server.
                        </div>
                      ) : (
                        <div className={serverStyles.channelsGrid}>
                          {/* Uncategorised channels */}
                          {uncategorised.map(ch => renderChannel(ch))}

                          {/* Categorised groups */}
                          {categories.map(cat => {
                            const children = channels.filter(c => c.parent_id === cat.id);
                            return (
                              <div key={cat.id} style={{ gridColumn: '1 / -1' }}>
                                {/* Category header */}
                                <div style={{
                                  display: 'flex', alignItems: 'center', gap: '6px',
                                  padding: '10px 12px 4px',
                                  cursor: 'default',
                                }}>
                                  <span style={{ fontSize: '0.65rem', color: '#80848e' }}>▸</span>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#949ba4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    {cat.name}
                                  </span>
                                </div>
                                {/* Children in a mini grid */}
                                <div className={serverStyles.subChannelsGrid}>
                                  {children.map(ch => renderChannel(ch))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Engagement Section */}
                <div className={serverStyles.engagementSection}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                    <Icons.Flame size={16} style={{ color: '#ffab1a' }} />
                    <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#80848e', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      Top Active Members
                    </h4>
                  </div>

                  {engagement.length === 0 ? (
                    <div style={{ color: '#80848e', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icons.Info size={14} />
                      <span>{roles.length === 0 ? 'Invite the bot to scan message activity.' : 'No recent message activity found in text channels.'}</span>
                    </div>
                  ) : (
                    <div className={serverStyles.engagementGrid}>
                      {engagement.map((member, idx) => {
                        const topCount = engagement[0].count;
                        const pct = topCount > 0 ? (member.count / topCount) * 100 : 0;
                        const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
                        const rankColor = rankColors[idx] || '#80848e';

                        return (
                          <div key={member.username} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            gap: '10px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: rankColor, width: '18px', flexShrink: 0 }}>
                                #{idx + 1}
                              </span>
                              {member.avatar ? (
                                <img src={member.avatar} alt={member.username} style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
                              ) : (
                                <div style={{
                                  width: '28px', height: '28px', borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #4f545c, #2f3136)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.75rem', fontWeight: 700, color: '#dcddde', flexShrink: 0
                                }}>
                                  {[...member.username][0]?.toUpperCase()}
                                </div>
                              )}
                              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {member.username}
                                </span>
                                <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${pct}%`, height: '100%', background: idx === 0 ? 'linear-gradient(90deg, #ffab1a, #ff73fa)' : '#5865F2', borderRadius: '2px' }} />
                                </div>
                              </div>
                            </div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(88,101,242,0.1)',
                              border: '1px solid rgba(88,101,242,0.15)',
                              flexShrink: 0,
                            }}>
                              <Icons.MessageSquare size={10} style={{ color: '#7289da' }} />
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#dbdee1' }}>{member.count}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Privacy footer strip */}
                <div className={serverStyles.cardFooter}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Icons.Shield size={14} style={{ color: '#3ba55d', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: '#949ba4' }}>
                      Data loaded in real-time via OAuth — we never store server contents or member info.
                    </span>
                  </div>
                  <WipeButton />
                </div>

              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
