# Project Manager API

# **🚀 Get Started Here**

### **Welcome to the Project Manager API documentation! This API powers collaborative project management tools, offering role-based access for managing users, projects, tasks, and notifications. Below is everything you need to start integrating with the API.**

## **Key Features**

- **User Management:** Create, update, delete, and assign roles (User, Admin, Project Manager, Director).
    
- **Project Tracking:** Manage project details such as budgets, timelines, and sponsors.
    
- **Task Workflows:** Assign tasks, update statuses, and set deadlines.
    
- **JWT Authentication:** Secure login, logout, and token refresh.
    

## **User Roles & Permissions**

This API uses **Role-Based Access Control (RBAC)**. Roles are embedded in JWT tokens and enforced by the backend:

- **Directeur (Director)**
    
    - **Permissions:** Read-only access to projects and tasks.
        
    - **Example Endpoint:** `GET /projet` (List all projects)
        
- **Administrateur (Admin)**
    
    - **Permissions:** Full access to users, projects, tasks, and notifications.
        
    - **Example Endpoints:**
        
        - `DELETE /utilisateur/{id}` (Delete a user)
            
        - `PUT /utilisateur/{id}/role` (Update user roles)
            
- **Chef de Projet (Project Manager)**
    
    - **Permissions:** Create and update projects and tasks.
        
    - **Example Endpoints:**
        
        - `POST /projet` (Create a project)
            
        - `PUT /tache/{id}` (Update a task)
            
- **Utilisateur (User)**
    
    - **Permissions:** Read-only access to projects assigned to the user, and the ability to update task statuses.
        
    - **Example Endpoints:**
        
        - `GET /projet` (List assigned projects)
            
        - `PUT /tache/{id}/status` (Update task status)
            

## **Authentication**

- **Login:** Send a `POST` request to `/auth/login` with an email and password.
    
- **Token:** Include the returned JWT token in the `Authorization` header as `Bearer {token}`.
    
- **Token Expiry:** Tokens expire after 24 hours. Use `/auth/refresh` to renew them.
    
- **Logout:** Send a `POST` request to `/auth/logout` using the current access token in the `Authorization` header.

## Users

#### This section covers all endpoints related to user management, including creating, deleting, updating, and retrieving user data. All endpoints (except login) require a valid `Authorization: Bearer` header.

### create user

- **Method:** `POST`
- **URL:** `{{base_url}}/utilisateur`
- **Description:** This is a **POST** request that creates a new user with the role "Utilisateur". It checks for the uniqueness of the matricule and email, hashes the password, and generates a profile picture. It returns **400** if required fields are missing, **409** if matricule or email already exist, or **201 Created** if successful.

#### Sample Body:
```json
{
  "matricule": "00012",
  "nom_complet": "John Doe",
  "adresse_email": "doe.test@example.com",
  "mot_de_passe": "password123",
  "numero_telephone": "0550123456",
  "departement": "IT"
}
```

### delete user

- **Method:** `DELETE`
- **URL:** `{{base_url}}/utilisateur/20/`
- **Description:** This is a **DELETE** request that removes a user by ID. It first deletes related records from the join tables `tache_utilisateur` and `projet_utilisateur`, then deletes the user. Returns **404** if the user doesn't exist, or **200 OK** if successfully deleted.

### update user info

- **Method:** `PUT`
- **URL:** `{{base_url}}/utilisateur/24/`
- **Description:** This is a **PUT** request that updates a user's information by ID. It allows partial updates of user fields, including secure hashing of the password if provided. Returns **404** if the user is not found, or **200 OK** upon successful update.

#### Sample Body:
```json
{
  "matricule": "00012",
  "nom_complet": "John Doe",
  "adresse_email": "updated@example.com",
  "mot_de_passe": "password123",
  "numero_telephone": "0550123333",
  "departement": "IT"
}
```

### update user role

