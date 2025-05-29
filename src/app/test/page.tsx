// app/test/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TestPage() {
  return (
    <div className="p-6">
      <Card className="max-w-md mx-auto">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-bold">Component Test</h2>
          <Label htmlFor="index">Index Number</Label>
          <Input id="index" placeholder="Enter index" />
          <Button>Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
}
