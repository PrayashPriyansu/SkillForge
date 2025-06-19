import { BookOpen, Play } from 'lucide-react';

import ProgressBar from '@/components/global/progress-bar';
// Assuming this component exists
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function GroupDashboard() {
  return (
    <div className="bg-background">
      {/* Continue Learning Card */}
      <Card className="border-border bg-card transform rounded-xl border p-6 shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="mb-6 p-0">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
                <BookOpen className="text-primary h-7 w-7" />
              </div>
              <div>
                <CardTitle className="text-card-foreground text-2xl font-bold">
                  Continue Learning
                </CardTitle>
                <p className="text-md text-muted-foreground mt-1">
                  Dive back into your last lesson.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full rounded-full text-lg font-semibold shadow-md md:w-auto md:min-w-[200px]"
            >
              <Play className="mr-2 h-5 w-5" />
              Resume Learning
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-0">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-card-foreground text-xl font-semibold">
                Frontend Foundations
              </h3>
              <Badge className="bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm font-medium">
                Chapter 2
              </Badge>
            </div>
            <p className="text-muted-foreground text-base">
              Last read:{' '}
              <span className="text-card-foreground font-semibold">
                Subtopic 2.3 – Flexbox Basics
              </span>
            </p>
          </div>
          <ProgressBar progress={35} />
        </CardContent>
      </Card>
    </div>
  );
}

export default GroupDashboard;
