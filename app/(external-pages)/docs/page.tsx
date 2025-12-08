import Documentation from "@/components/external-pages/Documentation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "Documentation for ZenGuide Onboarding Tour Platform",
};

export default function Page() {
  return <div className="">
    <Documentation />
  </div>;
}
