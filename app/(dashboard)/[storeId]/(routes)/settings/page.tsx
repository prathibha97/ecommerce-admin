import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import SettingsForm from './components/SettingsForm'

interface pageProps {
  params: {
    storeId: string
  }
}

const page: FC<pageProps> = async({params}) => {
  const {userId} = auth()

  if(!userId){
    redirect('/sign-in')
  }

  const store = await prisma.store.findFirst({
    where:{
      id: params.storeId,
      userId
    }
  })

  if(!store){
    redirect('/')
  }

  return <div className='flex flex-col'>
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <SettingsForm initialdData={store}/>
    </div>
  </div>
}

export default page