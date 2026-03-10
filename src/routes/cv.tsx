import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import type { NavSection } from '../lib/resume/types'
import { CVList } from '#/components/cv-page'

export const Route = createFileRoute('/cv')({
  component: CVRoute,
})

function CVRoute() {
  const navigate = useNavigate()
  // Get section from URL query param using TanStack Router
  const search = useSearch({ from: '/cv' }) as { section?: NavSection }

  const handleBack = () => {
    navigate({ to: '/play' })
  }

  return <CVList initialSection={search.section ?? 'OVERVIEW'} onBack={handleBack} />
}
