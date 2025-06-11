import { Checkbox } from "@/components/checkbox";

interface VolunteerFiltersProps {
  // Add filter props as needed
}

export function VolunteerFilters({}: VolunteerFiltersProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      <div className="bg-[#001337] text-white rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Type</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Tech/Innovation</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Community Service</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Education</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Location</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Bangkok</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Chiang Mai</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Remote</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Duration</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">1 Day</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">1 Week</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">1 Month+</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Time</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Morning</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Afternoon</span>
              </label>
              <label className="flex items-center">
                <Checkbox className="mr-2" />
                <span className="text-sm">Evening</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
