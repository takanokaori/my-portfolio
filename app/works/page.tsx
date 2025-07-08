// src/app/works/page.tsx

import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function WorksPage() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: 'desc'},
  });

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">制作実績一覧</h1>

      <div className="space-y-6 grid grid-cols-1 gap-2">
        {works.map((work) => (
          <div
            key={work.id}
            className="flex flex-col md:flex-row-reverse bg-white shadow-[0px_3px_10px_0px_#c9c9c9] rounded-lg overflow-hidden"
          >
            {work.image && (
              <div className="w-[250px] h-[250px]">
                <Image
                  src={work.image}
                  alt={work.title}
                  width={250}
                  height={250}
                  className="w-full h-full object-contain max-w-[250px] max-h-[250px]"
                />
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">{work.title}</h2>
                {work.period && (
                  <p className="text-sm text-gray-500 mb-1">期間：{work.period}</p>
                )}
                <p className="text-gray-700 mb-2">{work.description}</p>
              </div>
              {work.url && (
                <Link
                  href={work.url}
                  className="text-blue-600 underline mt-2 self-start"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  サイトを見る
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}