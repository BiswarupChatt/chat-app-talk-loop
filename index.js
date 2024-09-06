import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import { checkSchema } from 'express-validator';
import morgan from 'morgan';
import cors from 'cors'


import { userCtrl } from './app/controllers/user-ctrl.js';

import { userRegisterValidations, userLoginValidations } from './app/validations/user-validations.js';

import { configureDB } from './config/db.js';

const app = express()
const PORT = process.env.PORT || 3000

configureDB()

app.use(express.json())
app.use(morgan('combined'))
app.use(cors())

app.get('/', (req, res) => {
    res.send('API is running')
})

app.post('/api/user/register', checkSchema(userRegisterValidations), userCtrl.register)
app.post('/api/user/login', checkSchema(userLoginValidations), userCtrl.login)



app.listen(PORT, console.log(`Server is running on port ${PORT}`))