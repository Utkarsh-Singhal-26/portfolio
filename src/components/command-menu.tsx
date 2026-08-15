"use client";

import {
    ArticleIcon,
    BriefcaseIcon,
    EnvelopeSimpleIcon,
    FileTextIcon,
    GithubLogoIcon,
    HouseIcon,
    LinkedinLogoIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    StackIcon,
    SunIcon,
} from "@phosphor-icons/react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react";

import { DATA } from "@/app/data";
import { CornerMarks } from "@/components/ui/blueprint";
import { cn } from "@/lib/utils";

const SECTION_SHORTCUTS = [
    { key: "h", label: "Home", href: "/" },
    { key: "w", label: "Work", href: "/#work" },
    { key: "e", label: "Experience", href: "/#experience" },
    { key: "o", label: "Open source", href: "/#open-source" },
    { key: "s", label: "Stack", href: "/#stack" },
    { key: "a", label: "Writing", href: "/#writing" },
    { key: "c", label: "Contact", href: "/#contact" },
] as const;

const GLOBAL_SHORTCUTS = [
    { key: "⌘K", label: "Open command menu" },
    { key: "/", label: "Open command menu" },
    { key: "?", label: "Show shortcuts" },
    { key: "t", label: "Toggle theme" },
    { key: "esc", label: "Close menu or help" },
] as const;

const JUMP = [
    {
        href: "/",
        label: "Home",
        icon: HouseIcon,
        keywords: ["top", "header"],
    },
    {
        href: "/#work",
        label: "Work",
        icon: StackIcon,
        keywords: DATA.PROJECTS.map((project) => project.name),
    },
    {
        href: "/#experience",
        label: "Experience",
        icon: BriefcaseIcon,
        keywords: DATA.EXPERIENCE.map((company) => company.name),
    },
    {
        href: "/#open-source",
        label: "Open source",
        icon: GithubLogoIcon,
        keywords: ["github", "pull", "prs"],
    },
    {
        href: "/#stack",
        label: "Stack",
        icon: StackIcon,
        keywords: ["tools", "skills"],
    },
    {
        href: "/#writing",
        label: "Writing",
        icon: ArticleIcon,
        keywords: ["blog", "articles"],
    },
    {
        href: "/#contact",
        label: "Contact",
        icon: EnvelopeSimpleIcon,
        keywords: ["email", "hire"],
    },
] as const;

type CommandMenuContextValue = {
    open: boolean;
    setOpen: (open: boolean | ((value: boolean) => boolean)) => void;
};

const CommandMenuContext = createContext<CommandMenuContextValue | null>(null);

export function useCommandMenu() {
    const context = useContext(CommandMenuContext);
    if (!context) {
        throw new Error("useCommandMenu must be used within CommandMenu");
    }
    return context;
}

function isTypingTarget(target: EventTarget | null) {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
    );
}

function useGoTo() {
    const router = useRouter();

    return useCallback(
        (href: string) => {
            if (href.startsWith("http") || href.startsWith("mailto:")) {
                window.open(href, "_blank", "noopener,noreferrer");
                return;
            }

            if (href === "/") {
                if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    history.replaceState(null, "", "/");
                    return;
                }
                router.push("/");
                return;
            }

            if (href.startsWith("/#")) {
                const id = href.slice(2);
                if (window.location.pathname === "/") {
                    document
                        .getElementById(id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    history.replaceState(null, "", href);
                    return;
                }
                router.push(href);
                return;
            }

            router.push(href);
        },
        [router]
    );
}

