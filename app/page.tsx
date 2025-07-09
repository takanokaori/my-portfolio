// src/app/page.tsx - Front Page
// 'use client'

import Image from 'next/image';
import Link from 'next/link';
import { IconLayoutList, IconBrandGithub } from '@tabler/icons-react';

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-screen items-center justify-center">
      <div className='grid grid-cols-1 p-6'>
        {/* ヘッダー */}
        <header className='flex items-center justifi-center gap-5 mb-6'>
          <div className='w-[200px] y-[200px]'>
            <Image
              src="/mocchi.jpg"
              alt="代理：オカメインコのもっちー"
              width={200}
              height={200}
              className="min-w-[200px] min-h-[200px] object-cover rounded-full ring-2"
            />
          </div>
          <div className="max-w-xl">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">風間香織（Kaori Kazama）</h1>
            <p className="text-gray-700 text-sm md:text-base">
              このポートフォリオはNext.jsとTailwindCSSで制作しました
            </p>
          </div>
        </header>

        {/* 各ブロック */}
        {[
          { keyword: 'History', content: `2006年にIT業界へ。契約社員や派遣でコーディングのお仕事を経験しました。
            2013年に子育てで一旦お休みしましたが、翌年、元派遣先の制作会社から「うちにこない？」と声をかけていただいて復帰。
            ご縁に助けられて生きております。` },
          { keyword: 'Hobby', content: `・コードを書くのが好きです
            ・ゲーム（下手の横好き）
            ・オカメインコをモフること` },
          { keyword: 'Skills', content: `・WordPressの構築が一通りできます
            ・WebpackやViteを使ってフルスクラッチでサイトを作成するのが得意です
            ・SCSSファイルとViteのテンプレートを育てています
            ・高校卒業後は漫画の勉強をして、アシスタントをしながら糊口をしのいでいましたので漫画の手伝いができます` },
        ].map(({ keyword, content }, idx) => (
          <div
            key={idx}
            className="relative border-t p-6 z-auto"
          >
            <h2 className="absolute left-1 top-0 text-6xl text-[#efefef] font-bold select-none pointer-events-none z-0">
              {keyword}
            </h2>
            <p className="text-gray-800 whitespace-pre-line relative z-10 mt-4">{content}</p>
          </div>
        ))}

        {/* リンクナビゲーション */}
        <div className='border-t-1 mt-6 mb-6'>
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