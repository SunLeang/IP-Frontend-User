import { Button } from "@/components/ui/button";

interface FormData {
  fullName: string;
  gender: string;
  age: string;
  status: string;
  organization: string;
  reason: string;
}

interface ApplicationFormStep1Props {
  formData: FormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onNext: () => void;
}

export function ApplicationFormStep1({
  formData,
  onInputChange,
  onNext,
}: ApplicationFormStep1Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onInputChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={onInputChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={onInputChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter your age"
              min="18"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={onInputChange}
              className="w-full border rounded-md px-3 py-2"
              required
            >
              <option value="">Select status</option>
              <option value="Student">Student</option>
              <option value="Working">Working</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Organization (Optional)
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={onInputChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Enter your organization"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Why do you want to volunteer? *
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={onInputChange}
              className="w-full border rounded-md px-3 py-2 h-24"
              placeholder="Please explain why you want to volunteer for this event"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
}
