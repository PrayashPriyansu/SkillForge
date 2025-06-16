// components/GroupHeader.tsx
import Link from 'next/link';
import React from 'react';

// shadcn class utility
import { TrophyIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GroupHeaderProps {
  groupName?: string;
  currentXP?: number;
  totalXP?: number;
  groupId?: string;
  activeTab?: 'dashboard' | 'plans' | 'quizzes';
}

const GroupHeader: React.FC<GroupHeaderProps> = ({
  groupName = 'Unnamed Group',
  currentXP = 0,
  totalXP = 1000,
  groupId = 'default-group',
  activeTab = 'dashboard',
}) => {
  const safeTotalXP = totalXP === 0 ? 1 : totalXP;
  const progressValue = (currentXP / safeTotalXP) * 100;

  const tabs = [
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Plans', value: 'plans' },
    { label: 'Quizzes', value: 'quizzes' },
  ];

  return (
    <div className="bg-background mb-8 rounded-2xl border p-6 shadow-sm">
      {/* Top section: group name and right-side actions */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          <span className="text-primary">Group:</span> {groupName}
        </h2>

        <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-8">
          {/* XP display */}
          <div className="space-y-1 text-right">
            <div className="text-muted-foreground text-sm font-medium">
              {currentXP} / {totalXP} XP
            </div>
            {/* <Progress
              value={progressValue}
              className="bg-muted h-2 w-40"
              indicatorClassName="bg-primary"
            /> */}
          </div>

          {/* Leaderboard link */}
          <Button asChild variant="ghost" className="text-primary">
            <Link href={`/group/${groupId}/leaderboard`}>
              <TrophyIcon className="mr-2 h-5 w-5" />
              Leaderboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={`/group/${groupId}/${tab.value}`}
            className={cn(
              'relative px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.value
                ? 'border-primary text-primary border-b-2'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GroupHeader;
