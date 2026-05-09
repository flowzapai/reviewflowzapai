import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import styles from '@/styles/Settings.module.css';

interface Settings {
  businessName: string;
  welcomeMessage: string;
  thankYouMessagePos: string;
  thankYouMessageNeg: string;
  googleReviewUrl: string;
  sendTimingHours: number;
  enableWhatsApp: boolean;
  enableEmail: boolean;
  tonality: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!token) return null;

  return (
    <div className={styles.layout}>
      <Head>
        <title>Configurações - ReviewFlow</title>
      </Head>

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>ReviewFlow</h2>
        </div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={styles.navItem}>📊 Dashboard</Link>
          <Link href="/dashboard/clients" className={styles.navItem}>👥 Clientes</Link>
          <Link href="/dashboard/requests" className={styles.navItem}>📤 Solicitações</Link>
          <Link href="/dashboard/reviews" className={styles.navItem}>⭐ Avaliações</Link>
          <Link href="/dashboard/settings" className={styles.navItem + ' ' + styles.active}>⚙️ Configurações</Link>
        </nav>
        <div className={styles.userInfo}>
          <p>{user?.name}</p>
          <button onClick={() => useAuthStore.getState().logout()} className={styles.logoutButton}>Sair</button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <h1>Configurações</h1>
        </header>

        {loading ? (
          <div className={styles.loading}>Carregando...</div>
        ) : settings && (
          <form onSubmit={handleSave} className={styles.form}>
            <section className={styles.section}>
              <h2>Informações da Empresa</h2>
              
              <div className={styles.formGroup}>
                <label>Nome da Empresa</label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Link do Google Meu Negócio</label>
                <input
                  type="url"
                  value={settings.googleReviewUrl}
                  onChange={(e) => setSettings({ ...settings, googleReviewUrl: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
                <span className={styles.hint}>Cole o link da sua página no Google Maps</span>
              </div>
            </section>

            <section className={styles.section}>
              <h2>Mensagens</h2>
              
              <div className={styles.formGroup}>
                <label>Mensagem de Convite</label>
                <textarea
                  value={settings.welcomeMessage}
                  onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  rows={3}
                />
                <span className={styles.hint}>Variáveis: {'{nome}'}, {'{empresa}'}</span>
              </div>

              <div className={styles.formGroup}>
                <label>Mensagem de Agradecimento (Positiva)</label>
                <textarea
                  value={settings.thankYouMessagePos}
                  onChange={(e) => setSettings({ ...settings, thankYouMessagePos: e.target.value })}
                  rows={2}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mensagem de Agradecimento (Negativa)</label>
                <textarea
                  value={settings.thankYouMessageNeg}
                  onChange={(e) => setSettings({ ...settings, thankYouMessageNeg: e.target.value })}
                  rows={2}
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2>Automação</h2>
              
              <div className={styles.formGroup}>
                <label>Horário de Envio (horas após)</label>
                <input
                  type="number"
                  value={settings.sendTimingHours}
                  onChange={(e) => setSettings({ ...settings, sendTimingHours: parseInt(e.target.value) })}
                  min={1}
                  max={72}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Tom da Mensagem</label>
                <select
                  value={settings.tonality}
                  onChange={(e) => setSettings({ ...settings, tonality: e.target.value })}
                >
                  <option value="amigavel">Amigável</option>
                  <option value="formal">Formal</option>
                  <option value="pro">Profissional</option>
                </select>
              </div>

              <div className={styles.checkboxGroup}>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.enableWhatsApp}
                    onChange={(e) => setSettings({ ...settings, enableWhatsApp: e.target.checked })}
                  />
                  <span>Habilitar WhatsApp</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={settings.enableEmail}
                    onChange={(e) => setSettings({ ...settings, enableEmail: e.target.checked })}
                  />
                  <span>Habilitar E-mail</span>
                </label>
              </div>
            </section>

            <div className={styles.actions}>
              <button type="submit" className={styles.saveButton} disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
              {saved && <span className={styles.savedMessage}>✓ Configurações salvas!</span>}
            </div>
          </form>
        )}
      </main>
    </div>
  );
}