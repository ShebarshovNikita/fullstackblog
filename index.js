import express from 'express'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

import { registerValidation } from './validations/auth.js'
import   UserModel   from './models/User.js'

mongoose
.connect('mongodb+srv://admin:1111@cluster0.bly8lpu.mongodb.net/blog?retryWrites=true&w=majority')
.then(() => {
	console.log('DBok')
	})
.catch((err) => console.log('DB error', err))

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
	res.send("HEllo")
})


app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req)

		if(!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		const doc = new UserModel({
			email: req.body.email,
			avatarUrl: req.body.avatarUrl,
			fullname: req.body.fullName,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign({
			_id: user._id
		}, 'secret123', { expiresIn: '30d' })
		
		const { passwordHash , ...userData} = user._doc

		res.json({
			...userData,
			token
		})
	} catch(err) {
		console.log(err)
		res.status(500).json({
			message: 'Cant register',
			error: err
		})
	}
})


app.listen(4444, (err) => {
	if (err) {
		return console.log(err)
	}

	console.log("server ok")
})

