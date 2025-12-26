import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full py-8 mt-auto border-t border-white/5 text-center text-zinc-600 text-sm">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p>© {new Date().getFullYear()} Unofficial Project.</p>
                <div className="flex gap-6">
                    <Link href="/about" className="hover:text-zinc-400 transition-colors">About</Link>
                    <a href="https://arpitbhayani.me" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Official Site</a>
                    <a href="https://github.com/Raviikumar001" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">Developer</a>
                </div>
            </div>
        </footer>
    );
}
