
# Blog Application

A modern, full-stack blog application built with Next.js, TypeScript, Prisma, and more. This project supports authentication, post management, user profiles, and advanced editor features.

## Features
- User authentication (sign up, sign in, password reset, email verification)
- Admin panel for post creation and management
- Rich text editor for blog posts (Tiptap)
- Search functionality
- User profiles
- Responsive UI with custom components
- Prisma ORM for database management

## Tech Stack
- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [React](https://react.dev/)
- [PostCSS](https://postcss.org/)
- [ESLint](https://eslint.org/)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- PostgreSQL (or another supported database)

### Installation
1. Clone the repository:
	```sh
	git clone <repo-url>
	cd blog-application
	```
2. Install dependencies:
	```sh
	npm install
	# or
	yarn install
	```
3. Configure environment variables:
	- Copy `.env.example` to `.env` and update values as needed.
4. Set up the database:
	```sh
	npx prisma migrate dev
	npx prisma generate
	```
5. Start the development server:
	```sh
	npm run dev
	# or
	yarn dev
	```

## Project Structure
```
prisma/           # Prisma schema and migrations
src/app/          # Next.js app directory
src/components/   # Reusable React components
src/lib/          # Utility functions and API clients
src/queries/      # Data queries
src/services/     # Business logic
src/types/        # TypeScript types
```

## Scripts
- `dev`: Start development server
- `build`: Build for production
- `start`: Start production server
- `lint`: Run ESLint

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License.
