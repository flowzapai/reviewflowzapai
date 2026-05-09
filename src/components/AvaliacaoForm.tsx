import { useState } from 'react';
import Head from 'next/head';
import styles from '@/styles/Avaliacao.module.css';

interface Props {
  companyId: string;
  clientId: string;
  businessName: string;
  googleReviewUrl?: string;
}

export default function AvaliacaoForm({ companyId, clientId, businessName, googleReviewUrl }: Props) {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setLoading(true);
    
    try {
      await fetch('/api/avaliacao/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          clientId,
          note: rating,
        }),
      });
      
      setStep(2);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToGoogle = () => {
    if (googleReviewUrl) {
      window.open(googleReviewUrl, '_blank');
    }
  };

  if (step === 2) {
    return (
      <div className={styles.container}>
        <Head>
          <title>Avaliação - {businessName}</title>
        </Head>
        
        <div className={styles.card}>
          {rating >= 4 ? (
            <>
              <div className={styles.successIcon}>⭐</div>
              <h1>Obrigado!</h1>
              <p>Sua avaliação positiva nos ajuda a crescer!</p>
              <button 
                className={styles.googleButton}
                onClick={handleRedirectToGoogle}
              >
                Avaliar no Google
              </button>
              <button 
                className={styles.skipButton}
                onClick={() => setStep(3)}
              >
                Agora não, obrigado
              </button>
            </>
          ) : (
            <>
              <div className={styles.thankYouIcon}>🙏</div>
              <h1>Agradecemos!</h1>
              <p>Seu feedback é muito importante para nós melhorarmos nosso serviço.</p>
              <p className={styles.contactNote}>Em breve entraremos em contato!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Obrigado!</h1>
          <p>Agradecemos seu tempo e feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Avaliação - {businessName}</title>
      </Head>
      
      <div className={styles.card}>
        <h1>Como foi sua experiência?</h1>
        <p className={styles.subtitle}>Sua opinião é muito importante para nós</p>
        
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`${styles.starButton} ${rating >= star ? styles.active : ''}`}
              onClick={() => setRating(star)}
            >
              ⭐
            </button>
          ))}
        </div>
        
        <button 
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={rating === 0 || loading}
        >
          {loading ? 'Enviando...' : 'Continuar'}
        </button>
      </div>
    </div>
  );
}