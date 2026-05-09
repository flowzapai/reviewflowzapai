import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/db';

const submitSchema = z.object({
  companyId: z.string(),
  clientId: z.string(),
  note: z.number().min(0).max(5),
  comment: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { companyId, clientId, note, comment } = submitSchema.parse(req.body);

    const reviewRequest = await prisma.reviewRequest.updateMany({
      where: {
        clientId,
        companyId,
      },
      data: {
        note,
        status: 'RESPONDED',
        respondedAt: new Date(),
        redirectedToGoogle: note >= 4,
      },
    });

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: { settings: true },
    });

    res.status(200).json({
      success: true,
      redirectToGoogle: note >= 4,
      googleReviewUrl: company?.settings?.googleReviewUrl,
    });
  } catch (error) {
    console.error('Submit evaluation error:', error);
    res.status(500).json({ error: 'Erro ao enviar avaliação' });
  }
}