export function CommandMenu({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const goTo = useGoTo();
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (helpOpen) {
                if (event.key === "Escape") {
                    event.preventDefault();
                    setHelpOpen(false);
                }
                return;
            }

            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault();
                setOpen((value) => !value);
                return;
            }

            if (open || isTypingTarget(event.target)) return;
            if (event.metaKey || event.ctrlKey || event.altKey) return;

            if (event.key === "/") {
                event.preventDefault();
                setOpen(true);
                return;
            }

            if (event.key === "?") {
                event.preventDefault();
                setHelpOpen(true);
                return;
            }

            if (event.key.toLowerCase() === "t") {
                event.preventDefault();
                setTheme(resolvedTheme === "dark" ? "light" : "dark");
                return;
            }

            const section = SECTION_SHORTCUTS.find(
                (item) => item.key === event.key.toLowerCase()
            );
            if (section) {
                event.preventDefault();
                goTo(section.href);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [goTo, helpOpen, open, resolvedTheme, setTheme]);

    return (
        <CommandMenuContext.Provider value={{ open, setOpen }}>
            {children}
            <CommandPalette />
            {helpOpen ? (
                <ShortcutHelp onClose={() => setHelpOpen(false)} />
            ) : null}
        </CommandMenuContext.Provider>
    );
}

function CommandPalette() {
    const { open, setOpen } = useCommandMenu();
    const { setTheme } = useTheme();
    const goTo = useGoTo();
    const [search, setSearch] = useState("");

    const onOpenChange = useCallback(
        (next: boolean) => {
            setOpen(next);
            if (!next) setSearch("");
        },
        [setOpen]
    );

    const run = useCallback(
        (action: () => void) => {
            setOpen(false);
            setSearch("");
            action();
        },
        [setOpen]
    );

    return (
        <Command.Dialog
            open={open}
            onOpenChange={onOpenChange}
            label="Command menu"
            loop
            overlayClassName="z-[80] fixed inset-0 bg-foreground/20"
            contentClassName="z-[80] top-[18vh] fixed left-1/2 -translate-x-1/2 w-[min(92vw,36rem)] outline-none"
            className="relative bg-secondary border border-foreground/20 text-foreground"
        >
            <CornerMarks />
            <h2 className="sr-only">Command menu</h2>
            <div className="relative">
                <MagnifyingGlassIcon
                    size={16}
                    weight="light"
                    className="top-1/2 left-5 absolute text-muted-foreground -translate-y-1/2"
                />
                <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Type to jump..."
                    className="px-12 py-4 border-line border-b w-full text-[15px] bg-transparent outline-none placeholder:text-muted-foreground"
                />
            </div>

            <Command.List className="max-h-[min(60vh,32rem)] overflow-y-auto overscroll-contain">
                <Command.Empty className="px-5 py-8 text-muted-foreground text-sm">
                    Nothing matches.
                </Command.Empty>

                <Command.Group heading="Jump">
                    {JUMP.map((item) => (
                        <CommandItem
                            key={item.href}
                            value={item.label}
                            keywords={[...item.keywords]}
                            onSelect={() => run(() => goTo(item.href))}
                        >
                            <item.icon size={16} weight="light" />
                            {item.label}
                        </CommandItem>
                    ))}
                </Command.Group>

                <Command.Group heading="Work">
                    {DATA.PROJECTS.map((project) => (
                        <CommandItem
                            key={project.href}
                            value={project.name}
                            keywords={project.stack}
                            onSelect={() => run(() => goTo(project.href))}
                        >
                            <StackIcon size={16} weight="light" />
                            {project.name}
                        </CommandItem>
                    ))}
                </Command.Group>

                <Command.Group heading="Writing">
                    {DATA.WRITING.map((item) => (
                        <CommandItem
                            key={item.href}
                            value={item.title}
                            keywords={["article", "post"]}
                            onSelect={() => run(() => goTo(item.href))}
                        >
                            <ArticleIcon size={16} weight="light" />
                            <span className="truncate">{item.title}</span>
                        </CommandItem>
                    ))}
                </Command.Group>

                <Command.Group heading="Connect">
                    <CommandItem
                        value="Email"
                        keywords={["mail", "contact"]}
                        onSelect={() => run(() => goTo(DATA.HEADER.EMAIL))}
                    >
                        <EnvelopeSimpleIcon size={16} weight="light" />
                        Email
                    </CommandItem>
                    <CommandItem
                        value="Resume"
                        keywords={["cv", "pdf"]}
                        onSelect={() => run(() => goTo(DATA.HEADER.RESUME))}
                    >
                        <FileTextIcon size={16} weight="light" />
                        Resume
                    </CommandItem>
                    <CommandItem
                        value="GitHub"
                        onSelect={() => run(() => goTo(DATA.HEADER.GITHUB))}
                    >
                        <GithubLogoIcon size={16} weight="light" />
                        GitHub
                    </CommandItem>
                    <CommandItem
                        value="LinkedIn"
                        onSelect={() => run(() => goTo(DATA.HEADER.LINKEDIN))}
                    >
                        <LinkedinLogoIcon size={16} weight="light" />
                        LinkedIn
                    </CommandItem>
                </Command.Group>

                <Command.Group heading="Theme">
                    <CommandItem
                        value="Light theme"
                        keywords={["day"]}
                        onSelect={() => run(() => setTheme("light"))}
                    >
                        <SunIcon size={16} weight="light" />
                        Light
                    </CommandItem>
                    <CommandItem
                        value="Dark theme"
                        keywords={["night"]}
                        onSelect={() => run(() => setTheme("dark"))}
                    >
                        <MoonIcon size={16} weight="light" />
                        Dark
                    </CommandItem>
                </Command.Group>
            </Command.List>

            <div className="px-5 py-3 border-line border-t space-y-1.5">
                <p className="font-mono text-[11px] text-muted-foreground text-center">
                    <Kbd>h</Kbd>
                    <Kbd>w</Kbd>
                    <Kbd>e</Kbd>
                    <Kbd>o</Kbd>
                    <Kbd>s</Kbd>
                    <Kbd>a</Kbd>
                    <Kbd>c</Kbd> sections
                    <span className="inline-block w-2" />
                    <Kbd>t</Kbd> theme
                    <span className="inline-block w-2" />
                    <Kbd>?</Kbd> help
                </p>
                <p className="font-mono text-[11px] text-muted-foreground text-center">
                    <Kbd>⌘K</Kbd> or <Kbd>/</Kbd> search
                    <span className="inline-block w-2" />
                    <Kbd>↑</Kbd>
                    <Kbd>↓</Kbd>
                    <Kbd>↵</Kbd>
                    <Kbd>esc</Kbd>
                </p>
            </div>
        </Command.Dialog>
    );
}

