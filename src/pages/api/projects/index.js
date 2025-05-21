import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project.mjs";

export default async function handler(req, res) {
	await dbConnect();

	switch (req.method) {
		case "GET":
			try {
				const { status, assignedTo, search, page = 1, limit = 5 } = req.query;
		
				let query = {};
		
				if (status) query.status = status;
				if (assignedTo) query.assignedTo = assignedTo;
				if (search) {
				  query.$or = [
					{ name: { $regex: search, $options: "i" } },
					{ description: { $regex: search, $options: "i" } },
				  ];
				}
		
				// Get total count of all projects (without filters for the dashboard)
				const totalProjectsCount = await Project.countDocuments({});
				
				// Get paginated results (with filters if any)
				const projects = await Project.find(query)
				  .skip((page - 1) * limit)
				  .limit(limit)
				  .sort({ createdAt: -1 });
		
				const filteredCount = await Project.countDocuments(query);
		
				res.status(200).json({
				  success: true,
				  data: projects,
				  counts: {
					total: totalProjectsCount, // Total projects in database
					filtered: filteredCount   // Count matching current filters
				  },
				  pagination: {
					page: Number(page),
					limit: Number(limit),
					total: filteredCount,
					pages: Math.ceil(filteredCount / limit),
				  },
				});
			  } catch (error) {
				res.status(400).json({ success: false, error: error.message });
			  }
			  break;
		case "POST":
			try {
				const project = await Project.create(req.body);
				res.status(201).json({ success: true, data: project });
			} catch (error) {
				res.status(400).json({ success: false, error: error.message, details: process.env.NODE_ENV === 'development' ? error.message : undefined });
			}
			break;

		default:
			res.status(405).json({ success: false, message: "Method not allowed" });
			break;
	}
}
