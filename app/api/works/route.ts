// src/app/api/works/route.ts

import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);
    const offsetStr = searchParams.get('offset');
    const limitStr = searchParams.get('limit');

    const offset = offsetStr ? parseInt(offsetStr, 10) : undefined;
    const limit = limitStr ? parseInt(limitStr, 10) : undefined;

    if (
      (offsetStr && (typeof offset !== 'number' || isNaN(offset))) ||
      (limitStr && (typeof limit !== 'number' || isNaN(limit)))
    ) {
      return NextResponse.json({ error: 'Invalid offset or limit' }, { status: 400 });
    }

    const works = await prisma.work.findMany({
      ...(typeof offset === 'number' ? { skip: offset } : {}),
      ...(typeof limit === 'number' ? { take: limit } : {}),
      orderBy: { order: 'asc' },
    });

    /*
    const { searchParams } = new URL(req.url);
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');
    let works;
    if (offset !== null && limit !== null) { // limitあり取得
      works = await prisma.work.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        orderBy: { order: 'asc' }
      });
    } else { // 全件取得
      works = await prisma.work.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }
    */
  
    return NextResponse.json(works);
  } catch (err) {
    console.error('API /api/works error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

}
