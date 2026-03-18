'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function SettingsPage() {
  const { isAuthenticated, loading, user } = useAuth();
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
        <h1>Configurações</h1>
        <p className={styles.subtitle}>Gerencie suas preferências</p>
      </div>

      <div className={styles.grid}>
        <Card title="Perfil" subtitle="Informações pessoais">
          <div className={styles.section}>
            <label className={styles.label}>Usuário: {user?.username || '-'}</label>
            <Button variant="secondary" size="sm">
              Editar Perfil
            </Button>
          </div>
        </Card>

        <Card title="Segurança" subtitle="Gerenciamento de acesso">
          <Alert variant="info" title="HttpOnly Cookies">
            Sua autenticação é protegida por HttpOnly cookies. Tokens são inacessíveis a JavaScript.
          </Alert>
          <Button variant="secondary" size="sm" style={{ marginTop: '1rem' }}>
            Alterar Senha
          </Button>
        </Card>

        <Card title="Notificações" subtitle="Preferências de comunicação">
          <div className={styles.section}>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked />
              <span>Receber notificações por email</span>
            </label>
            <label className={styles.checkbox}>
              <input type="checkbox" defaultChecked />
              <span>Notificações de sistema</span>
            </label>
          </div>
        </Card>

        <Card title="Aparência" subtitle="Tema e layout">
          <div className={styles.section}>
            <label className={styles.radio}>
              <input type="radio" name="theme" value="light" defaultChecked />
              <span>Claro</span>
            </label>
            <label className={styles.radio}>
              <input type="radio" name="theme" value="dark" />
              <span>Escuro</span>
            </label>
          </div>
        </Card>
      </div>

      <Card title="Termos e Privacidade" subtitle="Políticas da plataforma">
        <p className={styles.text}>
          Ao usar nossa plataforma, você concorda com nossos termos de serviço e política de privacidade.
        </p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button variant="secondary" size="sm">
            Ver Termos
          </Button>
          <Button variant="secondary" size="sm">
            Ver Privacidade
          </Button>
        </div>
      </Card>
    </AppLayout>
  );
}
