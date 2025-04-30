import React from 'react';

const Filters = () => {
  return (
    <div className="bg-[#030B3C] p-6 rounded-xl shadow-md text-white space-y-6">
      <h2 className="text-2xl font-bold">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Price Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Price</h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-purple-500" />
              <span>Free</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-purple-500" />
              <span>Paid</span>
            </label>
          </div>
        </div>

        {/* Date Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Date</h3>
          <div className="flex flex-col space-y-2">
            {["Today", "Tomorrow", "This Week", "This Weekend", "Pick a Date"].map(date => (
              <label key={date} className="flex items-center space-x-2">
                <input type="checkbox" className="accent-purple-500" />
                <span>{date}</span>
              </label>
            ))}
            <a href="#" className="text-purple-400 text-sm mt-2">More</a>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <div className="flex flex-col space-y-2">
            {["Adventure Travel", "Art Exhibitions", "Auctions & Fundraisers", "Beer Festivals", "Benefit Concerts"].map(category => (
              <label key={category} className="flex items-center space-x-2">
                <input type="checkbox" className="accent-purple-500" />
                <span>{category}</span>
              </label>
            ))}
            <a href="#" className="text-purple-400 text-sm mt-2">More</a>
          </div>
        </div>

        {/* Format Filter */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Format</h3>
          <div className="flex flex-col space-y-2">
            {["Community Engagement", "Concerts & Performances", "Conferences", "Experiential Events", "Festivals & Fairs"].map(format => (
              <label key={format} className="flex items-center space-x-2">
                <input type="checkbox" className="accent-purple-500" />
                <span>{format}</span>
              </label>
            ))}
            <a href="#" className="text-purple-400 text-sm mt-2">More</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Filters;
