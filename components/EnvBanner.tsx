// /components/EnvBanner.tsx
// 環境表示バッジ

export default function EnvBanner() {
  const env = process.env.NEXT_PUBLIC_VERCEL_ENV;
  if (!env) {
    return (
      <div className="w-full bg-green-500/20 text-black text-center py-2 text-sm">
        これはLocal環境です
      </div>
    );
  }

  if (env !== 'preview') {
    // return null;
    return (
      <div className="w-full text-[0] invisible">
        {env} 
      </div>
    );
  }

  return (
    <div className="w-full bg-sky-500/20 text-black text-center py-2 text-sm">
      これはPreview環境です
    </div>
  );
}
