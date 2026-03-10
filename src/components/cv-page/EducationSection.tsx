import { RESUME } from "@/lib/resume/content";

export function EducationSection() {
  return (
    <section id="section-EDUCATION" className="mb-2">
      <h2 className="mb-6 text-heading color-accent">/ EDUCATION</h2>
      {RESUME.education.map((entry, idx) => (
        <div key={idx} className="mb-4">
          <p className="mb-1 text-heading color-primary">{entry.degree}</p>
          <p className="mb-1 text-ui color-accent">► {entry.school}</p>
          <p className="text-micro color-muted">
            {entry.period}
            {entry.gpa ? `  ·  GPA ${entry.gpa}` : ""}
          </p>
        </div>
      ))}
    </section>
  );
}
