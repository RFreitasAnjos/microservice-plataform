'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Microservices Platform
          </Link>
        </div>

        {isAuthenticated && !loading && (
          <div className={styles.nav}>
            <Link href="/dashboard" className={styles.link}>
              Dashboard
            </Link>
            <Link href="/profile" className={styles.link}>
              Perfil
            </Link>
            <Link href="/search" className={styles.link}>
              Buscar
            </Link>
          </div>
        )}

        <div className={styles.actions}>
          {!isAuthenticated && !loading && (
            <Link href="/auth/login" className={styles.loginBtn}>
              Login
            </Link>
          )}

          {isAuthenticated && !loading && (
            <div className={styles.user}>
              <span className={styles.username}>{user?.username || 'Usuário'}</span>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}