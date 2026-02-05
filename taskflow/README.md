# TaskFlow - Project Management System 🚀

Hi there! 👋  
This is my submission for the **Full Stack MERN Intern Assessment**.  
**TaskFlow** is a role-based project and task management application where Admins can manage users, Managers can handle projects, and Users can track their tasks using a Kanban-style board.

## 🛠️ Tech Stack Used
*   **Frontend**: React.js, Redux Toolkit, Tailwind CSS (for styling).
*   **Backend**: Node.js, Express.js.
*   **Database**: PostgreSQL (managed via Prisma ORM).
*   **Auth**: JWT (JSON Web Tokens) with secure password hashing (bcrypt).

---

## 🚀 Features implemented
*   **Authentication**: Login/Register (with specific email domains for roles).
*   **Admin Dashboard**: Manage all users (Edit, Delete, Assign Roles).
*   **Manager Dashboard**:
    *   Create & Manage Projects.
    *   Add Team Members to projects.
    *   Assign Tasks to team members.
    *   **New**: View all project tasks in a list.
*   **User Dashboard**:
    *   Kanban Board (To Do -> In Progress -> Done).
    *   View joined projects.
*   **Responsive UI**: Looks good on mobile and desktop!

---

## ⚙️ How to Run Locally

### 1. Clone the repo
```bash
git clone <repository-url>
cd taskflow
```

### 2. Backend Setup
Go to the backend folder and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskflow_db"
JWT_SECRET="mysecretkey123"
PORT=5000
```
Run migrations and start server:
```bash
npx prisma migrate dev --name init
npm run dev
```

### 3. Frontend Setup
Go to the frontend folder and install dependencies:
```bash
cd frontend
npm install
```
Start the React app:
```bash
npm run dev
```

---

## 🔑 Test Credentials (Roles)

To test the different dashboards, you can use these accounts I created (or create your own!):

| Role    | Email                 | Password | Access |
| :------ | :-------------------- | :------- | :----- |
| **Admin**   | `admin@admin.com`     | `123456` | Full Control |
| **Manager** | `manager@manager.com` | `123456` | Projects & Tasks |
| **User**    | `user@gmail.com`      | `123456` | My Tasks (Kanban) |

> **Note**: To create a new Admin, use an email ending in `@admin.com`. For Manager, use `@manager.com`.

---

## 🌐 Deployment
**Live Link**: [ INSERT YOUR DEPLOYED LINK HERE ]

---

## 📝 Student Notes
*   I used **Tailwind CSS** because it's cleaner and faster to style than writing custom CSS files.
*   The **Kanban board** in the User Dashboard uses drag-and-drop logic (or simple status updates) to make it interactive.
*   I focused on making the UI simple and "human" rather than over-engineering it.

Hope you like it! Thanks for reviewing my code. 😊
