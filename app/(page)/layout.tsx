import { ReactNode } from "react";
import { InterestProvider } from "@/context/interest-context";

export default function PageLayout({ children }: { children: ReactNode }) {
  return <InterestProvider>{children}</InterestProvider>;
}
