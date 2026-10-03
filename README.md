# task4
stackCRM — Modern Frontend Web Dashboard
📌 Project Overview
stackCRM is a fully functional, front-end Customer Relationship Management (CRM) dashboard built entirely with vanilla web technologies. Developed as a comprehensive UI/UX and frontend architecture task, this project translates a static design reference into a highly interactive, production-grade web application.

It features a simulated authentication flow, interactive data visualization, and robust state management using the browser's local storage to ensure data persistence across sessions without requiring a backend database.

🗂️ File Structure
The project is strictly modularized for maintainability and clean architecture. The separation of concerns ensures that authentication logic does not interfere with the main dashboard functionality.
stackCRM/
structure--
├── index.html          # Entry point: Operator authentication and registration UI
├── style.css           # Global design tokens, base styles, and Login UI styling
├── script.js           # Auth flow, inline validation, and mock token generation
├── dashboard.html      # Operational dashboard and main CRM workspace
├── dashboard.css       # Dashboard layout, sidebar navigation, and component styles
├── dashboard.js        # Dynamic KPIs, CRUD operations, Chart.js, and localStorage
└── README.md           # Project documentation, tech stack, and local setup guide
File Breakdown
index.html & style.css: Contain the responsive login and registration interfaces. Includes custom CSS variables for a consistent design system (colors, typography, spacing).

script.js: Handles client-side form validation, toggles between login/register tabs, and sets the nexora_auth token in localStorage upon successful authentication before redirecting the user.

dashboard.html & dashboard.css: Form the core Single Page Application (SPA) layout. This includes a collapsible sidebar, breadcrumb navigation, dynamic KPI grids, data tables, and modal containers.

dashboard.js: Acts as the application controller. It validates the auth token, initializes default mock data, binds event listeners for UI interactions, dynamically renders HTML tables based on local state, and manages Chart.js instances.

✨ Core Features
Authentication Guard: A simulated secure login flow. The dashboard is protected and verifies the presence of an authentication token (nexora_auth) before granting access, redirecting unauthorized users back to the login page.

Persistent Data Management: Utilizes localStorage to create a mocked database layer. All Create, Read, Update, and Delete (CRUD) operations for Leads, Deals, and Tasks are saved dynamically and persist through page reloads.

Dynamic Analytics: Integrates Chart.js to render real-time Revenue Overview (Line Chart) and Sales Pipeline Stages (Donut Chart) based on the underlying dataset.

Interactive Data Tables: Features status badges, bulk selection layouts, and inline action buttons (delete/toggle status) that automatically refresh dashboard KPIs upon interaction.

Universal Modal System: A scalable, dynamic modal system handles all data-entry forms (Add Lead, Create Deal, Schedule Task) with proper validation and success toast notifications.

Data Export: Built-in functionality to export the current Leads database as a formatted .csv file directly from the browser.

🚀 Tech Stack
Markup: HTML5 (Semantic Structure)

Styling: CSS3 (Custom variables, Flexbox/Grid layouts, zero external CSS frameworks used)

Scripting: Vanilla JavaScript (ES6+, DOM manipulation, module-like function scoping)

Libraries: Chart.js (Data Visualization via CDN)
