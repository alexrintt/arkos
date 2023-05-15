import { Transition, TransitionStatus } from "react-transition-group";
import { CSSProperties, useRef } from "react";

const duration = 50;

const defaultStyle: CSSProperties = {
  transition: `all ${duration}ms ease-in-out`,
  opacity: 0,
  zIndex: 100000,
  pointerEvents: "none",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  willChange: "contents",
};

const transitionStyles: Record<TransitionStatus, React.CSSProperties> = {
  entering: {
    opacity: 1,
    // translate: "10px 10px",
    pointerEvents: "auto",
  },
  entered: {
    opacity: 1,
    // translate: "10px 10px",
    pointerEvents: "auto",
  },
  exiting: {
    opacity: 0,
    // translate: "0px 0px",
    pointerEvents: "none",
  },
  exited: {
    opacity: 0,
    // translate: "0px 0px",
    pointerEvents: "none",
  },
  unmounted: {},
};

export type IFade = {
  in: boolean;
  children: React.ReactNode;
};

export function Fade({ in: inProp, children }: IFade) {
  const nodeRef = useRef(null);

  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={duration}>
      {(state) => {
        return (
          <div
            ref={nodeRef}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {children}
          </div>
        );
      }}
    </Transition>
  );
}
