// /components/EnvBanner.tsx
// VercelのPreview環境なら「これはPreview環境です」と表示する

export default function EnvBanner() {
  if (process.env.VERCEL_ENV !== 'preview') {
    return null;
  }

  return (
    <div className="w-full bg-sky-500/20 text-black text-center py-2 text-sm">
      これはPreview環境です
    </div>
  );
}