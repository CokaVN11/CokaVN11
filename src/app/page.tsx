import { EducationCapabilitiesSection } from '@components/sections/education-capabilities-section';
import { ExperienceTrustSection } from '@components/sections/experience-trust-section';
import { FeaturedWorkSection } from '@components/sections/feature-work-section';
import { PortfolioHero } from '@components/sections/portfolio-hero';
import PortfolioNavbar from '@components/sections/portfolio-navbar';
import { ContactSection } from '@components/sections/contact-section';
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

      <main className="container mx-auto max-w-(--breakpoint-2xl) bg-background p-4 pb-20 sm:p-6 md:p-10 min-h-dvh">
        <PortfolioNavbar
          links={[
            { href: '#about', label: 'About' },
            { href: '#projects', label: 'Projects' },
          ]}
          brand={RESUME.name}
          subtitle="Software Engineer"
        />

        <PortfolioHero
          name={RESUME.name}
          tagline={RESUME.tagline}
          actions={[
            { label: 'View Projects', href: '#projects', variant: 'default' },
            { label: 'Contact Me', href: '#contact', variant: 'outline' },
          ]}
          className="mt-10"
        />

        <FeaturedWorkSection featured={RESUME.projects[0]} supporting={RESUME.projects.slice(1)} />
        <ExperienceTrustSection items={RESUME.work} />

        <EducationCapabilitiesSection
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
