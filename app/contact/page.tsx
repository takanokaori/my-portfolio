// src/app/contact/page.tsx
export default function ContactPage() {
  return (
    <main className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">お問い合わせ</h1>
      <form className="space-y-4">
        <div>
          <label className="block font-medium mb-1">お名前</label>
          <input type="text" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">メールアドレス</label>
          <input type="email" className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">メッセージ</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4}></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          送信
        </button>
      </form>
    </main>
  );
}