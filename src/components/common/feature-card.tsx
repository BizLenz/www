import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-4 transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg">
      <CardHeader className="flex flex-col items-center p-0">
        <div className="bg-primary/20 mb-4 rounded-full p-3">{icon}</div>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="mb-4 p-0 text-center">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
