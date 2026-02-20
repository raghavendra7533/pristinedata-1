import { useState } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "bot" | "user";
  content: string;
  chips?: string[];
  list?: string[];
}

const initialMessages: Message[] = [
  {
    role: "bot",
    content: "Hi, I'm Content IQ. I can help you:",
    list: [
      "Explain these health scores",
      "Find specific decks, case studies, or playbooks",
      "Suggest assets to improve weak areas",
    ],
    chips: [
      "Why is Playbook Support low?",
      "Find case studies for retail",
      "Show content for discovery calls",
      "What should we build next?",
    ],
  },
];

export const ContentIQAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const handleChipClick = (chip: string) => {
    const userMessage: Message = { role: "user", content: chip };
    
    // Mock response based on chip
    let botResponse: Message;
    if (chip.toLowerCase().includes("playbook")) {
      botResponse = {
        role: "bot",
        content: "For Playbook Support, sellers currently lack objection handling guides and a discovery question bank. Recommended next steps:",
        list: [
          "Use the existing \"Discovery Call Checklist\" as a starting point.",
          "Convert the \"Top 10 Objections\" document into a structured FAQ.",
          "Create one-page play cards for your top 3 use cases.",
        ],
      };
    } else if (chip.toLowerCase().includes("case studies")) {
      botResponse = {
        role: "bot",
        content: "I found 3 retail-focused case studies in your library:",
        list: [
          "\"RetailMax Success Story\" - showcases 40% conversion improvement",
          "\"ShopDirect Implementation\" - focuses on integration speed",
          "\"Grocery Chain Rollout\" - highlights multi-location deployment",
        ],
      };
    } else if (chip.toLowerCase().includes("discovery")) {
      botResponse = {
        role: "bot",
        content: "For discovery calls, I recommend these assets:",
        list: [
          "Discovery Call Checklist (needs updating)",
          "Qualification Questions Template",
          "Pain Point Mapping Guide",
        ],
      };
    } else {
      botResponse = {
        role: "bot",
        content: "Based on your current scores, I recommend focusing on:",
        list: [
          "Create competitor comparison grid (Competitive Intelligence: 2/5)",
          "Build objection handling FAQ (Playbook Support: 2/5)",
          "Develop industry-specific case studies",
        ],
      };
    }

    setMessages([...messages, userMessage, botResponse]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: "user", content: input };
    const botResponse: Message = {
      role: "bot",
      content: "I understand you're asking about \"" + input + "\". Let me analyze your content library to find relevant insights...",
      list: [
        "Searching through 40 assets in your library",
        "Cross-referencing with category scores",
        "Generating personalized recommendations",
      ],
    };
    
    setMessages([...messages, userMessage, botResponse]);
    setInput("");
  };

  return (
    <>
      {/* Floating Panel */}
      {isOpen && (
        <div className="fixed right-6 bottom-24 w-[360px] max-h-[520px] bg-muted rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-border">
          {/* Header */}
          <div className="bg-violet-600 text-white px-5 py-4 flex justify-between items-center">
            <div>
              <div className="font-semibold text-[15px]">Content IQ</div>
              <div className="text-xs opacity-90">Ask about your content library</div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <Icon icon="solar:close-circle-linear" className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`rounded-xl px-3 py-2.5 text-[13px] leading-relaxed max-w-full ${
                  msg.role === "bot"
                    ? "bg-violet-100 dark:bg-violet-950/50 text-foreground self-start"
                    : "bg-violet-600 text-white self-end ml-auto"
                }`}
              >
                <p>{msg.content}</p>
                {msg.list && (
                  <ul className="mt-2 ml-4 space-y-1 text-xs list-disc">
                    {msg.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                )}
                {msg.chips && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.chips.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => handleChipClick(chip)}
                        className="bg-white text-foreground rounded-full px-3 py-1.5 text-[11px] border border-border hover:bg-muted transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-border bg-muted/50 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about your content..."
              className="flex-1 rounded-full text-sm"
            />
            <Button
              size="icon"
              onClick={handleSend}
              className="rounded-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Icon icon="solar:plain-2-linear" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* FAB Launcher */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-8 bottom-8 bg-violet-600 text-white rounded-full px-5 py-3 flex items-center gap-2 font-semibold text-sm shadow-lg shadow-violet-600/35 hover:bg-violet-700 transition-colors z-40"
      >
        <Icon icon="solar:chart-2-bold" className="w-5 h-5" />
        Content IQ
      </button>
    </>
  );
};
