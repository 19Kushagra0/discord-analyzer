"use client"; // 1. We make this an interactive Client Component!

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/login.module.css';
import { MessageSquare } from '@/components/Icons';
import { signIn } from 'next-auth/react'; // 2. Import the Auth.js magic function

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoArea} href="/">
          <div className={styles.logoIcon} />
          <span className={styles.logoText}>CoralStats</span>
        </Link>
        
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your workspace</p>
          
          {/* 3. We add the onClick handler to YOUR beautiful button! */}
          <button 
            onClick={() => signIn('discord', { callbackUrl: '/dashboard' })}
            className={styles.discordBtn}
          >
            <MessageSquare size={18} />
            <span>Continue with Discord</span>
          </button>
          
          <p className={styles.terms}>
            By continuing, you agree to CoralStats&apos; <a className={styles.link} href="#">Terms</a> and <a className={styles.link} href="#">Privacy Policy</a>
          </p>
        </div>
        
        <p className={styles.footer}>
          Don&apos;t have an account? <a className={styles.primaryLink} href="#">Request access →</a>
        </p>
      </div>
    </div>
  );
}