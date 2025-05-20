import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getProject, updateProject } from '../../lib/api';
import Layout from '../../components/Layout';
import ProjectForm from '../../components/ProjectForm';

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const { data } = await getProject(id);
          setProject(data);
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to load project');
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (projectData) => {
    try {
      await updateProject(id, projectData);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  if (loading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div className="text-red-500">{error}</div></Layout>;
  if (!project) return <Layout><div>Project not found</div></Layout>;

  return (
    <Layout title={project.name}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Edit Project</h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error.message}
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow">
          <ProjectForm initialData={project} onSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
}