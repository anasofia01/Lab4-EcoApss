const express = require('express');
const cors = require('cors');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json()); // utility to process JSON in requests
app.use(cors()); // utility to allow clients to make requests from other hosts or ips

const db = {
	users: [],
	posts: [],
};

const secretKey = 'AnaSofia';

const verifyToken = (request, response, next) => {
	const authHeader = request.headers['authorization'];
	if (!authHeader) {
		return response.status(403).send({ error: 'No token provided' });
	}
	const token = authHeader.split(' ')[1];
	jwt.verify(token, secretKey, (error, user) => {
		if (error) {
			return response.status(401).send({ error: 'Token invalid' });
		}
		request.user = user;
		next();
	});
};

app.post('/register', (request, response) => {
	const { name, email, password } = request.body;
	if (!name || name.trim() === '') {
		return response.status(400).send({ error: 'Name is required' });
	}
	if (!validator.isEmail(email)) {
		return response.status(400).send({ error: 'Invalid email' });
	}
	if (!password || password.trim() === '' || password.length <= 10) {
		return response.status(400).send({ error: 'Password is required and must be at least 10 characters' });
	}
	const userExist = db.users.find((user) => user.email === email);
	if (userExist) {
		return response.status(400).send({ error: 'Email already in use' });
	}
	const newUser = { name, email, password };
	db.users.push(newUser);
	// const token = jwt.sign({ email: newUser.email }, secretKey, { expiresIn: '20m' });
	return response.status(201).send({ name, message: 'The user was created well' });
});

app.get('/users', (request, response) => {
	const user = db.users.map((user) => ({
		name: user.name,
		email: user.email,
	}));
	response.status(200).send(user);
});

app.post('/login', (request, response) => {
	const { email, password } = request.body;
	if (!validator.isEmail(email)) {
		return response.status(400).send({ error: 'Invalid email' });
	}
	const userFind = db.users.find((user) => user.email === email);
	if (!userFind) {
		return response.status(400).send({ error: 'User not found' });
	}
	if (userFind.password !== password) {
		return response.status(400).send({ error: 'Invalid password' });
	}
	const token = jwt.sign({ email: userFind.email }, secretKey, { expiresIn: '20m' });
	const name = userFind.name;
	return response.status(200).send({ token, name, message: 'Correct Login' });
});

app.post('/posts', verifyToken, (request, response) => {
	const { urlImg, title, description, name } = request.body;
	if (!urlImg || !validator.isURL(urlImg)) {
		return response.status(400).send({ error: 'Invalid url' });
	}
	if (!title || title.trim() === '') {
		return response.status(400).send({ error: 'Title is required' });
	}
	if (!description || description.trim() === '') {
		return response.status(400).send({ error: 'Description is required' });
	}
	if (!name || name.trim() === '') {
		return response.status(400).send({ error: 'Name is required' });
	}
	const newPost = { urlImg, title, description, name };
	db.posts.push(newPost);
	return response.status(201).send({ message: 'The post was created well' });
});

app.get('/posts', (request, response) => {
	response.status(200).send(db.posts);
});

app.listen(5050, () => {
	console.log(`Server is running on http://localhost:${5050}`);
});
