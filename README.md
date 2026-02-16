# Dani Konveksi - Fullstack Application

A complete solution for Konveksi business, featuring a React frontend and a Node.js/Express backend with Midtrans payment integration and WhatsApp notifications.

## Project Structure

- `konveksi-app/`: React (Vite) frontend application.
- `konveksi-backend/`: Node.js Express API and MongoDB integration.

##  Getting Started

### 1. Clone the repository
```bash
git clone <YOUR_GITHUB_URL>
cd konveksi
```

### 2. Backend Setup
1. Enter the backend directory:
   ```bash
   cd konveksi-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` with your MongoDB URI, Midtrans keys, and other configurations.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. **WhatsApp Pairing**: Scan the QR code in the terminal using your WhatsApp mobile app (Linked Devices).

### 3. Frontend Setup
1. Enter the app directory:
   ```bash
   cd ../konveksi-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, React Router.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Integrations**: 
  - **Payment**: Midtrans
  - **Messaging**: WhatsApp-web.js for automated notifications.

## Features

- Product Catalog & Category Management.
- Shopping Cart & Checkout System.
- Automated Payment via Midtrans.
- Order Management with WhatsApp status updates.
