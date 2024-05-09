import { Button } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <h1>
      PharmaHub Next Gen for pharmacy management
      <Link href="/portal">home</Link>
      <Button>CLICK</Button>
    </h1>
  );
}
