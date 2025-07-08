// src/app/api/works/route.ts

import { writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {

  try {

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const period = formData.get('period') as string;
    const description = formData.get('description') as string;
    const url = formData.get('url') as string;
    const imageFile = formData.get('image') as File | null;

    // 必須チェック
    if (!title || !description) {
      return NextResponse.json({ error: 'タイトルと説明は必須です' }, { status: 400 });
    }

    let imageUrl = null;
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${fileName}`;
    }

    const newWork = await prisma.work.create({
      data: {
        title,
        period,
        description,
        url,
        image: imageUrl,
      },
    });

    return NextResponse.json(newWork, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }

}

export async function GET() {
  const works = await prisma.work.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(works);
}
