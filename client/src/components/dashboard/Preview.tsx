import { ArrowUpRightIcon, FolderClosedIcon, Lock } from "lucide-react"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    SandpackProvider,
    SandpackLayout,
    SandpackFileExplorer,
    SandpackCodeEditor,
    SandpackPreview,
    SandpackConsole,
} from "@codesandbox/sandpack-react"
import { sandpackDark } from "@codesandbox/sandpack-themes"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Status, StatusIndicator, StatusLabel } from "../kibo-ui/status"

interface NoProjectProps {
    onCreateProject: (projectName: string, techStack: string) => void;
}

function NoProject({ onCreateProject }: NoProjectProps) {
    const [projectName, setProjectName] = useState<string>("")
    const [techStack, setTechStack] = useState<string>("kubernetes")
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
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
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                            setProjectName("")
                            setTechStack("kubernetes")
                        }
                    }}>
                        <DialogTrigger><Button>Create Project</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader >
                                <DialogTitle>Create Project</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <FieldSet>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="projectName">Project Name</FieldLabel>
                                            <Input
                                                id="projectName"
                                                type="text"
                                                placeholder="Project-architech"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                            />
                                        </Field>
                                        <FieldSet>
                                            <FieldLabel htmlFor="compute-environment-p8w">
                                                Project base tech-stack
                                            </FieldLabel>
                                            <RadioGroup value={techStack} onValueChange={setTechStack} className="flex">
                                                <FieldLabel htmlFor="kubernetes-r2h">
                                                    <Field orientation="horizontal">
                                                        <FieldContent>
                                                            <FieldTitle className="text-lg">NodeJs</FieldTitle>
                                                            <FieldDescription className="text-xs">
                                                                Basic http server
                                                            </FieldDescription>
                                                        </FieldContent>
                                                        <RadioGroupItem value="kubernetes" id="kubernetes-r2h" />
                                                    </Field>
                                                </FieldLabel>
                                                <FieldLabel htmlFor="vm-z4k">
                                                    <Field orientation="horizontal">
                                                        <FieldContent>
                                                            <FieldTitle className="text-lg">ReactJs</FieldTitle>
                                                            <FieldDescription className="text-xs">
                                                                Basic react app
                                                            </FieldDescription>
                                                        </FieldContent>
                                                        <div className="flex flex-col justify-between h-full items-center">
                                                            <RadioGroupItem value="vm" id="vm-z4k" disabled />
                                                            <Lock size="16" className="text-muted" />
                                                        </div>
                                                    </Field>
                                                </FieldLabel>
                                            </RadioGroup>
                                        </FieldSet>
                                    </FieldGroup>
                                    <Button
                                        onClick={() => {
                                            onCreateProject(projectName, techStack)
                                            setIsDialogOpen(false)
                                        }}
                                        disabled={!projectName.trim()}
                                    >
                                        Create Project
                                    </Button>
                                </FieldSet>
                            </DialogDescription>
                        </DialogContent>
                    </Dialog>
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
    name: string;
    techStack: string;
    createdAt: Date;
}

function Project({ projectData }: ProjectProps) {
    const { user, signout } = useAuth()
    const [activeTab, setActiveTab] = useState("code")

    return (
        <div className="h-screen flex flex-col">
            <div className="p-3 border-b flex gap-2 items-center bg-background">
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
                            <MenubarItem>{projectData.name}</MenubarItem>
                            <MenubarItem>Tech Stack: {projectData.techStack === 'kubernetes' ? 'Node.js' : 'React.js'}</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>
                                Save
                                <Status status="degraded" className="rounded-full p-1 pl-2 pr-2">
                                    <StatusIndicator />
                                    <StatusLabel>Changes</StatusLabel>
                                </Status>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>New Project</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
                    <TabsList>
                        <TabsTrigger value="code">Code</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="flex-1 overflow-hidden" style={{ height: 'calc(100vh - 60px)' }}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                    <TabsContent value="code" className="h-full m-0 data-[state=inactive]:hidden">
                        <SandpackProvider theme={sandpackDark} template="node">
                            <SandpackLayout className="h-full" style={{ borderRadius: '0', border: '0', }}>
                                <SandpackFileExplorer style={{ height: 'calc(100vh - 94px)', width: '30vw', borderRadius: '0', borderBottom: '0' }} />
                                <SandpackCodeEditor style={{ height: 'calc(100vh - 94px)', width: '40vw', borderRadius: '0', borderBottom: '0' }} showTabs closableTabs initMode="lazy" showLineNumbers />
                            </SandpackLayout>
                        </SandpackProvider>
                    </TabsContent>

                    <TabsContent value="preview" className="h-full m-0 data-[state=inactive]:hidden">
                        <SandpackProvider
                            // files={sampleFiles}
                            theme={sandpackDark}
                            template="node"
                        >
                            <SandpackLayout className="h-full" style={{ borderRadius: '0', border: '0', }}>
                                <SandpackPreview
                                    style={{ height: 'calc(100vh - 94px)' }}
                                    showNavigator={false}
                                    showRefreshButton={true}
                                    showOpenInCodeSandbox={false}
                                />
                                <SandpackConsole
                                    style={{ height: 'calc(100vh - 94px)' }}
                                    showHeader={true}
                                    showSyntaxError={true}
                                    maxMessageCount={10}
                                />
                            </SandpackLayout>
                        </SandpackProvider>
                    </TabsContent>
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

    const handleCreateProject = (projectName: string, techStack: string) => {
        // Create a new project with user input data
        const newProject: ProjectData = {
            id: `project_${Date.now()}`,
            name: projectName,
            techStack: techStack,
            createdAt: new Date()
        }

        setProjectData(newProject)
        setProjectCreated(true)
    }

    return (
        <div className="h-screen">
            {projectCreated && projectData ? (
                <Project projectData={projectData} />
            ) : (
                <div className="h-full flex items-center justify-center">
                    <NoProject onCreateProject={handleCreateProject} />
                </div>
            )}
        </div>
    )
}
