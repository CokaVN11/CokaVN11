'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

import { ContactPayloadSchema } from '@/lib/schemas/contact';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionHeader } from '@/components/ui/section-header';
import { Textarea } from '@/components/ui/textarea';

type ContactFormData = z.infer<typeof ContactPayloadSchema>;

type ContactLink = {
  label: string;
  value: string;
  href: string;
};

type ContactSectionProps = {
  intro: string;
  links: ContactLink[];
};

function ContactLinksCard({ links }: { links: ContactLink[] }) {
  return (
    <Card className="h-full p-5 border shadow-none border-border">
      {links.map((link) => (
        <div
          key={link.label}
          className="flex flex-col gap-0.5 pb-4 border-b border-border last:border-b-0 last:pb-0 mb-4 last:mb-0"
        >
          <span className="font-mono-display text-[10px] uppercase tracking-widest text-muted-foreground">
            {link.label}
          </span>
          <a
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group/link font-serif text-sm transition-colors duration-150 text-foreground hover:text-primary flex items-center gap-1"
          >
            {link.value}
            <span className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-150 text-primary">
              →
            </span>
          </a>
        </div>
      ))}
    </Card>
  );
}

function ContactFormCard() {
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting'>('idle');

  const form = useForm({
    resolver: zodResolver(ContactPayloadSchema),
    defaultValues: { name: '', email: '', message: '' },
    mode: 'onBlur',
  });

  const handleSubmit = async (data: ContactFormData) => {
    setContactStatus('submitting');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = (await response.json()) as { message?: string };
        throw new Error(error.message || 'Failed to submit form');
      }
      toast.success("Message sent. I'll get back to you soon.");
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      console.error(message);
      toast.error('Failed to submit form');
    } finally {
      setContactStatus('idle');
    }
  };

  return (
    <Card className="p-5 border shadow-none border-border">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
        action="javascript:void(0)"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className="font-mono-display text-[10px] uppercase tracking-widest">
            Name
          </Label>
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="Your name"
                aria-invalid={form.formState.errors.name ? 'true' : 'false'}
                className="rounded-none border-0 border-b border-border focus-visible:ring-0 px-0 bg-transparent"
              />
            )}
          />
          {form.formState.errors.name && (
            <p className="font-mono text-[10px] text-muted-foreground italic">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="email"
            className="font-mono-display text-[10px] uppercase tracking-widest"
          >
            Email
          </Label>
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Input
                {...field}
                id="email"
                type="email"
                placeholder="your@email.com"
                aria-invalid={form.formState.errors.email ? 'true' : 'false'}
                className="rounded-none border-0 border-b border-border focus-visible:ring-0 px-0 bg-transparent"
              />
            )}
          />
          {form.formState.errors.email && (
            <p className="font-mono text-[10px] text-muted-foreground italic">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="message"
            className="font-mono-display text-[10px] uppercase tracking-widest"
          >
            Message
          </Label>
          <Controller
            name="message"
            control={form.control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="message"
                placeholder="Tell me about your project..."
                aria-invalid={form.formState.errors.message ? 'true' : 'false'}
                className="rounded-none border-0 border-b border-border focus-visible:ring-0 px-0 bg-transparent resize-none min-h-30"
              />
            )}
          />
          {form.formState.errors.message && (
            <p className="font-mono text-[10px] text-muted-foreground italic">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          disabled={contactStatus === 'submitting'}
          className="text-xs tracking-widest uppercase transition-colors duration-150 font-mono-display w-full sm:w-auto"
        >
          {contactStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Card>
  );
}

export function ContactSection({ intro, links }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="w-full mx-auto min-h-dvh flex flex-col snap-start"
      aria-labelledby="contact-heading"
    >
      <div className="flex-1 pb-10">
        <SectionHeader
          id="contact-heading"
          label="Contact"
          title="Get in Touch"
          description={intro}
        />

        <div className="grid gap-6 lg:grid-cols-[0.5fr_1.2fr] items-start">
          <ContactLinksCard links={links} />
          <ContactFormCard />
        </div>
      </div>
    </section>
  );
}
