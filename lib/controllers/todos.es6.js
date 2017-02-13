import Todo from '../models/todo.es6';
import express from 'express';

const router = express.Router();

//GET /todos listing.
router.get('/', (req, res, next) => {
	Todo.find((err, todos) => {
		if (err) return next(err);
		res.json(todos);
	});
});

//POST /todos
router.post('/', (req, res, next) => {
	Todo.create(req.body, (err, post) => {
		if (err) return next(err);   
		res.json(post);
	});
});

//GET /todos/id
router.get('/:id', (req, res, next) => {
	Todo.findById(req.params.id, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

//PUT /todos/:id
router.put('/:id', (req, res, next) => {
	Todo.findByIdAndUpdate(req.params.id, req.body, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

//DELETE /todos/:id
router.delete('/:id', (req, res, next) => {
	Todo.findByIdAndRemove(req.params.id, req.body, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

export default router;