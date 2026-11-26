import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { resolveImage } from "@/lib/images";

type ImageSlotProps = {
  slot: string; // path under public/images/, without extension
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
};

/**
 * Renders public/images/<slot>.* if it exists, otherwise a labelled placeholder
 * telling the editor exactly where to drop the file. The parent sets the size.
 */
export function ImageSlot({ slot, alt, className = "", sizes = "100vw", preload }: ImageSlotProps) {
  const src = resolveImage(slot);

  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-[#cbbda8] bg-[#e9e1d4] p-4 text-center text-muted [border-radius:inherit]">
          <ImageIcon size={28} strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[11px] leading-4">public/images/{slot}.jpg</span>
        </div>
      )}
    </div>
  );
}
