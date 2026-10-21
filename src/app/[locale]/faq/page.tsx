import { InfoPage, infoMetadata } from "@/components/info/InfoPage";

export const generateMetadata = () => infoMetadata("faq");

export default function Page() {
  return <InfoPage pageKey="faq" />;
}
