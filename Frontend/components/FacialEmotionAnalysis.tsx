"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useEmotionStore } from "./stores/emotionStore"

interface EmotionData {
    emotions: {
        anger: number
        disgust: number
        fear: number
        happy: number
        neutral: number
        sad: number
        surprise: number
    }
    face_coordinates: number[]
}

export default function FacialEmotionAnalysis() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [emotionData, setEmotionData] = useState<EmotionData | null>(null)
    const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number }>({ width: 640, height: 480 })
    const { setFacialEmotions } = useEmotionStore()

    useEffect(() => {
        let stream: MediaStream | null = null
        let intervalId: NodeJS.Timeout

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true })
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    // onloadedmetadata was not in previous version
                    videoRef.current.onloadedmetadata = () => {
                        setVideoDimensions({
                            width: videoRef.current!.videoWidth,
                            height: videoRef.current!.videoHeight,
                        })
                    }
                }
            } catch (err) {
                console.error("Error accessing the camera:", err)
            }
        }

        const captureAndAnalyze = () => {
            if (videoRef.current && canvasRef.current) {
                const context = canvasRef.current.getContext("2d")
                if (context) {
                    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
                    canvasRef.current.toBlob((blob) => {
                        if (blob) {
                            const formData = new FormData()
                            formData.append("image", blob, "frame.jpg")

                            fetch("http://localhost:5000/detect_emotion", {
                                method: "POST",
                                body: formData,
                            })
                                .then((response) => response.json())
                                .then((data) => {
                                    if (data.results && data.results.length > 0) {
                                        setEmotionData(data.results[0])
                                        setFacialEmotions(data.results[0].emotions)
                                    }
                                })
                                .catch((error) => console.error("Error:", error))
                        }
                    }, "image/jpeg")
                }
            }
        }

        startCamera()
        intervalId = setInterval(captureAndAnalyze, 1000)

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
            clearInterval(intervalId)
        }
    }, [setFacialEmotions])

    const emotionColors: { [key: string]: string } = {
        anger: "bg-red-500",
        disgust: "bg-green-500",
        fear: "bg-purple-500",
        happy: "bg-yellow-500",
        neutral: "bg-gray-500",
        sad: "bg-blue-500",
        surprise: "bg-pink-500",
    }

    const adjustCoordinates = (coordinates: number[]) => {
        const { width, height } = videoDimensions
        const scaleX = width / 640
        const scaleY = height / 480
        return [coordinates[0] * scaleX, coordinates[1] * scaleY, coordinates[2] * scaleX, coordinates[3] * scaleY]
    }

    const sortedEmotions = emotionData ? Object.entries(emotionData.emotions).sort(([, a], [, b]) => b - a) : []

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="rounded-lg shadow-lg w-full max-w-md"
                    style={{ height: "auto", maxHeight: "300px" }}
                />
                <canvas ref={canvasRef} className="hidden" width={640} height={480} />
                {emotionData && (
                    <div
                        className="absolute border-2 border-yellow-400"
                        style={{
                            left: `${adjustCoordinates(emotionData.face_coordinates)[0]}px`,
                            top: `${adjustCoordinates(emotionData.face_coordinates)[1]}px`,
                            width: `${adjustCoordinates(emotionData.face_coordinates)[2]}px`,
                            height: `${adjustCoordinates(emotionData.face_coordinates)[3]}px`,
                        }}
                    />
                )}
            </div>
            {emotionData && (
                <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-72">
                    <h2 className="text-lg font-semibold mb-2">Detected Emotions</h2>
                    <AnimatePresence>
                        {sortedEmotions.map(([emotion, value], index) => (
                            <motion.div
                                key={emotion}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center mb-2"
                                style={{ order: index }}
                            >
                                <span className="w-20 text-sm capitalize">{emotion}</span>
                                <div className="flex-grow bg-gray-200 rounded-full h-4 ml-2">
                                    <motion.div
                                        className={`h-full rounded-full ${emotionColors[emotion]}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.max(0, Math.min(100, (value + 5) * 10))}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <span className="w-12 text-right text-sm ml-2">{value.toFixed(2)}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

