import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function SearchConfigLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </Card>
      ))}
    </div>
  )
}
