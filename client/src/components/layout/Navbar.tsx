import * as React from "react"
import { Link } from "react-router-dom"
import { Linkedin, Twitter } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler"
import { Button } from "../ui/button"
import Authentication from "../auth/Authentication"

const components: { title: string; to: string; description: string }[] = [
    {
        title: "Spec-Driven Development",
        to: "/",
        description:
            "Traycer starts each task with a detailed, actionable plan so developers can iterate on ideas with AI rather than cryptic code diffs.",
    },
    {
        title: "Iteration to Perfection",
        to: "/",
        description:
            "Users can make precise updates to the plan, and Traycer ensures the plan remains coherent and grounded in the actual codebase.",
    },
    {
        title: "Parallel Agents",
        to: "/",
        description:
            "Multiple planning agents can be spun up simultaneously to get more done faster.",
    },
    {
        title: "One Click Hand-Off",
        to: "/",
        description: "Once the plan is finalized, code generation begins instantly via popular AI agents like Cursor, Claude Code, and Windsurf.",
    }
]

export function Navbar() {
    return (
        <NavigationMenu viewport={false} className="flex justify-between items-center w-full">
            <NavigationMenuList className="flex items-center">
                <span className="text-3xl pr-3">traycer</span>
                <div className="md:flex hidden space-x-2">
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="rounded-xs">Features</NavigationMenuTrigger>
                        <NavigationMenuContent className="rounded-xs">
                            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {components.map((component) => (
                                    <ListItem
                                        key={component.title}
                                        title={component.title}
                                        to={component.to}
                                    >
                                        {component.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                            <Link to="/">Docs</Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="rounded-xs">Resources</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[150px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="/">Components</Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="/">Blocks</Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Community</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[150px] gap-4">
                                <li>
                                    <NavigationMenuLink asChild>
                                        <Link to="/" className="flex-row items-center gap-2">
                                            <div className="w-8 h-8 border flex items-center justify-center rounded-xs"><Twitter /></div>
                                            Twitter
                                        </Link>
                                    </NavigationMenuLink>
                                    <NavigationMenuLink asChild>
                                        <Link to="/" className="flex-row items-center gap-2">
                                            <div className="w-8 h-8 border flex items-center justify-center rounded-xs"><Linkedin /></div>
                                            Linkedin
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </div>
            </NavigationMenuList>
            <div className="flex items-center gap-3">
                <AnimatedThemeToggler />
                <Dialog>
                    <DialogTrigger><Button className="rounded-xs">Signup</Button></DialogTrigger>
                    <DialogContent className="max-w-[200px]">
                        <Authentication />
                    </DialogContent>
                </Dialog>
            </div>
        </NavigationMenu>
    )
}

function ListItem({
    title,
    children,
    to,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link to={to}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}
