import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import styles from '@/styles/Clients.module.css';

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  reviewRequests: {
    id: string;
    status: string;
    note: number;
    sentAt: string;
  }[];
}

export default function ClientsPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchClients();
  }, [token]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });

      if (res.ok) {
        setShowModal(false);
        setNewClient({ name: '', phone: '', email: '' });
        fetchClients();
      }
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Pendente',
      SENT: 'Enviado',
      OPENED: 'Aberto',
      RESPONDED: 'Respondido',
      FAILED: 'Falhou',
    };
    return labels[status] || status;
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>Clientes - ReviewFlow</title>
      </Head>

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>ReviewFlow</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>📊 Dashboard</Link>
          <Link href="/dashboard/clients" className={styles.navItem + ' ' + styles.active}>👥 Clientes</Link>
          <Link href="/dashboard/requests" className={styles.navItem}>📤 Solicitações</Link>
          <Link href="/dashboard/reviews" className={styles.navItem}>⭐ Avaliações</Link>
          <Link href="/dashboard/settings" className={styles.navItem}>⚙️ Configurações</Link>
        </nav>
        <div className={styles.userInfo}>
          <p>{user?.name}</p>
          <button onClick={() => useAuthStore.getState().logout()} className={styles.logoutButton}>Sair</button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Clientes</h1>
          <button className={styles.addButton} onClick={() => setShowModal(true)}>
            + Novo Cliente
          </button>
        </header>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span>Nome</span>
              <span>Telefone</span>
              <span>E-mail</span>
              <span>Última Solicitação</span>
              <span>Status</span>
            </div>
            {clients.length === 0 ? (
              <div className={styles.empty}>
                <p>Nenhum cliente cadastrado</p>
                <button onClick={() => setShowModal(true)}>Adicionar primeiro cliente</button>
              </div>
            ) : (
              clients.map((client) => (
                <div key={client.id} className={styles.tableRow}>
                  <span className={styles.clientName}>{client.name}</span>
                  <span>{client.phone || '-'}</span>
                  <span>{client.email || '-'}</span>
                  <span>
                    {client.reviewRequests[0]?.sentAt
                      ? new Date(client.reviewRequests[0].sentAt).toLocaleDateString('pt-BR')
                      : '-'}
                  </span>
                  <span className={`${styles.status} ${styles[client.reviewRequests[0]?.status?.toLowerCase() || 'pending']}`}>
                    {getStatusLabel(client.reviewRequests[0]?.status || 'PENDING')}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Novo Cliente</h2>
            <form onSubmit={handleAddClient}>
              <div className={styles.formGroup}>
                <label>Nome</label>
                <input
                  type="text"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Telefone (WhatsApp)</label>
                <input
                  type="tel"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="5599999999999"
                />
              </div>
              <div className={styles.formGroup}>
                <label>E-mail</label>
                <input
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} className={styles.cancelButton}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitButton}>
                  Adicionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}