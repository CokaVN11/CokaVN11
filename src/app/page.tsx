import { SkillsSection } from '@/components/sections/skills-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { WorkSection } from '@/components/sections/work-section';
import { Hero } from '@/components/sections/hero';
import { Navbar } from '@/components/navbar';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Icons } from '@components/ui/icons';
import { ContactSection } from '@/components/sections/contact-section';
import { RESUME, generatePersonSchema, generateProfessionalServiceSchema } from '@/data/resume';

export default async function Home() {
  const personSchema = generatePersonSchema(RESUME);
  const professionalServiceSchema = generateProfessionalServiceSchema(RESUME);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(professionalServiceSchema),
        }}
      />

      <main className="container mx-auto max-w-(--breakpoint-2xl) bg-background p-4 pt-20 pb-20 sm:p-6 sm:pt-24 md:p-10 md:pt-28 min-h-dvh flex flex-col items-center">
        <Navbar
          brand={RESUME.name}
          subtitle="Software Engineer"
          navLinks={[
            { href: '#hero', label: 'About' },
            { href: '#featured-work', label: 'Projects' },
            { href: '#contact', label: 'Contact' },
          ]}
          socialLinks={[
            {
              label: 'GitHub',
              href: RESUME.contact.social.GitHub.url,
              icon: <Icons.github className="text-lg size-4" />,
            },
            {
              label: 'LinkedIn',
              href: RESUME.contact.social.LinkedIn.url,
              icon: <Icons.linkedin className="text-lg size-4" />,
            },
            {
              label: 'Email',
              href: `mailto:${RESUME.contact.email}`,
              icon: <Icons.email className="text-lg size-4" />,
            },
          ]}
        />

        <Hero
          name={RESUME.name}
          tagline={RESUME.tagline}
          actions={[
            { label: 'View Projects', href: '#featured-work', variant: 'default' },
            { label: 'Contact Me', href: '#contact', variant: 'outline' },
          ]}
          className="mt-10"
        />

        <WorkSection featured={RESUME.projects[0]} supporting={RESUME.projects.slice(1)} />
        <ExperienceSection items={RESUME.work} />

        <SkillsSection
          education={RESUME.education[0]}
          capabilities={[
            { title: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
            { title: 'Backend', items: ['Node.js', 'NestJS', 'Golang'] },
            { title: 'Data', items: ['PostgreSQL', 'MongoDB', 'Prisma'] },
            { title: 'Tooling', items: ['Docker', 'Git', 'CI/CD', 'Vercel'] },
            { title: 'Design', items: ['Figma', 'UX/UI', 'systems thinking'] },
          ]}
        />
        <ContactSection
          intro="Open to full-stack and product engineering opportunities."
          links={[
            { label: 'Email', value: RESUME.contact.email, href: `mailto:${RESUME.contact.email}` },
            {
              label: 'GitHub',
              value: 'github.com/CokaVN11',
              href: RESUME.contact.social.GitHub.url,
            },
            {
              label: 'LinkedIn',
              value: 'linkedin.com/in/ngckhanh',
              href: RESUME.contact.social.LinkedIn.url,
            },
          ]}
        />
      </main>
    </>
  );
}
