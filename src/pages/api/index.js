export default function handler(req, res) {
    // This is the root API endpoint for the application.
    res.status(200).json({
        message: "API root endpoint",
        availableEndpoints: [
            '/api/projects',
        ]
    });
}