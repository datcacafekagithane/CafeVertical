import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { SimpleMenu } from "@/components/simple-menu";
import { Router, Route, Switch } from "wouter";
import Admin from "@/pages/admin";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/admin" component={Admin} />
          <Route path="/" component={SimpleMenu} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
