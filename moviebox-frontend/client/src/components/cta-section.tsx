import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic
    console.log("Subscribing email:", email);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 lg:px-8 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">Ready to watch?</h2>
        <p className="text-foreground/80 text-base md:text-lg mb-8 max-w-2xl mx-auto">
          Join MovieBox today. Cancel anytime. No commitments.
        </p>
        
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-foreground/10 border-border/20 text-foreground"
            required
          />
          <Button type="submit" className="w-full sm:w-auto whitespace-nowrap" size="lg">
            Try it free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
        
        <p className="text-foreground/60 text-xs mt-4">
          Only new members are eligible for this offer.
        </p>
      </div>
    </section>
  );
}
