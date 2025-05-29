import { Suspense } from 'react'
import { notFound } from 'next/navigation'

interface WidgetPageProps {
  params: {
    agentId: string
  }
  searchParams: {
    theme?: 'light' | 'dark'
    position?: 'bottom-right' | 'bottom-left' | 'center'
    bubble?: 'true' | 'false'
    fullscreen?: 'true' | 'false'
  }
}

export default function WidgetPage({ params, searchParams }: WidgetPageProps) {
  const { agentId } = params
  const { 
    theme = 'light', 
    position = 'bottom-right', 
    bubble = 'false',
    fullscreen = 'false'
  } = searchParams

  if (!agentId) {
    notFound()
  }

  const isFullscreen = fullscreen === 'true'
  const isBubble = bubble === 'true'

  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Chat Widget - Agentes de Conversão</title>
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              ${isFullscreen ? 'height: 100vh; overflow: hidden;' : ''}
              ${theme === 'dark' ? 'background: #1a1a1a; color: white;' : 'background: white; color: black;'}
            }
            
            .widget-container {
              ${isFullscreen 
                ? 'width: 100vw; height: 100vh;' 
                : isBubble 
                ? `position: fixed; ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'} ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'} width: 60px; height: 60px; border-radius: 50%; z-index: 10000;`
                : `position: fixed; ${position.includes('right') ? 'right: 20px;' : 'left: 20px;'} ${position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'} width: 350px; height: 500px; border-radius: 12px; z-index: 10000; box-shadow: 0 10px 30px rgba(0,0,0,0.2);`
              }
              ${theme === 'dark' 
                ? 'background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%); border: 1px solid #404040;' 
                : 'background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 1px solid #e1e5e9;'
              }
            }
            
            .bubble-trigger {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-size: 24px;
              cursor: pointer;
              box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
              transition: transform 0.2s ease;
            }
            
            .bubble-trigger:hover {
              transform: scale(1.05);
            }
            
            .chat-interface {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              ${isBubble ? 'display: none;' : ''}
            }
            
            .chat-header {
              padding: 16px;
              ${theme === 'dark' 
                ? 'background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%); border-bottom: 1px solid #404040;' 
                : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-bottom: 1px solid #e1e5e9;'
              }
              color: white;
              border-radius: ${isFullscreen ? '0' : '12px 12px 0 0'};
            }
            
            .chat-header h3 {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 4px;
            }
            
            .chat-header p {
              font-size: 12px;
              opacity: 0.8;
            }
            
            .chat-messages {
              flex: 1;
              padding: 16px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .message {
              max-width: 80%;
              padding: 12px 16px;
              border-radius: 18px;
              font-size: 14px;
              line-height: 1.4;
            }
            
            .message.agent {
              align-self: flex-start;
              ${theme === 'dark' 
                ? 'background: #2d2d2d; color: white;' 
                : 'background: #f1f3f4; color: black;'
              }
            }
            
            .message.user {
              align-self: flex-end;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            
            .chat-input {
              padding: 16px;
              ${theme === 'dark' 
                ? 'border-top: 1px solid #404040;' 
                : 'border-top: 1px solid #e1e5e9;'
              }
              border-radius: ${isFullscreen ? '0' : '0 0 12px 12px'};
            }
            
            .input-container {
              display: flex;
              gap: 8px;
              align-items: center;
            }
            
            .input-container input {
              flex: 1;
              padding: 12px 16px;
              border: 1px solid ${theme === 'dark' ? '#404040' : '#e1e5e9'};
              border-radius: 24px;
              font-size: 14px;
              outline: none;
              ${theme === 'dark' 
                ? 'background: #1a1a1a; color: white;' 
                : 'background: white; color: black;'
              }
            }
            
            .input-container input:focus {
              border-color: #667eea;
            }
            
            .send-button {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              border: none;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              font-size: 16px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: transform 0.2s ease;
            }
            
            .send-button:hover {
              transform: scale(1.05);
            }
            
            .typing-indicator {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 12px 16px;
              align-self: flex-start;
            }
            
            .typing-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #667eea;
              animation: typing 1.4s ease-in-out infinite;
            }
            
            .typing-dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dot:nth-child(3) { animation-delay: 0.4s; }
            
            @keyframes typing {
              0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
              30% { transform: translateY(-10px); opacity: 1; }
            }
          `
        }} />
      </head>
      <body>
        <div className="widget-container" id="chatWidget">
          {isBubble ? (
            <div className="bubble-trigger" onClick={() => {
              const widget = document.getElementById('chatWidget')
              const chatInterface = document.querySelector('.chat-interface') as HTMLElement
              if (widget && chatInterface) {
                widget.style.width = '350px'
                widget.style.height = '500px'
                widget.style.borderRadius = '12px'
                chatInterface.style.display = 'flex'
                document.querySelector('.bubble-trigger')!.remove()
              }
            }}>
              💬
            </div>
          ) : null}
          
          <div className="chat-interface">
            <div className="chat-header">
              <h3>Assistente Virtual</h3>
              <p>Como posso ajudar você hoje?</p>
            </div>
            
            <div className="chat-messages" id="chatMessages">
              <div className="message agent">
                Olá! 👋 Eu sou seu assistente virtual. Como posso ajudar você hoje?
              </div>
            </div>
            
            <div className="chat-input">
              <div className="input-container">
                <input 
                  type="text" 
                  placeholder="Digite sua mensagem..." 
                  id="messageInput"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendMessage()
                    }
                  }}
                />
                <button className="send-button" onClick={() => sendMessage()}>
                  ↗
                </button>
              </div>
            </div>
          </div>
        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            let isTyping = false;
            
            function sendMessage() {
              const input = document.getElementById('messageInput');
              const messages = document.getElementById('chatMessages');
              const message = input.value.trim();
              
              if (!message || isTyping) return;
              
              // Add user message
              const userMessage = document.createElement('div');
              userMessage.className = 'message user';
              userMessage.textContent = message;
              messages.appendChild(userMessage);
              
              // Clear input
              input.value = '';
              
              // Scroll to bottom
              messages.scrollTop = messages.scrollHeight;
              
              // Show typing indicator
              showTypingIndicator();
              
              // Simulate API call
              setTimeout(() => {
                hideTypingIndicator();
                addAgentMessage(generateResponse(message));
              }, 1000 + Math.random() * 2000);
            }
            
            function showTypingIndicator() {
              if (isTyping) return;
              isTyping = true;
              
              const messages = document.getElementById('chatMessages');
              const typing = document.createElement('div');
              typing.className = 'typing-indicator';
              typing.id = 'typingIndicator';
              typing.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
              messages.appendChild(typing);
              messages.scrollTop = messages.scrollHeight;
            }
            
            function hideTypingIndicator() {
              isTyping = false;
              const typing = document.getElementById('typingIndicator');
              if (typing) typing.remove();
            }
            
            function addAgentMessage(text) {
              const messages = document.getElementById('chatMessages');
              const agentMessage = document.createElement('div');
              agentMessage.className = 'message agent';
              agentMessage.textContent = text;
              messages.appendChild(agentMessage);
              messages.scrollTop = messages.scrollHeight;
            }
            
            function generateResponse(message) {
              const responses = [
                'Entendi sua pergunta. Posso ajudar você com isso!',
                'Interessante! Vou verificar as melhores opções para você.',
                'Perfeito! Deixe me buscar essas informações.',
                'Ótima pergunta! Aqui está o que posso sugerir...',
                'Claro! Ficarei feliz em ajudar com isso.'
              ];
              return responses[Math.floor(Math.random() * responses.length)];
            }
            
            // Auto-focus input
            document.getElementById('messageInput').focus();
          `
        }} />
      </body>
    </html>
  )
}