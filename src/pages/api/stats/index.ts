import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = verifyToken(req.headers.authorization?.replace('Bearer ', '') || '');
  if (!auth) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const [    
      totalClients,
      totalRequests,
      sentRequests,
      respondedRequests,
      positiveReviews,
      negativeReviews,
      pendingRequests,
    ] = await Promise.all([
      prisma.client.count({ where: { companyId: auth.companyId } }),
      prisma.reviewRequest.count({ where: { companyId: auth.companyId } }),
      prisma.reviewRequest.count({ where: { companyId: auth.companyId, status: 'SENT' } }),
      prisma.reviewRequest.count({ where: { companyId: auth.companyId, status: 'RESPONDED' } }),
      prisma.reviewRequest.count({ where: { companyId: auth.companyId, note: { gte: 4 } } }),
      prisma.reviewRequest.count({ where: { companyId: auth.companyId, note: { gte: 0, lte: 3 } } }),
      prisma.reviewRequest.count({ where: { companyId: auth.companyId, status: 'PENDING' } }),
    ]);

    const reviews = await prisma.review.findMany({
      where: { companyId: auth.companyId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const responseRate = totalRequests > 0
      ? Math.round((respondedRequests / totalRequests) * 100)
      : 0;

    const conversionRate = totalRequests > 0
      ? Math.round((positiveReviews / totalRequests) * 100)
      : 0;

    res.json({
      totalClients,
      totalRequests,
      sentRequests,
      respondedRequests,
      positiveReviews,
      negativeReviews,
      pendingRequests,
      avgRating: Math.round(avgRating * 10) / 10,
      responseRate,
      conversionRate,
      recentReviews: reviews,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
}