import { Card, CardHeader, CardBody, CardFooter, Button, Divider, Image, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Textarea, useDisclosure, Select, SelectItem, RadioGroup, Radio, DatePicker } from "@nextui-org/react";
import { CalendarIcon, MapPinIcon, UsersIcon, FileText, ChevronRight, Download, User, Clock, Hash } from "lucide-react";
import { useState } from "react";

export default function EventListing() {
  const { isOpen: isReviewOpen, onOpen: onReviewOpen, onOpenChange: onReviewOpenChange } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    date: '',
    age: '',
    time: '',
    organization: '',
    fundingContact: false,
    motivation: '',
  });

  const events = [
    {
      id: 1,
      title: "Sound of Eventura Event",
      date: "Sunday, 16 November 2023",
      location: "Master Corri Nonskins Boulevard, Private Tech, 2022",
      volunteersNeeded: 15,
      image: "/assets/images/office-image.png",
      description: "Join us for this exciting event where we'll create awareness experiences for local teams."
    }
  ];

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    onReviewOpen();
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Add your submission logic here
    onReviewOpenChange();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Apply for Volunteer</h1>
          <p className="text-gray-500">Sound of Eventura Event</p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            isPressable
            onPress={() => handleEventClick(event)}
          >
            {/* ... (keep previous card content) ... */}
          </Card>
        ))}
      </div>

      {/* Review Modal */}
      <Modal 
        isOpen={isReviewOpen} 
        onOpenChange={onReviewOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedEvent?.title}
                <p className="text-sm font-normal text-gray-500">Review your application</p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Personal Information</h3>
                    
                    <Input
                      label="Full Name"
                      isRequired
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      startContent={<User className="text-gray-400" />}
                    />

                    <RadioGroup 
                      label="Gender"
                      isRequired
                      value={formData.gender}
                      onChange={(value) => handleInputChange('gender', value)}
                    >
                      <Radio value="male">Male</Radio>
                      <Radio value="female">Female</Radio>
                      <Radio value="other">Other</Radio>
                    </RadioGroup>

                    <div className="grid grid-cols-2 gap-4">
                      <DatePicker
                        label="Date"
                        isRequired
                        value={formData.date}
                        onChange={(date) => handleInputChange('date', date)}
                      />
                      <Input
                        label="Age"
                        type="number"
                        isRequired
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        startContent={<Hash className="text-gray-400" />}
                      />
                    </div>

                    <Input
                      label="Available Time"
                      isRequired
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                      startContent={<Clock className="text-gray-400" />}
                      placeholder="e.g. Weekends 9am-5pm"
                    />
                  </div>

                  {/* Organization Section */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Organization Details</h3>
                    
                    <Input
                      label="Organization"
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="fundingContact"
                        checked={formData.fundingContact}
                        onChange={(e) => handleInputChange('fundingContact', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="fundingContact" className="text-sm text-gray-700">
                        Initiated funding of contact
                      </label>
                    </div>
                  </div>

                  {/* Motivation Section */}
                  <div>
                    <h3 className="font-medium text-lg mb-2">Why do you want to be a volunteer?</h3>
                    <Textarea
                      value={formData.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      placeholder="Explain your motivation for volunteering..."
                      minRows={4}
                      isRequired
                    />
                  </div>
                  
                  {/* CV Section */}
                  <div>
                    <h3 className="font-medium text-lg mb-2">Submitted Documents</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">Google-certificate.pdf</p>
                          <p className="text-sm text-gray-500">Uploaded on {new Date().toLocaleDateString()}</p>
                        </div>
                        <Button 
                          isIconOnly 
                          variant="light"
                          as="a"
                          href="https://cyt.cy"
                          target="_blank"
                        >
                          <Download size={18} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <span>@cyrrepoq</span>
                        <Link href="https://cyt.cy" size="sm">https://cyt.cy</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Back
                </Button>
                <Button 
                  color="primary" 
                  onPress={handleSubmit}
                  isDisabled={!formData.fullName || !formData.gender || !formData.motivation}
                >
                  Start Login
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}