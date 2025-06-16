type Props = {
  params: Promise<{ _id: number }>;
};

export default async function page({ params }: Props) {
  const { _id } = await params;

  return <div>{_id.toString()}</div>;
}
