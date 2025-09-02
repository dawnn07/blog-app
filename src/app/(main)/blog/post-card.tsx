import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, User } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    title: string
    excerpt?: string
    image?: string
    imageAlt?: string
    createdAt: string
    author: {
      name: string
      email: string
    }
    _count: {
      comments: number
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full max-h-52 transition-all hover:shadow-lg gap-2 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {formatRelativeTime(post.createdAt)}
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MessageCircle size={16} />
            {post._count.comments}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex justify-between flex-row">
        <div className='space-y-4 min-w-0 flex-1'>    
          <Link href={`/blog/${post.id}`}>
          <h3 className="md:text-xl text-lg truncate font-semibold line-clamp-1 hover:text-primary transition-colors break-words">
            {post.title}
          </h3>
        </Link>    
            {post.excerpt ? (
          <p className="text-muted-foreground md:text-base text-sm line-clamp-1 truncate md:max-w-[50%] break-words">{post.excerpt}</p>
        ) : (
          <p className="text-muted-foreground md:text-base text-sm line-clamp-1 truncate">No excerpt available</p>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User size={16} />
          <span>{post.author.name || post.author.email}</span>
        </div></div>
        
        {post.image && (
          <Link href={`/blog/${post.id}`}>
            <div className="relative md:block hidden w-32 h-full overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}