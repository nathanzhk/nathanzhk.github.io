import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Section } from '@/components/section';
import { experience } from '@/data/experience';

export default function Home() {
  return (
    <HomeLayout
      className="flex-1"
      searchToggle={{ enabled: false }}
      nav={{ title: <span className="font-semibold">Zhikang Chai</span> }}
    >
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-24">
        <section>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Zhikang Chai
          </h1>
          <p className="text-fd-muted-foreground mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg">
            <span className="text-fd-foreground font-medium">
              Software Engineer
            </span>
            <span aria-hidden>·</span>
            <span>Vancouver, Canada</span>
          </p>
          <p className="text-fd-muted-foreground mt-6 leading-relaxed">
            I build reliable web applications end to end, and care about clean,
            maintainable systems that hold up as they grow.
          </p>
        </section>

        <Section
          title="Experience"
          subtitle="Where I've worked and what I worked on."
          icon="briefcase"
          items={experience}
        />
      </main>
    </HomeLayout>
  );
}
