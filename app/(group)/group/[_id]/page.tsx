import GroupDashboard from '@/components/pages/groups/dashboard';

type Props = {
  params: Promise<{ _id: number }>;
};

export default async function page({ params }: Props) {
  const { _id } = await params;

  return (
    <div className="flex h-full w-full flex-col p-3">
      {/* pnrpkvqneo;krnvo */}
      <GroupDashboard />
    </div>
  );
}
