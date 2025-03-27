import Credentials from 'next-auth/providers/credentials'

import { signInSchema } from '@/lib/zod'
import { getUserProfileByEmailUseCase, verifyUserPasswordUseCase } from '@/use-cases/users'

import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedFields = signInSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          // Check if the user exists in the database
          const user = await getUserProfileByEmailUseCase(email)

          if (!user || !user.hashedPassword) return null

          // Check if the password is correct
          const isPasswordCorrect = await verifyUserPasswordUseCase(user.id, password)

          if (!isPasswordCorrect) return null

          // Return the user object
          return user
        }

        return null
      },
    }),
  ],
} satisfies NextAuthConfig
