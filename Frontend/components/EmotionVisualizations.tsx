"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useEmotionStore } from "./stores/emotionStore"
import { Bar, Line, Radar } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from "chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Title,
    Tooltip,
    Legend,
)

const EmotionVisualizations: React.FC = () => {
    const { facialEmotions, speechEmotions } = useEmotionStore()
    const [emotionHistory, setEmotionHistory] = useState<{ facial: any[]; speech: any[] }>({ facial: [], speech: [] })

    useEffect(() => {
        setEmotionHistory((prev) => ({
            facial: [...prev.facial, facialEmotions],
            speech: [...prev.speech, speechEmotions],
        }))
    }, [facialEmotions, speechEmotions])

    const emotions = ["anger", "disgust", "fear", "happy", "neutral", "sad", "surprise"]

    const barData = {
        labels: emotions,
        datasets: [
            {
                label: "Facial Emotions",
                data: emotions.map((emotion) => facialEmotions[emotion] || 0),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
            {
                label: "Speech Emotions",
                data: emotions.map((emotion) => speechEmotions[emotion] || 0),
                backgroundColor: "rgba(153, 102, 255, 0.6)",
            },
        ],
    }

    const radarData = {
        labels: emotions,
        datasets: [
            {
                label: "Speech Emotions",
                data: emotions.map((emotion) => speechEmotions[emotion] || 0),
                backgroundColor: "rgba(153, 102, 255, 0.2)",
                borderColor: "rgba(153, 102, 255, 1)",
                pointBackgroundColor: "rgba(153, 102, 255, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(153, 102, 255, 1)",
            },
        ],
    }

    const lineData = {
        labels: Array.from({ length: emotionHistory.facial.length }, (_, i) => i + 1),
        datasets: emotions.map((emotion) => ({
            label: `Facial ${emotion}`,
            data: emotionHistory.facial.map((entry) => entry[emotion] || 0),
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            fill: false,
        })),
    }

    const speechLineData = {
        labels: Array.from({ length: emotionHistory.speech.length }, (_, i) => i + 1),
        datasets: emotions.map((emotion) => ({
            label: `Speech ${emotion}`,
            data: emotionHistory.speech.map((entry) => entry[emotion] || 0),
            borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            fill: false,
        })),
    }

    // Separate options for each chart type
    const barOptions: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Emotion Comparison",
            },
        },
    }

    const lineOptions: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Emotions Over Time",
            },
        },
    }

    const radarOptions: ChartOptions<"radar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Speech Emotions Radar",
            },
        },
        scales: {
            r: {
                beginAtZero: true,
                max: 1,
            },
        },
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Emotion Analysis Visualizations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-[400px]">
                    <h3 className="text-xl font-semibold mb-2">Emotion Comparison</h3>
                    <Bar data={barData} options={barOptions} />
                </div>
                <div className="h-[400px]">
                    <h3 className="text-xl font-semibold mb-2">Speech Emotions Radar</h3>
                    <Radar data={radarData} options={radarOptions} />
                </div>
                {/* <div className="h-[400px]">
                    <h3 className="text-xl font-semibold mb-2">Facial Emotions Over Time</h3>
                    <Line data={lineData} options={lineOptions} />
                </div>
                <div className="h-[400px]">
                    <h3 className="text-xl font-semibold mb-2">Speech Emotions Over Time</h3>
                    <Line data={speechLineData} options={lineOptions} />
                </div> */}
            </div>
        </div>
    )
}

export default EmotionVisualizations