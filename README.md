# Expense Tracker

## Overview

This project is a single-page web application that allows users to track their expenses in a simple and visual way. Users can add, edit, and delete expenses, and view their spending grouped by date and category.

The app focuses on clarity and usability, providing a clean interface to quickly understand where money is going.

---

## Tech Stack

- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Styling: Custom CSS

---

## Features

- Add new expenses
- Edit existing expenses
- Delete expenses
- View expenses grouped by date
- View total spending
- View spending by category (bar chart)
- Category-based color system
- Simple and responsive UI

---

## Data Structure

Each expense follows this structure:

```json
{
  "title": "string",
  "category": "string",
  "amount": number,
  "date": "string",
  "description": "string (optional)"
}
``` 
A sample dataset is included in:
backend/sampleData.json

Folder Structure
expense-tracker/
  frontend/   → React application
  backend/    → Express API and database logic
    models/
    routes/
    server.js

How to Run the Project
1. Install dependencies:
cd backend
npm install

cd ../frontend
npm install

2. Create a .env file inside /backend:
PORT=5000
MONGO_URI=your_mongodb_connection_string

3. Run the backend:
cd backend
npm run dev

4. Run the frontend: 
cd frontend
npm run dev

Challenges
One of the main challenges was connecting MongoDB Atlas, especially dealing with authentication and connection issues. This required careful configuration of the connection string and environment variables.

Another challenge was structuring the UI to keep it clean while still displaying useful information like grouped expenses and category summaries.

Future Improvements
Monthly spending insights
Category-based analytics (e.g. highest spending category)
Improved visualizations
Better mobile interactions

Author
Carola Trozzo