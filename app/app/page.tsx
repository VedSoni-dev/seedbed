import Playground from "@/components/Playground";
import { PublikGate } from "@/components/PublikGate";
import "./app.css";

// The software lives here, behind Sign in with publik. The landing page at / is public.
export const metadata = { title: "seedbed · your garden" };

export default function AppPage() {
  return (
    <PublikGate appName="seedbed">
      <Playground />
    </PublikGate>
  );
}
