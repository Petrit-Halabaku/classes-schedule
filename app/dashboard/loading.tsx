import { LoadingSpinner } from "@/components/loading-spinner"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading dashboard..." />
    </div>
  )
}
