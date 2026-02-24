![image](https://github.com/user-attachments/assets/2f13286b-5869-407e-bf61-1952f9604631)

# 🐾 Veterinary Clinic Management System

**Full Stack Project** by Aurea María Caride González, Alejandro Jesús Suárez Saavedra and Nicasio Manuel Galindo Lojo

![image](https://github.com/user-attachments/assets/2f13286b-5869-407e-bf61-1952f9604631)

## 📌 Project description

Full stack web application for veterinary clinic management and client portal.

Includes:

* Animal and client management
* Appointments
* Medical records
* Billing
* Product & service catalog
* Authentication & roles

Built with:
**Frontend:** Ionic + Angular
**Backend:** Node.js + Express + Sequelize
**Database:** MySQL

Repository:
https://github.com/ngalloj/PPP_Alejandro_Aurea_Nicasio

---

# 🌐 Production Deployment (Live Services)

## 🗄️ Database (MySQL Cloud)

Hosted on **Aiven Cloud**
Provides managed MySQL database for production.

https://console.aiven.io/account/a595efdfaa17/project/aureaalejandronicasio-36ac/services

---

## ⚙️ Backend API (Node + Express)

Hosted on **Render**

Handles:

* REST API
* Authentication
* Database connection
* Business logic

https://dashboard.render.com/web/srv-d6cpurctgctc73enplb0

Example API endpoint:

```
https://clinicaveterinaria2-0.onrender.com/api
```

---

## 💻 Frontend (Ionic Angular)

Hosted on **Cloudflare Pages**

Responsive web app compatible with:

* Desktop
* Tablet
* Mobile

https://dash.cloudflare.com/a24fcc17ff9c1e97a4116b1dfec5e5c4/pages/view/clinica-veterinaria-pages

Live site:

```
https://clinica-veterinaria-pages.pages.dev
```

---

## 🖼️ Image Storage (Cloudinary)

Used for:

* Product images
* Animal photos
* Media uploads

https://console.cloudinary.com/app/c-0d7e672066d71e7c0be446916218cc/assets/media_library

---

# 🛠️ Local Development Setup

## Prerequisites

* Windows OS
* Node.js
* npm
* MySQL / XAMPP
* MySQL Workbench
* Visual Studio Code

---

## Project structure

```
/backend   → Node/Express API (Sequelize)
/frontend  → Ionic Angular app
/database  → MySQL (cloud or local)
```

---

## Installation

Clone repository:

```
git clone https://github.com/ngalloj/PPP_Alejandro_Aurea_Nicasio
```

Install dependencies:

```
npm run install:all
```

Or manually:

```
npm install --prefix backend
npm install --prefix frontend
```

---

## Environment variables

Create `.env` in root:

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
CLOUDINARY_URL=
```

---

## Run project (development)

Start everything:

```
npm run start
```

Only backend:

```
npm run dev:backend
```

Only frontend:

```
npm run dev:frontend
```

---

## Tests

Backend:

```
npm test --prefix backend
```

Frontend:

```
npm test --prefix frontend
```

---

## Build frontend

```
npm run build --prefix frontend
```

---

# 👨‍💻 Authors

Aurea María Caride González
Alejandro Jesús Suárez Saavedra
Nicasio Manuel Galindo Lojo

Full Stack Developers (DAM)

---

# 📄 License

Creative Commons CC0 1.0 Universal

---

# 🙌 Acknowledgments

* Teachers and DAM program
* Open source community
* Ionic & Angular community
* Node.js ecosystem
