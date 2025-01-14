import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user, account, profile }) {
            
            await dbConnect();
            console.log(user);
            
            const userExists = await User.findOne({ id: user.id });
            if (userExists) {
                return { redirect: '/plans' };
            }

            console.log(user);
            
            await User.create({
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
            });
            return { redirect: '/plans' };
        }
    },
    pages: {
        signIn: '/login',
    },
});

export { handler as GET , handler as POST };