- **Method:** `PUT`
- **URL:** `{{base_url}}/utilisateur/24/role`
- **Description:** This **PUT** endpoint allows an **administrator** to update the role of a specific user by ID. It requires both the user ID and a valid role ID in the request. If the user or role does not exist, it returns appropriate error messages. Only users with the **administrateur** role can access this route.

#### Sample Body:
```json
{
	"role_id": 4
}
```

### Get all users

- **Method:** `GET`
- **URL:** `{{base_url}}/utilisateur`
- **Description:** This **GET** endpoint retrieves the complete list of users in the system. It is accessible **only to administrators and directors**. If no users are found, it returns a 404 response.

### Get user by name

- **Method:** `GET`
- **URL:** `{{base_url}}/utilisateur/search?nom_complet=John Doe`
- **Description:** This **GET** endpoint allows administrators and directors to retrieve a user's information by their full name (`nom_complet`). If the user is not found, a 404 response is returned.

## Projects

#### This section covers all endpoints related to **project management**, including creating, updating, deleting, and retrieving project data. All endpoints require valid authentication via the `Authorization: Bearer` header. Access is controlled based on the user's role (e.g., `administrateur`, `chef de projet`, `utilisateur`, `directeur`). Role-based permissions determine which operations a user can perform and which projects they can access.

### create project

- **Method:** `POST`
- **URL:** `{{base_url}}/projet/`
- **Description:** This is a **POST** request that creates a new project using JSON data from the request body. It validates required fields, ensures the start date is before the end date, and checks for duplicate project names. If valid, it saves the project to the database and links it to the current user. On success, it returns **201 Created** with the new project; otherwise, it returns appropriate error responses (400, 409, or 500).

#### Sample Body:
```json
{
  "function_de_projet": "Développement Web",
  "nom_de_projet": "Gestion de Projets",
  "nom_de_programme": "Transformation Digitale",
  "sponsor_de_programme": "Direction Générale",
  "manager_de_projet": "Jhon Doe",
  "controle_des_couts": 10000,
  "description": "Application de gestion de projets collaboratifs.",
  "objectif": "Améliorer la productivité des équipes.",
  "date_de_debut_projet": "2025-04-01",
  "date_de_fin_projet": "2025-08-31",
  "buget_global": 150000
}
```

### delete project

- **Method:** `DELETE`
- **URL:** `{{base_url}}/projet/25`
- **Description:** This is a **DELETE** request that removes a project by ID (from `req.params`). It requires `utilisateur_id` in the **request body** to verify if the user is authorized to delete the project. If authorized, it deletes the project and all its related tasks and associations for all users. Returns **200 OK** on success, or **404/500** on failure.

#### Sample Body:
```json
{
    "utilisateur_id": 12
}
```

### update project

- **Method:** `PUT`
- **URL:** `{{base_url}}/projet/21`
- **Description:** This is a **PUT** request that updates a project using its ID from the **URL** and new data from the **request body**. It validates that the start date is before the end date and ensures the project exists before updating. Returns **200 OK** with the updated project or **400/404/500** on error.

#### Sample Body:
```json
{
            "function_de_projet": "Updated Function",
            "nom_de_programme": "Updated name",
            "sponsor_de_programme": "Updated Sponsor",
            "manager_de_projet": "Updated Manager",
            "nom_de_projet": "Updated name",
            "controle_des_couts": 30000,
            "description": "Updated Project Description",
            "objectif": " Updated Project Objective",
            "date_de_debut_projet": "2023-10-01",
            "date_de_fin_projet": "2023-12-31",
            "buget_global": 100000,
            "created_by": 12
}
```

### Get project by role

- **Method:** `GET`
- **URL:** `{{base_url}}/projet/by-role`
- **Description:** This is a **GET** request that retrieves projects based on the user's role. It checks the user's role (either **chef de projet** or **utilisateur**) and returns the corresponding projects:

- **Chef de projet**: Projects created by the user.
    
- **Utilisateur**: Projects linked to tasks assigned to the user.  
      
    Returns **200 OK** with the list of projects or **400/403/404/500** on error.

