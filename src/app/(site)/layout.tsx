import { Footer } from "@/components/Footer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { LuHome } from "react-icons/lu";

export default function SiteLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
    return (
        <main className="relative flex min-h-dvh flex-col">
            <nav className='sticky top-0 z-20 border-b border-accent bg-foreground/30 px-4 py-2 backdrop-blur-md'>
                <div className="flex items-center gap-3 ">
                    <div className="flex flex-1 items-center gap-3">
                        <Link href='/images'>
                            <Button type="button" variant="outline">
                                <LuHome className="size-4" />
                            </Button>
                        </Link>
                    </div>
                    <ThemeToggle />
                </div>
            </nav>
            {children}
            {modal}
            <Footer />
        </main>
    )
}