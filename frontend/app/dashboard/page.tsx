'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import styles from './page.module.css';
import { getApi } from '@/app/services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (isAuthenticated && !loading) {
      fetchUsers();
    }
  }, [isAuthenticated, loading]);

  const fetchUsers = async () => {
    setFetchLoading(true);
    setError('');
    try {
      const api = getApi();
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setFetchLoading(false);
    }
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
        <h1>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral do sistema e gerenciamento de usuários</p>
      </div>

      {/* Cards de estatísticas */}
      <div className={styles.statsGrid}>
        <Card title="Total de Usuários" subtitle={`${users.length} usuários cadastrados`}>
          <div className={styles.statValue}>{users.length}</div>
        </Card>
        <Card title="Status do Sistema" subtitle="Todos os serviços operacionais">
          <div className={styles.statusBadge}>✓ Online</div>
        </Card>
        <Card title="Usuário Atual" subtitle={user?.username || 'Carregando...'}>
          <div className={styles.userInfo}>{user?.userId || '-'}</div>
        </Card>
      </div>

      {/* Lista de usuários */}
      <Card title="Usuários Cadastrados" subtitle="Lista completa de usuários do sistema">
        {error && (
          <Alert variant="error" title="Erro ao carregar" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {fetchLoading ? (
          <div className={styles.loadingText}>Carregando usuários...</div>
        ) : users.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td>{userItem.id}</td>
                    <td>{userItem.name}</td>
                    <td>{userItem.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Nenhum usuário encontrado.</p>
          </div>
        )}
      </Card>
    </AppLayout>
  );
}