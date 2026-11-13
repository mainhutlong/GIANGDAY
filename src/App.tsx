/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { SubjectCards } from './components/SubjectCards';
import { BottomWaves } from './components/BottomWaves';
import { SubjectWorkspace } from './components/SubjectWorkspace';
import { CourseCatalogModal } from './components/CourseCatalogModal';
import { PracticeExercisesModal } from './components/PracticeExercisesModal';
import { MockExamModal } from './components/MockExamModal';
import { InteractiveGamesModal } from './components/InteractiveGamesModal';
import { ProgressModal } from './components/ProgressModal';
import { GuideModal } from './components/GuideModal';
import { AuthModal } from './components/AuthModal';
import { AttendanceView } from './components/AttendanceView';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'word' | 'excel' | 'powerpoint' | 'guide' | 'attendance'>('home');
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(140);
  const [mockExamScore, setMockExamScore] = useState<number>(8.5);

  // Modals state
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const [isExercisesOpen, setIsExercisesOpen] = useState<boolean>(false);
  const [isMockExamOpen, setIsMockExamOpen] = useState<boolean>(false);
  const [isGamesOpen, setIsGamesOpen] = useState<boolean>(false);
  const [isProgressOpen, setIsProgressOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const handleAddPoints = (pts: number) => {
    setTotalPoints((prev) => prev + pts);
  };

  const handleUpdateExamScore = (score: number) => {
    setMockExamScore(score);
    setTotalPoints((prev) => prev + Math.round(score * 10));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#F2F7FD] via-[#F8FBFE] to-[#E8F3FD] text-slate-800 font-sans antialiased selection:bg-blue-200">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* 2. Hero Section with Center Title, Laptop & Orbit */}
            <HeroSection />

            {/* 3. The 4 Cards: Word, Excel, PowerPoint, Tìm hiểu & Điểm danh */}
            <SubjectCards
              onSelectSubject={(subj) => {
                setActiveTab(subj);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenGuide={() => {
                setActiveTab('guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAttendance={() => {
                setActiveTab('attendance');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 4. Layered Bottom Decorative Waves */}
            <BottomWaves />
          </div>
        )}

        {/* Subject Workspace View (Word, Excel, PowerPoint, Tìm hiểu) */}
        {(activeTab === 'word' || activeTab === 'excel' || activeTab === 'powerpoint' || activeTab === 'guide') && (
          <div className="flex-1 flex flex-col justify-between">
            <SubjectWorkspace
              subject={activeTab}
              onBack={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAddScore={handleAddPoints}
            />
            <BottomWaves />
          </div>
        )}

        {/* Attendance Workspace View (Chuyển trang toàn màn hình) */}
        {activeTab === 'attendance' && (
          <div className="flex-1 flex flex-col justify-between">
            <AttendanceView
              onBack={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <BottomWaves />
          </div>
        )}
      </main>

      {/* Modals for Interactive Features */}
      <CourseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectModule={(mod) => setActiveTab(mod)}
      />

      <PracticeExercisesModal
        isOpen={isExercisesOpen}
        onClose={() => setIsExercisesOpen(false)}
      />

      <MockExamModal
        isOpen={isMockExamOpen}
        onClose={() => setIsMockExamOpen(false)}
        onUpdateScore={handleUpdateExamScore}
      />

      <InteractiveGamesModal
        isOpen={isGamesOpen}
        onClose={() => setIsGamesOpen(false)}
        onAddScore={handleAddPoints}
      />

      <ProgressModal
        isOpen={isProgressOpen}
        onClose={() => setIsProgressOpen(false)}
        user={user}
        totalPoints={totalPoints}
        mockExamScore={mockExamScore}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => setUser(u)}
      />
    </div>
  );
}
