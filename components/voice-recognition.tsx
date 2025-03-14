"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface VoiceRecognitionProps {
  onResult: (command: string) => void
}

export default function VoiceRecognition({ onResult }: VoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex
        const result = event.results[current]
        const transcriptValue = result[0].transcript
        setTranscript(transcriptValue)

        if (result.isFinal) {
          onResult(transcriptValue)
          stopListening()
        }
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        toast({
          title: "Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        })
        stopListening()
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    } else {
      setIsSupported(false)
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in this browser",
        variant: "destructive",
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onResult, toast])

  const startListening = () => {
    setTranscript("")
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    setIsListening(false)
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return (
      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-400">
          Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`rounded-full w-16 h-16 flex items-center justify-center ${
          isListening ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
        aria-label={isListening ? "Stop listening" : "Start voice command"}
      >
        {isListening ? (
          <div className="relative">
            <MicOff className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </Button>

      <div className="mt-4 min-h-[40px] text-center">
        {isListening && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Listening...</p>
          </div>
        )}
        {transcript && <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">"{transcript}"</p>}
      </div>
    </div>
  )
}

