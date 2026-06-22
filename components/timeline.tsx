'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Building2, GraduationCap, type LucideIcon } from 'lucide-react';
import { TimelineItem } from '@/data/timeline';

export type SectionIcon = 'building' | 'graduation';

const timelineIcons = {
  building: Building2,
  graduation: GraduationCap,
} satisfies Record<SectionIcon, LucideIcon>;

export function Timeline({
  id,
  title,
  icon,
  items,
}: {
  id?: string;
  title: string;
  icon: SectionIcon;
  items: TimelineItem[];
}) {
  const Icon = timelineIcons[icon];
  return (
    <section id={id} className="mt-16 scroll-mt-20">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <Accordion type="single" collapsible className="mt-4">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="transition-transform duration-200 hover:scale-[1.02] hover:no-underline">
              <span className="flex w-full items-center gap-3">
                <Icon className="text-foreground size-4 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{item.title}</span>
                  <span className="text-muted-foreground block text-sm font-normal">
                    {item.subtitle}
                  </span>
                </span>
                <span className="text-muted-foreground shrink-0 pe-4 text-sm font-normal">
                  {item.period}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.tags && item.tags.length > 0 ? (
                <ul className="mb-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-foreground bg-muted rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.description.length > 0 ? (
                <ul className="list-disc space-y-1 ps-5">
                  {item.description.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
