'use client';

import Link from 'next/link';
import AppLayout from '@/components/layouts/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import styles from './page.module.css';

export default function Home() {
  return (
    <AppLayout>
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.badge}>Login centralizado com Keycloak</span>
          <h1 className={styles.headline}>
            Segurança, acesso e operação reunidos em uma única experiência.
          </h1>
          <p className={styles.description}>
            Esta é a porta de entrada da plataforma. Aqui você encontra uma visão rápida do ambiente,
            dos controles de segurança e do caminho para acessar os serviços protegidos.
          </p>

          <div className={styles.actions}>
            <Link href="/auth/login" className={styles.primaryAction}>
              <Button size="lg">Entrar com Keycloak</Button>
            </Link>
            <a href="#recursos" className={styles.secondaryAction}>
              Ver recursos
            </a>
          </div>
        </div>

        <Card className={styles.heroCard} title="Resumo do ambiente" subtitle="O que esta plataforma entrega">
          <ul className={styles.heroList}>
            <li>Autenticação via OAuth2 com Keycloak</li>
            <li>Token protegido em HttpOnly cookie no backend</li>
            <li>Frontend desacoplado dos serviços internos</li>
            <li>Fluxo pronto para dashboard, perfil e buscas</li>
          </ul>
        </Card>
      </div>

      <section id="recursos" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>O que você encontra aqui</h2>
          <p>Um ponto de entrada simples para usuários e uma base sólida para evoluir o produto.</p>
        </div>

        <div className={styles.grid}>
          <Card title="Acesso seguro" subtitle="Login centralizado">
            <p className={styles.cardText}>
              O botão de login leva diretamente ao fluxo do Keycloak, mantendo a autenticação fora do JavaScript da aplicação.
            </p>
          </Card>

          <Card title="Sessão protegida" subtitle="HttpOnly cookies">
            <p className={styles.cardText}>
              A sessão é validada pelo backend, com cookies acessíveis apenas pelo navegador e não pelo frontend.
            </p>
          </Card>

          <Card title="Navegação pronta" subtitle="Área autenticada">
            <p className={styles.cardText}>
              Após autenticação, o usuário segue para perfil, dashboard e demais áreas já preparadas.
            </p>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Fluxo de uso</h2>
        </div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <p>Abra a home pública e conheça a plataforma.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <p>Clique em Entrar na navegação para ir ao Keycloak.</p>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <p>Depois do login, a sessão é persistida no backend e você segue para a área autenticada.</p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}