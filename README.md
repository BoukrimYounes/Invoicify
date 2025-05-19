<h1 align="center">
	<img
		width="250"
		alt="Invoicify"
		src="https://github.com/BoukrimYounes/Invoicify/resources/js/assets/logo.png">
</h1>

<h3 align="center">
	Invoicify – Simple Invoice Management App
</h3>

## 📖 Table of Contents

<details>
<summary>Click to expand</summary>

- [📖 Table of Contents](#-table-of-contents)
- [📷 Demo](#-demo)
- [⛓ Description](#-description)
	- [User Authentication](#user-authentication)
	- [Invoice Management](#invoice-management)
	- [Dashboard](#dashboard)
	- [Responsive Design](#responsive-design)
- [🔨 Development](#-development)
	- [Tech Stack](#tech-stack)
- [☑️ Installation](#-installation)
	- [Prerequisites](#prerequisites)
	- [Backend Setup (Laravel)](#backend-setup-laravel)
	- [Frontend Setup (React)](#frontend-setup-react)
- [📦 Usage](#-usage)
- [🤝 Collaborators](#-collaborators)

</details>

# 📷 Demo

Link coming soon…

# ⛓ Description

<p align="center">
	<b>Invoicify</b> is a lightweight and intuitive invoice management system that helps users easily create, track, and manage their invoices. Built with Laravel and ReactJS via Inertia.js, it ensures a seamless and modern user experience.
</p>

## 1️⃣ User Authentication
- Secure account registration and login system.
- Each user gets access to their own personalized dashboard.

## 2️⃣ Invoice Management
- Create, update, delete, and print invoices.
- Include details like:
  - Invoice number
  - Date & Due Date
  - List of items (with prices)
  - Tax rate
  - Discount percentage
- Automatic calculation of subtotal, discount amount, and total.

## 3️⃣ Dashboard
- View all created invoices in one place.
- Easily access options to edit, delete, or print any invoice.

## 4️⃣ Responsive Design
- Fully responsive, modern UI built with Tailwind CSS for an optimized experience on desktop, tablet, and mobile.

---

# 🔨 Development

## 🛠 Tech Stack

- Backend: [![Laravel](https://img.shields.io/badge/Laravel-11-red?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com/)
- Frontend: [![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
- Routing & Inertia: [![Inertia.js](https://img.shields.io/badge/Inertia.js-SPA-lightgrey?style=flat-square)](https://inertiajs.com/)
- Database: [![MySQL](https://img.shields.io/badge/MySQL-Database-orange?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
- Styling: [![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-Styling-teal?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

# ☑️ Installation

## Prerequisites
- PHP >= 8.2.12
- Composer
- Node.js >= 22.13
- MySQL or compatible database

## Backend Setup (Laravel)

```bash
git clone https://github.com/YourUsername/Invoicify.git
cd Invoicify
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```
##Frontend Setup (React)
```bash
cd resources/js
npm install
npm run dev
```

## 📦 Usage

1. Register a new account or log in if you already have one.

2. Access your dashboard to view all your invoices.

3. Click "Create Invoice" to add a new one.

4. Fill in:

    -Invoice number

    -Date & Due Date

    -Items list with price

    -Tax rate & Discount percentage

5. The system will auto-calculate subtotal, discount value, and total.

6. You can edit, delete, or print invoices anytime from your dashboard.

# 🤝 Collaborators

We collaborated to develop **Invoicify**, each contributing to different aspects of the project:

| Name                | GitHub Profile                                      | Role                                                |
|-------------------- |---------------------------------------------------- |---------------------------------------------------- |
| **Younes BOUKRIM**  | [BoukrimYounes](https://github.com/BoukrimYounes)   | UI/UX Designer, Frontend Developer (React)          |
| **Chaimaa AFKIR**   | [Chaimaa101](https://github.com/Chaimaa101)         | Backend Developer , API Tester                      |
