'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Award, Briefcase, GraduationCap, type LucideIcon } from 'lucide-react';

const sectionIcons = {
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  award: Award,
} satisfies Record<string, LucideIcon>;

export type SectionIcon = keyof typeof sectionIcons;

export type SectionItem = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  description: string;
};

export function Section({
  title,
  subtitle,
  icon,
  items,
}: {
  title: string;
  subtitle?: string;
  icon: SectionIcon;
  items: SectionItem[];
}) {
  const Icon = sectionIcons[icon];
  return (
    <section className="mt-16">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {subtitle ? (
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      ) : null}
      <Accordion type="single" collapsible className="mt-6">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>
              <span className="flex w-full items-center gap-3">
                <Icon className="text-muted-foreground size-5 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.title}</span>
                  <span className="text-muted-foreground block text-sm font-normal">
                    {item.subtitle}
                  </span>
                </span>
                <span className="text-muted-foreground shrink-0 pe-2 text-sm font-normal">
                  {item.period}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
