import express from 'express';
import passport from 'passport';
import Movie from '../models/Movie.mjs';
import { addMovieTheater, addSeance } from '../methods/adminMethods.mjs';
import { getMovieSeances, getMovie, getOptionsForFilters, getSeance } from '../methods/clientMethods.mjs';
import { seance, theater } from '../../forTest/testTheater.mjs';
import * as authService from '../services/auth.mjs';
import { toBlockSeat } from '../methods/clientMethods.mjs';
import { unBlockSeat } from '../methods/clientMethods.mjs';

const router = express.Router();

router.post('/login', async (req, res) => {
  const response = await authService.login(req.body);
  res.json(response);
});

router.post('/signup', async (req, res) => {
  const response = await authService.signup(req.body);
  res.json(response);
});

router.get('/getusername', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json(req.user.nickName);
});

router.get('/movies', (req, res) => {
  Movie.find({}, (err, movies) => {
    if (err) {
      return console.log(err);
    }
    res.send(movies);
  });
});

router.get('/movies/movie/', (req, res) => {
  getMovie(req.query.id)
    .then(movie => res.send(movie))
    .catch(err => console.log(err));
});

router.get('/movies/movie/seances/', (req, res) => {
  getMovieSeances(req.query)
    .then(data => {
      res.send(data);
    })
    .catch(err => console.log(err));
});

router.get('/movies/filters/', (req, res) => {
  getOptionsForFilters(req.query)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.get('/seance/', (req, res) => {
  getSeance(req.query)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.get('/seance/authorized/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const params = {
    ...req.query,
    userId: req.user._id,
  };
  getSeance(params)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.post('/seance/to-block-seat', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const params = {
    ...req.body,
    userId: req.user._id,
  };
  toBlockSeat(params).then(result => res.json(result));
  // res.json(req.body);
});

router.post('/seance/unblock-seat', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const params = {
    ...req.body,
    userId: req.user._id,
  };

  unBlockSeat(params).then(result => res.json(result));
});

/**Some querys for create testing */
router.get('/test-create/theater', (req, res) => {
  addMovieTheater(theater)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

router.get('/test-create/seance', (req, res) => {
  addSeance(seance)
    .then(result => res.send(result))
    .catch(err => console.log(err));
});

export default router;
