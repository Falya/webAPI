import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import { getGenres, getCities } from '../methods/adminMethods.mjs';
import * as authService from '../services/auth.mjs';
import { adminInsertMiddleware } from '../middlewares/middlewares.mjs';
import { addMovie, addCity, updateMovie } from '../methods/adminMethods.mjs';
import { getTheaters, getTheater } from '../methods/adminMethods.mjs';
import { addMovieTheater, addFeature } from '../methods/adminMethods.mjs';
import { addHall } from '../methods/adminMethods.mjs';
import { getMovies } from '../methods/clientMethods.mjs';
import { getSeances } from '../methods/adminMethods.mjs';
import { addSeance } from '../methods/adminMethods.mjs';
import { getDrafts } from '../methods/adminMethods.mjs';
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

router
  .route('/add-movie')
  .post(passport.authenticate('jwt', { session: false }), (req, res) => {
    addMovie(req.body)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  })
  .put(passport.authenticate('jwt', { session: false }), (req, res) => {
    updateMovie(req.body)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  })


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

router
  .route('/theaters')
  .get(passport.authenticate('jwt', { session: false }), async (req, res) => {
    getTheaters(req.query)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  })
  .post(passport.authenticate('jwt', { session: false }), async (req, res) => {
    addMovieTheater(req.body)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });

router.get('/theaters/theater', passport.authenticate('jwt', { session: false }), async (req, res) => {
  getTheater(req.query)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});
router.post('/theaters/feature', passport.authenticate('jwt', { session: false }), async (req, res) => {
  addFeature(req.body)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.post('/theaters/halls', passport.authenticate('jwt', { session: false }), async (req, res) => {
  addHall(req.body)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  getMovies()
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.get('/movies/drafts', passport.authenticate('jwt', { session: false }), async (req, res) => {
  getDrafts()
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router
  .route('/seances')
  .get(passport.authenticate('jwt', { session: false }), async (req, res) => {
    getSeances(req.query)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  })
  .post(passport.authenticate('jwt', { session: false }), async (req, res) => {
    addSeance(req.body)
      .then(result => res.send(result))
      .catch(err => console.log(err));
  });

export default router;
