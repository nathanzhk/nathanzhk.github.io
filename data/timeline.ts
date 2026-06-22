export type TimelineItem = {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  tags?: string[];
  description: string[];
};

export const experience: TimelineItem[] = [
  {
    id: 'digitalaid',
    title: 'Full Stack Software Engineer',
    subtitle: 'Digital Aid Seattle',
    period: 'Jun 2026 — Present',
    tags: ['TypeScript', 'Python', 'React', 'FastAPI', 'Azure'],
    description: [],
  },
  {
    id: 'freelance',
    title: 'Full Stack Software Engineer',
    subtitle: 'Independent Projects',
    period: 'Sep 2024 — May 2026',
    tags: ['TypeScript', 'Python', 'React', 'FastAPI'],
    description: [],
  },
  {
    id: 'bitsun',
    title: 'Backend Software Engineer',
    subtitle: 'BitSun Technology',
    period: 'Oct 2019 — Mar 2023',
    tags: [
      'Java',
      'Spring Boot',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Kubernetes',
      'CI/CD',
    ],
    description: [
      'Developed core features of the inventory service and order service. Refactored the inventory processing module, reducing code size by 80% while improving flexibility and extensibility.',
      'Accelerated the order placement workflow by refining SQL queries and implementing a layered caching strategy with local cache and distributed cache. Reduced response time from hundreds of milliseconds to tens of milliseconds, improving user experience and service efficiency.',
      'Increased the processing capacity and stability of the order service by using message-queue-based asynchronous processing, multithreading, and scheduled task pipelines.',
      'Designed and wrote CI/CD scripts based on GitLab CI. Solid understanding of DevOps practices, Docker, and Kubernetes.',
    ],
  },
];

export const education: TimelineItem[] = [
  {
    id: 'georgiatech',
    title: 'Online Master of Science in Computer Science',
    subtitle: 'Georgia Institute of Technology',
    period: 'Aug 2025 — Present',
    description: [],
  },
  {
    id: 'newyorktech',
    title: 'Master of Science in Cybersecurity',
    subtitle: 'New York Institute of Technology',
    period: 'May 2023 — Aug 2024',
    description: [],
  },
];
