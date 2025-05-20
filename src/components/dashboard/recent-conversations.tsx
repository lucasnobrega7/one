import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentConversations() {
  return (
    <div className="space-y-8">
      {conversations.map((conversation) => (
        <div key={conversation.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt="Avatar" />
            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{conversation.name}</p>
            <p className="text-sm text-muted-foreground">{conversation.message}</p>
          </div>
          <div className="ml-auto text-xs text-muted-foreground">{conversation.time}</div>
        </div>
      ))}
    </div>
  )
}

const conversations = [
  {
    id: "1",
    name: "Customer Support Agent",
    avatar: "/diverse-avatars.png",
    message: "We've resolved the issue with your account.",
    time: "5m ago",
  },
  {
    id: "2",
    name: "Sales Assistant",
    avatar: "/diverse-avatars.png",
    message: "I've sent you the pricing information you requested.",
    time: "10m ago",
  },
  {
    id: "3",
    name: "Technical Support",
    avatar: "/diverse-avatars.png",
    message: "The API integration is now complete.",
    time: "1h ago",
  },
  {
    id: "4",
    name: "Marketing Bot",
    avatar: "/diverse-avatars.png",
    message: "Your campaign has reached 10,000 impressions!",
    time: "2h ago",
  },
  {
    id: "5",
    name: "Knowledge Base Agent",
    avatar: "/diverse-avatars.png",
    message: "Here's the documentation you were looking for.",
    time: "5h ago",
  },
]
