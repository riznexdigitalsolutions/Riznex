import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Save to database
    await prisma.consultationRequest.create({
      data: {
        restaurantName: data.restaurantName,
        contactName: data.yourName,
        emailAddress: data.emailAddress,
        phoneNumber: data.phoneNumber,
        message: data.message,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving consultation request:', error);
    return NextResponse.json({ error: 'Failed to save request' }, { status: 500 });
  }
}
