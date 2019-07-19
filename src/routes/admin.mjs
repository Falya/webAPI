import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { getGenres, getCities } from '../methods/adminMethods.mjs';
import * as authService from '../services/auth.mjs';
import { adminInsertMiddleware } from '../middlewares/middlewares.mjs';
import { addMovie, addCity } from '../methods/adminMethods.mjs';
dotenv.config();

const router = express.Router();

router.use(adminInsertMiddleware);

router.post('/login', async (req, res) => {
  console.log('req: ', req.body);

  const response = await authService.adminLogin(req.body);
  res.json(response);
});

router.get('/genres', passport.authenticate('jwt', { session: false }), async (req, res) => {
  getGenres()
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.post('/add-movie', passport.authenticate('jwt', { session: false }), (req, res) => {
  addMovie(req.body)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router
  .route('/cities')
  .get(passport.authenticate('jwt', { session: false }), async (req, res) => {
    getCities()
      .then(result => res.send(result))
      .catch(err => console.log(err));
  })
  .post(passport.authenticate('jwt', { session: false }), async (req, res) => {
    addCity(req.body)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });

export default router;
