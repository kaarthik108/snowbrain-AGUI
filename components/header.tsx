import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  IconGitHub,
  IconSeparator,
  IconVercel,
  IconX,
} from "@/components/ui/icons";
import { Schema } from "./schema";
import LogoIcon from "./ui/LogoIcon";

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 h-14 shrink-0 bg-background backdrop-blur-xl">
      <span className="inline-flex items-center home-links whitespace-nowrap">
        <a href="https://snowbrain.dev" rel="noopener">
          <LogoIcon className="mr-1 h-6 w-6 dark:text-stone-300" />
        </a>
        <IconSeparator className="w-6 h-6 text-muted-foreground/20" />
        <Link href="/">
          <span className="text-md sm:text-lg font-semibold dark:text-stone-300">
            snowBrain
          </span>
          <span className="text-xs bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 ml-1">
            (Beta)
          </span>
        </Link>
      </span>
      <div className="flex items-center justify-end space-x-2">
        <Schema />
        <Button variant="outline" asChild>
          <a
            target="_blank"
            href="https://github.com/kaarthik108"
            rel="noopener noreferrer"
          >
            <IconGitHub />
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
