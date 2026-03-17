'use client';
import { useMotionValueEvent, useScroll, useTransform, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import type { JobData } from '@/data/generateJobs';
import {
  formatDateRange,
  formatTimelineDate,
  isPresentJob,
  isCurrentMonth,
} from '@/lib/timeline-utils';
import { Highlighter } from '@/components/ui/highlighter';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from './separator';
import { Link } from '@tanstack/react-router';

interface ExperienceTimelineProps {
  jobs: JobData[];
}

export function ExperienceTimeline({ jobs }: ExperienceTimelineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full font-sans" ref={containerRef}>
      <div ref={ref} className="relative max-w-4xl mx-auto">
        {jobs.map((job, _) => (
          <div key={job.slug} className="flex justify-start gap-4 mt-8 md:gap-6 first:mt-0">
            {/* Timeline dot and year - 1/4 width on desktop */}
            <div className="sticky z-40 flex items-center self-start w-auto top-24 md:w-1/4">
              <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-1 md:left-3 bg-background">
                <div id="timeline-dot" className="bg-[#0070F3] rounded-full w-4 h-4" />
              </div>
              <div className="hidden text-center md:block md:pl-20">
                <h3 className="text-lg font-bold text-muted-foreground">
                  {isCurrentMonth(job) ? (
                    <Highlighter
                      color="#fbbf24"
                      strokeWidth={1}
                      animationDuration={800}
                      multiline={true}
                    >
                      {formatTimelineDate(job)}
                    </Highlighter>
                  ) : (
                    formatTimelineDate(job)
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">{job.company}</p>
              </div>
            </div>

            {/* Job content - 3/4 width on desktop */}
            <div className="relative flex-1 pl-6 pr-4 md:pl-4">
              {/* Mobile header */}
              <div className="mb-4 md:hidden">
                <h3 className="text-2xl font-bold text-foreground">
                  {isCurrentMonth(job) ? (
                    <Highlighter
                      color="#fbbf24"
                      strokeWidth={1}
                      animationDuration={800}
                      multiline={false}
                    >
                      {formatTimelineDate(job)}
                    </Highlighter>
                  ) : (
                    formatTimelineDate(job)
                  )}
                </h3>
                <p className="text-base text-muted-foreground">{job.company}</p>
              </div>

              {/* Job card */}
              <Link to={job.href}>
                <Card className="relative p-2 transition-all duration-300 border group hover:shadow-lg sm:p-4 hover:border-primary/20 border-border">
                  {/* Absolute positioned badges */}
                  {(job.featured || isPresentJob(job)) && (
                    <div className="absolute top-0 right-0 z-10 flex flex-col gap-2 translate-x-1/2 -translate-y-1/2">
                      {isPresentJob(job) && (
                        <Badge
                          variant="outline"
                          className="bg-green-500/10 shadow-xs backdrop-blur-xs px-3 py-1.5 border-green-500/20 rounded-full font-medium text-green-600 dark:text-green-400 text-xs"
                        >
                          Present
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Job header */}
                  <CardHeader className="flex-1 p-0">
                    <CardTitle className="flex items-center w-full gap-2 mb-2 text-base leading-tight transition-colors text-foreground group-hover:text-primary sm:text-lg md:text-xl">
                      {job.role}
                      <Separator orientation="vertical" className="h-4" />
                      <span className="text-primary">{job.company}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-0 space-y-2">
                    {/* Cover image */}
                    {job.cover && (
                      <div className="relative w-full h-32 overflow-hidden shadow-inner rounded-xl sm:h-48 md:h-56">
                        <img
                          src={job.cover}
                          alt={`${job.company} - ${job.role}`}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 600px"
                          loading="lazy"
                        />
                      </div>
                    )}
                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-4 text-muted-foreground sm:text-sm">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium tracking-tight"
                      >
                        📅 {formatDateRange(job)}
                      </Badge>
                      {job.location && (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-2 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium"
                        >
                          📍 {job.location}
                        </Badge>
                      )}
                      {job.type && (
                        <Badge
                          variant="outline"
                          className="px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-xs sm:text-xs"
                        >
                          {job.type}
                        </Badge>
                      )}
                    </div>
                    {/* Description */}
                    {(job.summary || job.description) && (
                      <p className="text-xs leading-tight text-muted-foreground sm:text-sm">
                        {job.summary || job.description}
                      </p>
                    )}
                    {/* Technologies */}
                    {job.technologies && job.technologies.length > 0 && (
                      <div className="pb-2 sm:pb-0">
                        <div className="flex flex-wrap gap-2">
                          {job.technologies
                            .sort((a, b) => a.length - b.length)
                            .slice(0, 3)
                            .map((tech) => (
                              <Badge
                                key={tech}
                                variant="secondary"
                                className="px-1.5 sm:px-3 py-1 sm:py-0.5 rounded-lg font-medium text-xs transition-colors"
                              >
                                {tech}
                              </Badge>
                            ))}
                          {job.technologies.length > 3 && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 sm:px-3 py-0.5 rounded-lg font-medium text-xs transition-colors"
                            >
                              +{job.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        ))}

        {/* Timeline line */}
        <div
          style={{
            height: height + 'px',
          }}
          className="top-0 left-4 md:left-8 absolute bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-0% from-transparent via-[#0070F3]/20 to-99% to-transparent rounded-full w-[2px] overflow-hidden mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="top-0 absolute inset-x-0 bg-linear-to-t from-[#0070F3] from-0% via-[#38bdf8]/80 via-10% to-transparent rounded-full w-[2px]"
          />
        </div>
      </div>
    </div>
  );
}
