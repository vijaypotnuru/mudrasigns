import { HTMLAttributes, useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import { db } from '@/services/firebase'
import { markAttendance, handleAutoLogout } from '@/services/firebase/user'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, { message: 'Please enter your password' })
    .min(8, { message: 'Password must be at least 8 characters long' }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  })

  useEffect(() => {
    const msuser = localStorage.getItem('msadmin')
    const empUserID = localStorage.getItem('isEmployee')

    if (msuser) navigate({ to: '/' as '/' })
    if (empUserID) navigate({ to: '/employee-request' as '/' })
  }, [navigate])

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setLoginError('')

    setTimeout(async () => {
      try {
        // Check user in Firestore
        const usersRef = collection(db, 'mudra_sign_users')
        const q = query(
          usersRef,
          where('email', '==', data.email),
          where('password', '==', data.password)
        )

        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
          setLoginError('Invalid email or password')
          return
        }

        const userDoc = querySnapshot.docs[0]
        const userData = userDoc.data()
        localStorage.setItem('user', JSON.stringify(userData))

        if (userData.role === 'admin') {
          localStorage.setItem('msadmin', 'msadmin')
          console.log('user in login admin', userData)
          localStorage.setItem('user', JSON.stringify(userData))
          navigate({ to: '/' as '/' })
        } else if (userData.role === 'employee') {
          localStorage.setItem('isEmployee', userDoc.id)
          console.log('user in login employee', userData)
          localStorage.setItem('user', JSON.stringify(userData))

          await markAttendance(userDoc.id)
          navigate({ to: '/employee-request' as '/' })
        } else {
          setLoginError('Unauthorized access')
        }
      } catch (error) {
        console.error('Login error:', error)
        setLoginError('An error occurred during login')
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {loginError && (
              <p className='text-sm font-medium text-destructive'>
                {loginError}
              </p>
            )}

            <Button className='mt-2' type='submit' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
