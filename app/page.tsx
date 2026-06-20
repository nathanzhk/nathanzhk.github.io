import { HomeLayout } from 'fumadocs-ui/layouts/home';

export default function Home() {
  return (
    <HomeLayout
      className="flex-1"
      searchToggle={{ enabled: false }}
      nav={{ title: <span className="font-semibold">Nathan</span> }}
    >
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p>hello</p>
      </main>
    </HomeLayout>
  );
}
