import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-6">
      <div>
        <Label htmlFor="fullName" className="block mb-2">
          Full Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          name="fullName"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={onInputChange}
          required
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="gender" className="block mb-2">
          Gender <span className="text-red-500">*</span>
        </Label>
        <select
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={onInputChange}
          required
          className="w-full border border-input rounded-md h-10 px-3"
        >
          <option value="" disabled>
            Select gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <Label htmlFor="age" className="block mb-2">
          Age <span className="text-red-500">*</span>
        </Label>
        <Input
          id="age"
          name="age"
          type="number"
          placeholder="Your age"
          value={formData.age}
          onChange={onInputChange}
          required
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="status" className="block mb-2">
          Status <span className="text-red-500">*</span>
        </Label>
        <Input
          id="status"
          name="status"
          placeholder="e.g. Student, Professional"
          value={formData.status}
          onChange={onInputChange}
          required
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="organization" className="block mb-2">
          Organization
        </Label>
        <Input
          id="organization"
          name="organization"
          placeholder="Your school or company"
          value={formData.organization}
          onChange={onInputChange}
          className="w-full"
        />
      </div>

      <div>
        <Label htmlFor="reason" className="block mb-2">
          Why do you want to be a volunteer?
        </Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Describe your motivation and what you hope to contribute"
          value={formData.reason}
          onChange={onInputChange}
          className="w-full min-h-[200px]"
        />
      </div>

      <Button
        onClick={onNext}
        className="w-full py-6 bg-green-500 hover:bg-green-600"
      >
        Next
      </Button>
    </div>
  );
}
