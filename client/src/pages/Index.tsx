import { IssueView } from "@/components/IssueView";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">RT</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Real-time Notifications</h1>
              <p className="text-sm text-muted-foreground">Live issue tracking system</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        <IssueView issueId="RT-001" />
      </main>
    </div>
  );
};

export default Index;
