import dotenv from 'dotenv'
dotenv.config()
import express from  'express'
import authroutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'
const app = express()
app.use(express.json())

//Routes

app.use('/auth', authroutes)
app.use('/users', usersRoutes)
//autenticacion

//user una api rest

export default app