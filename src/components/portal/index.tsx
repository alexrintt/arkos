import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useMouseMoveEvent } from "../../pages/dashboard";

export interface IPortal extends React.PropsWithChildren {
  anchor?: DOMRect;
  isOpen: boolean;
}

export type PortalRectBuilder = (
  viewport: DOMRect,
  // anchor: DOMRect,
  menu: DOMRect
) => DOMRect;

export function Portal({ isOpen, children }: IPortal) {
  const portalRef = useRef<HTMLDivElement>(null);

  const mouseMoveEvent = useMouseMoveEvent();

  const [currentPortalPosition, setCurrentPortalPosition] = useState<
    DOMRect | undefined
  >(undefined);

  const [portalBouncingRect, setPortalBouncingRect] = useState<
    DOMRect | undefined
  >(undefined);

  const isPortalReadToShow = !!currentPortalPosition;

  const visible = isOpen && isPortalReadToShow;

  useEffect(() => {
    if (!portalRef.current) {
      setPortalBouncingRect(undefined);
    } else {
      setPortalBouncingRect(portalRef.current.getBoundingClientRect());
    }
  }, [portalRef]);

  useEffect(() => {
    if (visible) return;

    if (!portalBouncingRect || !mouseMoveEvent) {
      setCurrentPortalPosition(undefined);
    } else {
      const viewport = new DOMRect(0, 0, window.innerWidth, window.innerHeight);

      const left = Math.min(
        viewport.width - portalBouncingRect.width,
        mouseMoveEvent.x
      );

      const top = Math.min(
        viewport.height - portalBouncingRect.height,
        mouseMoveEvent.y
      );

      setCurrentPortalPosition(
        new DOMRect(
          left,
          top,
          portalBouncingRect.width,
          portalBouncingRect.height
        )
      );
    }
  }, [portalBouncingRect, mouseMoveEvent]);

  return (
    <div
      data-portal={true}
      className="fixed rounded-lg bg-s2 shadow-md cursor-pointer"
      ref={portalRef}
      style={{
        zIndex: 200,
        top: `${currentPortalPosition?.top}px`,
        left: `${currentPortalPosition?.left}px`,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
}

export function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef<HTMLElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, isComponentVisible, setIsComponentVisible };
}
