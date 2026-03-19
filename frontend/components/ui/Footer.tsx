'use client';

import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.section}>
            <h4 className={styles.heading}>Sobre</h4>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.link}>
                  Documentação
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  API
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Status
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h4 className={styles.heading}>Segurança</h4>
            <ul className={styles.list}>
              <li>
                <a href="#" className={styles.link}>
                  Privacidade
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Termos de Serviço
                </a>
              </li>
              <li>
                <a href="#" className={styles.link}>
                  Segurança
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} Microservices Platform. Todos os direitos reservados.
          </p>
          <p className={styles.version}>v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}