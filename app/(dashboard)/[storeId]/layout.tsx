import Navbar from "@/components/Navbar"
import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs"
import {redirect} from 'next/navigation'

export default async function dashboardLayout({
  children,
  params
}:{
  children: React.ReactNode
  params: {storeId: string}
}){
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

  return(
    <>
    <Navbar />
    {children}
    </>
  )
}