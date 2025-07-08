'use client';

import { useState } from 'react';
import { useEffect } from 'react';

type Work = {
  title: string;
  period: string;
  description: string;
  url: string;
  image: string;
};

export default function AdminPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [form, setForm] = useState({
    title: '',
    period: '',
    description: '',
    url: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch('/api/works');
        if (res.ok) {
          const data = await res.json();
          setWorks(data);
        }
      } catch (err) {
        console.error('取得に失敗しました', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

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

      <h2 className="text-2xl font-semibold mb-2">登録済み一覧</h2>
      {
        loading ? (
          <p>読み込み中...</p>
        ) : (
          <ul className="space-y-2">
            {works.map((work, index) => (
              <li key={index} className="border p-3 rounded">
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
                  <img
                    src={work.image}
                    alt={work.title}
                    className="mt-2 max-h-48 rounded border"
                  />
                )}
              </li>
            ))}
          </ul>
        )
      }
    </main>
  );
}