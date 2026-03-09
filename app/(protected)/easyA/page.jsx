'use client'

import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import Markdown from '@/app/components/common/Markdown'

export default function EasyA() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8 md:p-12">
          <h1 className="mb-8 font-sans text-5xl font-bold tracking-[-0.05em] text-foreground">Easy A Finder</h1>
          <div className="border border-border bg-card p-8">
            <Markdown className="mb-4 text-lg text-foreground" content="Premium feature under construction" />
            <Markdown
              className="text-sm uppercase tracking-[0.08em] text-muted-foreground"
              content="This feature will show GPA-boosting course alternatives and community college transfer suggestions."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
