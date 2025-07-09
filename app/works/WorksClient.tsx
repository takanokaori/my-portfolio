// src/app/works/WorksClient.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { IconBoxMultiple } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';

type Work = {
  id: number;
  title: string;
  period?: string | null;
  description: string;
  url?: string | null;
  image?: string | null;
  createdAt: Date;
  order?: number;
};

export default function WorksClient({ initialWorks }: { initialWorks: Work[] }) {

  const [works, setWorks] = useState<Work[]>(initialWorks);
  const [offset, setOffset] = useState(initialWorks.length);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(`/api/works?offset=${offset}&limit=5`);
    const newWorks = await res.json();
    if (!Array.isArray(newWorks)) {
      console.error('取得結果が配列ではありません', newWorks);
      return;
    }
    // 人工的な遅延を追加（.5秒）
    await new Promise(resolve => setTimeout(resolve, 500));

    if (newWorks.length === 0) {
      setHasMore(false);
      return;
    }
    
    setWorks((prev) => [...prev, ...newWorks]);
    setOffset((prev) => prev + newWorks.length);
    setLoading(false);
  };

  // Intersection Observer
  useEffect(() => {
    const target = loaderRef.current;
    if (!target) return; // loaderRefがnullならで弾く

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: '100px' }
    );

    if (hasMore) observer.observe(target);
    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [works.length, hasMore, fetchMore]);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">制作実績一覧</h1>

      <div className="space-y-6 grid grid-cols-1 gap-2">
        {works.map((work) => (
          <div key={work.id} className="fade-in flex flex-col md:flex-row-reverse bg-white shadow rounded-lg overflow-hidden">
            {work.image && (
              <div className="flex align-bottom">
                <Image
                  src={work.image}
                  alt={work.title}
                  width={300}
                  height={150}
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                  className='min-w-[300px] object-cover object-top'
                  priority={false}
                />
              </div>
            )}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">{work.title}</h2>
                {work.period && <p className="text-sm text-gray-500 mb-1">期間：{work.period}</p>}
                <p className="text-gray-700 mb-2 whitespace-pre-line ">{work.description}</p>
                {work.url && (
                  <Link href={work.url} target="_blank" rel="noopener noreferrer" className="flex hover:underline mt-2 self-start text-sm">
                    <IconBoxMultiple className="w-4 h-5 mr-1" /> {work.url}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="text-center py-6 text-gray-500">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-ping h-4 w-4 bg-gray-400 rounded-full"></div>
            </div>
          ) : (
            <p>　</p>
          )}
        </div>
      )}
      {!hasMore && works.length > 0 && <div className="text-center py-6">　</div>}
    </main>
  );
}
