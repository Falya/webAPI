import express from 'express';
import passport from 'passport';
import Movie from '../models/Movie.mjs';
import { addMovieTheater, addSeance } from '../methods/adminMethods.mjs';
import { getMovieSeances, getMovie, getOptionsForFilters, getSeance } from '../methods/clientMethods.mjs';
import { seance, hall } from '../../forTest/testTheater.mjs';
import * as authService from '../services/auth.mjs';
import { toBlockSeat } from '../methods/clientMethods.mjs';
import { unBlockSeat } from '../methods/clientMethods.mjs';
import uuidv4 from 'uuid/v4.js';
import stripeApp from 'stripe';
import { compareOrder } from '../methods/clientMethods.mjs';
import dotenv from 'dotenv';
import { getUserProfile } from '../methods/clientMethods.mjs';

dotenv.config();

const stripe = stripeApp(process.env.STRIPE_SECRET_KEY);

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

router.get('/user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const result = await getUserProfile(req.user);
  res.json(result);
});

router.post('/payment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  console.log(req.body);

  let error;
  let status = { success: false, message: 'Failed payment' };
  try {
    const {
      totalPrice,
      currency = 'brl',
      description,
      stripeEmail,
      stripeToken,
      stripeTokenType,
      orderTickets,
      orderFeatures,
    } = req.body;

    const amount = totalPrice;

    const customer = await stripe.customers.create({
      email: stripeEmail,
      source: stripeToken,
      metadata: {
        userId: req.user.id,
      },
    });

    if (stripeTokenType === 'card') {
      const idempotency_key = uuidv4();
      const charge = await stripe.charges.create(
        {
          amount,
          currency: currency,
          customer: customer.id,
          description: description,
        },
        {
          idempotency_key,
        }
      );
      console.log('charge:');
      console.log(JSON.stringify(charge));
    } else {
      throw Error(`Unrecognized Stripe token type: "${stripeTokenType}"`);
    }

    const params = {
      orderTickets,
      orderFeatures,
      userId: req.user.id,
    };

    status = await compareOrder(params);
  } catch (err) {
    console.error(err);
    error = err;
  }

  res.json({ error, status });
});

/**Some querys for create testing */
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
