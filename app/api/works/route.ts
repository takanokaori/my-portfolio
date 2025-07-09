// src/app/api/works/route.ts

import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {

  try {
    const { searchParams } = new URL(req.url);
    const offsetStr = searchParams.get('offset');
    const limitStr = searchParams.get('limit');

    const offset = offsetStr !== null ? Number(offsetStr) : undefined;
    const limit = limitStr !== null ? Number(limitStr) : undefined;

    if (
      (offset !== undefined && isNaN(offset)) ||
      (limit !== undefined && isNaN(limit))
    ) {
      return NextResponse.json({ error: 'Invalid offset or limit' }, { status: 400 });
    }

    /*
    const works = await prisma.work.findMany({
      ...(offset !== undefined ? { skip: offset } : {}),
      ...(limit !== undefined ? { take: limit } : {}),
      orderBy: { order: 'asc' },
    });
    */

    let works;
    if (offset !== undefined && limit !== undefined) {
      works = await prisma.work.findMany({
        skip: offset,
        take: limit,
        orderBy: { order: 'asc' },
      });
    } else {
      works = await prisma.work.findMany({
        orderBy: { order: 'asc' },
      });
    }
  
    return NextResponse.json(works);
  } catch (err) {
    console.error('API /api/works error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

}
