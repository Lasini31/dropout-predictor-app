# Dropout Predictor App

This is a full-stack web application for predicting student academic outcomes using a pretrained machine learning model.

## 📦 Stack

- **Frontend**: Next.js + Tailwind CSS + TypeScript
- **Backend API**: Flask (Python)
- **Database**: MongoDB
- **Authentication**: NextAuth (Role-based for Admin, Student, and Parent)

## 💡 Features

- **Admin Dashboard**: 
  - Upload CSV with student data
  - Predict outcomes via ML model
  - View & download results
  - Search students by ID

- **Student Dashboard**: 
  - Secure login
  - View personal details & prediction

- **Parent Dashboard**: 
  - View linked student IDs
  - Access predictions per student

## 🚀 Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/dropout-predictor-app.git
cd dropout-predictor-app
