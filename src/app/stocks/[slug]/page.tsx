import StockPageClient from "@/components/StockPageClient";

interface StockPageProps {
  params: Promise<{ slug: string }>;
}

export default async function StockPage({ params }: StockPageProps) {
  const { slug } = await params;
  return <StockPageClient slug={slug} />;
}
