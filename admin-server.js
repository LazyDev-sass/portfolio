const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_PATH = path.join(__dirname, 'public', 'data.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Ensure uploads directory exists
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const stamp = Date.now();
    cb(null, `${stamp}_${safeName}`);
  },
});

const upload = multer({ storage });

async function readDataFile() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    const trimmed = raw.trim();
    if (!trimmed) {
      return getEmptySchema();
    }
    return JSON.parse(trimmed);
  } catch (err) {
    // If file doesn't exist or is invalid, fall back to empty schema
    return getEmptySchema();
  }
}

function getEmptySchema() {
  return {
    welcome: {
      name: '',
      role: '',
      photo_url: '',
      tagline: '',
      secondary_text: '',
      resume_url: '',
      limit: {
        name: 50,
        role: 100,
      },
    },
    about: {
      bio: '',
      limit: {
        bio: 500,
      },
    },
    education: [],
    certifications: [],
    projects: [],
    skills: [],
    contact: {
      email: '',
      phone: '',
      social_links: [],
      instagram: '',
      facebook: '',
      youtube: '',
      github_profile: '',
      leetcode: '',
      limit: {
        email: 100,
      },
    },
  };
}

function collectImagePaths(data) {
  const paths = new Set();
  if (!data || typeof data !== 'object') return paths;

  if (data.welcome && typeof data.welcome.photo_url === 'string') {
    if (data.welcome.photo_url.startsWith('/uploads/')) {
      paths.add(data.welcome.photo_url);
    }
  }

  if (Array.isArray(data.projects)) {
    for (const proj of data.projects) {
      if (proj && typeof proj.image_url === 'string' && proj.image_url.startsWith('/uploads/')) {
        paths.add(proj.image_url);
      }
    }
  }

  if (Array.isArray(data.certifications)) {
    for (const cert of data.certifications) {
      if (cert && typeof cert.image_url === 'string' && cert.image_url.startsWith('/uploads/')) {
        paths.add(cert.image_url);
      }
    }
  }

  return paths;
}

async function removeUnusedImages(oldData, newData) {
  const oldPaths = collectImagePaths(oldData);
  const newPaths = collectImagePaths(newData);

  for (const p of oldPaths) {
    if (!newPaths.has(p)) {
      const rel = p.replace(/^\/+/, '');
      const fileOnDisk = path.join(__dirname, 'public', rel);
      try {
        await fs.unlink(fileOnDisk);
      } catch (err) {
        // Ignore missing files or fs errors; we don't want to fail the save for this
      }
    }
  }
}

// API: get current data (or empty schema)
app.get('/api/data', async (req, res) => {
  try {
    const data = await readDataFile();
    res.json(data);
  } catch (err) {
    console.error('Error reading data.json', err);
    res.status(500).json({ error: 'Failed to read data file' });
  }
});

// API: replace data.json contents
app.put('/api/data', async (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  try {
    const previous = await readDataFile();
    const formatted = JSON.stringify(body, null, 2);
    await fs.writeFile(DATA_PATH, formatted + '\n', 'utf8');
    // Clean up any /uploads/* files that are no longer referenced
    await removeUnusedImages(previous, body);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error writing data.json', err);
    res.status(500).json({ error: 'Failed to write data file' });
  }
});

// API: upload image file -> returns URL under /uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Missing file field "file"' });
  }
  const urlPath = `/uploads/${req.file.filename}`;
  res.json({ url: urlPath });
});

// Serve built-in static assets
app.use('/uploads', express.static(UPLOAD_DIR));
// Serve admin UI
app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.listen(PORT, () => {
  console.log(`Admin server listening on http://localhost:${PORT}`);
  console.log('Admin UI: http://localhost:%d/admin', PORT);
});

