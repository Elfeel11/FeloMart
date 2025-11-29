import { Loader2 } from "lucide-react"
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">Loading</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we load your content...
          </p>
        </div>
      </div>
    </div>
  )
}
