"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Menu, Stethoscope } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              MedDeck.io
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/#tools"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Tools
            </Link>
            <Link
              href="/about"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              About
            </Link>
            <Link
              href="/#pricing"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-background/80 backdrop-blur-lg">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Link href="/" className="flex items-center">
              <Stethoscope className="h-6 w-6 text-primary" />
              <span className="ml-2 font-bold font-headline">MedDeck.io</span>
            </Link>
            <div className="mt-8 flex flex-col gap-4">
              <Link href="/#tools" className="hover:underline">Tools</Link>
              <Link href="/about" className="hover:underline">About</Link>
              <Link href="/#pricing" className="hover:underline">Pricing</Link>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
