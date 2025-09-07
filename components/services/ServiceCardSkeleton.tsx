import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const ServiceCardSkeleton = () => (
  <Card className="group overflow-hidden border-0 shadow-lg">
    <div className="relative overflow-hidden">
      <Skeleton className="w-full h-48" />
    </div>
    <CardContent className="p-6">
      <Skeleton className="h-6 w-2/3 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
    </CardContent>
  </Card>
)
export default ServiceCardSkeleton;