'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import styles from './page.module.css';

export default function SearchPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <AppLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
        </div>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className={styles.header}>
        <h1>Buscar</h1>
        <p className={styles.subtitle}>Funcionalidade em desenvolvimento</p>
      </div>

      <Card title="Busca de Recursos">
        <Alert variant="info">
          Esta página contará com funcionalidade avançada de busca e filtros.
        </Alert>
        <p className={styles.text}>Volte em breve para atualizações!</p>
      </Card>
    </AppLayout>
  );
}