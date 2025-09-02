"use server";

import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function createComment(postId: string, content: string) {
  try {

    const session = await getServerSession();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        data: {
          isSuccess: false,
          error: "Authentication required"
        }
      };
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: userId,
        postId: postId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    revalidatePath(`/blog/${postId}`);

    return {
      data: {
        isSuccess: true,
        comment
      }
    }

  } catch (error) {
    console.error("Error creating comment:", error);
    return {
      data: {
        isSuccess: false,
        error: "Failed to create comment. Please try again."
      }
    };
  }
}