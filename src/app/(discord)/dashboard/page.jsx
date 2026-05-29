import React from 'react';
import styles from '@/styles/dashboard.module.css';
import * as Icons from '@/components/Icons';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { adminDb } from '@/lib/firebase-admin';

// Decode Discord public_flags bitfield into badge labels
function getDiscordBadges(flags) {
  if (!flags) return [];
  const badges = [];
  if (flags & 1)       badges.push({ label: 'Discord Staff',          emoji: '🛠️' });
  if (flags & 2)       badges.push({ label: 'Partnered Server Owner', emoji: '🤝' });
  if (flags & 4)       badges.push({ label: 'HypeSquad Events',       emoji: '🎉' });
  if (flags & 8)       badges.push({ label: 'Bug Hunter Lv.1',        emoji: '🐛' });
  if (flags & 64)      badges.push({ label: 'House Bravery',          emoji: '🛡️' });
  if (flags & 128)     badges.push({ label: 'House Brilliance',       emoji: '✨' });
  if (flags & 256)     badges.push({ label: 'House Balance',          emoji: '⚖️' });
  if (flags & 512)     badges.push({ label: 'Early Supporter',        emoji: '💎' });
  if (flags & 16384)   badges.push({ label: 'Bug Hunter Lv.2',        emoji: '🐞' });
  if (flags & 65536)   badges.push({ label: 'Verified Bot Dev',       emoji: '💻' });
  if (flags & 131072)  badges.push({ label: 'Certified Moderator',    emoji: '🛡️' });
  if (flags & 4194304) badges.push({ label: 'Active Developer',       emoji: '⚙️' });
  return badges;
}

// Convert Discord accent_color integer → hex string
function toHex(n) {
  if (n == null) return null;
  return '#' + n.toString(16).padStart(6, '0');
}

// Decode locale code → readable string
function localeLabel(locale) {
  const map = {
    'en-US': 'English (United States)', 'en-GB': 'English (United Kingdom)',
    'da': 'Danish', 'de': 'German', 'es-ES': 'Spanish', 'fr': 'French',
    'hr': 'Croatian', 'it': 'Italian', 'lt': 'Lithuanian', 'hu': 'Hungarian',
    'nl': 'Dutch', 'no': 'Norwegian', 'pl': 'Polish', 'pt-BR': 'Portuguese (BR)',
    'ro': 'Romanian', 'fi': 'Finnish', 'sv-SE': 'Swedish', 'vi': 'Vietnamese',
    'tr': 'Turkish', 'cs': 'Czech', 'el': 'Greek', 'bg': 'Bulgarian',
    'ru': 'Russian', 'uk': 'Ukrainian', 'hi': 'Hindi', 'th': 'Thai',
    'zh-CN': 'Chinese (China)', 'zh-TW': 'Chinese (Taiwan)', 'ja': 'Japanese', 'ko': 'Korean',
  };
  return map[locale] || locale || 'Unknown';
}

// Nitro tier → label
function nitroLabel(type) {
  if (type === 1) return 'Nitro Classic';
  if (type === 2) return 'Nitro';
  if (type === 3) return 'Nitro Basic';
  return 'None (Free)';
}

// Snowflake → exact Date
function snowflakeToDate(id) {
  return new Date(Number(BigInt(id) >> 22n) + 1420070400000);
}

