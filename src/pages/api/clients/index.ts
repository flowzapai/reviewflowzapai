import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const createClientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

const sendRequestSchema = z.object({
  clientId: z.string(),
  channel: z.enum(['WHATSAPP', 'EMAIL']).default('WHATSAPP'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = verifyToken(req.headers.authorization?.replace('Bearer ', '') || '');
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'POST') {
    try {
      const { name, phone, email } = createClientSchema.parse(req.body);

      const client = await prisma.client.create({
        data: {
          companyId: auth.companyId,
          name,
          phone,
          email,
        },
      });

      res.status(201).json(client);
    } catch (error) {
      console.error('Create client error:', error);
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  } else if (req.method === 'GET') {
    try {
      const clients = await prisma.client.findMany({
        where: { companyId: auth.companyId },
        include: {
          reviewRequests: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json(clients);
    } catch (error) {
      console.error('Get clients error:', error);
      res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}