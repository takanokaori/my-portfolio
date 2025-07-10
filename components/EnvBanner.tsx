// /components/EnvBanner.tsx
// 環境表示バッジ

export default function EnvBanner() {
  if (!process.env.VERCEL_ENV) {
    return (
      <div className="w-full bg-green-500/20 text-black text-center py-2 text-sm">
        これはLocal環境です
      </div>
    );
  }

  if (process.env.VERCEL_ENV !== 'preview') {
    const envTxt = String(process.env.VERCEL_ENV);
    // return null;
    return (
      <div className="w-full text-[0] invisible">
        これはPreview以外の環境です
      </div>
    );
  }

  return (
    <div className="w-full bg-sky-500/20 text-black text-center py-2 text-sm">
      これはPreview環境です
    </div>
  );
}