import { Chat } from "@/components/dashboard/Chat"
import { Preview } from "@/components/dashboard/Preview"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const Dashboard = () => {
  return (
    <div className="p-4 pl-0 flex h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={30} className="p-4">
          <Chat />
          </ResizablePanel>
        <ResizableHandle withHandle className="" />
        <ResizablePanel className="border rounded-md" defaultSize={65} minSize={50}><Preview /></ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Dashboard