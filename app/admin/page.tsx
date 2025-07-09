// src/app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

type Work = {
  id: number;
  title: string;
  period: string;
  description: string;
  url: string;
  image: string;
  order: number;
};

function SortableItem({ work }: { work: Work }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: work.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-3 rounded bg-white cursor-move"
    >
      <p className="font-bold">{work.title}</p>
      {work.period && <p className="text-sm text-gray-500">期間：{work.period}</p>}
      <p className="text-gray-700">{work.description}</p>
      {work.url && (
        <a
          href={work.url}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
        {work.url}
        </a>
      )}
      {work.image && (
        <Image
          src={work.image}
          alt={work.title}
          width={250}
          height={250}
          className="w-auto h-auto object-contain"
          priority={false}
          />
      )}
      <div className='text-right'>
        <button
          onClick={ async () => {
            if (confirm('本当に削除しますか？')) {
              const res = await fetch(`/api/works/${work.id}`, { method: 'DELETE' });
              if (res.ok) {
                setWorks((prev) => prev.filter((w) => w.id !== work.id));
              } else {
                const result = await res.json();
                alert('削除に失敗しました: ' + result.error);
              }
            }
          }}
          className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
        >
          削除
        </button>
      </div>
    </li>
  );
}

export default function AdminPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchWorks = async () => {
      // const res = await fetch('/api/works');
      // const data = await res.json();
      // setWorks(data.sort((a: Work, b:Work) => a.order - b.order));
      try {
        const res = await fetch('/api/works');
        const data = await res.json();
        //setWorks(data);
        setWorks(data.sort((a: Work, b:Work) => a.order - b.order));
      } catch (err) {
        console.error('取得に失敗しました', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  const handleDragEnd = async (event:any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = works.findIndex((w) => w.id === active.id);
    const newIndex = works.findIndex((w) => w.id === over.id);
    const newList = arrayMove(works, oldIndex, newIndex);
    setWorks(newList);

    const reordered = newList.map((work, index) => ({
      id: work.id,
      order: index,
    }));

    await fetch('/api/works/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reordered),
    });
  };

  const [form, setForm] = useState<{
    title: string;
    period: string;
    description: string;
    url: string;
    imageFile: File | null;
  }>({
    title: '',
    period: '',
    description: '',
    url: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('period', form.period);
      formData.append('description', form.description);
      formData.append('url', form.url);
      if (form.imageFile) {
        formData.append('image', form.imageFile);
      }

      const res = await fetch('/api/works', {
        method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify(form),
        body: formData,
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(`登録に失敗しました: ${error}`);
        return;
      }

      const newWork = await res.json();
      setForm({
        title: '',
        period: '',
        description: '',
        url: '',
        imageFile: null,
      });
      setWorks([...works, newWork]);
    } catch (err) {
      console.error(err);
      alert('送信中にエラーが発生しました');
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">制作物の登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <input
          type="text"
          name="title"
          placeholder="タイトル *"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="period"
          placeholder="期間（例：2024年1月〜3月）"
          value={form.period}
          onChange={handleChange}
          className="w-full border px-3 p-2"
        />
        <textarea
          name="description"
          placeholder="説明 *"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="url"
          name="url"
          placeholder="URL（https://〜）"
          value={form.url}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">アップロードする画像</label>
        <input
          className="w-full border rounded px-3 py-2"
          id="file_input"
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setForm({ ...form, imageFile: e.target.files[0] });
            }
          }}
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          登録する
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-2">登録済み一覧（ドラッグで並び替え）</h2>
      {
        loading ? (
          <p>読み込み中...</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext items={works.map((w) => w.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {works.map((work) => (
                  <SortableItem key={work.id} work={work} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        )
      }
    </main>
  );
}
