# Airbnb Clone

A full-stack Airbnb-style app: browse stays, search by location and category, view listing details with a booking cost calculator, manage listings (CRUD), and authenticate with JWT. Built with **React** (Redux, React Router) and **Express** + **MongoDB** (Mongoose).

## Quick start

1. **Backend** (API + database)
   ```bash
   cd backend
   npm install
   cp .env.example .env   # set MONGODB_URI and JWT_SECRET
   npm run server         # http://localhost:5000
   ```
   Ensure MongoDB is running locally or set `MONGODB_URI` in `.env`.

2. **Frontend**
   ```bash
   npm install
   npm start              # http://localhost:3000
   ```

## Tech stack

- **Frontend:** React, Redux, React Router, MUI (icons), CSS
- **Backend:** Express, Mongoose, JWT (jsonwebtoken), bcryptjs, helmet, express-rate-limit
- **Database:** MongoDB

## Documentation

- [**API reference**](docs/API.md) – Auth, listings, reservations (request/response, status codes)
- [**Security**](docs/SECURITY.md) – JWT, validation, rate limiting, production checklist
- [**Backend**](backend/README.md) – MongoDB + Express setup
- [**Frontend structure**](src/README.md) – Components, actions, utils

## Features

- Home: banner, province cards, “Inspiration for your next trip”, gift cards, hosting CTA, category tabs with filtered listings
- Search: filter by location and category, listing cards with details and navigation to listing page
- Listing detail: gallery, heading/subheading, cost calculator (dates, guests), static sections (about, amenities, house rules)
- Listings management: create, edit, delete listings (with validation)
- Auth: login / register (JWT), protected routes, session handling and 401 logout
- Reservations: create and list reservations (API)

## UI notes

- Card hover: card lifts with stronger shadow, image zooms slightly (0.25s / 0.4s).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