### Get all projects

- **Method:** `GET`
- **URL:** `{{base_url}}/projet/`
- **Description:** This is a **GET** request to retrieve all projects. The request requires the user to be authenticated and have an **administrateur** or **directeur** role (checked by `isAuthenticated` and `isAuthorized` middleware). It returns a list of projects with associated tasks and users assigned to those tasks. Returns **200 OK** with the project data or **404/500** on error.

### Get project by name

- **Method:** `GET`
- **URL:** `{{base_url}}/projet/search?nom_de_projet=Updated name`
- **Description:** This is a **GET** request that retrieves a project by its name (`nom_de_projet`) from the query string. It returns the project details along with associated tasks and users assigned to those tasks. The request will return **400** if no project name is provided, **404** if the project is not found, or **200 OK** with the project data if successful.

## Tasks

#### **This section includes all task management endpoints such as creating, updating, deleting, assigning users, and changing status. All endpoints require authentication via the** **`Authorization: Bearer`** **header.**

#### **Access is role-based: only users with roles like administrateur, chef de projet, or utilisateur can perform certain actions based on their permissions.**

### create task

- **Method:** `POST`
- **URL:** `{{base_url}}/tache/projet/21`
- **Description:** This **POST** endpoint allows administrators and project managers to create tasks for a specific project. If `finalize` is false, the task is temporarily stored in memory. If `finalize` is true, all pending tasks for the project are saved in the database, associated with users and the project, and notifications are sent to each assigned user.

#### Sample Body:
```json
{
  "titre": "Conception Base de Données",
  "equipe": ["user" ,"user1" ,"user2"],
  "statut": "En cours",
  "date_de_debut_tache": "2025-04-05",
  "date_de_fin_tache": "2025-04-20",
  "poids": 30,
  "finalize": true
}
```

### delete task

- **Method:** `DELETE`
- **URL:** `{{base_url}}/tache/95/24`
- **Description:** This **DELETE** endpoint allows **only authorized users (Administrateur and Chef de Projet)** to delete a specific task. It takes **two parameters in the URL**:

- The **first ID** is the `tache_id` (ID of the task to delete),
    
- The **second ID** is the `projet_id` (ID of the project that contains the task).
    

Before deleting the task, the endpoint ensures that all associated data is cleaned up, including:

- Notifications linked to the task,
    
- Notification-user relationships,
    
- Task-project and task-user associations.
    

If the task is found and deletion is successful, a success message is returned. Otherwise, appropriate error messages are sent.

### update task

- **Method:** `PUT`
- **URL:** `{{base_url}}/tache/96/21`
- **Description:** This **PUT** endpoint allows **authorized users (Administrateur and Chef de Projet)** to **update a task**.  
  
It expects two **URL parameters**:

- `id`: ID of the task to update,
    
- `projectId`: ID of the project that the task belongs to.
    

The request body can include:

- `titre`: Title of the task,
    
- `equipe`: Array of user full names to assign to the task,
    
- `date_de_debut_tache` and `date_de_fin_tache`: Task date range,
    
- `poids`: Task weight.
    

### Behavior:

- If the assigned team is empty and the task has no users, the task is deleted.
    
- If the project has no more tasks after deletion, the project is also deleted.
    
- Users must exist; otherwise, an error is returned.
    
- Dates are validated to ensure logical order.
    
- After update, the response includes the updated task and list of assigned users.
    

Only users with appropriate roles can perform this operation.

#### Sample Body:
```json
{
  "titre": "updated title",
  "equipe": ["user" ,"user1" ,"user2"],
  "date_de_debut_tache": "2025-04-05",
  "date_de_fin_tache": "2025-05-20",
  "poids": 30,
  "finalize": true
}
```

### update status

- **Method:** `PUT`
- **URL:** `{{base_url}}/tache/96/status`
- **Description:** This **PUT** endpoint allows **authorized users (Utilisateur, Chef de Projet, Administrateur)** to **update the status of a task**.

