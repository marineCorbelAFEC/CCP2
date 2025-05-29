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
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// 1. Charge le JSON complet (tel que téléchargé depuis Google Cloud)
const allSecrets = JSON.parse(fs.readFileSync(process.env.SECRET_PATH, 'utf8'));

// 2. Selon le format, les credentials sont souvent sous l’objet "web"
const creds = allSecrets.web || allSecrets.installed || allSecrets;

// 3. Récupère les valeurs clés
const GOOGLE_CLIENT_ID = creds.client_id;
const GOOGLE_CLIENT_SECRET = creds.client_secret;
// redirect_uris est un tableau, prends la première (celle que tu as déclarée dans Google Console)
const GOOGLE_CALLBACK_URL = creds.redirect_uris[0];

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

const app = express();
console.info('Démarrage du serveur...');
console.log(`Port du serveur : ${process.env.SERVER_PORT}`);
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
    failureRedirect: '/', // si l’auth échoue
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
