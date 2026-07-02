import type { ReactNode } from "react";
import Header from "@/widgets/Header/Header";
import styles from "./ApplicationLayout.module.css";

type Props = {
  children: ReactNode;
};

export default function ApplicationLayout({ children }: Props) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <footer>«Своя игра»</footer>
    </div>
  );
}
