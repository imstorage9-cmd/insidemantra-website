import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { PLACEHOLDER_SLOT, resolveImage } from "@/lib/images";
import { delay } from "@/lib/motion";

type ImageSlotProps = {
  slot: string; // path under public/images/, without extension
  alt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  /** Zoom the photo when a parent with the `group` class is hovered */
  zoomOnHover?: boolean;
  /** Unveil the photo upward like a curtain when it scrolls into view */
  curtain?: boolean;
  /** Stagger for the curtain reveal, in ms */
  revealDelay?: number;
};

const isDev = process.env.NODE_ENV === "development";

/**
 * Renders public/images/<slot>.* if it exists. Otherwise falls back to the shared
 * placeholder photo (public/images/placeholder.jpg) and, in the local preview only,
 * labels it with the file name this spot is waiting for. The parent sets the size.
 */
export function ImageSlot({
  slot,
  alt,
  className = "",
  sizes = "100vw",
  preload,
  zoomOnHover,
  curtain,
  revealDelay = 0,
}: ImageSlotProps) {
  const own = resolveImage(slot);
  const src = own ?? resolveImage(PLACEHOLDER_SLOT);

  return (
    <div
      className={`relative overflow-hidden bg-surface ${className}`}
      data-reveal={curtain ? "curtain" : undefined}
      style={curtain ? delay(revealDelay) : undefined}
    >
      {src ? (
        <>
          {/* Layers: the outer div is what the scroll observer watches (never clipped, so it is always detected);
              curtain-clip does the upward wipe; curtain-inner settles from a slight zoom; the image does the hover zoom. */}
          <div className="curtain-clip absolute inset-0">
            <div className="curtain-inner absolute inset-0">
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                preload={preload}
                className={`object-cover ${zoomOnHover ? "transition-transform duration-700 ease-out group-hover:scale-110" : ""}`}
              />
            </div>
          </div>
          {!own && isDev && (
            <span className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)] truncate rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] text-white">
              placeholder · add public/images/{slot}.jpg
            </span>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 border border-dashed border-[#cbbda8] bg-[#e9e1d4] p-4 text-center text-muted [border-radius:inherit]">
          <ImageIcon size={28} strokeWidth={1.25} aria-hidden />
          <span className="font-mono text-[11px] leading-4">public/images/{slot}.jpg</span>
        </div>
      )}
    </div>
  );
}
