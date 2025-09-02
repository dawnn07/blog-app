"use server";

import { CreatePostValues } from "./create-post-form";
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPost(data: CreatePostValues) {
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

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        authorId: userId,
        published: true,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    revalidatePath("/blog");

    return {
      data: {
        isSuccess: true,
        post: {
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          published: post.published,
          createdAt: post.createdAt.toISOString(), 
          updatedAt: post.updatedAt.toISOString(),
          author: post.author,
        }
      }
    };

  } catch (error) {
    console.error("Database error creating post:", error);
    
    return {
      data: {
        isSuccess: false,
        error: "Failed to create post. Please try again."
      }
    };
  }
}