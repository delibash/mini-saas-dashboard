import { useState } from 'react';
import { createProject } from '../../lib/api';
import Layout from '../../components/Layout';
import ProjectForm from '../../components/ProjectForm';

export default function NewProject() {
  const [error, setError] = useState(null);

  const handleSubmit = async (projectData) => {
    try {
      await createProject(projectData);
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  return (
    <Layout title="New Project">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error.message}
          </div>
        )}
        <div className="bg-white p-6 rounded-lg shadow">
          <ProjectForm onSubmit={handleSubmit} />
        </div>
      </div>
    </Layout>
  );
}