
import { Title } from '@/components';
import { AddressForm } from './ui/AddressForm';
import { getCountries, getUserAddress } from '@/actions';
import { auth } from '@/auth.config';

export default async function NamePage() {

  const countries = await getCountries();


  // Dirección de la persona y un server action para cargar la información del user
  const session = await auth();

  if ( !session?.user ) {
    return (
      <h3 className="text-5xl">500 - There is no user session.</h3>
    )
  }

  const userAddress = await getUserAddress( session.user.id ) ?? undefined;

  console.log("User Address: ", userAddress)


  return (
    <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">



      <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">
        
        <Title title="Dirección" subtitle="Dirección de entrega" />

        <AddressForm countries={ countries } userStoredAddress={ userAddress } />

      </div>




    </div>
  );
}