"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, addDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const FormSchema = z.object({
  lastPeriodDate: z.date({
    required_error: "First day of your last period is required.",
  }),
  cycleLength: z.coerce.number().int().min(20).max(45, "Cycle length must be between 20 and 45 days."),
})

interface OvulationResult {
  fertileWindowStart: Date;
  fertileWindowEnd: Date;
  estimatedOvulation: Date;
  nextPeriod: Date;
}

export function OvulationCalculator() {
  const [result, setResult] = useState<OvulationResult | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        cycleLength: 28,
    }
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const estimatedOvulation = addDays(data.lastPeriodDate, data.cycleLength - 14);
    const fertileWindowStart = addDays(estimatedOvulation, -5);
    const fertileWindowEnd = addDays(estimatedOvulation, 1);
    const nextPeriod = addDays(data.lastPeriodDate, data.cycleLength);
    
    setResult({
        fertileWindowStart,
        fertileWindowEnd,
        estimatedOvulation,
        nextPeriod,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ovulation Calculator</CardTitle>
        <CardDescription>Estimate your fertile window to predict ovulation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="lastPeriodDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>First Day of Last Period</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cycleLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Average Cycle Length (days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Calculate</Button>
          </form>
        </Form>
        
        {result && (
            <div className="mt-8 space-y-4">
                <Card className="bg-primary/5 border-primary">
                    <CardHeader>
                        <CardTitle className="text-primary">Estimated Fertile Window</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl font-semibold">
                            {format(result.fertileWindowStart, "MMMM d, yyyy")} - {format(result.fertileWindowEnd, "MMMM d, yyyy")}
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Estimated Ovulation Date</CardDescription>
                        <CardTitle className="text-lg">{format(result.estimatedOvulation, "PPP")}</CardTitle>
                    </CardHeader>
                     <CardHeader className="pt-2">
                        <CardDescription>Estimated Next Period</CardDescription>
                        <CardTitle className="text-lg">{format(result.nextPeriod, "PPP")}</CardTitle>
                    </CardHeader>
                </Card>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
