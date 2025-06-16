import Link from 'next/link';

import { Users } from 'lucide-react';

import ProgressBar from '@/components/global/progress-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardTitle } from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';

type Props = {
  group: Doc<'group'>;
};

function GroupCards({ group }: Props) {
  return (
    <Card className="col-span-12 h-[180px] p-4 shadow-md transition-all hover:shadow-lg md:col-span-6">
      <CardTitle className="mb-2 flex items-center text-xl font-semibold">
        <span>{group.name}</span>
        <div className="flex-1"></div>
        <span>
          <Badge variant="secondary">Mentor</Badge>
        </span>
      </CardTitle>
      <CardContent className="space-y-4 p-0">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <ProgressBar progress={group.averageProgress} />
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <Users className="h-4 w-4" />
            {group.menteeCount + group.mentorCount} members
          </div>
        </div>

        {/* <div className="flex flex-wrap gap-1 pt-1">
          {group.tags?.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="px-2 py-0.5 text-xs">
              {tag}
            </Badge>
          ))}
        </div> */}
      </CardContent>
      <CardAction className="flex w-full">
        <div className="flex-1"></div>
        <Button className="font-semibold" asChild>
          <Link href={`/groups/${group._id}`}>Enter Group</Link>
        </Button>
      </CardAction>
    </Card>
  );
}

export default GroupCards;
