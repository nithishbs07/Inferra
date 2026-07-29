import { ProjectsWorkspace } from "#/components/features/projects/projects-workspace";

export default function ProjectsRoute() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar-always">
      <ProjectsWorkspace />
    </div>
  );
}
