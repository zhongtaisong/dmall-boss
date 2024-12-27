import { Empty, Image } from "antd";
import type { ImageProps } from "antd";
import { useEffect, useRef, useState } from "react";

export default function LazyLoadImage({ src, ...restProps }: ImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>();
  const imageRef = useRef(null);

  useEffect(() => {
    let ob: IntersectionObserver | null = null;
    if (imageRef?.current) {
      ob = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry?.isIntersecting) {
            setImageSrc(src);
            ob?.unobserve?.(entry?.target);
          }
        });
      });

      ob.observe(imageRef?.current);
    }

    return () => {
      if (ob && imageRef?.current) {
        ob?.unobserve?.(imageRef?.current);
      }
    };
  });

  return (
    <div ref={imageRef}>
        {
            imageSrc ? (
                <Image src={ imageSrc } {...restProps} />
            ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )
        }
    </div>
  );
}
