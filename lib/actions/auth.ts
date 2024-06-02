'use server';

import { signIn, signOut } from '@/config/auth';

export async function signInWithGithub() {
  await signIn('github');
}

export async function logout() {
  await signOut();
}
