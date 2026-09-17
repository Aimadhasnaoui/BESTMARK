# StorePilot

StorePilot is a store/business management system for tracking products, stock, sales, purchases, customers, suppliers, deliveries, employees, expenses, and finances from a single dashboard.

## What it does

- **Products & Stock** — manage products, categories, and stock movements (in/out).
- **Sales & Purchases** — record sales to customers and purchases from suppliers.
- **Customers & Suppliers** — manage contact and transaction history.
- **Delivery** — track delivery of orders.
- **Employees** — manage employees and employee types, with authentication for staff logins.
- **Expenses** — track expenses and expense types.
- **Transactions & Finance report** — view financial transactions and a finance report dashboard (with charts, filterable by month).
- **Auth** — JWT-based login for employees, with route protection on the API.

## Tech stack

### Back-end
- **Node.js** + **Express 5** — REST API server
- **MongoDB** with **Mongoose** — database and ODM
- **JWT (jsonwebtoken)** + **bcrypt** — authentication and password hashing
- **cookie-parser** — auth cookie handling
- **Security middleware**: `helmet`, `hpp`, `express-rate-limit`, custom NoSQL-injection sanitization
- **multer** + **sharp** — file upload and image processing
- **dotenv** — environment configuration
- **nodemon** — dev auto-reload

### Front-end
- **React 19** + **Vite** — UI and build tooling
- **React Router** — client-side routing
- **TanStack Query** — server-state/data fetching
- **TanStack Table** — data tables
- **Axios** — HTTP client
- **MUI** + **Radix UI** + **shadcn** + **Tailwind CSS 4** — UI components and styling
- **Recharts** — dashboard/finance charts
- **React Hook Form** — forms
- **React Hot Toast** — notifications
- **dayjs** — date handling

## Project structure

```
StorePilot/
├── Back-end/                  # Express + MongoDB API
│   ├── Index.js                # App entry point (middleware, routes, server start)
│   ├── Customers/               # Customer module (model, controller, router)
│   ├── Delivery/
│   ├── Employes/                # Employee + employee type modules, auth
│   ├── Products/                # Product + product category modules
│   ├── Purchases/
│   ├── sales/
│   ├── stockMovements/
│   ├── Supplieres/
│   ├── Transactions/
│   ├── expenses/                # Expense + expense type modules
│   ├── Users/
│   ├── Midelwars/               # Shared middleware (error handlers, etc.)
│   ├── utils/                   # Shared utilities
│   └── uploads/                 # Uploaded files (served statically)
│
└── Front-end/                  # React + Vite client
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── AppRouter.jsx        # App routes
        ├── Component/           # Feature pages (Dashboard, Products, Sales, Stock, ...)
        ├── components/           # Reusable/UI components (components/ui = shadcn)
        ├── Servises/             # API service calls (axios)
        ├── hooks/
        ├── lib/
        └── assets/
```

Each back-end module (e.g. `Products/Product/`) follows the same pattern: a Mongoose model, a `Controller.js` with the route handlers, and a `Router.js` exposing the Express routes.

## How to use it

### Prerequisites
- Node.js
- A MongoDB instance (local or hosted, e.g. MongoDB Atlas)

### 1. Back-end setup

```bash
cd Back-end
npm install
```

Copy `.env.example` to `.env` in `Back-end/` and fill in the values:

```bash
cp .env.example .env
```

```
PORT=your_port
BACKEND_URL=your_backend_url
DataBase=your_mongodb_connection_string
User=your_admin_user
password=your_admin_password
envirement=development
SecureTokenKey=your_jwt_secret
tOKENeXPIRE=your_token_expiry
CookieseXPIRE=your_cookie_expiry
```

Start the server (with auto-reload via nodemon):

```bash
npx nodemon Index.js
```

The API will be available at `http://localhost:<PORT>/api`.

### 2. Front-end setup

```bash
cd Front-end
npm install
```

Copy `.env.example` to `.env` in `Front-end/` and fill in the values:

```bash
cp .env.example .env
```

```
VITE_BASE_URL=http://localhost:<PORT>/api
VITE_IMG_URL=http://localhost:<PORT>
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port), which matches the CORS origin configured on the back-end.

### 3. Build for production

```bash
cd Front-end
npm run build
```

This outputs a production build to `Front-end/dist/`.
