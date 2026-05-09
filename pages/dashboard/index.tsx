import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import styles from '@/styles/Dashboard.module.css';

interface Stats {
  totalClients: number;
  totalRequests: number;
  sentRequests: number;
  respondedRequests: number;
  positiveReviews: number;
  negativeReviews: number;
  pendingRequests: number;
  avgRating: number;
  responseRate: number;
  conversionRate: number;
}

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats', {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.loginRequired}>
        <p>Faça login para acessar o dashboard</p>
        <Link href="/login">Entrar</Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>Dashboard - ReviewFlow</title>
      </Head>

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>ReviewFlow</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem + ' ' + styles.active}>
            📊 Dashboard
          </Link>
          <Link href="/dashboard/clients" className={styles.navItem}>
            👥 Clientes
          </Link>
          <Link href="/dashboard/requests" className={styles.navItem}>
            📤 Solicitações
          </Link>
          <Link href="/dashboard/reviews" className={styles.navItem}>
            ⭐ Avaliações
          </Link>
          <Link href="/dashboard/settings" className={styles.navItem}>
            ⚙️ Configurações
          </Link>
        </nav>
        <div className={styles.userInfo}>
          <p>{user.name}</p>
          <p className={styles.companyName}>{user.company.name}</p>
          <button onClick={logout} className={styles.logoutButton}>
            Sair
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Dashboard</h1>
          <span className={styles.planBadge}>{user.company.plan}</span>
        </header>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>👥</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.totalClients || 0}</span>
                  <span className={styles.statLabel}>Clientes</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📤</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.totalRequests || 0}</span>
                  <span className={styles.statLabel}>Solicitações</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>✅</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.positiveReviews || 0}</span>
                  <span className={styles.statLabel}>Positivas</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>⭐</div>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{stats?.avgRating || 0}</span>
                  <span className={styles.statLabel}>Nota Média</span>
                </div>
              </div>
            </div>

            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <h3>Taxa de Resposta</h3>
                <div className={styles.metricValue}>{stats?.responseRate || 0}%</div>
                <p>dos clientes responderam</p>
              </div>

              <div className={styles.metricCard}>
                <h3>Taxa de Conversão</h3>
                <div className={styles.metricValue}>{stats?.conversionRate || 0}%</div>
                <p>avaliações positivas geradas</p>
              </div>

              <div className={styles.metricCard}>
                <h3>Créditos Restantes</h3>
                <div className={styles.metricValue}>100</div>
                <p>envios disponíveis este mês</p>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h3>Ações Rápidas</h3>
              <div className={styles.actions}>
                <Link href="/dashboard/clients/new" className={styles.actionButton}>
                  + Adicionar Cliente
                </Link>
                <Link href="/dashboard/requests/new" className={styles.actionButton}>
                  📤 Enviar Solicitações
                </Link>
                <Link href="/dashboard/settings" className={styles.actionButton}>
                  ⚙️ Configurar Mensagens
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}