"use client"

import { useTheme } from "next-themes";
import { Button as ButtonAria, Menu, MenuItem, MenuItemProps, MenuTrigger, Popover } from 'react-aria-components';
import { LuAppWindow, LuMoon, LuSun } from "react-icons/lu";

export function ThemeToggle() {
	const { setTheme } = useTheme()

	return (
		<MenuTrigger>
			<ButtonAria
				aria-label="ThemeMenu"
				className="inline-flex items-center justify-center rounded-md border border-accent bg-foreground px-2 py-1 text-sm text-primary focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:text-primary/50 disabled:opacity-50"
			>
				<LuSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
				<LuMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				<span className="sr-only">Toggle theme</span>
			</ButtonAria>
			<Popover placement='bottom right' className="origin-top-left overflow-auto rounded-lg border border-accent bg-foreground/50 p-1 shadow-lg ring-1 ring-accent/5 backdrop-blur-md fill-mode-forwards entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:zoom-out-95">
				<Menu className="outline-none">
					<ActionItem id="light" onAction={() => setTheme("light")}>
						<LuSun className="mr-2 size-4" />
						Light
					</ActionItem>
					<ActionItem id="dark" onAction={() => setTheme("dark")}>
						<LuMoon className="mr-2 size-4" />
						Dark
					</ActionItem>
					<ActionItem id="system" onAction={() => setTheme("system")}>
						<LuAppWindow className="mr-2 size-4" />
						System
					</ActionItem>
				</Menu>
			</Popover>
		</MenuTrigger>
	)
}

function ActionItem(props: MenuItemProps) {
	return (
		<MenuItem
			{...props}
			className="group box-border flex w-full cursor-default items-center rounded-md p-2 text-sm text-secondary outline-none focus:bg-background focus:text-primary"
		/>
	);
}