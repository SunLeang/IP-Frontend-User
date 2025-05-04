"use client"
import { HeroSection } from "@/components/home/hero-section"
import { CategorySection } from "@/components/home/category-section"
import { EventsSection } from "@/components/home/events-section"

const categories = [
  { title: "Seminar", img: "seminar.png" },
  { title: "Culture", img: "lantern.png" },
  { title: "Festival", img: "balloon.png" },
  { title: "Songkran", img: "songkran.png" },
]

const events = [
  {
    id: "1",
    title: "Event New Year Celebration",
    img: "new-year.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    id: "2",
    title: "Event Booking and Explore",
    img: "eventx.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Educational & Business",
  },
  {
    id: "3",
    title: "Event Summer Festival",
    img: "summer.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    id: "4",
    title: "Event Prom Night",
    img: "prom.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    id: "5",
    title: "Event New Year Celebration",
    img: "new-year.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    id: "6",
    title: "Event Booking and Explore",
    img: "eventx.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Educational & Business",
  },
  {
    id: "7",
    title: "Event Summer Festival",
    img: "summer.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
  {
    id: "8",
    title: "Event Prom Night",
    img: "prom.png",
    date: { month: "NOV", day: "22" },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    price: 4.99,
    interested: 10,
    category: "Entertainment",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f9fc] text-gray-900">
      <HeroSection />
      <CategorySection categories={categories} />
      <EventsSection title="Popular Events in Phnom Penh" events={events} />
      <EventsSection title="Discover Best Online Events" events={events} />
    </main>
  )
}
