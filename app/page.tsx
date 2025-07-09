// src/app/page.tsx - Front Page
// 'use client'

import Image from 'next/image';
import Link from 'next/link';
import { IconLayoutList, IconBrandGithub } from '@tabler/icons-react';

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className='grid grid-cols-1'>
        <div className='flex items-center justifi-center gap-5'>
          <div className='w-[200px] y-[200px]'>
            <Image
              src="/mocchi.jpg"
              alt="代理：オカメインコのもっちー"
              width={200}
              height={200}
              className="w-[200px] h-[200px] object-cover rounded-full ring-2"
            />
          </div>
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold mb-4">風間香織（Kaori Kazama）</h1>
            <p className="text-lg text-gray-700">
              このポートフォリオはNext.jsとTailwindCSSで制作しました。
            </p>
          </div>
        </div>
        <div className='border-t-1 mt-6'>
          <p className='p-4 pl-0'>asdf</p>
        </div>
        <div className='border-t-1 mt-6'>
          <div className='flex justify-center gap-6 text-base p-2'>
            <Link
              href="/works"
              className="flex items-center hover:underline p-2"
            >
              <IconLayoutList className="w-5 h-5 mr-1" /> 制作実績一覧
            </Link>
            <Link
              href="https://github.com/takanokaori"
              className="flex items-center hover:underline p-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconBrandGithub className="w-5 h-5 mr-1" /> GitHub
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}