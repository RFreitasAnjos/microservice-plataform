'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import styles from './page.module.css';
import { getApi } from '@/app/services/api';

interface MeResponse {
  userId: string;
  username: string;
  authenticated: boolean;
}

export default function ProfilePage() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchMe();
    }
  }, [isAuthenticated, loading]);

  const fetchMe = async () => {
    setFetchLoading(true);
    setError('');
    try {
      const api = getApi();
      const response = await api.get('/auth/me');
      setMe(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar dados do usuário:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

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
        <div className={styles.headerContent}>
          <div>
            <h1>Perfil do Usuário</h1>
            <p className={styles.userId}>ID: {me?.userId || user?.userId || '-'}</p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Card title="Dados da Sessão" subtitle="Informações do seu perfil autenticado">
        <div className={styles.sessionInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>ID do Usuário:</span>
            <span className={styles.value}>{me?.userId || user?.userId || '-'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Nome de Usuário:</span>
            <span className={styles.value}>{me?.username || user?.username || '-'}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Status:</span>
            <span className={styles.status}>✓ Autenticado</span>
          </div>
        </div>
      </Card>

      <Card title="Acesso às rotas privadas" subtitle="Navegue para as áreas protegidas pelo JWT HttpOnly">
        <div className={styles.privateLinks}>
          <Button onClick={() => router.push('/dashboard')}>Dashboard</Button>
          <Button variant="secondary" onClick={() => router.push('/settings')}>Configurações</Button>
          <Button variant="secondary" onClick={() => router.push('/search')}>Buscar</Button>
          <Button variant="secondary" onClick={() => router.push('/onboarding')}>Onboarding</Button>
        </div>
      </Card>

      <Card title="Status da rota privada" subtitle="Validação no backend via /auth/me">
        {error && (
          <Alert variant="error" title="Erro ao carregar" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {fetchLoading ? (
          <div className={styles.loadingText}>Carregando dados do usuário...</div>
        ) : me ? (
          <div className={styles.emptyState}>
            <p>Autenticação confirmada no backend para {me.username}.</p>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Não foi possível obter os dados do usuário autenticado.</p>
          </div>
        )}
      </Card>

      <Card title="Informações de Segurança">
        <ul className={styles.securityList}>
          <li>Tokens em HttpOnly cookies</li>
          <li>Proteção contra XSS</li>
          <li>Proteção contra CSRF</li>
          <li>Renovação automática de tokens</li>
        </ul>
      </Card>
    </AppLayout>
  );
}