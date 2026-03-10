import { PlayMode } from "@/components/PlayMode";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/play")({
  component: PlayRoute,
});

function PlayRoute() {
  const navigate = useNavigate();

  const handleViewSection = (section: string) => {
    // Navigate to CV with the selected section
    navigate({ to: "/cv", search: { section } });
  };

  return <PlayMode onViewSection={handleViewSection} />;
}
