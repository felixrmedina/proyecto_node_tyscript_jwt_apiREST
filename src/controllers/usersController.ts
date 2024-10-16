
import { Request, RequestHandler, Response } from "express"
import { hashPassword } from "../services/password.service"
import prisma from '../models/user'
import { json } from "stream/consumers"

export const createUser = async (req:Request, res: Response): Promise<void>=>{
    try {
        const {email,password}=req.body
        if (!password) {
            res.status(400).json({message: `El password es obligatorio`})
            return
        }
        if (!email){
            res.status(400).json({message: `El email es obligatorio`})
            return
        }
        const hashedPassword = await hashPassword(password)
        const user = await prisma.create(
            {
                data:{
                    email,
                    password: hashedPassword
                }
            }
        )
        res.status(201).json(user)
    } catch (error:any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({message: 'El email ingresado ya existe'})
        }
        console.log(error)
        res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
    }
}

export const getAllUsers = async (req:Request, res: Response): Promise<void>=>{
    try {
        const users= await prisma.findMany()
        res.status(200).json(users)
    } catch (error:any) {
        console.log(error)
        res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
    }
}

export const getUsersById = async (req:Request, res: Response): Promise<void>=>{
   const userId=parseInt(req.params.id)

    try {
        const users= await prisma.findUnique({
            where:{
                id:userId
            }
        })
        if (!users) {
            res.status(404).json({error: 'El usuario no fue encontrado'})
            return
        }
        res.status(200).json(users)
    } catch (error:any) {
        console.log(error)
        res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
    }
}


export const updateUsers = async (req:Request, res: Response): Promise<void>=>{
    const userId=parseInt(req.params.id)
 const {email,password}=req.body
     try {
        let dataToUpdate: any={...req.body}
         if (password) {
            const hashedPassword = await hashPassword(password)
            dataToUpdate.password=hashedPassword
         }

        if (email) {
            dataToUpdate.email=email
        }

         const users= await prisma.update({
             where:{
                 id:userId
             },
             data: dataToUpdate
         })
         
         res.status(200).json(users)
     } catch (error:any) {
        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({error: 'El email ingresado ya existe'})
        }else if (error?.code == 'P2025') {
            res.status(404).json({error: 'Usuario no encontrado'})
        }
         console.log(error)
         res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
     }
 }


 export const deleteUsers= async  (req:Request,res:Response): Promise<void>=>{
    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id:userId
            }
        })
        res.status(200).json({
            message: 'El usuario ha sido eliminado'
        }).end()
    } catch (error:any) {
        console.log(error)
        res.status(500).json({error: 'Hubo un error, pruebe mas tarde'})
    }
 }