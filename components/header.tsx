import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  IconGitHub,
  IconSeparator,
  IconSparkles,
  IconVercel,
  IconX,
} from "@/components/ui/icons";
import LogoIcon from "./ui/LogoIcon";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 h-14 shrink-0 bg-background backdrop-blur-xl">
      <span className="inline-flex items-center home-links whitespace-nowrap">
        <a href="https://vercel.com" rel="noopener" target="_blank">
          <LogoIcon className="mr-1 h-6 w-6" />
        </a>
        <IconSeparator className="w-6 h-6 text-muted-foreground/20" />
        <Link href="/">
          <span className="text-lg font-semibold">snowBrain</span>
        </Link>
      </span>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" asChild>
          <a
            target="_blank"
            href="https://github.com/vercel/ai/tree/main/examples/next-ai-rsc"
            rel="noopener noreferrer"
          >
            <IconGitHub />
          </a>
        </Button>
        <Button asChild>
          <a
            href="https://vercel.com/new/clone?repository-url="
            target="_blank"
          >
            <IconVercel />
          </a>
        </Button>
        <Button asChild variant={"outline"}>
          <a href="https://twitter.com/kaarthikcodes" target="_blank">
            <IconX />
          </a>
        </Button>
      </div>
    </header>
  );
}
