import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProjects } from '../lib/api';
import Layout from '../components/Layout';
// import Button from '../components/UI/Button';

export default function Home() {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const { data } = await getProjects({ limit: 5, sort: '-createdAt' });
        setRecentProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent projects:', error);
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total Projects</h3>
            <p className="text-3xl font-bold">-</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Active Projects</h3>
            <p className="text-3xl font-bold">-</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Upcoming Deadlines</h3>
            <p className="text-3xl font-bold">-</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <Link href="/projects/new" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-white">
              Create New Project
            </Link>
            <Link href="/projects" className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-white">
              View All Projects
            </Link>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
          {loading ? (
            <p>Loading recent projects...</p>
          ) : recentProjects.length === 0 ? (
            <p>No recent projects</p>
          ) : (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProjects.map((project) => (
                    <tr key={project._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/projects/${project._id}`} className="text-blue-600 hover:text-blue-800">
                          {project.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          project.status === 'on hold' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(project.deadline).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}