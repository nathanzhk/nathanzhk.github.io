import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Introduce } from '@/components/intro';
import { Timeline } from '@/components/timeline';
import { profile } from '@/data/intro';
import { experience, education } from '@/data/timeline';

export default function Home() {
  return (
    <HomeLayout
      className="flex-1"
      searchToggle={{ enabled: false }}
      nav={{ title: <span className="font-semibold">{profile.name}</span> }}
      links={[
        { text: 'Experience', url: '#experience', active: 'none' },
        { text: 'Education', url: '#education', active: 'none' },
      ]}
    >
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:py-24">
        <Introduce />

        <Timeline
          id="experience"
          title="Experience"
          icon="building"
          items={experience}
        />

        <Timeline
          id="education"
          title="Education"
          icon="graduation"
          items={education}
        />
      </main>
    </HomeLayout>
  );
}
