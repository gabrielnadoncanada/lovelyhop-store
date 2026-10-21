import { InfoPage, infoMetadata } from "@/components/info/InfoPage";

export const generateMetadata = () => infoMetadata("privacy");

export default function Page() {
  return <InfoPage pageKey="privacy" />;
}
