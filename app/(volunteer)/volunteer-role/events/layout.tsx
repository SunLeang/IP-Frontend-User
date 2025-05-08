import type { ReactNode } from "react"
import { VolunteerNavbar } from "@/components/navigation/volunteer-navbar"
import { Footer } from "@/components/footer/footer"

export default function VolunteerEventsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <VolunteerNavbar />
      {children}
      <Footer />
    </>
  )
}
