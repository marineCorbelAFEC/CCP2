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
    origin: ['http://localhost:5174'],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.disable('x-powered-by');
app.use(cookieParser());
app.use(express.json());

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
