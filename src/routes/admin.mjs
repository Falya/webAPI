import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { addMovieTheater, addSeance } from '../methods/adminMethods.mjs';
import { seance, hall } from '../../forTest/testTheater.mjs';
import * as authService from '../services/auth.mjs';
dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  console.log('req: ', req.body);

  const response = await authService.adminLogin(req.body);
  res.json(response);
});

router.get('/test-create/theater', (req, res) => {
  addMovieTheater(hall)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.get('/test-create/seance', (req, res) => {
  addSeance(seance)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

export default router;
