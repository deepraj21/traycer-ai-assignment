import { ArrowUpRightIcon, FolderClosedIcon } from "lucide-react"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NoProjectProps {
    onCreateProject: () => void;
}

function NoProject({ onCreateProject }: NoProjectProps) {
    return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <FolderClosedIcon />
                </EmptyMedia>
                <EmptyTitle>No Projects Yet</EmptyTitle>
                <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by creating
                    your first project.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <div className="flex gap-2">
                    <Button onClick={onCreateProject}>Create Project</Button>
                    <Button variant="outline">Import Project</Button>
                </div>
            </EmptyContent>
            <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
            >
                <a href="#">
                    Learn More <ArrowUpRightIcon />
                </a>
            </Button>
        </Empty>
    )
}

interface ProjectProps {
    projectData: ProjectData;
}

interface ProjectData {
    id: string;
    createdAt: Date;
}

function Project({ projectData }: ProjectProps) {
    const { user, signout } = useAuth()
    return (
        <div>
            <div className="p-2 border-b flex gap-2">
                <Menubar className="w-fit">
                    <MenubarMenu>
                        <MenubarTrigger>traycer</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>{user?.email}</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem onClick={signout}>Logout</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Project</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>{projectData.id}</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Save</MenubarItem>
                            <MenubarItem>Reload</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="account">Code</TabsTrigger>
                        <TabsTrigger value="password">Preview</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </div>
    )
}

export function Preview() {
    const [projectCreated, setProjectCreated] = useState<boolean>(false)
    const [projectData, setProjectData] = useState<ProjectData | null>(null)

    // useEffect to handle project creation and display
    useEffect(() => {
        if (projectCreated && projectData) {
            console.log('Project created successfully:', projectData)
            // You can add additional logic here like API calls, notifications, etc.
        }
    }, [projectCreated, projectData])

    const handleCreateProject = () => {
        // Create a new project with sample data
        const newProject: ProjectData = {
            id: `project_${Date.now()}`,
            createdAt: new Date()
        }

        setProjectData(newProject)
        setProjectCreated(true)
    }

    return (
        <div className="">
            {projectCreated && projectData ? (
                <Project projectData={projectData} />
            ) : (
                <div className="min-h-screen flex items-center justify-center">
                    <NoProject onCreateProject={handleCreateProject} />
                </div>
            )}
        </div>
    )
}
