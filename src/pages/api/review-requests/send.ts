import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

const sendRequestSchema = z.object({
  clientId: z.string(),
  channel: z.enum(['WHATSAPP', 'EMAIL']).default('WHATSAPP'),
  customMessage: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = verifyToken(req.headers.authorization?.replace('Bearer ', '') || '');
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientId, channel, customMessage } = sendRequestSchema.parse(req.body);

    const client = await prisma.client.findFirst({
      where: { id: clientId, companyId: auth.companyId },
      include: { company: { include: { settings: true } } },
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const settings = client.company.settings;
    if (!settings) {
      return res.status(400).json({ error: 'Configure sua empresa primeiro' });
    }

    const message = customMessage || settings.welcomeMessage
      .replace('{nome}', client.name)
      .replace('{empresa}', settings.businessName);

    const reviewLink = `${process.env.NEXTAUTH_URL}/avaliacao/${client.companyId}?clientId=${clientId}`;

    const fullMessage = `${message}\n\nAvalie-nos aqui: ${reviewLink}`;

    let sent = false;
    if (channel === 'WHATSAPP' && client.phone) {
      const phoneNumber = client.phone.replace(/\D/g, '');
      sent = await sendWhatsAppMessage({
        number: phoneNumber,
        text: fullMessage,
      });
    }

    const reviewRequest = await prisma.reviewRequest.create({
      data: {
        companyId: auth.companyId,
        clientId,
        channel,
        status: sent ? 'SENT' : 'PENDING',
        message: fullMessage,
        sentAt: sent ? new Date() : null,
      },
    });

    res.status(201).json({
      request: reviewRequest,
      sent,
    });
  } catch (error) {
    console.error('Send request error:', error);
    res.status(500).json({ error: 'Erro ao enviar solicitação' });
  }
}