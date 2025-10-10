"use client"

import { useMemo, useState } from "react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ArrowUp, Book, Brain, CloudUpload, Folder, Globe, Paperclip, Plus, Settings2, X } from "lucide-react"
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

const SAMPLE_DATA = {
  mentionable: [
    {
      type: "page",
      title: "Meeting Notes",
      image: "📝",
    },
    {
      type: "page",
      title: "Project Dashboard",
      image: "📊",
    },
    {
      type: "page",
      title: "Ideas & Brainstorming",
      image: "💡",
    },
    {
      type: "page",
      title: "Calendar & Events",
      image: "📅",
    },
    {
      type: "page",
      title: "Documentation",
      image: "📚",
    },
    {
      type: "page",
      title: "Goals & Objectives",
      image: "🎯",
    },
    {
      type: "page",
      title: "Budget Planning",
      image: "💰",
    },
    {
      type: "page",
      title: "Team Directory",
      image: "👥",
    },
    {
      type: "page",
      title: "Technical Specs",
      image: "🔧",
    },
    {
      type: "page",
      title: "Analytics Report",
      image: "📈",
    },
    {
      type: "user",
      title: "shadcn",
      image: "https://github.com/shadcn.png",
      workspace: "Workspace",
    },
    {
      type: "user",
      title: "maxleiter",
      image: "https://github.com/maxleiter.png",
      workspace: "Cursor",
    },
    {
      type: "user",
      title: "evilrabbit",
      image: "https://github.com/evilrabbit.png",
      workspace: "Vercel",
    },
  ],
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

function MentionableIcon({
  item,
}: {
  item: (typeof SAMPLE_DATA.mentionable)[0]
}) {
  return item.type === "page" ? (
    <span className="flex size-4 items-center justify-center">
      {item.image}
    </span>
  ) : (
    <Avatar className="size-4">
      <AvatarImage src={item.image} />
      <AvatarFallback>{item.title[0]}</AvatarFallback>
    </Avatar>
  )
}

export function Chat() {
  const [mentions, setMentions] = useState<string[]>([])
  const [mentionPopoverOpen, setMentionPopoverOpen] = useState(false)
  const [modelPopoverOpen, setModelPopoverOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<
    (typeof SAMPLE_DATA.models)[0]
  >(SAMPLE_DATA.models[0])
  const [scopeMenuOpen, setScopeMenuOpen] = useState(false)

  const grouped = useMemo(() => {
    return SAMPLE_DATA.mentionable.reduce(
      (acc, item) => {
        const isAvailable = !mentions.includes(item.title)

        if (isAvailable) {
          if (!acc[item.type]) {
            acc[item.type] = []
          }
          acc[item.type].push(item)
        }
        return acc
      },
      {} as Record<string, typeof SAMPLE_DATA.mentionable>
    )
  }, [mentions])

  const hasMentions = mentions.length > 0

  return (
    <div>
      <div className="h-[calc(100vh-217px)]">
        <div className="no-chat h-full flex items-center justify-center text-6xl text-muted-foreground select-none">
          traycer
        </div>
      </div>
      <form className="rounded-md">
        <Field>
          <FieldLabel htmlFor="notion-prompt" className="sr-only">
            Prompt
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              id="notion-prompt"
              placeholder="Plan, search, build anything..."
            />
            <InputGroupAddon align="block-start">
              <Popover
                open={mentionPopoverOpen}
                onOpenChange={setMentionPopoverOpen}
              >
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    onFocusCapture={(e) => e.stopPropagation()}
                  >
                    <PopoverTrigger asChild>
                      <InputGroupButton
                        variant="outline"
                        size={!hasMentions ? "sm" : "icon-sm"}
                        className="rounded-full transition-transform"
                      >
                        <Folder /> {!hasMentions && "Add context"}
                      </InputGroupButton>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Mention any file from project</TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 [--radius:1.2rem]" align="start">
                  <Command>
                    <CommandInput placeholder="Search pages..." />
                    <CommandList>
                      <CommandEmpty>No pages found</CommandEmpty>
                      {Object.entries(grouped).map(([type, items]) => (
                        <CommandGroup
                          key={type}
                          heading={type === "page" ? "Pages" : "Users"}
                        >
                          {items.map((item) => (
                            <CommandItem
                              key={item.title}
                              value={item.title}
                              onSelect={(currentValue) => {
                                setMentions((prev) => [...prev, currentValue])
                                setMentionPopoverOpen(false)
                              }}
                            >
                              <MentionableIcon item={item} />
                              {item.title}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="no-scrollbar -m-1.5 flex gap-1 overflow-y-auto p-1.5">
                {mentions.map((mention) => {
                  const item = SAMPLE_DATA.mentionable.find(
                    (item) => item.title === mention
                  )

                  if (!item) {
                    return null
                  }

                  return (
                    <InputGroupButton
                      key={mention}
                      size="sm"
                      variant="secondary"
                      className="rounded-full !pl-2"
                      onClick={() => {
                        setMentions((prev) => prev.filter((m) => m !== mention))
                      }}
                    >
                      <MentionableIcon item={item} />
                      {item.title}
                      <X />
                    </InputGroupButton>
                  )
                })}
              </div>
            </InputGroupAddon>
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
                    {SAMPLE_DATA.models.map((model) => (
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
              >
                <ArrowUp />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </form>
    </div>
  )
}