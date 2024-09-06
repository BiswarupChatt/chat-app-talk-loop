import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import { checkSchema } from 'express-validator';
import morgan from 'morgan';
import cors from 'cors'


import { userCtrl } from './app/controllers/user-ctrl.js';

import { userRegisterValidations, userLoginValidations } from './app/validations/user-validations.js';

import { configureDB } from './config/db.js';

import { authenticateUser } from './app/middlewares/authenticateUser.js';

const app = express()
const PORT = process.env.PORT || 3000

configureDB()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('API is running')
})

app.get('/api/user', authenticateUser, userCtrl.allUser)
app.post('/api/user/register', checkSchema(userRegisterValidations), userCtrl.register)
app.post('/api/user/login', checkSchema(userLoginValidations), userCtrl.login)

app.post('/api/chat', authenticateUser, )
app.get('/api/chat', authenticateUser, )


app.listen(PORT, console.log(`Server is running on port ${PORT}`))