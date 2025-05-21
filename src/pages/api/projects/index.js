import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project.mjs";

export default async function handler(req, res) {
	await dbConnect();

	switch (req.method) {
		case "GET":
			try {
				const { status, assignedTo, search, page = 1, limit = 5, activeOnly, upcomingDeadlines } = req.query;

				let query = {};

				// Handle activeOnly parameter
				if (activeOnly === 'true') {
					query.status = 'active';
				} else if (status) {
					query.status = status;
				}

				// Handle upcomingDeadlines parameter
				if (upcomingDeadlines === 'true') {
					const now = new Date();
					const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
					query.status = 'active';
					query.deadline = {
						$gt: now,
						$lt: nextWeek
					};
				} else if (status) {
					query.status = status;
				}

				if (status) query.status = status;
				if (assignedTo) query.assignedTo = assignedTo;

				// TODO: Handle search parameter
				if (search) {
					query.$or = [
						{ name: { $regex: search, $options: "i" } },
						{ description: { $regex: search, $options: "i" } },
					];
				}

				// Get counts
				const totalProjectsCount = await Project.countDocuments({});
				const activeProjectsCount = await Project.countDocuments({ status: 'active' });
				const filteredCount = await Project.countDocuments(query);

				// Count upcoming deadlines
				const now = new Date();
				const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
				const upcomingDeadlinesCount = await Project.countDocuments({
					status: 'active',
					deadline: {
						$gt: now,
						$lt: nextWeek
					}
				});

				// Get paginated results (with filters if any)
				const projects = await Project.find(query)
					.skip((page - 1) * limit)
					.limit(limit)
					.sort({ createdAt: -1 });

				res.status(200).json({
					success: true,
					data: projects,
					counts: {
						total: totalProjectsCount, // Total projects in database
						filtered: filteredCount,   // Count matching current filters
						active: activeProjectsCount, // Count of active projects
						upcoming: upcomingDeadlinesCount, // Count of upcoming deadlines
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
