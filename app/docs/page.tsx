import Link from "next/link"
import { MessageSquare, FileText, Image, Mic, Code, Settings, CheckCircle, ArrowRight } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Header */}
      <header className="w-full h-[60px] bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between h-full px-6">
          {/* Left Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="w-6 h-6">
                <div className="w-full h-full bg-gray-900 rounded-sm"></div>
              </div>
              <nav className="flex items-center gap-8">
                <Link href="/docs" className="text-[14px] text-green-600 font-normal">
                  Overview
                </Link>
                <Link href="/docs/documentation" className="text-[14px] text-gray-600 font-normal hover:text-gray-900">
                  Documentation
                </Link>
                <Link href="/docs/api-reference" className="text-[14px] text-gray-600 font-normal hover:text-gray-900">
                  API reference
                </Link>
                <Link href="/docs/examples" className="text-[14px] text-gray-600 font-normal hover:text-gray-900">
                  Examples
                </Link>
              </nav>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-[14px] text-gray-600 font-normal hover:text-gray-900">
              Log in
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-green-600 text-white px-3 py-1.5 rounded text-[14px] font-normal hover:bg-green-700 transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[872px] mx-auto pt-[60px] pb-[60px] px-14">
        
        {/* GPT-4 API Waitlist Banner */}
        <div className="border border-gray-200 rounded px-5 py-6 mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-[14px] font-bold text-gray-900">
              Join the GPT-4 API waitlist
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/waitlist"
              className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-[14px] font-normal hover:bg-gray-300 transition-colors"
            >
              Sign up
            </Link>
            <ArrowRight className="w-5 h-5 text-gray-600" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-12">
          <h1 className="text-[32px] font-bold text-gray-900 leading-[40px] mb-2">
            Explore the OpenAI API
          </h1>
        </div>

        {/* Start with the basics */}
        <section className="mb-16">
          <h2 className="text-[24px] font-bold text-gray-900 leading-[32px] mb-14">
            Start with the basics
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="relative rounded overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-blue-600 to-purple-700"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-[16px] font-bold mb-1">Quickstart tutorial</h3>
                <p className="text-[14px] opacity-90">Learn by building a quick sample app</p>
              </div>
            </div>
            
            <div className="relative rounded overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-green-600 to-teal-700"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-[15px] font-bold mb-1">Examples</h3>
                <p className="text-[14px] opacity-90">Explore some example tasks</p>
              </div>
            </div>
          </div>
        </section>

        {/* Build an application */}
        <section>
          <h2 className="text-[23px] font-bold text-gray-900 leading-[32px] mb-14">
            Build an application
          </h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Row 1 */}
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-[16px] font-bold text-gray-900">Chat</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[12px] font-bold">
                    Beta
                  </span>
                </div>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to use chat-based language models
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Text completion</h3>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to generate or edit text
                </p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Embeddings</h3>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to search, classify, and compare text
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[15px] font-bold text-gray-900">Speech to text</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[12px] font-bold">
                    Beta
                  </span>
                </div>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to turn audio into text
                </p>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-purple-600 rounded flex items-center justify-center flex-shrink-0">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[16px] font-bold text-gray-900">Image generation</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[12px] font-bold">
                    Beta
                  </span>
                </div>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to generate or edit images
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-pink-500 rounded flex items-center justify-center flex-shrink-0">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[15px] font-bold text-gray-900">Code completion</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[12px] font-bold">
                    Limited beta
                  </span>
                </div>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to generate, edit, or explain code
                </p>
              </div>
            </div>

            {/* Row 4 - Single item */}
            <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-[54px] h-[54px] bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold text-gray-900 mb-1">Fine-tuning</h3>
                <p className="text-[14px] text-gray-600 leading-[20px]">
                  Learn how to train a model for your use case
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
