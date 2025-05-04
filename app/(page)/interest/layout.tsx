import type { ReactNode } from "react"
import Navbar from "@/components/navigation/navbar"
import { Footer } from "@/components/footer/footer"

export default function InterestLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar isLoggedIn={true} />
      {children}
      <Footer />
    </>
  )
}
