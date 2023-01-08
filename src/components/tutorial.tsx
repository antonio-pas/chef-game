import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import styles from "./tutorial.module.css";
import { Button } from "./ui";

export interface TutorialProps {
  messages: [string, string, string][],
  initialIndex: number,
  onTutorialEnd: () => void
}
export const Tutorial: FunctionalComponent<TutorialProps> = ({ messages, initialIndex, onTutorialEnd}) => {
  const [index, setIndex] = useState(initialIndex);
  const [heading, message, video] = messages[index];
  const atEnd = () => index === messages.length - 1;
  const atStart = () => index === 0;
  function next() {
    if (atEnd()) {
      onTutorialEnd();
    } else {
      setIndex(index + 1);
    }
  }
  function prev() {
    if (!atStart()) {
      setIndex(index - 1);
    }
  }
  return (
    <div class={styles.tutorial}>
      <div class={styles.card}>
        <h1 class={styles.heading}>{heading}</h1>
        <hr class={styles.hr} />
        <p class={styles.p}>{message}</p>
        {video !== "" &&
          <img src={video}></img>
        }
        <div class={styles.buttons}>
          <Button onClick={prev}>Previous</Button>
          <Button onClick={next}>{atEnd() ? "Done" : "Next"}</Button>
        </div>
      </div>
    </div>
  );
}
