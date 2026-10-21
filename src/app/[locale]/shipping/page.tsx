import { InfoPage, infoMetadata } from "@/components/info/InfoPage";

export const generateMetadata = () => infoMetadata("shipping");

export default function Page() {
  return <InfoPage pageKey="shipping" />;
}