// Human-readable account age
function accountAge(date) {
  const now = new Date();
  let y = now.getFullYear() - date.getFullYear();
  let m = now.getMonth()   - date.getMonth();
  let d = now.getDate()    - date.getDate();
  if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  const parts = [];
  if (y > 0) parts.push(`${y} year${y > 1 ? 's' : ''}`);
  if (m > 0) parts.push(`${m} month${m > 1 ? 's' : ''}`);
  if (d > 0 && y === 0) parts.push(`${d} day${d > 1 ? 's' : ''}`);
  return parts.length ? parts.join(', ') : 'Today';
}

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
  let guilds = [];
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
        else errorMsg = `Discord API error (${profileRes.status}). Try logging out and back in.`;
        if (guildsRes.ok) guilds = await guildsRes.json();
      } else {
        errorMsg = 'No access token found. Try logging out and back in.';
      }
    } else {
      errorMsg = 'No linked account found. Try logging out and back in.';
    }
  } catch (e) {
    console.error(e);
    errorMsg = 'Failed to load profile.';
  }

  // ── Error state ──────────────────────────────────────────────────────────────
  if (errorMsg || !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.headerTitle}>User Overview</h1>
            <p className={styles.headerSubtitle}>Discord Identity Dashboard</p>
          </div>
        </div>
        <div className={styles.feedCard} style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Icons.AlertTriangle style={{ color: '#f23f43', flexShrink: 0 }} />
          <span style={{ color: '#949ba4' }}>{errorMsg || 'Failed to load profile.'}</span>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────────
  const regDate    = snowflakeToDate(profile.id);
  const regStr     = regDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const age        = accountAge(regDate);
  const accentHex  = toHex(profile.accent_color);
  const bannerColor = accentHex || '#5865F2';
  const badges     = getDiscordBadges(profile.public_flags || profile.flags);
  const nitroTier  = profile.premium_type || 0;
  const nitro      = nitroLabel(nitroTier);
  const avatarUrl  = profile.avatar
    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
    : null;
  const bannerUrl  = profile.banner
    ? `https://cdn.discordapp.com/banners/${profile.id}/${profile.banner}.png?size=600`
    : null;

  // ── UI ────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.headerTitle}>
            Welcome back, {profile.global_name || profile.username}!
          </h1>
          <p className={styles.headerSubtitle}>Discord Identity Dashboard · Connected via OAuth</p>
        </div>
      </div>

      {/* ── Hero Profile Card (full width) ────────────────────────────── */}
      <div className={styles.profileCard} style={{
        borderColor: accentHex ? `${accentHex}55` : 'rgba(88,101,242,0.2)',
        overflow: 'visible',
      }}>
        {/* Banner */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '110px',
          borderRadius: '16px 16px 0 0', overflow: 'hidden', zIndex: 1,
        }}>
          {bannerUrl ? (
            <img src={bannerUrl} alt="banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: bannerColor, opacity: 0.7 }} />
          )}
        </div>

        {/* Content sits below banner */}
        <div style={{ position: 'relative', zIndex: 2, paddingTop: '70px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', flexWrap: 'wrap' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0, marginTop: '-30px' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar"
                  style={{ width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #1e1f22', display: 'block' }} />
              ) : (
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%', border: '4px solid #1e1f22',
                  background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.25rem', fontWeight: 700, color: '#fff',
                }}>
                  {(profile.global_name || profile.username).charAt(0).toUpperCase()}
                </div>
              )}
              {/* Online dot */}
              <div style={{
                position: 'absolute', bottom: 5, right: 5,
                width: 16, height: 16, borderRadius: '50%',
                background: '#23a55a', border: '3px solid #1e1f22',
              }} />
            </div>

            {/* Name + username */}
            <div style={{ marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {profile.global_name || profile.username}
                {profile.verified && (
                  <Icons.CheckCircle2 size={20} style={{ color: '#23a55a' }} title="Email verified" />
                )}
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: '#80848e', fontFamily: 'monospace' }}>
                @{profile.username}
              </p>
            </div>

            {/* Status pills — Nitro / MFA / Verified */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem', marginLeft: 'auto' }}>
              {nitroTier > 0 && (
                <span className={`${styles.badge} ${styles.badgeNitro}`}>
                  <Icons.Flame size={12} /> {nitro}
                </span>
              )}
              {profile.mfa_enabled && (
                <span className={`${styles.badge} ${styles.badgeMfa}`}>
                  <Icons.Shield size={12} /> 2FA On
                </span>
              )}
              {profile.verified && (
                <span className={`${styles.badge} ${styles.badgeVerified}`}>
                  <Icons.CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Discord public badges row */}
          {badges.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
              {badges.map((b, i) => (
                <span key={i} className={styles.badge} style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#dbdee1', fontSize: '0.75rem',
                }}>
                  {b.emoji} {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Two-column body ───────────────────────────────────────────── */}
      <div className={styles.layoutGrid}>

        {/* Left column — Account Details */}
        <div className={styles.mainColumn}>
          <div className={styles.feedCard}>
            <div className={styles.feedHeader}>
              <div className={styles.feedHeaderLeft}>
                <Icons.UserCircle className={styles.tabIcon} style={{ color: '#5865F2' }} />
                <h2 className={styles.feedTitle} style={{ marginLeft: '8px' }}>Account Details</h2>
              </div>
            </div>

            <div style={{ padding: '0.5rem' }}>
              {[
                { icon: <Icons.Mail size={15} />,        label: 'Email Address',      value: profile.email || 'Not shared' },
                { icon: <Icons.Key size={15} />,         label: 'Discord ID',         value: profile.id, mono: true },
                { icon: <Icons.Clock size={15} />,       label: 'Registered On',      value: regStr },
                { icon: <Icons.Activity size={15} />,    label: 'Account Age',        value: age },
                { icon: <Icons.Compass size={15} />,     label: 'Language / Locale',  value: `${localeLabel(profile.locale)} (${profile.locale || 'N/A'})` },
                { icon: <Icons.Flame size={15} />,       label: 'Discord Premium',    value: nitro },
              ].map(({ icon, label, value, mono }, i, arr) => (
                <div key={label} className={styles.feedItem} style={{
                  borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  padding: '0.9rem 0.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: '1rem',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#949ba4', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {icon} {label}
                  </span>
                  <span style={{
                    fontFamily: mono ? 'monospace' : 'inherit',
                    fontSize: '0.875rem',
                    color: mono ? '#80848e' : '#dbdee1',
                    fontWeight: 500,
                    textAlign: 'right',
                    wordBreak: 'break-all',
                  }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Security + Nitro detail */}
        <div className={styles.sideColumn}>

          {/* Security card */}
          <div className={styles.card} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <Icons.Shield size={15} style={{ color: '#23a55a' }} /> Security Status
            </h3>

            {/* MFA row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem',
              borderRadius: '0.75rem',
              background: profile.mfa_enabled ? 'rgba(35,165,90,0.08)' : 'rgba(242,63,67,0.08)',
              border: `1px solid ${profile.mfa_enabled ? 'rgba(35,165,90,0.2)' : 'rgba(242,63,67,0.2)'}`,
            }}>
              {profile.mfa_enabled
                ? <Icons.Shield size={28} style={{ color: '#23a55a', flexShrink: 0 }} />
                : <Icons.AlertTriangle size={28} style={{ color: '#f23f43', flexShrink: 0 }} />}
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                  {profile.mfa_enabled ? 'Two-Factor Auth Active' : 'MFA is Disabled'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#949ba4' }}>
                  {profile.mfa_enabled
                    ? 'Your account is protected with 2FA.'
                    : 'Enable 2FA in Discord settings for protection.'}
                </p>
              </div>
            </div>

            {/* Email verified row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem',
              borderRadius: '0.75rem',
              background: profile.verified ? 'rgba(35,165,90,0.08)' : 'rgba(242,63,67,0.08)',
              border: `1px solid ${profile.verified ? 'rgba(35,165,90,0.2)' : 'rgba(242,63,67,0.2)'}`,
            }}>
              {profile.verified
                ? <Icons.CheckCircle2 size={28} style={{ color: '#23a55a', flexShrink: 0 }} />
                : <Icons.AlertTriangle size={28} style={{ color: '#f23f43', flexShrink: 0 }} />}
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                  {profile.verified ? 'Email Verified' : 'Email Not Verified'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#949ba4', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                  {profile.email || 'No email shared via OAuth'}
                </p>
              </div>
            </div>
          </div>

          {/* Nitro / Premium card */}
          <div className={styles.card} style={{
            background: nitroTier > 0
              ? 'linear-gradient(135deg, rgba(255,115,250,0.1) 0%, rgba(88,101,242,0.1) 100%)'
              : '#313338',
            border: nitroTier > 0 ? '1px solid rgba(255,115,250,0.25)' : '1px solid rgba(255,255,255,0.05)',
          }}>
            <h3 className={styles.cardTitle} style={{
              display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700,
              color: nitroTier > 0 ? '#ff73fa' : '#949ba4',
            }}>
              <Icons.Flame size={15} /> Discord Premium
            </h3>
            <p style={{
              margin: '0.75rem 0 0.25rem',
              fontSize: '1.75rem', fontWeight: 800,
              background: nitroTier > 0 ? 'linear-gradient(90deg,#ff73fa,#5865f2)' : 'none',
              WebkitBackgroundClip: nitroTier > 0 ? 'text' : 'none',
              WebkitTextFillColor: nitroTier > 0 ? 'transparent' : '#dbdee1',
            }}>
              {nitro}
            </p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#949ba4', lineHeight: 1.5 }}>
              {nitroTier > 0
                ? `You enjoy ${nitro} perks — custom avatar, animated emotes, server boosting, and larger uploads.`
                : 'Free tier. Upgrade to Nitro on Discord for premium perks.'}
            </p>
          </div>

        </div>
      </div>

      {/* ── Connected Servers Grid ────────────────────────────────────── */}
      <div className={styles.feedCard}>
        <div className={styles.feedHeader}>
          <div className={styles.feedHeaderLeft}>
            <Icons.Users className={styles.tabIcon} style={{ color: '#5865F2' }} />
            <h2 className={styles.feedTitle} style={{ marginLeft: '8px' }}>Connected Servers</h2>
            <span className={styles.liveBadge} style={{ background: 'rgba(88,101,242,0.1)', color: '#5865F2', border: '1px solid rgba(88,101,242,0.2)' }}>
              {guilds.length} SERVERS
            </span>
          </div>
        </div>

        {guilds.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#949ba4' }}>
            No servers found. Make sure the guilds permission was granted during login.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.875rem',
            padding: '1.25rem',
          }}>
            {guilds.map((guild) => {
              const icon = guild.icon
                ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                : null;
              return (
                <div key={guild.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem',
                  backgroundColor: '#2b2d31',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}>
                  {icon ? (
                    <img src={icon} alt={guild.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                      background: '#5865F2', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '1.1rem',
                    }}>
                      {guild.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{
                      margin: 0, fontWeight: 600, fontSize: '0.875rem',
                      color: '#dbdee1', overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {guild.name}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#949ba4' }}>
                      {guild.owner ? '👑 Owner' : 'Member'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
