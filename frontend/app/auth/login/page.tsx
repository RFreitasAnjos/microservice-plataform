'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/layouts/AuthLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const gatewayUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const baseUrl = gatewayUrl.replace('/api', '');
    window.location.replace(`${baseUrl}/auth/login`);
  }, [router]);

  return (
    <AuthLayout title="Redirecionando para login" subtitle="Conectando com o provedor de autenticação">
      <Card>
        <div className={styles.content}>
          {loading && !error ? (
            <>
              <div className={styles.spinner} />
              <p className={styles.text}>Preparando sua sessão segura...</p>
            </>
          ) : (
            <>
              <p className={styles.error}>{error}</p>
              <Button onClick={() => router.replace('/auth/login')} fullWidth>
                Tentar novamente
              </Button>
            </>
          )}
        </div>
      </Card>
    </AuthLayout>
  );
}