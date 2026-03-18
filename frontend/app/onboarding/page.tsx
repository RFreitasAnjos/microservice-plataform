'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import styles from './page.module.css';

export default function OnboardingPage() {
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
        <h1>Onboarding</h1>
        <p className={styles.subtitle}>Configure sua conta</p>
      </div>

      <div className={styles.grid}>
        <Card title="Bem-vindo!" subtitle="Guia de primeiros passos">
          <Alert variant="info">
            Clique nos cards abaixo para aprender a usar a plataforma.
          </Alert>
        </Card>

        <Card title="Perfil" subtitle="Configure seu perfil">
          <p className={styles.text}>Acesse seus dados e atualize suas informações.</p>
        </Card>

        <Card title="Dashboard" subtitle="Veja os dados do sistema">
          <p className={styles.text}>Monitore usuários e estatísticas em tempo real.</p>
        </Card>

        <Card title="Suporte" subtitle="Precisa de ajuda?">
          <p className={styles.text}>Entre em contato com o administrador do sistema.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
