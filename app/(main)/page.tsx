import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Home() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center text-5xl">Next Starter</CardHeader>
      <CardContent className="text-center">
        <p className="text-xl">A simple starter for Next.js</p>
      </CardContent>
    </Card>
  );
}
