import dbConnect from '../../../lib/dbConnect';
import Project from '../../../models/Project';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      try {
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    case 'PUT':
      try {
        const project = await Project.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true
        });
        if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: project });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    case 'DELETE':
      try {
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
      
    default:
      res.status(405).json({ success: false, message: 'Method not allowed' });
      break;
  }
}