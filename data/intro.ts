export type ContactIcon = 'email' | 'github' | 'linkedin';

export type Contact = {
  label: string;
  href: string;
  icon: ContactIcon;
};

export type Location = {
  base: string;
  relocateTo?: string;
};

export type Profile = {
  name: string;
  title: string;
  location: Location;
  bio: string[];
  contacts: Contact[];
};

export const profile: Profile = {
  name: 'Zhikang Chai',
  title: 'Full Stack Software Engineer',
  location: {
    base: 'Vancouver, BC',
    relocateTo: 'Toronto, ON',
  },
  bio: [
    'Authorized to work in Canada (Permanent Resident)',
    'An experienced backend developer with frontend capabilities. Proficient in Java and Spring Boot, with an understanding of JavaScript and React.',
    'Experienced in designing and optimizing database schemas and queries. Skilled in designing and implementing RESTful APIs. Solid understanding of microservices architecture and have successfully implemented it in multiple projects using Docker and Kubernetes.',
  ],
  contacts: [
    { label: 'Email', href: 'mailto:nathanzhk@gmail.com', icon: 'email' },
    { label: 'GitHub', href: 'https://github.com/nathanzhk', icon: 'github' },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/nathanzhk',
      icon: 'linkedin',
    },
  ],
};
