import Card from "./Card";

const events = Array.from({ length: 12 }, (_, idx) => ({
  title: "Event title that can go up to two lines",
  date: "NOV 22",
  time: "00:00AM - 00:00PM",
  venue: "Venue",
  category: "Technology & Innovation",
  interested: 50 + idx,
}));

const CardList = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.map((event, index) => (
        <Card
          key={index}
          title={event.title}
          date={event.date}
          time={event.time}
          venue={event.venue}
          category={event.category}
          interested={event.interested}
        />
      ))}
    </div>
  );
};

export default CardList;
