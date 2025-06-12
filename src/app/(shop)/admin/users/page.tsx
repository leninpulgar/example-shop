export const revalidate = 0;

// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedUsers } from '@/actions';
import { Pagination, Title } from '@/components';

// import Link from 'next/link';
// import { IoCardOutline } from 'react-icons/io5';
import { redirect } from 'next/navigation';
import { UsersTable } from './ui/UsersTable';

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function UsersPage({ searchParams }: Props) {

  const resolvedSearchParams = await searchParams;
    
    const page  = resolvedSearchParams.page ? parseInt( resolvedSearchParams.page ) : 1;
      
    // const { ok, orders = [], currentPage, totalPages } = await getPaginatedOrders({ page });

  const { ok, users = [], currentPage, totalPages } = await getPaginatedUsers({ page });

  if ( !ok ) {
    redirect('/auth/login');
  }


  return (
    <>
      <Title title="User Management" />

      <div className="mb-10">
        <UsersTable users={ users } />
        <Pagination totalPages={totalPages ?? 1} currentPage={currentPage ?? 1 } />
      </div>
    </>
  );
}