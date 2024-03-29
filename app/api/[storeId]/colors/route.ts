import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(req: Request,{params}:{params:{storeId:string}}) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    const body = await req.json();
    const { name, value } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!value) {
      return new NextResponse('Value URL is required', { status: 400 });
    }

    if(!params.storeId){
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prisma.store.findFirst({
      where:{
        id: params.storeId,
        userId
      }
    })

    if(!storeByUserId){
      return new NextResponse('Unauthorized', { status: 403 });
    }

    const color = await prisma.color.create({
      data: {
        name,
        value,
        storeId: params.storeId
      },
    });

    return NextResponse.json(color);
  } catch (error: any) {
    console.log('[COLORS_POST]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const colors = await prisma.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error: any) {
    console.log('[COLORS_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}