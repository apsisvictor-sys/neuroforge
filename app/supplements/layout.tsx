import { SupplementLayoutClient } from "./layout-client";

export default function SupplementsLayout({ children }: { children: React.ReactNode }) {
  return <SupplementLayoutClient>{children}</SupplementLayoutClient>;
}
