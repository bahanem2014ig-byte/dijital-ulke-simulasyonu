import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Lazy load pages for better performance, though static imports are fine too
import Feed from "@/pages/Feed";
import Topics from "@/pages/Topics";
import TopicDetail from "@/pages/TopicDetail";
import Citizens from "@/pages/Citizens";
import CitizenDetail from "@/pages/CitizenDetail";
import Chat from "@/pages/Chat";
import Nexus from "@/pages/Nexus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Feed} />
      <Route path="/feed" component={Feed} />
      <Route path="/topics" component={Topics} />
      <Route path="/topics/:id" component={TopicDetail} />
      <Route path="/nexus" component={Nexus} />
      <Route path="/citizens" component={Citizens} />
      <Route path="/citizens/:id" component={CitizenDetail} />
      <Route path="/chat/:id" component={Chat} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
