import express from 'express';
import passport from 'passport';
import { getMovieSeances, getMovie, getOptionsForFilters, getSeance } from '../methods/clientMethods.mjs';
import * as authService from '../services/auth.mjs';
import { toBlockSeat } from '../methods/clientMethods.mjs';
import { unBlockSeat } from '../methods/clientMethods.mjs';
import uuidv4 from 'uuid/v4.js';
import stripeApp from 'stripe';
import { compareOrder } from '../methods/clientMethods.mjs';
import dotenv from 'dotenv';
import { getUserProfile } from '../methods/clientMethods.mjs';
import messages from '../namedMessages/namedMessages.mjs';
import { getMovies } from '../methods/clientMethods.mjs';
import { userRegistrationMiddleware } from '../middlewares/middlewares.mjs';

dotenv.config();

const stripe = stripeApp(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post('/login', async (req, res) => {
  const response = await authService.login(req.body);
  res.json(response);
});

router.post('/signup', userRegistrationMiddleware, async (req, res) => {
  const response = await authService.signup(req.body);
  res.json(response);
});

router.get('/getusername', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.json(req.user.nickName);
});

router.get('/movies', (req, res) => {
  getMovies()
    .then(result => res.json(result))
    .catch(err => console.error(err));
});

router.get('/movies/movie/', (req, res) => {
  getMovie(req.query.id)
    .then(movie => res.send(movie))
    .catch(err => console.log(err));
});

router.post('/movies/movie/seances/', (req, res) => {
  getMovieSeances(req.body)
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
  let status = { success: false, message: messages.PAYMENT_FAILED };
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
      const idempotencyKey = uuidv4();
      const charge = await stripe.charges.create(
        {
          amount,
          currency: currency,
          customer: customer.id,
          description: description,
        },
        {
          idempotency_key: idempotencyKey,
        }
      );
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

export default router;
