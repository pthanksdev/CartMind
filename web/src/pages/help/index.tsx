import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createInquiryMutationFn } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, Phone, MapPin, Search, Send, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        question: "How fast is standard delivery?",
        answer: "Standard delivery typically takes 2–4 business days. Express same-day shipping is available in selected metro areas."
      },
      {
        question: "How do I track my order status?",
        answer: "Once your order is placed, visit Account > Orders and click on Track Order to view real-time delivery checkpoints."
      },
      {
        question: "What is the threshold for free delivery?",
        answer: "Orders totaling over $50 automatically qualify for free standard home delivery."
      }
    ]
  },
  {
    category: "Payments & Refunds",
    items: [
      {
        question: "What payment methods are supported?",
        answer: "We support major credit/debit cards via Stripe, Cash on Delivery (COD), and instant digital bank payments."
      },
      {
        question: "How are refunds processed?",
        answer: "Approved refunds are credited back to your original payment method within 3–5 business days after inspection."
      }
    ]
  },
  {
    category: "Account & Security",
    items: [
      {
        question: "How do I update my profile details or password?",
        answer: "Go to your Account Settings page (`/account/profile`) where you can edit your name, phone number, and password anytime."
      }
    ]
  }
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const inquiryMutation = useMutation({
    mutationFn: createInquiryMutationFn,
    onSuccess: () => {
      toast.success("Thank you! Your inquiry has been sent to our customer support team.");
      setFormState({ name: "", email: "", subject: "", message: "" });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to submit support message.");
    },
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    inquiryMutation.mutate(formState);
  };

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero Header */}
      <div className="bg-primary/5 py-12 border-b border-border text-center">
        <div className="container max-w-3xl">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <HelpCircle className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">How can we help you?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search our frequently asked questions or get in touch with our customer support team.
          </p>

          <div className="relative mt-6 max-w-xl mx-auto">
            <Search className="absolute left-3.5 top-3.5 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for shipping, returns, payment options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-card border-border shadow-sm rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="container max-w-5xl py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
            
            {filteredFaqs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6">
                No matching questions found for "{searchQuery}". Please send us a message below!
              </p>
            ) : (
              filteredFaqs.map((cat, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {cat.category}
                  </h3>
                  <div className="space-y-2">
                    {cat.items.map((faq, fIdx) => {
                      const key = `${idx}-${fIdx}`;
                      const isOpen = openFaq === key;
                      return (
                        <div key={fIdx} className="rounded-xl border border-border bg-card overflow-hidden">
                          <button
                            onClick={() => setOpenFaq(isOpen ? null : key)}
                            className="w-full flex items-center justify-between p-4 text-left font-medium text-sm hover:bg-muted/30 transition-colors"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 text-sm text-muted-foreground border-t border-border/50">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Contact Support Form & Details */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-bold">Contact Support</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Can't find what you're looking for? Send us a direct inquiry.
              </p>

              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Your Name *</label>
                  <Input
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Your Email *</label>
                  <Input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subject</label>
                  <Input
                    value={formState.subject}
                    onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                    placeholder="Order inquiry / Feedback"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Message *</label>
                  <Textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Describe your issue or question..."
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={inquiryMutation.isPending}>
                  <Send className="size-4" /> {inquiryMutation.isPending ? "Submitting..." : "Submit Message"}
                </Button>
              </form>
            </div>

            {/* Quick Contact Info */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <Mail className="size-4 text-primary" />
                <span>support@storefast.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-primary" />
                <span>+1 (800) 555-0199 (Mon-Fri, 9am-6pm)</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 text-primary" />
                <span>100 Commerce Way, Tech City, USA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
