// src/app/api/works/reorder/route.ts

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const updates = await req.json(); // [{ id: 3, order: 0 }, { id: 2, order: 1 }, ... ]

  try {
    const updatePromises = updates.map((item: { id: number; order: number }) =>
      prisma.work.update({
        where: { id: item.id },
        data: { order: item.order },
      })
    );
    await Promise.all(updatePromises);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: '並び替えの保存に失敗しました' }, { status: 500 });
  }
};
