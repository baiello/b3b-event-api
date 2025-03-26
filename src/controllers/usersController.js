const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const prisma = require('../utils/db.js');

const router = express.Router();


const UserRegister = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstname: z.string(),
    lastname: z.string(),
    birthdate: z.string().date(),
});

const UserLogin = z.object({
    email: z.string().email(),
    password: z.string(),
});


router.post('/register', async (req, res, next) => {
    try {
        const { email, password, firstname, lastname, birthdate } = UserRegister.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstname,
                lastname,
                birthdate: new Date(birthdate),
            }
        });

        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    const erroJson = { errors: [ { message: 'Invalid credentials' } ]};

    try {
        const { email, password } = UserLogin.parse(req.body);

        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });

        !user && res.status(200).json(erroJson);

        const credentialsMatches = await bcrypt.compare(password, user.password);

        !credentialsMatches && res.status(200).json(erroJson);

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "12 hours" });

        return res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
