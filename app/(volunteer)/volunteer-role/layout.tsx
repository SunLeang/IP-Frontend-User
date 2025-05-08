import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { InterestProvider } from "@/context/interest-context";

export default function VolunteerRoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  // This layout should not include the general Navbar and Footer
  // The children components will render their own specific navbar and footer
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <InterestProvider>{children}</InterestProvider>
    </ThemeProvider>
  );
}
