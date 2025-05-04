import type React from "react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-[#001337] text-white py-10">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <FooterSection title="Company Info">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact Us</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/faqs">FAQs</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
          </FooterSection>

          <FooterSection title="Help">
            <FooterLink href="/support">Account Support</FooterLink>
            <FooterLink href="/listing">Listing Guidelines</FooterLink>
            <FooterLink href="/ticketing">Event Ticketing</FooterLink>
            <FooterLink href="/purchase-terms">Ticket Purchase Terms & Conditions</FooterLink>
          </FooterSection>

          <FooterSection title="Categories">
            <FooterLink href="/events/concerts">Concerts & Gigs</FooterLink>
            <FooterLink href="/events/festivals">Festivals & Lifestyle</FooterLink>
            <FooterLink href="/events/business">Business & Networking</FooterLink>
            <FooterLink href="/events/food">Food & Drinks</FooterLink>
            <FooterLink href="/events/arts">Performing Arts</FooterLink>
            <FooterLink href="/events/sports">Sports & Outdoors</FooterLink>
          </FooterSection>

          <FooterSection title="Follow Us">
            <FooterLink href="https://facebook.com">Facebook</FooterLink>
            <FooterLink href="https://instagram.com">Instagram</FooterLink>
            <FooterLink href="https://twitter.com">X</FooterLink>
            <FooterLink href="https://threads.net">Thread</FooterLink>
          </FooterSection>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-700 text-sm text-center text-gray-400">
          ©2025 Eventura. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

interface FooterSectionProps {
  title: string
  children: React.ReactNode
}

function FooterSection({ title, children }: FooterSectionProps) {
  return (
    <div className="text-center md:text-left">
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  )
}

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <Link href={href} className="text-sm text-gray-300 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  )
}
