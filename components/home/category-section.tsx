import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface Category {
  id: string;
  title: string;
  img: string;
}

interface CategorySectionProps {
  categories: Category[];
  isLoading?: boolean;
}

function CategoryImage({ src, title }: { src: string; title: string }) {
  const [imgSrc, setImgSrc] = useState(() => {
    // Handle empty or invalid src
    if (!src || src.trim() === "") {
      return "/assets/constants/billboard.png";
    }
    
    // Handle relative paths - Next.js requires leading slash
    if (!src.startsWith("/") && !src.startsWith("http") && !src.startsWith("data:")) {
      console.log(`Fixing category image path: ${src} -> /${src}`);
      return `/${src}`;
    }
    
    return src;
  });
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      console.warn(`Category image failed to load: ${imgSrc}`);
      setImgSrc("/assets/constants/billboard.png");
      setHasError(true);
    }
  };

  console.log(`CategoryImage for "${title}" using src:`, imgSrc);

  return (
    <Image
      src={imgSrc}
      alt={`${title} category`}
      width={96}
      height={96}
      className="w-full h-full object-cover"
      onError={handleError}
    />
  );
}

export function CategorySection({ categories, isLoading = false }: CategorySectionProps) {
  return (
    <section className="py-12 px-6 text-center bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8">Explore Popular Events Categories</h2>
        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {isLoading
            ? // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full mb-2" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            : // Actual categories
              categories.map(({ id, title, img }) => {
                console.log(`Category "${title}" raw image:`, img);
                return (
                  <Link
                    href={`/events?category=${id}`}
                    key={id}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 border-2 border-white shadow-md transition-transform group-hover:scale-105">
                      <CategoryImage src={img} title={title} />
                    </div>
                    <span className="font-medium">{title}</span>
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
}