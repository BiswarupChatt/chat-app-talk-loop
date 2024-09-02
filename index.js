import dotenv from 'dotenv'
dotenv.config()

import { configureDB } from './config/db.js';

import express from 'express';

const app = express()
const PORT = process.env.PORT || 3000

configureDB()


app.get('/', (req, res) => {
    res.send('API is running')
})

app.listen(PORT, console.log(`Server is running on port ${PORT}`))