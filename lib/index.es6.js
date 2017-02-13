/*eslint no-console: [, { allow: ["warn", "log"] }] */

import User from './models/user.es6';
import bodyParser from 'body-parser';
import config from './config.es6';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import todos from './controllers/todos.es6';
import users from './controllers/users.es6';

//import http from 'http';

//create a express app
const app = express();

//use HTTP body parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  configuration =============================================================
// port to create, sign, and verify tokens
const port =  process.env.PORT || 3005; 
// connect to Database
mongoose.Promise = global.Promise;
mongoose.connect(config.database)
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));
// setting secret key
app.set('secretKey', config.secret);

app.listen(port, () => {
	console.log('listening on 3005');
});

// initial routes =============================================================
//basic route
app.get('/', (req, res) => {
	res.send('Welcome to the Web Server');
});

// create a generic user
app.get('/setup', function(req, res) {

	var admin = new User({ 
		name: 'admin', 
		password: 'password',
		active: true 
	});
	admin.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

//route to authenticate a user
app.post('/authenticate', (req, res) => {
  // find the user
	User.findOne({
		name: req.body.name
	}, (err, user) => {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

    // check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

        // if user is found and password is right
        // create a token
				const token = jwt.sign(user, app.get('secretKey'), {
					expiresIn: 24*60 // expires in 24 hours
				});

        // return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token
				});
			}   
		}
	});
});

// route middleware to verify a token
app.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
	if (token) {
    // verifies secret and checks expiration
		jwt.verify(token, app.get('secretKey'), function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
        // if everything is good, save to request for use in other routes
				req.decoded = decoded;    
				next();
			}
		});
	} else {
    // if there is no token
    // return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.' 
		});    
	}
});

//apply routes 
app.use('/todos', todos);
app.use('/users', users);