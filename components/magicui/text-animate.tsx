"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps, Variants } from "motion/react";
import { ElementType, memo, ReactNode, isValidElement } from "react";

type AnimationType = "text" | "word" | "character" | "line";
type AnimationVariant =
  | "fadeIn"
  | "blurIn"
  | "blurInUp"
  | "blurInDown"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "scaleUp"
  | "scaleDown";


/**
 * Props for TextAnimate component (can include HTML tags)
 */
type TextAnimateProps = MotionProps & {
  children: ReactNode;
  className?: string;
  segmentClassName?: string;
  delay?: number;
  duration?: number;
  variants?: Variants;
  as?: ElementType;
  by?: AnimationType;
  startOnView?: boolean;
  once?: boolean;
  animation?: AnimationVariant;
  accessible?: boolean;
};

const staggerTimings: Record<AnimationType, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
};

const defaultContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const defaultItemAnimationVariants: Record<
  AnimationVariant,
  { container: Variants; item: Variants }
> = {
  fadeIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.3 },
      },
    },
  },
  blurIn: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        transition: { duration: 0.3 },
      },
    },
  },
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  blurInDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
      show: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
  slideUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: 20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      },
      exit: {
        y: -20,
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      },
    },
  },
  slideDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { y: -20, opacity: 0 },
      show: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        y: 20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideLeft: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: 20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        x: -20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  slideRight: {
    container: defaultContainerVariants,
    item: {
      hidden: { x: -20, opacity: 0 },
      show: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.3 },
      },
      exit: {
        x: 20,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  scaleUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 0.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        },
      },
      exit: {
        scale: 0.5,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
  scaleDown: {
    container: defaultContainerVariants,
    item: {
      hidden: { scale: 1.5, opacity: 0 },
      show: {
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
          scale: {
            type: "spring",
            damping: 15,
            stiffness: 300,
          },
        },
      },
      exit: {
        scale: 1.5,
        opacity: 0,
        transition: { duration: 0.3 },
      },
    },
  },
};


// Helper: recursively process children, animating only text nodes
function renderAnimatedSegments(
  node: ReactNode,
  by: AnimationType,
  finalVariants: { container: Variants; item: Variants },
  segmentClassName: string | undefined,
  accessible: boolean,
  staggerBase: number,
  keyPrefix: string = ""
): React.ReactNode {
  if (typeof node === "string") {
    let segments: string[] = [];
    switch (by) {
      case "word":
        segments = node.split(/(\s+)/);
        break;
      case "character":
        segments = node.split("");
        break;
      case "line":
        segments = node.split("\n");
        break;
      case "text":
      default:
        segments = [node];
        break;
    }
    return segments.map((segment, i) => (
      <motion.span
        key={`${keyPrefix}${by}-${segment}-${i}`}
        variants={finalVariants.item}
        custom={i * staggerBase}
        className={cn(
          by === "line" ? "block" : "inline-block whitespace-pre",
          by === "character" && "",
          segmentClassName,
        )}
        aria-hidden={accessible ? true : undefined}
      >
        {segment}
      </motion.span>
    ));
  }
  if (Array.isArray(node)) {
    return node.map((child, i) =>
      renderAnimatedSegments(
        child,
        by,
        finalVariants,
        segmentClassName,
        accessible,
        staggerBase,
        keyPrefix + i + "-"
      )
    );
  }
  if (isValidElement(node)) {
    // Recursively process children of elements
    const props = node.props as { children?: ReactNode };
    return (
      node.type === "span"
        ? <span {...props}>{renderAnimatedSegments(props.children, by, finalVariants, segmentClassName, accessible, staggerBase, keyPrefix)}</span>
        : node
    );
  }
  return node;
}

const TextAnimateBase = ({
  children,
  delay = 0,
  duration = 0.3,
  variants,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = false,
  by = "word",
  animation = "fadeIn",
  accessible = true,
  ...props
}: TextAnimateProps) => {
  const MotionComponent = motion.create(Component);

  // For variant calculation, count only text segments
  let textLength = 0;
  function countTextSegments(node: ReactNode): number {
    if (typeof node === "string") {
      switch (by) {
        case "word": return node.split(/(\s+)/).length;
        case "character": return node.length;
        case "line": return node.split("\n").length;
        case "text": default: return 1;
      }
    }
    if (Array.isArray(node)) return node.reduce((acc, child) => acc + countTextSegments(child), 0);
    if (isValidElement(node)) {
      const props = node.props as { children?: ReactNode };
      return countTextSegments(props.children);
    }
    return 0;
  }
  textLength = countTextSegments(children);
  if (textLength === 0) textLength = 1;

  const finalVariants = variants
    ? {
      container: {
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            opacity: { duration: 0.01, delay },
            delayChildren: delay,
            staggerChildren: duration / textLength,
          },
        },
        exit: {
          opacity: 0,
          transition: {
            staggerChildren: duration / textLength,
            staggerDirection: -1,
          },
        },
      },
      item: variants,
    }
    : animation
      ? {
        container: {
          hidden: defaultItemAnimationVariants[animation].container.hidden ?? { opacity: 0 },
          show: {
            ...defaultItemAnimationVariants[animation].container.show,
            transition: {
              delayChildren: delay,
              staggerChildren: duration / textLength,
            },
          },
          exit: {
            ...defaultItemAnimationVariants[animation].container.exit,
            transition: {
              staggerChildren: duration / textLength,
              staggerDirection: -1,
            },
          },
        },
        item: defaultItemAnimationVariants[animation].item,
      }
      : { container: defaultContainerVariants, item: defaultItemVariants };

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        variants={finalVariants.container as Variants}
        initial="hidden"
        whileInView={startOnView ? "show" : undefined}
        animate={startOnView ? undefined : "show"}
        exit="exit"
        className={cn("whitespace-pre-wrap", className)}
        viewport={{ once }}
        aria-label={accessible ? (typeof children === "string" ? children : undefined) : undefined}
        {...props}
      >
        {accessible && <span className="sr-only">{children}</span>}
        {renderAnimatedSegments(children, by, finalVariants, segmentClassName, accessible, staggerTimings[by])}
      </MotionComponent>
    </AnimatePresence>
  );
};

// Export the memoized version
export const TextAnimate = memo(TextAnimateBase);
