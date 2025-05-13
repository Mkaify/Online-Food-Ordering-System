# Food Ordering System

A full-stack food ordering application built with Next.js, TypeScript, Prisma, and NextAuth.js.

## Features

- 🍔 Browse restaurants and menus
- 🛒 Add items to cart
- 💳 Checkout process with confirmation
- 📱 Responsive design for mobile and desktop
- 👤 User authentication and profiles
- 📊 Order tracking with automatic status updates
- 🗑️ Order history management

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/food-ordering-system.git
cd food-ordering-system
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/food_ordering"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Initialize the database
```bash
npx prisma migrate dev
npx prisma db seed
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Screenshots

(Add some screenshots of your application here)

## License

MIT

## Acknowledgments

- Thanks to all the open-source libraries that made this project possible
