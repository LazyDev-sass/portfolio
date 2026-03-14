# Portfolio Template (JSON‑Driven, React + Tailwind)

This is a modern, animated developer portfolio built with **React (CRA)**, **Tailwind CSS**, and **Framer Motion**.  
All content is driven from a single JSON file (`public/data.json`), so you can customize the site without touching React code.

---

## Features

- **JSON‑driven content** via `public/data.json`
  - Hero (name, role, tagline, secondary text, photo, résumé link)
  - About
  - Skills with ratings
  - Education
  - Certifications (with optional credential links)
  - Projects (with optional preview images and links)
  - Contact (email, phone, social + coding profiles)
- **Framer Motion animations**
  - Fade‑in hero
  - Scroll‑triggered project and certification cards
  - Animated skill bars
- **Hero section**
  - Animated gradient background
  - Rotating multicolor profile border
  - CTA buttons: view projects, download résumé, contact
- **Responsive layout**
  - Mobile‑friendly navbar with a collapsible menu
  - Desktop navbar with smooth section scroll
- **Optional links**
  - Project / certification / social / coding links only render when provided.

---

## Getting Started

### Prerequisites

- **Node.js** (v16+ recommended) and **npm**

### Install & Run (manually)

```bash
cd c:\PORTFOLIO\portfolio
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

### One‑click scripts

#### Windows

Double‑click `run-portfolio.bat` in the `portfolio` folder, or run:

```bash
cd c:\PORTFOLIO\portfolio
run-portfolio.bat
```

#### macOS / Linux

```bash
cd /path/to/PORTFOLIO/portfolio
chmod +x run-portfolio.sh   # first time only
./run-portfolio.sh
```

---

## JSON Schema (`public/data.json`)

All main sections are configured here.

### `welcome`

```json
"welcome": {
  "name": "Alex Johnson",
  "role": "Full Stack Developer & UI Enthusiast",
  "photo_url": "https://...",
  "tagline": "Short hero sentence...",
  "secondary_text": "Smaller paragraph on the right side of hero...",
  "resume_url": "/resume.pdf",
  "limit": {
    "name": 50,
    "role": 100
  }
}
```

- Put your résumé file in `public/resume.pdf` or change `resume_url` to point to another URL.

### `about`

```json
"about": {
  "bio": "Longer about text...",
  "limit": { "bio": 500 }
}
```

### `education`

```json
"education": [
  {
    "degree": "Bachelor of Science in Computer Science",
    "institution": "University of Example",
    "year": "2020",
    "limit": {
      "degree": 100,
      "institution": 100,
      "year": 10
    }
  }
]
```

### `skills`

```json
"skills": [
  { "name": "React", "category": "Frontend", "rating": 5 },
  { "name": "TypeScript", "category": "Frontend", "rating": 4 }
]
```

- `rating` is from `0` to `5`. Bars animate based on this value.

### `certifications`

```json
"certifications": [
  {
    "title": "AWS Certified Solutions Architect – Associate",
    "issuer": "Amazon Web Services",
    "year": "2023",
    "description": "Short summary...",
    "link": "https://...",        // optional
    "limit": { "title": 120, "issuer": 120, "description": 300 }
  }
]
```

- If `link` is omitted or empty, **no button** is shown for that certification.

### `projects`

```json
"projects": [
  {
    "title": "Modern Portfolio Website",
    "tech_stack": ["React", "Tailwind CSS", "Framer Motion"],
    "description": "Short project description...",
    "link": "https://github.com/...",     // optional
    "image_url": "https://...",           // optional (preview image)
    "limit": { "title": 100, "description": 300 }
  }
]
```

- If `link` is missing, the **“View project”** button is hidden.
- If `image_url` is missing, a gradient **“Preview”** placeholder is shown.

### `contact`

```json
"contact": {
  "email": "you@example.com",
  "phone": "+1 (555) 123-4567",
  "social_links": [
    { "platform": "LinkedIn", "url": "https://linkedin.com/in/your-handle" }
  ],
  "instagram": "https://instagram.com/your-handle",   // optional
  "facebook": "https://facebook.com/your-profile",    // optional
  "youtube": "https://youtube.com/@your-channel",     // optional
  "github_profile": "https://github.com/your-username", // optional
  "leetcode": "https://leetcode.com/your-username",     // optional
  "limit": {
    "email": 100
  }
}
```

- **Email**: rendered as a `mailto:` link with a circular `@` badge.
- **Phone**: rendered as a `tel:` link with a phone badge when present.
- **Instagram / Facebook / YouTube / GitHub / LeetCode**:
  - Each has its own badge (IG, f, YT, GH, LC).
  - If a URL is **not provided**, that platform is simply **not shown**.

---

## Available NPM Scripts

In the `portfolio` directory:

- `npm start` – start the development server on `http://localhost:3000`.
- `npm run build` – create a production build in the `build` folder.
- `npm test` – run tests (default CRA setup).

---

## Deployment

After running:

```bash
npm run build
```

The optimized static site is in the `build` directory. You can deploy it to:

- Static hosts (Netlify, Vercel, GitHub Pages, etc.)
- Any static file server:

```bash
npm install -g serve
serve -s build
```

---

## Customization Tips

- Update **content only** via `public/data.json` for most changes.
- Replace the **profile photo** by changing `welcome.photo_url`.
- Update all social / coding links in `contact` before sharing the portfolio.
- You can tweak colors, spacing, and animations in:
  - `src/App.css` – custom CSS for hero, profile ring, contact badges, etc.
  - `src/components/*.js` – React components and motion variants.

---

## Running in Termux (Android)

You can run the portfolio on Android using the Termux app.

### Install prerequisites

```bash
pkg update
pkg upgrade
pkg install nodejs-lts git
```

### Get the project into Termux

Either clone from your repository:

```bash
git clone <your-repo-url>.git
cd your-repo/portfolio
```

Or copy the `portfolio` folder into Termux storage and:

```bash
cd /path/to/portfolio
```

### Run the app

```bash
chmod +x run-portfolio.sh   # first time only
./run-portfolio.sh
```

This script runs:

```bash
npm install
npm start
```

Then open `http://127.0.0.1:3000` in your Android browser.

---

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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