import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.contact.whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex h-14 items-center rounded-full bg-[#25d366] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <span className="animate-pulse-ring absolute inset-0 rounded-full bg-[#25d366]" aria-hidden />
      <span className="relative flex h-14 w-14 items-center justify-center">
        <MessageCircle size={26} className="transition-transform duration-300 group-hover:rotate-12" />
      </span>
      <span className="relative max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:max-w-40 group-hover:pr-5">
        Chat with us
      </span>
    </a>
  );
}
