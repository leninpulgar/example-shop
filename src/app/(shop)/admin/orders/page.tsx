// https://tailwindcomponents.com/component/hoverable-table
import { getPaginatedOrders } from '@/actions';
import { Pagination, Title } from '@/components';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';


interface Props {
  searchParams: Promise<{ page?: string }>
}


export default async function Orders({ searchParams }: Props) {

  // const { ok, orders = [] } = await getPaginatedOrders();
  
  const resolvedSearchParams = await searchParams;
  
  const page  = resolvedSearchParams.page ? parseInt( resolvedSearchParams.page ) : 1;
    
  const { ok, orders = [], currentPage, totalPages } = await getPaginatedOrders({ page });

  if ( !ok ) {
    redirect('/auth/login');
  }


  return (
    <>
      <Title title="All Users Orders" />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Full Name
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Status
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Options
              </th>
            </tr>
          </thead>
          <tbody>

            {
              orders.map((order) => (
                <tr key={ order.id } className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id.split('-').at(-1)}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    { order.OrderAddress?.firstName } { order.OrderAddress?.lastName }
                  </td>
                  <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                    {
                      order.isPaid ? (
                        <>
                          <IoCardOutline className="text-green-800" />
                          <span className='mx-2 text-green-800'>Paid</span>
                        </>
                      ) : (
                        <>
                          <IoCardOutline className="text-red-800" />
                          <span className='mx-2 text-red-800'>Pending</span>
                        </>
                      )
                    }

                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 ">
                    <Link href={`/orders/${ order.id }`} className="hover:underline">
                      View order
                    </Link>
                  </td>

                </tr>
              ))
            }

          </tbody>
        </table>

        { /* Paginación */ }
        <Pagination totalPages={totalPages ?? 1} currentPage={currentPage ?? 1} />
      </div>
    </>
  );
}