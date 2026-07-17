import Image from "next/image";

export default function PageHeaderBanner({
  title,
  image,
}: {
  title: string;
  image: string;
}) {
  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden sm:h-56">
      <Image
        src={image}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-brand-primary/60" />
      <h1 className="relative px-4 text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
        {title}
      </h1>
    </div>
  );
}
