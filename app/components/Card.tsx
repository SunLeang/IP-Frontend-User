import Image from "next/image";

interface CardProps {
  title: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  interested: number;
}

const Card = ({ title, date, venue, time, category, interested }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative h-40 w-full">
        <Image 
          src="/assets/images/newyear.png" 
          alt="Event" 
          fill 
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          CELEBRATION
        </div>
        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
          ⭐
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span className="bg-yellow-400 text-white px-2 py-0.5 rounded">{category}</span>
          <span>{date}</span>
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <div className="text-xs text-gray-500">{time}</div>
        <p className="text-xs text-gray-500">{venue}</p>

        <div className="flex items-center justify-between text-xs pt-2">
          <span>USD $5</span>
          <span className="flex items-center gap-1">
            💙 {interested} interested
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
