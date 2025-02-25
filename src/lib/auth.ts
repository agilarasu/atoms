import GithubProvider from 'next-auth/providers/github';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.AUTH_GITHUB_ID || '',
            clientSecret: process.env.AUTH_GITHUB_SECRET || '',
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user: any }) {
            await dbConnect();
            console.log(user);

            const userExists = await User.findOne({ id: user.id });
            if (userExists) {
                return { redirect: '/learn' };
            }

            console.log(user);

            await User.create({
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
            });
            return { redirect: '/learn' };
        }
    },
    pages: {
        signIn: '/login',
    },
};