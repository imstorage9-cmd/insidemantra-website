import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle size={26} />
    </a>
  );
}
