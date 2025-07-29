"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import * as LucideIcons from "lucide-react"

type Tool = {
  name: string
  description: string
  href: string
  icon: keyof typeof LucideIcons
}

interface ToolGridProps {
  tools: Tool[]
}

export const ToolGrid = React.memo(function ToolGrid({ tools }: ToolGridProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTools = useMemo(() => {
    return tools.filter(
      (tool) =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [tools, searchTerm])

  return (
    <div id="tools" className="space-y-8">
      <div className="relative">
        <LucideIcons.Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for a tool... (e.g. BMI, AI Diagnosis)"
          className="w-full rounded-full pl-12 py-6 text-lg bg-background/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTools.map((tool) => {
          const Icon = LucideIcons[tool.icon] || LucideIcons.FlaskConical
          return (
            <Link href={tool.href} key={tool.name} className="group">
              <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 bg-background/50 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-headline">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
})
