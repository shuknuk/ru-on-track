'use client'

import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import Markdown from '@/app/components/common/Markdown'
import { FadeIn } from '@/app/components/motion/MotionPrimitives'

export default function Professors() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 md:p-12">
          <FadeIn>
            <h1 className="mb-8 font-sans text-5xl font-bold tracking-[-0.05em] text-foreground">Professor Ratings</h1>
          </FadeIn>
          <FadeIn className="border border-border bg-card p-8" delay={0.08}>
            <Markdown className="mb-4 text-lg text-foreground" content="Premium feature under construction" />
            <Markdown
              className="text-sm uppercase tracking-[0.08em] text-muted-foreground"
              content="This feature will link to RateMyProfessors.com with appropriate disclaimers."
            />
          </FadeIn>
        </div>
      </div>
    </div>
  )
}
