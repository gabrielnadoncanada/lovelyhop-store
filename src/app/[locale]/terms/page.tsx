import { InfoPage, infoMetadata } from "@/components/info/InfoPage";

export const generateMetadata = () => infoMetadata("terms");

export default function Page() {
  return <InfoPage pageKey="terms" />;
}
