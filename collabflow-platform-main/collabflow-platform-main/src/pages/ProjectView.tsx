import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { KanbanBoard } from "@/components/KanbanBoard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
}

const ProjectView = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (data) setProject(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Project not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-lg"
            style={{ backgroundColor: project.color }}
          />
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
        </div>
        <KanbanBoard projectId={project.id} />
      </div>
    </MainLayout>
  );
};

export default ProjectView;
