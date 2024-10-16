import express, { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { createUser, deleteUsers, getAllUsers, getUsersById, updateUsers } from '../controllers/usersController'

const router = express.Router()
const JWT_SECRET= process.env.JWT_SECRET || 'default-secret'
//Middleware de JWT para ver si estamos autenticados

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers['authorization'] as string|undefined
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
         res.status(401).json({ error: 'No autorizado' })
        return 
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {
            console.error('Error en la autenticación: ', err)
            return res.status(403).json({ error: 'No tienes acceso a este recurso' })
        }

        next();

    })

}

router.post('/',authenticateToken,createUser)
router.get('/',authenticateToken, getAllUsers)
router.get('/:id',authenticateToken, getUsersById)
router.put('/:id',authenticateToken, updateUsers)
router.delete('/:id',authenticateToken, deleteUsers)


export default router