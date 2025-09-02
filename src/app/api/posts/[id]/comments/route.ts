import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })
    const totalComments = await prisma.comment.count({
      where: { postId: id },
    })

    const totalPages = Math.ceil(totalComments / limit)

    return NextResponse.json({
      data: comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        totalPages,
      },
      isSuccess: true,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
