import { useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandInput
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowUp, Book, Brain, CloudUpload, Globe, Paperclip, Plus, Settings2 } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import gemini_logo from "@/assets/gemini.png"
import groq_logo from "@/assets/groq.png"
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { PlanLive } from "@/components/ai-elements/plan-live"
import { useChat } from "@/context/chat-context"
import { Response } from "../ai-elements/response"
import { Loader } from "../ai-elements/loader"

const MODEL_DATA = {
  models: [
    {
      name: "gemini-2.5-flash",
      icon: () => <img src={gemini_logo} alt="Gemini" className="w-5 h-5 rounded" />,
      badge: "free",
    },
    {
      name: "groq",
      icon: () => <img src={groq_logo} alt="Groq" className="w-5 h-5 rounded" />,
      badge: "free",
    }
  ],
}

export function Chat() {
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<
    (typeof MODEL_DATA.models)[0]
  >(MODEL_DATA.models[0])
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false)

  const { messages, plan, sendMessage, isPlanning, isExecuting } = useChat()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  
  const isLoading = isPlanning || isExecuting

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    setInput("")
    await sendMessage(text)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div>
      <div className="h-[calc(100vh-166px)]">
        {messages.length === 0 ? (
          <div className="no-chat h-full flex items-center justify-center text-6xl text-muted-foreground select-none">
            traycer
          </div>
        ) : (
          <Conversation className="h-full">
            <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b"></div>
            <ConversationContent>
              {messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent className="p-[2px] rounded-tr-xs pl-2 pr-2" variant={m.role === 'user' ? 'contained' : 'flat'}>
                    <Response>{m.text}</Response>
                  </MessageContent>
                  {/* <MessageAvatar src={m.role === 'assistant' ? (selectedModel.name === 'groq' ? groq_logo : gemini_logo) : ''} /> */}
                </Message>
              ))}
              {plan.length > 0 && (
                <div className="mt-2">
                  <PlanLive tasks={plan} />
                </div>
              )}
            </ConversationContent>
          </Conversation>
        )}
      </div>
      <form className="rounded-md" onSubmit={handleSubmit}>
        <Field>
          <FieldLabel htmlFor="notion-prompt" className="sr-only">
            Prompt
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="notion-prompt"
              placeholder="Plan, search, build anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              ref={inputRef}
            />
            <InputGroupAddon align="block-end" className="gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    size="icon-sm"
                    className="rounded-full"
                    aria-label="Attach file"
                  >
                    <Paperclip />
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>Attach file</TooltipContent>
              </Tooltip>
              <DropdownMenu
                open={modelPopoverOpen}
                onOpenChange={setModelPopoverOpen}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <InputGroupButton size="sm" className="rounded-full">
                        {selectedModel.icon && selectedModel.name !== "Auto" && (
                          <selectedModel.icon />
                        )}
                        {selectedModel.name}
                      </InputGroupButton>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Select AI model</TooltipContent>
                </Tooltip>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="[--radius:1.2rem]"
                >
                  <DropdownMenuGroup className="w-62">
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                      Select a model from our list
                    </DropdownMenuLabel>
                    {MODEL_DATA.models.map((model) => (
                      <DropdownMenuCheckboxItem
                        key={model.name}
                        checked={model.name === selectedModel.name}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedModel(model)
                          }
                        }}
                        className="pl-2 *:[span:first-child]:right-2 *:[span:first-child]:left-auto"
                      >
                        {model.icon && <model.icon />}
                        {model.name}
                        {model.badge && (
                          <Badge
                            variant="secondary"
                            className="h-5 rounded-sm bg-blue-100 px-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                          >
                            {model.badge}
                          </Badge>
                        )}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu open={scopeMenuOpen} onOpenChange={setScopeMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <InputGroupButton size="sm" className="rounded-full">
                    <Settings2 /> Tools
                  </InputGroupButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  className="[--radius:1.2rem]"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      asChild
                      onSelect={(e) => e.preventDefault()}
                    >
                      <label htmlFor="web-search">
                        <Globe /> Web Search{" "}
                        <Switch
                          id="web-search"
                          className="ml-auto"
                          defaultChecked
                        />
                      </label>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Brain />
                        Knowledge Base
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-72 p-0 -mt-20 ml-2 [--radius:1.2rem]">
                        <Command>
                          <CommandInput
                            placeholder="Find or use knowledge in..."
                            autoFocus
                          />
                          <Empty className="md:p-4">
                            <EmptyHeader>
                              <EmptyMedia variant="icon">
                                <CloudUpload />
                              </EmptyMedia>
                              <EmptyTitle>No Knowledge Base</EmptyTitle>
                              <EmptyDescription>
                                Upload files to index them and use them
                              </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                              <Button variant="outline" size="sm">
                                Upload Files
                              </Button>
                            </EmptyContent>
                          </Empty>
                        </Command>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Book />
                        Add Instructions
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-72 p-2 -mt-16 ml-2 [--radius:1.2rem]">
                        <span className="ml-2">Add your instrctions</span>
                        <div className="mt-2">
                          <Textarea />
                        </div>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Plus /> Connect Apps
                    </DropdownMenuItem>
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                      We&apos;ll only search in the sources selected here.
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <InputGroupButton
                aria-label="Send"
                className="ml-auto rounded-sm"
                variant="default"
                size="icon-sm"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? <Loader size={16} /> : <ArrowUp />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </form>
    </div>
  )
}
