'use client';

import { useEffect } from 'react';
import AuthLayout from '@/components/layouts/AuthLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AuthLayout title="Erro" subtitle="Algo deu errado">
      <Card>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '1rem' }}>
            Desculpe, encontramos um erro ao processar sua requisição.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            {error.message || 'Erro desconhecido'}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button onClick={() => reset()}>
              Tentar Novamente
            </Button>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Button variant="secondary">
                Voltar para Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </AuthLayout>
  );
}
