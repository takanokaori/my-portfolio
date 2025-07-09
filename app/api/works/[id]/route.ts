// src/app/api/works/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const idStr = url.pathname.split('/').pop();
  const workId = Number(idStr);

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
