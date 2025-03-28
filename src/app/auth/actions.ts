'use server'

import { AuthError } from 'next-auth'

import { unauthenticatedAction } from '@/lib/safe-action'
import { signIn } from '@/lib/auth'
import { signInSchema } from '@/lib/zod'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserProfileByEmailUseCase } from '@/use-cases/users'

export const sigAction = unauthenticatedAction.createServerAction().handler(async ({ input }) => {
  try {
    await signIn('google')
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin': {
          return { error: 'Invalid crendentials.' }
        }
        default: {
          return { error: "Something went wrong. We're looking into it." }
        }
      }
    }
    throw error
  }
})
