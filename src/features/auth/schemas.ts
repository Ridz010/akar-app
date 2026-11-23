import { z } from 'zod'

export const signInSchema = z.object({
  email: z.email('Masukkan alamat email yang valid.'),
  password: z.string().min(1, 'Kata sandi wajib diisi.'),
})

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(80, 'Nama terlalu panjang.'),
  email: z.email('Masukkan alamat email yang valid.'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter.'),
})

export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
