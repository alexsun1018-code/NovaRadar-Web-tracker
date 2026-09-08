import Image from "next/image";

export default function PageHeaderBanner({
  title,
  image,
  imagePosition = "center",
}: {
  title: string;
  image: string;
  /** 圖片焦點位置（CSS object-position），人像照片可傳 "center 15%" 之類的值讓臉部不被短版橫幅裁掉 */
  imagePosition?: string;
}) {
  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden sm:h-56">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-brand-primary/60" />
      {/* 2026-09-08 依客戶指示移除橫幅圖片上疊加的標題文字（About／Team／News／Contact 等頁一致套用），
          標題文字改為視覺隱藏（sr-only）保留給螢幕閱讀器與 SEO 用，頁面標題改由內文區塊的 h2/markdown 標題呈現 */}
      <h1 className="sr-only">{title}</h1>
    </div>
  );
}
