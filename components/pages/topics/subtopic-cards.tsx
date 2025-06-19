'use client';

import { useRouter } from 'next/navigation';

import { ArrowRight, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';

interface SubtopicCardProps {
  subtopic: Doc<'subtopics'>;
  isMentor?: boolean;
}

export default function SubtopicCard({
  subtopic,
  isMentor = false,
}: SubtopicCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/subtopic/${subtopic._id}`);
  };

  const getStatusVariant = (status: string) => {
    return status === 'published' ? 'default' : 'secondary';
  };

  const getStatusIcon = (status: string) => {
    return status === 'published' ? '🟢' : '🟡';
  };

  return (
    <Card className="border-l-primary/20 border-l-4 transition-all duration-200 hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h5 className="font-medium">{subtopic.title}</h5>
              <Badge
                variant={getStatusVariant(subtopic.status)}
                className="text-xs"
              >
                {getStatusIcon(subtopic.status)} {subtopic.status}
              </Badge>
            </div>

            {subtopic.description && (
              <p className="text-muted-foreground mb-2 text-sm">
                {subtopic.description}
              </p>
            )}

            <div className="text-muted-foreground flex items-center gap-3 text-xs">
              {subtopic.estimatedTime && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {subtopic.estimatedTime} min
                </div>
              )}
              <span>🧩 Subtopic</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex items-center gap-2"
          >
            View Details
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
