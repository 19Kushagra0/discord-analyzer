/**
 * Firestore Demo Data Seeding Engine
 * Generates brand-new, rich dummy Discord data under the 'demo_data' collection.
 * Ensures zero leakage of personal data by operating on simulated data based on a legacy, high-privilege account.
 */

export async function ensureDemoDataSeeded(db) {
  try {
    const profileRef = db.collection('demo_data').doc('profile');
    const doc = await profileRef.get();
    if (!doc.exists) {
      console.log("Demo data not found in Firestore. Running self-healing seeding engine...");
      await seedDemoData(db);
    }
  } catch (e) {
    console.error("Failed checking or seeding demo data in Firestore:", e);
  }
}

export async function seedDemoData(db) {
  const batch = db.batch();
  
  // 1. Vintage, high-privilege dummy Discord profile
  const profileRef = db.collection('demo_data').doc('profile');
  batch.set(profileRef, {
    id: "158309183921839218",
    username: "coral_legend",
    global_name: "Captain Blackbeard",
    email: "blackbeard@coralstats.dev",
    locale: "en-US",
    accent_color: 3447003,
    public_flags: 514, // Partnered Server Owner (2) + Early Supporter (512)
    premium_type: 2, // Nitro
    verified: true,
    mfa_enabled: true,
    avatar: null,
    banner: null
  });

  // 2. Connected guilds list (for overview server list)
  const guildsRef = db.collection('demo_data').doc('guilds');
  batch.set(guildsRef, {
    list: [
      { id: "1111", name: "🏴‍☠️ Pirates of Coral-bean", icon: null, owner: true, permissions: "1099511627775", member_count: 14200 },
      { id: "2222", name: "👾 Retro Arcade", icon: null, owner: true, permissions: "1099511627775", member_count: 6500 },
      { id: "3333", name: "☕ Developers Anonymous", icon: null, owner: true, permissions: "8", member_count: 1250 },
      { id: "4444", name: "🎓 Academic Cove", icon: null, owner: false, permissions: "0", member_count: 340 },
      { id: "5555", name: "🎨 Creative Sandbox", icon: null, owner: false, permissions: "0", member_count: 85 }
    ]
  });

  // 3. Owned servers list (full details for the Personal Servers tab)
  const ownedServersRef = db.collection('demo_data').doc('owned_servers');
  batch.set(ownedServersRef, {
    list: [
      {
        id: "1111",
        name: "🏴‍☠️ Pirates of Coral-bean",
        icon: null,
        owner: true,
        permissions: "1099511627775",
        features: ["COMMUNITY", "ROLE_SUBSCRIPTIONS_ENABLED", "ANIMATED_ICON", "BANNER", "VANITY_URL"]
      },
      {
        id: "2222",
        name: "👾 Retro Arcade",
        icon: null,
        owner: true,
        permissions: "1099511627775",
        features: ["COMMUNITY", "WELCOME_SCREEN_ENABLED", "ANIMATED_ICON"]
      },
      {
        id: "3333",
        name: "☕ Developers Anonymous",
        icon: null,
        owner: true,
        permissions: "8",
        features: ["COMMUNITY", "MEMBER_VERIFICATION_GATE_ENABLED"]
      }
    ]
  });

  // 4. Server details (member counts, presences, server boost logs)
  const guildDetailsRef = db.collection('demo_data').doc('guild_details');
  batch.set(guildDetailsRef, {
    "1111": {
      approximate_member_count: 14200,
      approximate_presence_count: 4210,
      premium_tier: 3,
      premium_subscription_count: 32
    },
    "2222": {
      approximate_member_count: 6500,
      approximate_presence_count: 1850,
      premium_tier: 2,
      premium_subscription_count: 15
    },
    "3333": {
      approximate_member_count: 1250,
      approximate_presence_count: 480,
      premium_tier: 1,
      premium_subscription_count: 4
    }
  });

  // 5. Distinct color roles system with hierarchy positions
  const rolesRef = db.collection('demo_data').doc('roles');
  batch.set(rolesRef, {
    "1111": [
      { id: "r11", name: "Pirate Lord", color: 16753920, position: 4 },
      { id: "r12", name: "Quartermaster", color: 15158332, position: 3 },
      { id: "r13", name: "First Mate", color: 3447003, position: 2 },
      { id: "r14", name: "Deckhand", color: 10070709, position: 1 }
    ],
    "2222": [
      { id: "r21", name: "Arcade Champion", color: 16580705, position: 3 },
      { id: "r22", name: "High Scorer", color: 3066993, position: 2 },
      { id: "r23", name: "Retro Gamer", color: 9807270, position: 1 }
    ],
    "3333": [
      { id: "r31", name: "Lead Architect", color: 15548997, position: 3 },
      { id: "r32", name: "Senior Dev", color: 2067276, position: 2 },
      { id: "r33", name: "Intern", color: 9807270, position: 1 }
    ]
  });

  // 6. Complete channel listings (including Categories, Forums, Voice & Text)
  const channelsRef = db.collection('demo_data').doc('channels');
  batch.set(channelsRef, {
    "1111": [
      { id: "c11", name: "announcements", type: 5, position: 1 },
      { id: "c12", name: "rules-and-info", type: 0, position: 2 },
      { id: "cat11", name: "Text Channels", type: 4, position: 3 },
      { id: "c13", name: "general-chat", type: 0, parent_id: "cat11", position: 4 },
      { id: "c14", name: "loot-discussions", type: 0, parent_id: "cat11", position: 5 },
      { id: "c15", name: "ship-designs", type: 15, parent_id: "cat11", position: 6 },
      { id: "cat12", name: "Voice Quarters", type: 4, position: 7 },
      { id: "c16", name: "The Captain's Table", type: 2, parent_id: "cat12", position: 8 },
      { id: "c17", name: "Deck Talk", type: 2, parent_id: "cat12", position: 9 }
    ],
    "2222": [
      { id: "c21", name: "welcome-info", type: 0, position: 1 },
      { id: "c22", name: "high-scores", type: 0, position: 2 },
      { id: "cat21", name: "Arcade Cabinets", type: 4, position: 3 },
      { id: "c23", name: "pacman-cove", type: 0, parent_id: "cat21", position: 4 },
      { id: "c24", name: "street-fighter", type: 0, parent_id: "cat21", position: 5 },
      { id: "c25", name: "coop-voice", type: 2, parent_id: "cat21", position: 6 }
    ],
    "3333": [
      { id: "c31", name: "getting-started", type: 0, position: 1 },
      { id: "c32", name: "system-status", type: 5, position: 2 },
      { id: "cat31", name: "Development", type: 4, position: 3 },
      { id: "c33", name: "architecture", type: 0, parent_id: "cat31", position: 4 },
      { id: "c34", name: "code-reviews", type: 15, parent_id: "cat31", position: 5 },
      { id: "c35", name: "watercooler-voice", type: 2, parent_id: "cat31", position: 6 }
    ]
  });

  // 7. Active member channel engagement charts (message logs metric)
  const engagementRef = db.collection('demo_data').doc('engagement');
  batch.set(engagementRef, {
    "1111": [
      { username: "CaptainBlackbeard", count: 2450, tag: "blackbeard", avatar: null },
      { username: "FirstMateSmee", count: 1820, tag: "smee", avatar: null },
      { username: "JackSparrow", count: 1205, tag: "captainjack", avatar: null },
      { username: "Kushagra", count: 420, tag: "kush", avatar: null },
      { username: "Antigravity", count: 310, tag: "antigravity", avatar: null }
    ],
    "2222": [
      { username: "MarioLuigi", count: 890, tag: "plumber", avatar: null },
      { username: "PacmanGhost", count: 654, tag: "blinky", avatar: null },
      { username: "Kushagra", count: 120, tag: "kush", avatar: null }
    ],
    "3333": [
      { username: "Kushagra", count: 720, tag: "kush", avatar: null },
      { username: "DevDave", count: 540, tag: "dave", avatar: null },
      { username: "GitBot", count: 380, tag: "gitbot", avatar: null },
      { username: "Antigravity", count: 150, tag: "antigravity", avatar: null }
    ]
  });

  await batch.commit();
  console.log("Firestore successfully populated with rich demo collections!");
}
