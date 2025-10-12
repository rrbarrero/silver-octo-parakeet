"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";

import { ApplicationStatus } from "@/domain/applications";
import {
  CreateApplicationInput,
  createApplicationInputSchema,
} from "@/lib/validation/applicationSchemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreateApplicationCardProps {
  statuses: ApplicationStatus[];
  onSubmit: (values: CreateApplicationInput) => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

export function CreateApplicationCard({
  statuses,
  onSubmit,
  isSubmitting,
  error,
}: CreateApplicationCardProps) {
  const form = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationInputSchema),
    defaultValues: {
      companyName: "",
      roleTitle: "",
      roleDescription: "",
      appliedAt: new Date().toISOString().slice(0, 10),
      status: statuses[0],
      initialComment: "",
      url: "",
    },
  });

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-white/30 bg-gradient-to-br from-white/80 via-white/65 to-slate-100/60 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-800/70">
      <div className="pointer-events-none absolute -top-10 right-4 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/30 via-sky-400/20 to-transparent blur-3xl" />
      <CardHeader className="space-y-4 pb-0">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-200">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <CardTitle className="text-xl">Register a new opportunity</CardTitle>
            <CardDescription className="text-sm">
              Outline the essentials and we will orchestrate the rest of the workflow.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await onSubmit(values);
              form.reset({
                companyName: "",
                roleTitle: "",
                roleDescription: "",
                appliedAt: new Date().toISOString().slice(0, 10),
                status: statuses[0],
                initialComment: "",
                url: "",
              });
            })}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Corp"
                      className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Frontend Engineer"
                      className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roleDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summarize the responsibilities or the job appeal."
                      rows={3}
                      className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="appliedAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Applied on</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {formatStatus(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job posting URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://company.com/careers/role"
                      className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialComment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial comment</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Document anything noteworthy about the application."
                      rows={2}
                      className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error ? (
              <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg shadow-slate-900/20 hover:from-slate-800 hover:to-slate-900 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 dark:text-slate-900"
            >
              {isSubmitting ? "Creating..." : "Create application"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function formatStatus(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    cv_sent: "CV sent",
    phone_screen_scheduled: "Phone screen scheduled",
    technical_interview: "Technical interview",
    offer_received: "Offer received",
    rejected: "Rejected",
    withdrawn: "Withdrawn",
  };

  return labels[status] ?? status;
}
