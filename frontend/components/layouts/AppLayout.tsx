'use client';

import React, { ReactNode } from 'react';
import Navbar from '../ui/Navbar';
import Footer from '../ui/Footer';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
