import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";
import { siteConfig } from "@/config/site";

// Placeholder until the offering pages are built. One page per offering in config/site.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return siteConfig.offerings.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/offerings/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const offering = siteConfig.offerings.find((o) => o.slug === slug);
  return offering ? { title: offering.title } : {};
}

export default async function OfferingPage({ params }: PageProps<"/offerings/[slug]">) {
  const { slug } = await params;
  const offering = siteConfig.offerings.find((o) => o.slug === slug);
  if (!offering) notFound();
  return <ComingSoon title={offering.title} />;
}
