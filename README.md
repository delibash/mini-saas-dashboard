This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

A mini SaaS dashboard built with Next.js, MongoDB, and Tailwind CSS.

## Getting Started

Install dependencies with ``npm i``.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

The project requires a free Atlas instance [https://www.mongodb.com/products/platform/atlas-database](https://www.mongodb.com/products/platform/atlas-database) for data storage. Create an ``.env.local`` file in the the root of the project and update it to use the DB:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

To seed your DB instance, run ``npm run seed``.

To see your raw JSON data locally, open [http://localhost:3000/api/projects](http://localhost:3000/api/projects).