import React from "react";
import Navbar from "@/components/navigation/navbar";
import { Footer } from "@/components/footer/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}