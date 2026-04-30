import { AIChatInput } from "@/components/ui/ai-chat-input"
import Silk from "@/components/ui/silk"

export default function Home() {
  return (
    <div className="relative min-h-screen w-full">
      {/* Silk background */}
      <div className="absolute inset-0 -z-10">
        <Silk />
      </div>
      <AIChatInput />
    </div>
  )
}