It expects one **URL parameter**:

- `id`: ID of the task to update.
    

The request body must include:

- `statut`: New status of the task.
    
    Accepted values: `"A faire"`, `"En cours"`, `"Terminée"`, `"En attente"`, `"Annulée"`
    

### Behavior:

- Returns an error if the task ID or status is missing.
    
- Validates that the new status is among the accepted values.
    
- If the user has the role `Utilisateur`, they must be assigned to the task to update its status.
    
- If the task is found and the user is authorized, the status is updated.
    
- The response includes the updated task.
    

### Possible Responses:

- `200 OK`: Status updated successfully.
    
- `400 Bad Request`: Missing or invalid input.
    
- `403 Forbidden`: User not authorized to update this task.
    
- `404 Not Found`: Task does not exist.
    
- `500 Internal Server Error`: Unexpected server error.

#### Sample Body:
```json
{
	"statut": "En attente"
}
```

## Notifications

#### **This section covers all notification-related endpoints, including retrieving and managing user notifications. All requests require valid authentication using the** **`Authorization: Bearer`** **header.**

#### **Access is role-based, ensuring users only receive notifications relevant to their tasks or projects, with data filtered by their user ID.**

### Get all notif

- **Method:** `GET`
- **URL:** `{{base_url}}/notification/`
- **Description:** This **GET** endpoint retrieves all notifications assigned to the authenticated user (via the `Authorization: Bearer` token). It includes related project and task info and sorts results by date.  
  
If no notifications are found, it returns a 404 response. Otherwise, it returns a list of processed notifications with clean formatting.

## Authentication

#### **This section covers all authentication-related endpoints, including user login, token generation, and logout. All requests require valid authentication via the** **`Authorization: Bearer`** **header. Access is role-based, allowing users to log in, refresh their access token, and securely log out based on their credentials and session tokens.**

### login

- **Method:** `POST`
- **URL:** `{{base_url}}/auth/login`
- **Description:** This **POST** endpoint handles user login. It verifies the provided email and password, and if valid, returns an `accessToken` and a `refreshToken`.

Authentication is role-aware, and tokens are generated based on the user’s ID and role. If credentials are invalid, a `401 Unauthorized` response is returned.

#### Sample Body:
```json
{
	"adresse_email": "test@example.com",
    "mot_de_passe": "password123"
}
```

### refresh

- **Method:** `POST`
- **URL:** `{{base_url}}/auth/refresh`
- **Description:** This **POST** endpoint handles the refresh token mechanism**.** It verifies the provided `refreshToken`, checks its validity, and generates a new `accessToken` if the token is valid. If the token is invalid or expired, the endpoint responds with a `403 Forbidden` status. If an error occurs, a `500 Internal Server Error` response is returned.

#### Sample Body:
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJhZG1pbmlzdHJhdGV1ciIsImlhdCI6MTc0Mzg5NjEwMCwiZXhwIjoxNzQ0NTAwOTAwfQ.7uFi_dDZ4Z4RE2jQiA4ExXvemuNUb4xOOTxJ93FxPss"
}
```

### logout

- **Method:** `POST`
- **URL:** `{{base_url}}/auth/logout`
- **Description:** This **POST** endpoint logs out the user by deleting their refresh token from the database. If the user is not found or there's an error, an appropriate error message is returned. On success, a confirmation message is sent with a `200 OK` status.

---

## How to Run the App

### 📦 1. Clone the Repository

```bash
git clone https://github.com/AzzOu3108/PFE-coding-project
cd PFE-codeing-project
cd backend
```
### 🛠️ 2. Environment Setup
Create a .env file from the example provided:

```bash
cp .env.example .env
```

### 📥 3. Install Dependencies

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
npm install
```

### 🚀 4. Start the Development Server

```bash
npm run dev
```

---

## 🔧 Build for Production

To generate a production build:

```bash
npm run build
```

Then preview the production build locally:

```bash
npm run preview
```