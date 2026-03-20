import { usePageMeta } from "@/hooks/app/usePageMeta";
import { PageLayout } from "@/components/layout/page-layout";
import { Pricing as PricingCards } from "@/components/ui/pricing-cards";

export default function PricingPage() {
  usePageMeta("Pricing", "Simple, transparent pricing plans for delivery logistics teams of all sizes.");

  return (
    <PageLayout>
      <PricingCards />
    </PageLayout>
  );
}
