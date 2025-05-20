import type { Message } from "../types"

interface MessageBubbleProps {
  message: Message
}

/**
 * Componente para exibir uma mensagem de chat
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : message.role === "system"
              ? "bg-muted text-muted-foreground"
              : "bg-secondary text-secondary-foreground"
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-xs">
            <div className="font-semibold">Fontes:</div>
            <ul className="list-disc list-inside">
              {message.sources.map((source, index) => (
                <li key={index}>{source.title || source.url}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
