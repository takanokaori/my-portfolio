// src/app/api/works/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const workId = Number(context.params.id);

  if (isNaN(workId)) {
    return NextResponse.json(
      { error: '無効なIDです' },
      { status: 400 }
    );
  }

  try{
    await prisma.work.delete({ where: { id: workId } });
    return NextResponse.json({ message: '削除成功' });
  } catch (error) {
    console.error('削除失敗:', error);
    return NextResponse.json(
      { error: 'サーバーエラーで削除できませんでした' },
      { status: 500 }
    );
  }
}
