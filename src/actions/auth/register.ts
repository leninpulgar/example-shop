'use server';
import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs';


export const registerUser = async( name: string, email: string, password: string) => {

    try {

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email.toLowerCase(),
                password: bcryptjs.hashSync( password ) // Hash the password
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })


        return {
            ok: true,
            user: user,
            message: 'User registered successfully.'
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'An error occurred while registering the user.'
        }
    }
}