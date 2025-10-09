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
                    <Dialog>
                        <DialogTrigger><Button>Create Project</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader >
                                <DialogTitle>Create Project</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                                <FieldSet>
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="username">Project Name</FieldLabel>
                                            <Input id="username" type="text" placeholder="Project-architech" />
                                        </Field>
                                        <FieldSet>
                                            <FieldLabel htmlFor="compute-environment-p8w">
                                                Project base tech-stack
                                            </FieldLabel>
                                            <RadioGroup defaultValue="kubernetes" className="flex">
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
                                                        <RadioGroupItem value="vm" id="vm-z4k" />
                                                    </Field>
                                                </FieldLabel>
                                            </RadioGroup>
                                        </FieldSet>
                                    </FieldGroup>
                                    <Button onClick={onCreateProject}>Create Project</Button>
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
    createdAt: Date;
}

// Sample files for Sandpack
// const sampleFiles = {
//     "/App.js": {
//         code: `import React, { useState } from 'react';
// import './App.css';

// export default function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <div className="app">
//       <h1>Welcome to Traycer</h1>
//       <p>This is a sample React app in Sandpack!</p>
//       <div className="counter">
//         <button onClick={() => setCount(count - 1)}>-</button>
//         <span>{count}</span>
//         <button onClick={() => setCount(count + 1)}>+</button>
//       </div>
//       <p>Edit the files to see changes in real-time!</p>
//     </div>
//   );
// }`,
//         active: true,
//     },
//     "/App.css": {
//         code: `.app {
//   text-align: center;
//   padding: 20px;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
// }

// h1 {
//   color: #333;
//   margin-bottom: 20px;
// }

// .counter {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 15px;
//   margin: 20px 0;
// }

// .counter button {
//   padding: 10px 20px;
//   font-size: 18px;
//   border: 2px solid #007acc;
//   background: white;
//   color: #007acc;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: all 0.2s;
// }

// .counter button:hover {
//   background: #007acc;
//   color: white;
// }

// .counter span {
//   font-size: 24px;
//   font-weight: bold;
//   min-width: 50px;
// }`,
//     },
//     "/index.js": {
//         code: `import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';

// const container = document.getElementById('root');
// const root = createRoot(container);

// root.render(<App />);`,
//     },
//     "/public/index.html": {
//         code: `<!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Traycer Sandpack</title>
//   </head>
//   <body>
//     <div id="root"></div>
//   </body>
// </html>`,
//     },
// };

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
                            <MenubarItem>{projectData.id}</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem>Save</MenubarItem>
                            <MenubarItem>Reload</MenubarItem>
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
