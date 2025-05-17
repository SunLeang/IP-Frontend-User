import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface Category {
  id: string
  title: string
  img: string
}

interface CategorySectionProps {
  categories: Category[]
  isLoading?: boolean
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
              categories.map(({ id, title, img }) => (
                <Link
                  href={`/events?category=${id}`}
                  key={id}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-2 border-2 border-white shadow-md transition-transform group-hover:scale-105">
                    <Image
                      src={img.startsWith("http") ? img : `/assets/images/${img}`}
                      alt={`${title} category`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{title}</span>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
