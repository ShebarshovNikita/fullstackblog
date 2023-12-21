import { body } from 'express-validator'

export const registerValidation = [
	body('email', 'Incorrect email').isEmail(),
	body('password', 'Min length is 5').isLength({min: 5}),
	body('fullName', 'Min length is 3').isLength({min: 3}),
	body('avatarUrl', 'Incorrect URL').optional().isURL()
]