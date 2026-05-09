import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

const updateSettingsSchema = z.object({
  businessName: z.string().min(2).optional(),
  welcomeMessage: z.string().optional(),
  thankYouMessagePos: z.string().optional(),
  thankYouMessageNeg: z.string().optional(),
  googleReviewUrl: z.string().url().optional(),
  sendTimingHours: z.number().min(1).max(72).optional(),
  enableWhatsApp: z.boolean().optional(),
  enableEmail: z.boolean().optional(),
  tonality: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = verifyToken(req.headers.authorization?.replace('Bearer ', '') || '');
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    try {
      const settings = await prisma.companySettings.findUnique({
        where: { companyId: auth.companyId },
      });

      if (!settings) {
        return res.status(404).json({ error: 'Configurações não encontradas' });
      }

      res.json(settings);
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({ error: 'Erro ao buscar configurações' });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = updateSettingsSchema.parse(req.body);

      const settings = await prisma.companySettings.update({
        where: { companyId: auth.companyId },
        data,
      });

      res.json(settings);
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Erro ao atualizar configurações' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}