import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { getJobEntry } from '@/lib/content';
import { MDXRenderer } from '@/lib/mdx';
import { getImageUrl } from '@/lib/seo-utils';

export const Route = createFileRoute('/job/$slug')({
  component: JobDetailPage,
  loader: async ({ params }) => {
    const entry = await getJobEntry(params.slug);
    if (!entry) {
      throw notFound();
    }
    return { entry };
  },
  head: ({ loaderData }) => {
    const entry = loaderData?.entry;
    if (!entry) {
      return {
        meta: [{ title: 'Job Experience Not Found' }],
      };
    }

    const coverImageUrl = getImageUrl(entry.metadata.cover);

    return {
      meta: [
        { title: `${entry.metadata.title} - Career` },
        { name: 'description', content: entry.metadata.summary },
        { property: 'og:title', content: entry.metadata.title },
        { property: 'og:description', content: entry.metadata.summary },
        { property: 'og:type', content: 'article' },
        ...(coverImageUrl ? [{ property: 'og:image', content: coverImageUrl }] : []),
      ],
    };
  },
});

function JobDetailPage() {
  const { entry } = Route.useLoaderData();
  const coverImageUrl = getImageUrl(entry.metadata.cover);

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: entry.metadata.title,
    description: entry.metadata.summary,
    datePublished: entry.metadata.date,
    image: coverImageUrl,
    keywords: entry.metadata.tags?.join(', '),
    author: {
      '@type': 'Person',
      name: 'Coka',
    },
    url: `${import.meta.env.VITE_SITE_URL}/job/${entry.slug}`,
    about: {
      '@type': 'Thing',
      name: entry.metadata.role,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorkSchema),
        }}
      />
      <article className="bg-background min-h-screen">
        <div className="mx-auto px-4 py-16 max-w-4xl container">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Career
            </Link>
          </div>

          {/* Header */}
          <header className="mb-12">
            {/* Cover Image */}
            {entry.metadata.cover && (
              <div className="relative mb-8 rounded-lg w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={entry.metadata.cover}
                  alt={entry.metadata.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title and Meta */}
            <div className="text-center">
              <h1 className="mb-4 font-bold text-foreground text-4xl md:text-5xl">
                {entry.metadata.title}
              </h1>

              {/* Role */}
              {entry.metadata.role && (
                <div className="mb-6">
                  <h2 className="font-semibold text-primary text-2xl">{entry.metadata.role}</h2>
                </div>
              )}

              <div className="flex flex-wrap justify-center items-center gap-4 mb-6 text-muted-foreground">
                {/* Date */}
                <time className="flex items-center">
                  <svg
                    className="mr-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(entry.metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>

              {/* Summary */}
              {entry.metadata.summary && (
                <p className="mx-auto mb-8 max-w-3xl text-muted-foreground text-xl">
                  {entry.metadata.summary}
                </p>
              )}

              {/* Technologies */}
              {entry.metadata.tech && entry.metadata.tech.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.metadata.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-secondary px-3 py-1 rounded-full font-medium text-secondary-foreground text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {entry.metadata.tags && entry.metadata.tags.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                    Areas of Focus
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {entry.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted px-3 py-1 rounded-full text-muted-foreground text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Badge */}
              {entry.metadata.featured && (
                <div className="mt-6">
                  <span className="bg-primary px-3 py-1 rounded-full font-medium text-primary-foreground text-sm">
                    Key Career Role
                  </span>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="max-w-none prose prose-lg">
            <MDXRenderer content={entry.content} />
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="text-center">
              <Link to="/job" className="inline-flex items-center text-primary hover:underline">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to career journey
              </Link>
            </div>
          </footer>
        </div>
      </article>
    </>
  );
}