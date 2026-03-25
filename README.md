📚 BookStore Management System
A full-stack web application for managing a book inventory, built with Angular 19 and ASP.NET Core 9. This project uses a local XML-based storage system with advanced environment management.

🌟 Key Features
Full CRUD Operations: Create, Read, Update, and Delete books.

XML Persistence: Data is stored in XML files, eliminating the need for external database installation.

Environment-Specific Data: Separate data folders for Development and Test environments to ensure data integrity.

Self-Provisioning (Zero-Config): On the first run, the system automatically initializes the data folder and populates it with Seed Data.

Swagger Integration: Fully documented API for easy testing and exploration.

🛠️ Getting Started
1. Prerequisites
.NET 9 SDK

Node.js & npm

Angular CLI (Optional, but recommended)

2. Backend (Web API)
Navigate to the Backend folder.

Open BookStore.sln in Visual Studio 2022.

Select your desired profile from the run button dropdown:

BookStore-Development: Uses Dev folder.

BookStore-Production: Uses Prod folder.

Press F5. Swagger will open automatically at https://localhost:[PORT]/swagger.

3. Frontend (Angular)
Navigate to the Frontend folder.

Run npm install to install dependencies.

Run npm start (or ng serve) to launch the client.

Open your browser at http://localhost:4200.

📂 Project Structure (Monorepo)
Plaintext
├── Backend/
│   ├── Data_Seed/          # Template XML for first-time setup
│   ├── Data_Dev/           # Created automatically on Development run
│   ├── Services/           # XML Logic and File Management
│   └── Controllers/        # API Endpoints
├── Frontend/
│   ├── src/app/services/   # API Integration
│   └── src/app/components/ # UI Components
└── README.md
💡 Implementation Details
Data Strategy
To ensure a "plug-and-play" experience for reviewers, the application checks for the existence of the XML database upon startup. If missing, it copies a pre-defined template from the Data_Seed directory to the active environment's data folder.

CORS Configuration
The API is configured to allow requests from the Angular development server (http://localhost:4200) to ensure smooth local communication.
