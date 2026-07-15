import { useReveal } from "../hooks/useReveal";
import "./Reveal.css";

/**
 * variant: "up" | "left" | "right" | "scale" | "clip"
 */
export default function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  variant = "up",
}) {
  const [ref, visible] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${visible ? "reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
