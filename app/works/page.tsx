// src/app/works/page.tsx

import { prisma } from '@/lib/prisma';
import WorksClient from './WorksClient';

export default async function WorksPage() {
  const initialWorks = await prisma.work.findMany({
    orderBy: { order: 'asc' },
    take: 10,
  });

  return <WorksClient initialWorks={initialWorks} />;
}
