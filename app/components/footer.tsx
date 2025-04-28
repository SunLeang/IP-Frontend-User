import React from "react";

export default function Footer() {
  return (
    <footer className="bg-primaryblue text-white py-12 px-6">
      <div className="grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-bold mb-4">Company Info</h4>
          <ul className="space-y-2">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">FAQs</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Help</h4>
          <ul className="space-y-2">
            <li>
              <a href="#">Account Support</a>
            </li>
            <li>
              <a href="#">Listing Events</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Categories</h4>
          <ul className="space-y-2">
            <li>
              <a href="#">Concerts & Gigs</a>
            </li>
            <li>
              <a href="#">Festivals & Lifestyle</a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <ul className="space-y-2">
            <li>
              <a href="#">Facebook</a>
            </li>
            <li>
              <a href="#">Instagram</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-8 text-xs">
        &copy; 2025 Eventura. All rights reserved.
      </p>
    </footer>
  );
}
