'use client';

import React, { ReactNode } from 'react';
import styles from './Alert.module.css';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  children: ReactNode;
  variant?: AlertVariant;
  title?: string;
  className?: string;
  onClose?: () => void;
}

export default function Alert({
  children,
  variant = 'info',
  title,
  className = '',
  onClose,
}: AlertProps) {
  return (
    <div className={`${styles.alert} ${styles[`variant__${variant}`]} ${className}`}>
      <div className={styles.content}>
        {title && <h4 className={styles.title}>{title}</h4>}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose && (
        <button className={styles.close} onClick={onClose} aria-label="Fechar alerta">
          ✕
        </button>
      )}
    </div>
  );
}
