'use client';

import dynamic from 'next/dynamic';
import CustomCursor from '@/components/CustomCursor';
import HeroSection from '@/components/HeroSection';

import PhotoGallery from '@/components/PhotoGallery';
import CakeSection from '@/components/CakeSection';
import MessageSection from '@/components/MessageSection';
import FinalSection from '@/components/FinalSection';
import MusicPlayer from '@/components/MusicPlayer';

// Dynamic import for particle background to avoid SSR issues
const ParticlesBackground = dynamic(
  () => import('@/components/ParticlesBackground'),
  { ssr: false }
);

// Brother's name — change here to update everywhere
export const BROTHER_NAME = 'Bhaiyaa';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Animated background */}
      <ParticlesBackground />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Music player (floating) */}
      <MusicPlayer />

      {/* Page sections */}
      <HeroSection name={BROTHER_NAME} />
      <PhotoGallery name={BROTHER_NAME} />
      <CakeSection name={BROTHER_NAME} />
      <MessageSection name={BROTHER_NAME} />
      <FinalSection name={BROTHER_NAME} />
    </main>
  );
}
