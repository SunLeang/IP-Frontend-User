"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/checkbox";
import { HeroSection } from "@/components/hero-section";

export default function VolunteerPage() {
  // Sample volunteer opportunities data
  const volunteerOpportunities = Array.from({ length: 9 }, (_, i) => ({
    id: `volunteer-${i + 1}`,
    title: "Requesting Volunteer on BookFair",
    image: "/assets/images/prom-night.png",
    category: "Technology & Innovation",
    date: {
      month: "NOV",
      day: "22",
    },
    venue: "Venue",
    time: "00:00 AM - 00:00 PM",
    applicants: 20,
  }));

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Banner */}
      <HeroSection />

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="bg-[#001337] text-white rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price Filter */}
            <div>
              <h3 className="font-semibold mb-3">Price</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="free"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="free" className="ml-2 text-sm">
                    Free
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="paid"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="paid" className="ml-2 text-sm">
                    Paid
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>

            {/* Date Filter */}
            <div>
              <h3 className="font-semibold mb-3">Date</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="today"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="today" className="ml-2 text-sm">
                    Today
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="tomorrow"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="tomorrow" className="ml-2 text-sm">
                    Tomorrow
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="this-week"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="this-week" className="ml-2 text-sm">
                    This Week
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="this-weekend"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="this-weekend" className="ml-2 text-sm">
                    This Weekend
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="pick-date"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="pick-date" className="ml-2 text-sm">
                    Pick a Date
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="adventure"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="adventure" className="ml-2 text-sm">
                    Adventure Travel
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="art"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="art" className="ml-2 text-sm">
                    Art Exhibitions
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="auctions"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="auctions" className="ml-2 text-sm">
                    Auctions & Fundraisers
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="beer"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="beer" className="ml-2 text-sm">
                    Beer Festivals
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="benefit"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="benefit" className="ml-2 text-sm">
                    Benefit Concerts
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>

            {/* Format Filter */}
            <div>
              <h3 className="font-semibold mb-3">Format</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="community"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="community" className="ml-2 text-sm">
                    Community Engagement
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="concerts"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="concerts" className="ml-2 text-sm">
                    Concerts & Performances
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="conferences"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="conferences" className="ml-2 text-sm">
                    Conferences
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="experiential"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="experiential" className="ml-2 text-sm">
                    Experiential Events
                  </label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="festivals"
                    className="border-white data-[state=checked]:bg-yellow-400 data-[state=checked]:text-black"
                  />
                  <label htmlFor="festivals" className="ml-2 text-sm">
                    Festivals & Fairs
                  </label>
                </div>
              </div>
              <button className="text-sm text-blue-300 mt-2">More</button>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Opportunities Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {volunteerOpportunities.map((opportunity) => (
            <VolunteerCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center space-x-2">
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">First</span>
            <span aria-hidden="true">« First</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Previous</span>
            <span aria-hidden="true">‹ Back</span>
          </Button>
          <Button variant="default" size="sm" className="px-3 bg-[#001337]">
            1
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            2
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            3
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            4
          </Button>
          <span className="px-2">...</span>
          <Button variant="outline" size="sm" className="px-3">
            25
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Next</span>
            <span aria-hidden="true">Next ›</span>
          </Button>
          <Button variant="outline" size="sm" className="px-3">
            <span className="sr-only">Last</span>
            <span aria-hidden="true">Last »</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Define a proper interface for the opportunity object
interface VolunteerOpportunity {
  id: string;
  title: string;
  image?: string;
  category: string;
  date: {
    month: string;
    day: string;
  };
  venue: string;
  time: string;
  applicants: number;
}

// Volunteer Card Component
function VolunteerCard({ opportunity }: { opportunity: VolunteerOpportunity }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="relative">
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-1 text-xs">
          ✨ YOU ARE INVITED ✨
        </div>
        <Image
          src={opportunity.image || "/placeholder.svg"}
          alt={opportunity.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-pink-500 text-white text-center py-1 text-xs">
          SCHOOL GRADUATION
        </div>
        <div className="absolute top-12 left-4 bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-sm">
          {opportunity.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="text-center">
            <div className="text-xs font-semibold text-gray-500">
              {opportunity.date.month}
            </div>
            <div className="text-2xl font-bold">{opportunity.date.day}</div>
          </div>

          <div className="flex-1 ml-4">
            <h3 className="font-medium">{opportunity.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{opportunity.venue}</p>
            <p className="text-xs text-gray-400 mt-0.5">{opportunity.time}</p>
            <div className="flex items-center mt-2 text-xs text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{opportunity.applicants} Have applied</span>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <p className="text-sm mb-2">
            Join us as a volunteer for our book fair! Help with setup, customer
            assistance, and organizing books at ITC. Sign up today!
          </p>
          <p className="text-sm mb-3">
            Location:{" "}
            <a
              href="https://googlemap.com"
              className="text-blue-500 hover:underline"
            >
              googlemap.com
            </a>
          </p>
          <div className="text-right">
            <Link href={`/volunteer/${opportunity.id}`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
