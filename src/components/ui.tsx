import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

import styles from "./ui.module.css";

export const Icon = ({ name }: { name: string }) => {
  return <span class="material-icons">{name}</span>;
}

interface ButtonProps {
  disabled?: boolean;
  large?: boolean;
  square?: boolean;
  onClick?: () => void;
}
export const Button: FunctionComponent<ButtonProps> = ({ large = false, disabled = false, onClick, square = false, children }) => {
  const [clicked, setClicked] = useState(false);
  useEffect(() => {
    if (!clicked) return;
    const timer = setTimeout(() => {
      setClicked(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [clicked]);
  const animate = () => {
    if (disabled || clicked) return;
    if (onClick !== undefined) onClick();
    setClicked(true);
  };
  return (
    <button onClick={animate} disabled={disabled} class={`${styles.button} ${large ? "large" : ""} ${square ? styles.square : ''} ${clicked ? styles.clicked : ''}`} >
      {children}
    </button>
  );
};
