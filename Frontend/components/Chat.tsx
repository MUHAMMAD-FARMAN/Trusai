"use client"

import { VoiceProvider } from "@humeai/voice-react"
import Messages from "./Messages"
import Controls from "./Controls"
import StartCall from "./StartCall"
import { type ComponentRef, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { MessageCircle, BarChart2 } from "lucide-react"
import EmotionVisualizations from "./EmotionVisualizations"
import { Button } from "./ui/button";

const FacialEmotionAnalysis = dynamic(() => import("./FacialEmotionAnalysis"), { ssr: false })

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string
}) {
  const timeout = useRef<number | null>(null)
  const ref = useRef<ComponentRef<typeof Messages> | null>(null)
  const [showFacialAnalysis, setShowFacialAnalysis] = useState(false)
  const [activeTab, setActiveTab] = useState<"messages" | "graphs">("messages")

  const handleStartCall = () => {
    setShowFacialAnalysis(true)
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="flex-grow flex flex-row">
        <div className="w-1/2 relative flex flex-col overflow-hidden">
          <VoiceProvider
            auth={{ type: "accessToken", value: accessToken }}
            onMessage={() => {
              if (timeout.current) {
                window.clearTimeout(timeout.current)
              }

              timeout.current = window.setTimeout(() => {
                if (ref.current) {
                  const scrollHeight = ref.current.scrollHeight

                  ref.current.scrollTo({
                    top: scrollHeight,
                    behavior: "smooth",
                  })
                }
              }, 200)
            }}
          >
            {showFacialAnalysis && (
              <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                  <Button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === "messages" ? "bg-blue-700 text-white" : "bg-white text-gray-900 hover:bg-gray-100"
                      }`}
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === "graphs" ? "bg-blue-700 text-white" : "bg-white text-gray-900 hover:bg-gray-100"
                      }`}
                    onClick={() => setActiveTab("graphs")}
                  >
                    <BarChart2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            {activeTab === "messages" ? (
              <>
                <Messages ref={ref} />
                <Controls />
              </>
            ) : (
              <EmotionVisualizations />
            )}
            <StartCall onStartCall={handleStartCall} />
          </VoiceProvider>
        </div>
        {showFacialAnalysis && (
          <div className="w-1/2 p-4 bg-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Facial Emotion Analysis</h2>
            <FacialEmotionAnalysis />
          </div>
        )}
      </div>
    </div>
  )
}

