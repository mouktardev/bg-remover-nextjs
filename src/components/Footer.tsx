import { RiGithubLine, RiInstagramLine, RiTwitterXLine } from 'react-icons/ri'

export const Footer = () => {
    return (
        <footer className="flex items-center justify-center gap-2 border-t border-accent bg-background/80 p-4 text-primary backdrop-blur-md">
            <p>MouktarDev ©2024</p>
            <p>&#8226;</p>
            <a className="text-secondary" target='_blank' href="https://x.com/mouktardev">
                <RiTwitterXLine className="size-6" />
            </a>
            <p>&#8226;</p>
            <a className="text-secondary" target='_blank' href="https://github.com/mouktardev">
                <RiGithubLine className="size-6" />
            </a>
            <p>&#8226;</p>
            <a className="text-secondary" target='_blank' href="https://www.instagram.com/mouktardev/">
                <RiInstagramLine className="size-6" />
            </a>
        </footer>
    )
}