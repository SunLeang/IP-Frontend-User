import CardList from "@/app/components/CardList";
import Filters from "@/app/components/Filters";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-gray-900">
      {/* Big Image Top Banner */}
      <section
        className="relative bg-cover bg-center h-[400px]"
        style={{ backgroundImage: "url('/assets/images/banner.png')" }}
      >
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-white"> Dont miss out!</h1>
          <h2 className="text-2xl text-white mt-2">
            Explore the <span className="text-yellow-400">vibrant events</span>{" "}
            happening right now.
          </h2>
          <div className="mt-6 w-full max-w-xl">
            <input
              type="text"
              placeholder="Search Events, Categories, Location..."
              className="w-full px-4 py-2 rounded-md focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <Filters />
      </section>

      <div className="min-h-screen bg-[#f7f9fc] px-6 py-10">
        <CardList />
      </div>
    </div>
  );
}
