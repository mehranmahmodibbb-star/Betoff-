import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { t } from "@/locales/translations";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  responses: Array<{ author: string; message: string; timestamp: string }>;
}

export default function Support() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const [, navigate] = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "1",
      subject: "Deposit not received",
      message: "I sent USDT but it hasn't been credited",
      status: "in-progress",
      createdAt: "2025-12-20",
      responses: [
        {
          author: "Support Team",
          message: "We are investigating your case",
          timestamp: "2025-12-20 10:30",
        },
      ],
    },
  ]);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleSubmitTicket = () => {
    if (newSubject && newMessage) {
      const ticket: Ticket = {
        id: (tickets.length + 1).toString(),
        subject: newSubject,
        message: newMessage,
        status: "open",
        createdAt: new Date().toISOString().split("T")[0],
        responses: [],
      };
      setTickets([...tickets, ticket]);
      setNewSubject("");
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-accent hover:text-accent/80"
        >
          <ArrowLeft size={20} />
          {t("common.back", language)}
        </button>

        <h1 className="text-3xl font-bold mb-8">{t("nav.support", language)}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Ticket Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Create Ticket</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Issue subject"
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Message</label>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Describe your issue..."
                    rows={4}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>
                <Button
                  onClick={handleSubmitTicket}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Send size={16} className="mr-2" />
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                  className="bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-accent transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground">{ticket.createdAt}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        ticket.status === "resolved"
                          ? "bg-green-500/20 text-green-400"
                          : ticket.status === "in-progress"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>

                  {selectedTicket === ticket.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-sm mb-3">{ticket.message}</p>
                      {ticket.responses.length > 0 && (
                        <div className="bg-secondary p-3 rounded-lg">
                          {ticket.responses.map((response, idx) => (
                            <div key={idx} className="mb-2">
                              <p className="text-xs font-semibold text-accent">{response.author}</p>
                              <p className="text-sm text-muted-foreground">{response.message}</p>
                              <p className="text-xs text-muted-foreground/50">{response.timestamp}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
