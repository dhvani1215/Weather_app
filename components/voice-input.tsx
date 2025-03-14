"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface VoiceInputProps {
  onResult: (text: string) => void
}

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = "en-IN"

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
    return null
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`rounded-full w-12 h-12 flex items-center justify-center ${
          isListening ? "bg-red-500 hover:bg-red-600" : "bg-indigo-500 hover:bg-indigo-600"
        }`}
        aria-label={isListening ? "Stop listening" : "Start voice command"}
      >
        <i className={`fas ${isListening ? "fa-stop" : "fa-microphone"}`} aria-hidden="true" />
      </Button>

      {isListening && (
        <div className="flex items-center gap-2 text-sm text-indigo-600">
          <i className="fas fa-circle-notch fa-spin" aria-hidden="true" />
          <span>Listening...</span>
        </div>
      )}

      {transcript && <p className="text-sm text-gray-600 mt-2">"{transcript}"</p>}

      <p className="text-xs text-gray-500 mt-1">Try saying "Weather in Mumbai" or "What's the temperature in Delhi"</p>
    </div>
  )
}

