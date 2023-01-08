import { Button } from "$components/ui";
import { Link } from "preact-router";
import styles from  "./home.module.css";

export const Home = () => {
  return (
    <div class={styles.centered}>
      <Link href="/game">
        <Button large>Play the game</Button>
      </Link>
    </div>
  )
}