function ShortcutHelp({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="z-85 fixed inset-0 bg-foreground/20"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-label="Keyboard shortcuts"
                className="top-[18vh] left-1/2 absolute bg-secondary border border-foreground/20 w-[min(92vw,28rem)] -translate-x-1/2"
                onClick={(event) => event.stopPropagation()}
            >
                <CornerMarks />
                <div className="px-5 py-4 border-line border-b">
                    <h2 className="font-medium text-sm tracking-tight">
                        Keyboard shortcuts
                    </h2>
                </div>
                <div className="px-5 py-4 space-y-5">
                    <ShortcutList title="Sections" items={SECTION_SHORTCUTS} />
                    <ShortcutList title="Global" items={GLOBAL_SHORTCUTS} />
                </div>
                <div className="px-5 py-3 border-line border-t">
                    <p className="font-mono text-[11px] text-muted-foreground text-center">
                        Press <Kbd>esc</Kbd> to close
                    </p>
                </div>
            </div>
        </div>
    );
}

function ShortcutList({
    title,
    items,
}: {
    title: string;
    items: ReadonlyArray<{ key: string; label: string }>;
}) {
    return (
        <div>
            <p className="mb-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.14em]">
                {title}
            </p>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li
                        key={item.key}
                        className="flex items-center justify-between gap-4 text-sm"
                    >
                        <span className="text-foreground/80">{item.label}</span>
                        <Kbd>{item.key}</Kbd>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function CommandItem({
    children,
    className,
    ...props
}: ComponentProps<typeof Command.Item>) {
    return (
        <Command.Item
            className={cn(
                "flex items-center gap-3 px-5 py-3 border-line border-b text-foreground/80 text-sm select-none cursor-target",
                "data-[selected=true]:bg-foreground/5 data-[selected=true]:text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </Command.Item>
    );
}

function Kbd({ children }: { children: ReactNode }) {
    return (
        <kbd className="inline-flex items-center px-1.5 border border-line h-5 font-mono text-[11px] text-muted-foreground">
            {children}
        </kbd>
    );
}
