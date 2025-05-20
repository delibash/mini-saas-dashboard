import dbConnect from "../../../lib/dbConnect";
import Project from "../../../models/Project";

export default async function handler(req, res) {
	await dbConnect();

	switch (req.method) {
		case "GET":
			try {
				// Handle filtering, searching, and pagination
				const { status, assignedTo, search, page = 1, limit = 10 } = req.query;

				let query = {};

				if (status) query.status = status;
				if (assignedTo) query.assignedTo = assignedTo;
				if (search) {
					query.$or = [
						{ name: { $regex: search, $options: "i" } },
						{ description: { $regex: search, $options: "i" } },
					];
				}

				const projects = await Project.find(query)
					.skip((page - 1) * limit)
					.limit(limit)
					.sort({ deadline: 1 });

				const total = await Project.countDocuments(query);

				res.status(200).json({
					success: true,
					data: projects,
					pagination: {
						page: Number(page),
						limit: Number(limit),
						total,
						pages: Math.ceil(total / limit),
					},
				});
			} catch (error) {
				res.status(400).json({ success: false, error: error.message, details: process.env.NODE_ENV === 'development' ? err.message : undefined });
			}
			break;

		case "POST":
			try {
				const project = await Project.create(req.body);
				res.status(201).json({ success: true, data: project });
			} catch (error) {
				res.status(400).json({ success: false, error: error.message, details: process.env.NODE_ENV === 'development' ? err.message : undefined });
			}
			break;

		default:
			res.status(405).json({ success: false, message: "Method not allowed" });
			break;
	}
}
