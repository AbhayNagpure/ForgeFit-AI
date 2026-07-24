# ForgeFit AI - Architecture & Tech Stack Proposal

This document outlines the proposed architecture and technology stack for ForgeFit AI. The goal is to build a production-ready, highly scalable SaaS application that provides a beautiful, simple user interface backed by advanced AI coaching capabilities.

## 1. The Technology Stack

### Frontend
*   **Framework:** **React (via Vite)** 
    *   *Why:* Since you are a PERN stack developer, standard React is exactly what you're used to. Vite will give us a blazing fast development environment to build a highly responsive Single Page Application (SPA).
*   **Language:** **TypeScript**
    *   *Why:* Since you are eager to learn, this is the perfect project for it! I will help explain the TypeScript code as we write it. It will make your database schemas and API responses much easier to manage.
*   **Styling:** **Vanilla CSS & Custom Animations**
    *   *Why:* To create a truly premium, dynamic, and customized "WOW" factor without the constraints of generic utility classes.

### Backend & API
*   **Server Framework:** **Node.js & Express**
    *   *Why:* The standard 'E' and 'N' in your PERN stack. We will build a robust RESTful API to handle authentication, database queries, and AI integrations.

### Database
*   **Database:** **PostgreSQL**
    *   *Why:* The 'P' in your stack! A robust relational database is critical for fitness tracking because data is highly structured and relational (e.g., A User has many Workouts, a Workout has many Exercises, an Exercise has many Sets/Reps). We can host this on a service like Neon or Supabase to make it easy.

### The AI "Brain"
*   **AI Model:** **Google Gemini API**
    *   *Why:* Gemini has a massive context window, meaning we can feed it a user's entire 6-month workout and nutrition history in a single prompt to get highly personalized insights. It is also inherently multimodal, meaning users could potentially upload a picture of a meal or a progress photo, and the AI can analyze it directly.

## 2. System Architecture

Here is a high-level visualization of how the system components will interact:

```mermaid
graph TD
    User([User]) --> |Interacts with| ReactClient[React Frontend (Vite)]
    ReactClient --> |REST API Calls| ExpressAPI[Node.js / Express Backend API]
    
    ExpressAPI --> |SQL Queries| PostgresDB[(PostgreSQL Database)]
    ExpressAPI --> |Context & Prompts| AI[Gemini AI API]
    
    %% AI interaction flow
    AI -.-> |Generates Workouts, Analyzes Plateaus| ExpressAPI
    ExpressAPI -.-> |JSON Responses| ReactClient
```

## 3. Core Data Architecture (High Level)

To allow the AI to answer complex questions like *"Why has my bench press plateaued?"*, we need a strict data schema:

*   **Users Table:** Age, height, weight, fitness goals, experience level.
*   **Workouts Table:** Date, duration, type (push/pull/legs, cardio), perceived exertion.
*   **Exercises Table:** Catalog of available exercises.
*   **Sets Table:** Links to Workouts and Exercises. Tracks Reps, Weight, RPE (Rate of Perceived Exertion).
*   **Nutrition/Meals Table:** Daily calories, macros (protein, carbs, fat).
*   **Biometrics Table:** Daily/Weekly body weight, body fat %, link to progress photos.

## 4. Execution Plan (30-Day Timeline)

We will build ForgeFit AI in 6 distinct parts, spending exactly 5 days on each part to ensure a high-quality, production-ready outcome.

### Part 1: Architecture & Foundation (Days 1-5)
*   **Sub-part 1.1:** Initialize the React (Vite) frontend and Node/Express backend repositories.
*   **Sub-part 1.2:** Configure PostgreSQL (Supabase/Neon) and set up the connection in Express.
*   **Sub-part 1.3:** Design and run initial database migrations (Users, Auth tables).
*   **Sub-part 1.4:** Set up the Vanilla CSS design system (colors, typography, spacing).
*   **Sub-part 1.5:** Implement secure User Authentication (Sign up, Log in, JWT sessions).

### Part 2: User Profiles & Dashboard Shell (Days 6-10)
*   **Sub-part 2.1:** Build the backend API routes for user profiles and onboarding data.
*   **Sub-part 2.2:** Create the interactive Frontend Onboarding Flow (capturing age, goals, experience).
*   **Sub-part 2.3:** Build the main Dashboard UI layout (sidebar, navigation, headers).
*   **Sub-part 2.4:** Develop reusable UI components (buttons, inputs, cards) using modern glassmorphism.
*   **Sub-part 2.5:** Connect the Dashboard to the backend to fetch and display the user's basic profile.

### Part 3: Workout Tracking Engine (Days 11-15)
*   **Sub-part 3.1:** Design the database schema for Exercises, Workouts, and Sets.
*   **Sub-part 3.2:** Build the CRUD (Create, Read, Update, Delete) API endpoints for workouts.
*   **Sub-part 3.3:** Build the UI for searching and selecting exercises from a catalog.
*   **Sub-part 3.4:** Develop the interactive "Active Workout" UI (logging sets, reps, weight, and RPE).
*   **Sub-part 3.5:** Create history views to let users browse their past workouts.

### Part 4: Nutrition & Progress Tracking (Days 16-20)
*   **Sub-part 4.1:** Expand the database schema to handle Meals (macros/calories) and Biometrics (weight).
*   **Sub-part 4.2:** Build backend API routes for logging nutrition and daily weight.
*   **Sub-part 4.3:** Build the Frontend UI for adding meals and tracking daily caloric intake.
*   **Sub-part 4.4:** Integrate charting libraries to visualize body weight and strength progress over time.
*   **Sub-part 4.5:** Set up cloud storage (Supabase Storage) and the UI for uploading Progress Photos.

### Part 5: The AI Brain (Gemini Integration) (Days 21-25)
*   **Sub-part 5.1:** Integrate the Google Gemini API securely into the Node.js backend.
*   **Sub-part 5.2:** Build a data pipeline that fetches a user's recent workouts/meals and formats it into a context prompt.
*   **Sub-part 5.3:** Build the Frontend AI Chat Assistant UI.
*   **Sub-part 5.4:** Implement specific AI logic for answering plateau questions and generating workout advice based on user data.
*   **Sub-part 5.5:** Develop an automated "Weekly AI Report" feature that summarizes their progress.

### Part 6: Polish, Testing, & Deployment (Days 26-30)
*   **Sub-part 6.1:** Conduct thorough UI/UX polishing (adding micro-animations, ensuring mobile responsiveness).
*   **Sub-part 6.2:** Optimize API performance and database queries (adding indexes if necessary).
*   **Sub-part 6.3:** Implement error handling, loading states, and edge-case testing.
*   **Sub-part 6.4:** Deploy the PostgreSQL Database and Express Backend to a production environment (e.g., Render, Railway).
*   **Sub-part 6.5:** Deploy the React Frontend (e.g., Vercel, Netlify) and connect everything for the final launch.
