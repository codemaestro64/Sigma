import Link from 'next/link';
import { Github, Twitter, MessageSquare } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <Link
              href="https://twitter.com/fairlaunch"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Fair Launch
            </Link>
            . The source code is available on{" "}
            <Link
              href="https://github.com/fairlaunch"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://github.com/fairlaunch"
            target="_blank"
            rel="noreferrer"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://twitter.com/fairlaunch"
            target="_blank"
            rel="noreferrer"
          >
            <Twitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://discord.gg/fairlaunch"
            target="_blank"
            rel="noreferrer"
          >
            <MessageSquare className="h-5 w-5" />
          </Link>
        </div>
      </div>
      <div className="container mt-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Fair Launch. All rights reserved.</p>
      </div>
    </footer>
  );
}