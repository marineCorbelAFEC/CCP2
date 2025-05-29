import 'dotenv/config';
import express from 'express';
import authRouter from './routes/authRouter.js';
import applicationRouter from './routes/applicationRouter.js';

import missionRouter from './routes/missionsRouter.js';
import { userService, roleService } from './instanciation.js';
// pour instancier avant les middlewares
import cors from 'cors';
import cookieParser from 'cookie-parser';
import organizationRouter from './routes/organizationRouter.js';
import helmet from 'helmet';

import fs from 'fs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"], // Bloque les scripts externes
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'], // Autorise seulement les images locales et base64
      objectSrc: ["'none'"], // Bloque les plugins comme Flash
    },
  })
);

app.use(
  cors({
    origin: [`${process.env.FRONT_URL}`],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());

const allSecrets = JSON.parse(fs.readFileSync(process.env.SECRET_PATH, 'utf8'));

const creds = allSecrets.web || allSecrets.installed || allSecrets;

const GOOGLE_CLIENT_ID = creds.client_id;
const GOOGLE_CLIENT_SECRET = creds.client_secret;

const GOOGLE_CALLBACK_URL = creds.redirect_uris[0];

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: false,
  })
);

// 4. Utilisation dans Passport
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

console.info('Démarrage du serveur...');
console.log(`Port du serveur : ${process.env.SERVER_PORT}`);

// Sérialisation/desérialisation de l'utilisateur
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware de vérification d'authentification
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

app.get('/', (req, res) => {
  res.send(`accueil de l'application `);
});
app.get('/fail', (req, res) => {
  res.send(`authentification échouée, veuillez réessayer`);
});

app.get('/fichier', ensureAuth, (req, res) => {
  res.send(
    `test de l'authentification réussie, voici votre profil : ${JSON.stringify(
      req.user || 'aucun utilisateur connecté'
    )}`
  );
});

// 1) Route pour démarrer l’authentification Google
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// 2) Route de callback que Google va appeler
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/fail', // si l’auth échoue
    successRedirect: '/', // où rediriger si l’auth réussit
  })
);

app.use('/api/auth', authRouter);
app.use('/api/missions', missionRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/organizations', organizationRouter);

app.use((req, res) => {
  res.status(404).send('Path Not found');
});
app.use((err, req, res, next) => {
  console.error(err);
  if (!err.statusCode)
    return res.status(500).json({ message: 'Erreur innatendu' });
  if (err.statusCode === 409) {
    return res.status(400).json({ message: 'user not created' });
  }
  res.status(err.statusCode).json({ message: err.message });
});

const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
  console.info(`Serveur démarré sur le port ${PORT}`);
});
