import { GetServerSideProps } from 'next';
import Head from 'next/head';
import prisma from '@/lib/db';
import AvaliacaoForm from '@/components/AvaliacaoForm';

interface Props {
  companyId: string;
  clientId: string;
  businessName: string;
  googleReviewUrl?: string;
}

export default function AvaliacaoPage({ companyId, clientId, businessName, googleReviewUrl }: Props) {
  return (
    <>
      <Head>
        <title>Avaliação - {businessName}</title>
        <meta name="description" content={`Avalie ${businessName}`} />
      </Head>
      <AvaliacaoForm
        companyId={companyId}
        clientId={clientId}
        businessName={businessName}
        googleReviewUrl={googleReviewUrl}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const companyId = params?.companyId as string;
  const clientId = params?.clientId as string;

  if (!companyId || !clientId) {
    return { notFound: true };
  }

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { settings: true },
  });

  if (!company) {
    return { notFound: true };
  }

  return {
    props: {
      companyId,
      clientId,
      businessName: company.settings?.businessName || company.name,
      googleReviewUrl: company.settings?.googleReviewUrl || null,
    },
  };
};