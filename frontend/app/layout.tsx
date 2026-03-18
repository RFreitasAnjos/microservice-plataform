import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './providers/AuthContext';
import { KeycloakProvider } from './providers/KeycloakProvider';

export const metadata: Metadata = {
  title: 'Microservices Platform',
  description: 'Platform de Microserviços',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <KeycloakProvider>{children}</KeycloakProvider>
        </AuthProvider>
      </body>
    </html>
  );
}