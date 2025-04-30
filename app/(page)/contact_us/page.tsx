import Image from "next/image"
import officeImage from "@/assets/images/office-image.png"

export default function ContactUs() {
  return (
    <main className="min-h-screen">
      {/* Main content section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DISCOVER US</h1>
              <p className="mt-4 text-gray-700">
                Eventura is here to help you
                <br />
                Our experts are available to answer any questions you
                <br />
                might have. We&apos;re here to help.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">VISIT US</h2>
              <p className="mt-2 text-gray-700">Russian Civil Nordstrom Boulevard, Phnom Penh</p>
              <p className="mt-4 text-gray-700">Feel free to get in touch with us through our channels:</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">EMAIL US</h2>
              <p className="mt-2 text-gray-700">eventura@gmail.com</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">CALL US</h2>
              <p className="mt-2 text-gray-700">
                +855 987654321
                <br />
                +855 123456789
              </p>
            </div>
          </div>

          <div className="relative h-[400px] md:h-full">
            <Image src={officeImage} alt="Eventura Office" fill className="object-cover rounded-md" priority />
          </div>
        </div>
      </section>

      {/* Contact form section */}
      <section className="bg-[#0a1e3c] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                Have a project!
                <br />
                Let&apos;s diascuss
              </h2>
              <div className="space-y-2">
                <p>Thank you for getting in touch!</p>
                <p>Kindly,</p>
                <p>Fill the form, have a great day!</p>
              </div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="relative">
                  <select className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white appearance-none text-white/70">
                    <option value="" disabled selected hidden>
                      Country
                    </option>
                    <option value="cambodia">Cambodia</option>
                    <option value="thailand">Thailand</option>
                    <option value="vietnam">Vietnam</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white"
                  />
                </div>
                <div className="relative">
                  <select className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white appearance-none text-white/70">
                    <option value="" disabled selected hidden>
                      Interested in
                    </option>
                    <option value="web">Web Development</option>
                    <option value="mobile">Mobile App</option>
                    <option value="design">UI/UX Design</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 1L6 6L11 1"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Message"
                  rows={4}
                  className="w-full bg-transparent border-b border-white/50 py-2 px-1 focus:outline-none focus:border-white resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-white text-[#0a1e3c] px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                >
                  Send Us
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map section */}
      <section className="h-[300px] w-full relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15635.53790000001!2d104.91174!3d11.568271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM0JzA1LjgiTiAxMDTCsDU0JzQyLjMiRQ!5e0!3m2!1sen!2sus!4v1651234567890!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </main>
  )
}
