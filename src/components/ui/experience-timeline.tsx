'use client';
import { useScroll, useTransform, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { JobData } from '@/data/jobs';
import { formatDateRange, formatTimelineDate, isPresentJob } from '@/lib/utils/timeline';

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
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative mx-auto">
        {jobs.map((job) => (
          <div key={job.slug} className="group flex justify-start gap-4 md:gap-6 mt-8 first:mt-0">
            {/* Left column: dot + date */}
            <div className="top-24 z-40 sticky flex items-start self-start w-auto md:w-1/4 pt-2">
              {/* Square dot */}
              <div className="-left-[5px] md:left-[27px] absolute flex justify-center items-center w-4 h-4">
                <div className="w-2 h-2 bg-foreground group-hover:bg-primary transition-colors duration-150" />
              </div>

              {/* Desktop date + company */}
              <div className="hidden md:block md:pl-16 space-y-0.5">
                <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-150">
                  {formatTimelineDate(job)}
                </p>
                <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
                  {job.company}
                </p>
              </div>
            </div>

            {/* Right column: entry content */}
            <div className="relative flex-1 pr-4 pl-6 md:pl-4">
              {/* Mobile date */}
              <div className="md:hidden mb-2">
                <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors duration-150">
                  {formatTimelineDate(job)}
                </p>
              </div>

              {/* Entry block */}
              <div className="border-l border-border group-hover:border-primary transition-colors duration-150 pl-4 py-1 space-y-1">
                {/* Mono meta row */}
                <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
                  {[formatDateRange(job), job.type].filter(Boolean).join(' · ')}
                  {isPresentJob(job) && (
                    <span className="ml-2 text-primary">Present</span>
                  )}
                </p>

                {/* Company — links to job page */}
                <h3 className="font-mono-display text-sm text-foreground group-hover:text-primary transition-colors duration-150">
                  <a href={job.href}>{job.company}</a>
                </h3>

                {/* Role — serif muted */}
                <p className="font-serif text-xs text-muted-foreground">{job.role}</p>

                {/* Summary — serif body */}
                {(job.summary || job.description) && (
                  <p className="font-serif text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {job.summary || job.description}
                  </p>
                )}

                {/* Tech tags — dot-separated mono */}
                {job.technologies && job.technologies.length > 0 && (
                  <p className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground pt-1">
                    {job.technologies.slice(0, 5).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Timeline line */}
        <div
          style={{ height: height + 'px' }}
          className="top-0 left-4 md:left-8 absolute bg-border w-px overflow-hidden"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="top-0 absolute inset-x-0 bg-primary w-px"
          />
        </div>
      </div>
    </div>
  );
}
