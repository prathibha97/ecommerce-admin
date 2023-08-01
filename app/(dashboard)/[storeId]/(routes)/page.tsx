import prisma from '@/lib/prisma';
import { FC } from 'react'

interface DashboardPageProps {
  params: {storeId: string}
}

const DashboardPage: FC<DashboardPageProps> = async({params}) => {
  const store = await prisma.store.findFirst({
    where:{
      id: params.storeId
    }
  })
  return <div>Active store: {store?.name}</div>;
};

export default DashboardPage;