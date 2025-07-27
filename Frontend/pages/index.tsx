"use client"
import { fetchAccessToken } from "hume";
import { InferGetServerSidePropsType } from "next";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const Chat = dynamic(() => import("@/components/Chat"), {
  ssr: false,
});

export const getServerSideProps = async () => {
  const accessToken = await fetchAccessToken({
    apiKey: String(process.env.HUME_API_KEY),
    secretKey: String(process.env.HUME_SECRET_KEY),
  });

  if (!accessToken) {
    return {
      redirect: {
        destination: "/",
        statusCode: 500,
      },
    };
  }

  return {
    props: {
      accessToken,
    },
  };
};

type PageProps = InferGetServerSidePropsType<typeof getServerSideProps>;

export default function Page({ accessToken }: PageProps) {
  const [showHeading, setShowHeading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHeading(false);
      setShowChat(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {showHeading && (
        <h1 className="text-4xl font-bold mb-8 text-center animate-fade-out">
          Empathetic Voice Chatbot with Facial Emotion Analysis
        </h1>
      )}
      {showChat && (
        <main className="container mx-auto py-8 w-full h-full">
          <Chat accessToken={accessToken} />
        </main>
      )}
    </div>
  );
}
