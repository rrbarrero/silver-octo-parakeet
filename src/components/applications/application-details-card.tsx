"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ApplicationStatus } from "@/domain/applications";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AddApplicationCommentInput,
  ApplicationDTO,
  UpdateApplicationStatusInput,
  addApplicationCommentSchema,
  updateApplicationStatusSchema,
} from "@/lib/validation/applicationSchemas";
import { cn } from "@/lib/utils";

interface ApplicationDetailsCardProps {
  application: ApplicationDTO | null;
  statuses: ApplicationStatus[];
  onUpdateStatus: (id: string, values: UpdateApplicationStatusInput) => void;
  onAddComment: (id: string, values: AddApplicationCommentInput) => void;
  isUpdatingStatus: boolean;
  isAddingComment: boolean;
  updateError?: string | null;
  commentError?: string | null;
}

export function ApplicationDetailsCard({
  application,
  statuses,
  onUpdateStatus,
  onAddComment,
  isUpdatingStatus,
  isAddingComment,
  updateError,
  commentError,
}: ApplicationDetailsCardProps) {
  const statusForm = useForm<UpdateApplicationStatusInput>({
    resolver: zodResolver(updateApplicationStatusSchema),
    defaultValues: {
      status: application?.status ?? statuses[0],
    },
  });

  const commentForm = useForm<AddApplicationCommentInput>({
    resolver: zodResolver(addApplicationCommentSchema),
    defaultValues: {
      comment: "",
    },
  });

  useEffect(() => {
    if (application) {
      statusForm.reset({ status: application.status });
      commentForm.reset({ comment: "" });
    }
  }, [application, statusForm, commentForm]);

  if (!application) {
    return (
      <Card className="h-full min-h-[320px] overflow-hidden rounded-3xl border border-dashed border-white/30 bg-gradient-to-br from-white/40 via-white/20 to-transparent shadow-inner backdrop-blur dark:border-slate-700/60 dark:from-slate-900/40 dark:via-slate-900/30">
        <CardContent className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
          <Badge variant="outline" className="border-slate-300/60 bg-white/70 text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            Focus mode
          </Badge>
          <p className="max-w-sm text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Choose an application from the list to reveal its status timeline, keep interview notes, and orchestrate the next steps effortlessly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-3xl border border-white/40 bg-gradient-to-br from-white/70 via-white/55 to-slate-100/50 shadow-xl backdrop-blur-md dark:border-slate-800/50 dark:from-slate-900/70 dark:via-slate-900/60 dark:to-slate-900/40">
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/20 via-violet-400/20 to-transparent blur-3xl" />
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className={cn(
                "border px-3 py-1 font-medium uppercase tracking-[0.2em]",
                statusBadgeClass(application.status),
              )}
            >
              {formatStatus(application.status)}
            </Badge>
            <CardTitle className="text-3xl text-slate-900 dark:text-slate-100">
              {application.companyName}
            </CardTitle>
            <CardDescription className="text-base font-medium text-slate-700 dark:text-slate-200">
              {application.roleTitle}
            </CardDescription>
            {application.url ? (
              <Button
                asChild
                variant="ghost"
                className="mt-2 h-auto w-fit rounded-full border border-white/50 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-600 transition hover:bg-white/80 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
              >
                <a href={application.url} target="_blank" rel="noopener noreferrer">
                  View posting ↗
                </a>
              </Button>
            ) : null}
          </div>
          <div className="rounded-2xl border border-white/40 bg-white/60 px-4 py-3 text-right text-xs uppercase tracking-[0.28em] text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
            Applied on
            <div className="mt-1 text-base normal-case tracking-normal text-slate-700 dark:text-slate-100">
              {new Intl.DateTimeFormat("en", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }).format(application.appliedAt)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {application.roleDescription ? (
          <section className="space-y-3 rounded-2xl border border-white/40 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
            <h3 className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
              Role summary
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {application.roleDescription}
            </p>
          </section>
        ) : null}

        <section className="space-y-5 rounded-2xl border border-white/30 bg-white/60 p-5 shadow-sm backdrop-blur dark:border-slate-800/50 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
                Current status
              </h3>
              <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
                {formatStatus(application.status)}
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "border px-3 py-1 text-xs",
                statusBadgeClass(application.status),
              )}
            >
              {application.comments.length} notes
            </Badge>
          </div>

          <Form {...statusForm}>
            <form
              className="space-y-3"
              onSubmit={statusForm.handleSubmit((values) =>
                onUpdateStatus(application.id, values),
              )}
            >
              <FormField
                control={statusForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-slate-600 dark:text-slate-300">
                      Update status
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className="border-white/40 bg-white/70 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
                          <SelectValue placeholder="Select new status" />
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

              {updateError ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {updateError}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="secondary"
                disabled={isUpdatingStatus}
                className="w-full rounded-2xl border border-slate-900/10 bg-slate-900/90 text-white shadow-md shadow-slate-900/20 hover:bg-slate-900 dark:border-slate-200/20 dark:bg-slate-100 dark:text-slate-900"
              >
                {isUpdatingStatus ? "Updating..." : "Save status"}
              </Button>
            </form>
          </Form>
        </section>

        <section className="space-y-4">
          <header className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Comments ({application.comments.length})
            </h3>
          </header>

          <ul className="space-y-4">
            {application.comments.length === 0 ? (
              <li className="rounded-2xl border border-dashed border-white/30 bg-white/40 px-4 py-6 text-center text-sm text-slate-500 backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                No comments yet. Share updates or reminders to stay on track.
              </li>
            ) : (
              application.comments.map((comment, index) => (
                <li key={comment.id} className="relative pl-6">
                  {index !== application.comments.length - 1 ? (
                    <span className="absolute left-[11px] top-6 block h-full w-px bg-gradient-to-b from-slate-400/40 to-transparent dark:from-slate-600/60" />
                  ) : null}
                  <div className="relative rounded-2xl border border-white/30 bg-white/70 px-4 py-4 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
                    <span className="absolute -left-[11px] top-4 block h-5 w-5 rounded-full border border-white/60 bg-white dark:border-slate-600 dark:bg-slate-900" />
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">
                      {new Intl.DateTimeFormat("en", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(comment.createdAt)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                      {comment.message}
                    </p>
                  </div>
                </li>
              ))
            )}
          </ul>

          <Form {...commentForm}>
            <form
              className="space-y-3"
              onSubmit={commentForm.handleSubmit((values) =>
                onAddComment(application.id, values),
              )}
            >
              <FormField
                control={commentForm.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add comment</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        placeholder="Document what happened next in the process."
                        className="border-white/40 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {commentError ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {commentError}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isAddingComment}
                className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:from-indigo-400 hover:to-purple-500"
              >
                {isAddingComment ? "Saving..." : "Add comment"}
              </Button>
            </form>
          </Form>
        </section>
      </CardContent>
    </Card>
  );
}

function statusBadgeClass(status: ApplicationStatus) {
  return {
    cv_sent:
      "border-sky-400/60 bg-sky-400/10 text-sky-700 dark:border-sky-400/60 dark:bg-sky-400/15 dark:text-sky-100",
    phone_screen_scheduled:
      "border-amber-400/60 bg-amber-400/10 text-amber-700 dark:border-amber-400/60 dark:bg-amber-400/15 dark:text-amber-100",
    technical_interview:
      "border-violet-400/60 bg-violet-400/10 text-violet-700 dark:border-violet-400/60 dark:bg-violet-400/15 dark:text-violet-100",
    offer_received:
      "border-emerald-400/60 bg-emerald-400/10 text-emerald-700 dark:border-emerald-400/60 dark:bg-emerald-400/15 dark:text-emerald-100",
    rejected:
      "border-rose-400/60 bg-rose-400/10 text-rose-700 dark:border-rose-400/60 dark:bg-rose-400/15 dark:text-rose-100",
    withdrawn:
      "border-slate-400/60 bg-slate-400/10 text-slate-700 dark:border-slate-400/60 dark:bg-slate-400/15 dark:text-slate-100",
  }[status];
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
