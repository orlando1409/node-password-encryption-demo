import User from '../models/user.es6';
import express from 'express';

const router = express.Router();

//GET /users listing.
router.get('/', (req, res, next) => {
	User.find((err, users) => {
		if (err) return next(err);
		res.json(users);
	});
});

//POST /users
router.post('/', (req, res, next) => {
	User.create(req.body, (err, post) => {
		if (err) return next(err);   
		res.json(post);
	});
});

//GET /users/id
router.get('/:id', (req, res, next) => {
	User.findById(req.params.id, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

//PUT /users/:id
router.put('/:id', (req, res, next) => {
	User.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

//DELETE /users/:id
router.delete('/:id', (req, res, next) => {
	User.findByIdAndRemove(req.params.id, req.body, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

export default router;