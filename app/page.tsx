import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";

const DESCRIPTION =
  "A flower hover effect for any website: move across a dot grid and flowers grow out of it, then wilt back. Five styles, one 21 KB file, a web component or React. Free and open source.";

// The landing page's own head, and the page type the taste kit reads (page-type, site-kind;
// <html data-type> is set by Landing's first script).
export const metadata: Metadata = {
  title: "seedbed: flower hover effect for your website",
  description: DESCRIPTION,
  openGraph: { title: "seedbed: flowers that grow under your cursor", description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image" },
  other: { "page-type": "software", "site-kind": "software" },
};

export default function Home() {
  return <Landing />;
}
