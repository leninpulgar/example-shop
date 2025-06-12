'use server';
 
import { signIn } from '@/auth.config';

 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {

    await signIn('credentials', {
      redirect: false,
      ...Object.fromEntries(formData),
    });

    return 'Success';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {

    console.log(error);
    return 'CredentialsSignin';

}
}



export const login = async(email: string, password: string) => {


  try {

    await signIn( 'credentials', { email, password })

    return { ok: true };

    
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'An error occurred while logging in.' };
    
  }


}