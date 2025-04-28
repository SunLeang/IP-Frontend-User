import React from 'react';

interface FooterLinkProps {
  label: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label }) => (
  <li>
    <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
      {label}
    </a>
  </li>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: "Company Info",
      links: ["About Us", "Contact Us", "Careers", "FAQs", "Terms of Service", "Privacy Policy"]
    },
    {
      title: "Help",
      links: ["Account Support", "Listing Events", "Event Ticketing", "Ticket Purchase Terms & Conditions"]
    },
    {
      title: "Categories",
      links: ["Concerts & Gigs", "Festivals & Lifestyle", "Business & Networking", "Food & Drinks", "Performing Arts", "Sports & Outdoors"]
    },
    {
      title: "Follow Us",
      links: ["Facebook", "Instagram", "X", "Thread"]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white text-sm">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <FooterLink key={linkIndex} label={link} />
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800 text-gray-400 text-center">
          © {currentYear} Eventura. All rights reserved.
        </div>
      </div>
    </footer>
  );
};