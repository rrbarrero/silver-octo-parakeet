"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApplicationStatus } from "@/domain/applications";
import {
  AddApplicationCommentInput,
  ApplicationDTO,
  ApplicationStatusEnum,
  CreateApplicationInput,
  UpdateApplicationStatusInput,
} from "@/lib/validation/applicationSchemas";
import {
  addApplicationComment,
  createApplication,
  fetchApplications,
  updateApplicationStatus,
} from "@/lib/api/applications";
import { ApplicationDetailsCard } from "./application-details-card";
import { ApplicationTable } from "./application-table";
import { CreateApplicationCard } from "./create-application-card";

const STATUS_OPTIONS: ApplicationStatus[] = ApplicationStatusEnum.options;

export function ApplicationsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);
  const [commentSuccess, setCommentSuccess] = useState<string | null>(null);

  const applicationsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: fetchApplications,
  });

  const createMutation = useMutation({
    mutationFn: (input: CreateApplicationInput) => createApplication(input),
    onMutate: () => {
      setCreateSuccess(null);
    },
    onSuccess: (created) => {
      queryClient.setQueryData<ApplicationDTO[] | undefined>(
        ["applications"],
        (previous) => {
          if (!previous) {
            return [created];
          }

          const next = [created, ...previous.filter((app) => app.id !== created.id)];
          return next.sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());
        },
      );
      setSelectedId(created.id);
      setCreateSuccess("Application saved successfully.");
    },
    onError: () => {
      setCreateSuccess(null);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdateApplicationStatusInput;
    }) => updateApplicationStatus(id, values),
    onMutate: () => {
      setStatusSuccess(null);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ApplicationDTO[] | undefined>(
        ["applications"],
        (previous) => {
          if (!previous) {
            return [updated];
          }

          return previous.map((app) => (app.id === updated.id ? updated : app));
        },
      );
      setStatusSuccess("Status updated.");
    },
    onError: () => {
      setStatusSuccess(null);
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: AddApplicationCommentInput;
    }) => addApplicationComment(id, values),
    onMutate: () => {
      setCommentSuccess(null);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<ApplicationDTO[] | undefined>(
        ["applications"],
        (previous) => {
          if (!previous) {
            return [updated];
          }

          return previous.map((app) => (app.id === updated.id ? updated : app));
        },
      );
      setCommentSuccess("Comment added.");
    },
    onError: () => {
      setCommentSuccess(null);
    },
  });

  const applications = useMemo(
    () => applicationsQuery.data ?? [],
    [applicationsQuery.data],
  );

  const statusSummary = useMemo(() => summarizeStatuses(applications), [applications]);
  const selectedApplication = useMemo(
    () => applications.find((application) => application.id === selectedId) ?? null,
    [applications, selectedId],
  );

  useEffect(() => {
    if (applications.length > 0 && !selectedId) {
      setSelectedId(applications[0].id);
    }
  }, [applications, selectedId]);

  useEffect(() => {
    setStatusSuccess(null);
    setCommentSuccess(null);
  }, [selectedApplication?.id]);

  return (
    <div className="relative isolate">
      <SignedOut>
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-slate-100">
            Sign in to access your job application workspace
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Authenticate to create new opportunities, track interview progress, and keep notes synchronized securely.
          </p>
          <SignInButton mode="modal">
            <button className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
              Sign in
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 via-white/0 to-transparent dark:from-slate-950/40" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 lg:px-6">
          <header className="space-y-6 rounded-3xl border border-white/10 bg-white/70 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:border-emerald-400/40 dark:text-emerald-200">
                  Career compass
                </span>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 lg:text-5xl">
                  A refined workspace for your job hunt
                </h1>
                <p className="max-w-2xl text-base text-slate-600 dark:text-slate-300">
                  Capture every lead, monitor interview progress, and keep rich notes in a single, elegant command center designed for clarity and focus.
                </p>
              </div>
              <div className="grid gap-1 text-right text-sm text-muted-foreground">
                <span>Live sync</span>
                <span>Domain-driven core · CQRS orchestration</span>
              </div>
            </div>
            <StatusOverview summary={statusSummary} />
          </header>

          <div className="grid gap-6 xl:grid-cols-[400px_1fr] xl:items-start">
            <CreateApplicationCard
              statuses={STATUS_OPTIONS}
              onSubmit={async (values) => {
                await createMutation.mutateAsync(values);
              }}
              isSubmitting={createMutation.isPending}
              error={createMutation.error?.message}
              successMessage={createSuccess}
            />

            <div className="space-y-6">
              <ApplicationTable
                data={applications}
                selectedId={selectedId}
                onSelect={setSelectedId}
                isLoading={applicationsQuery.isLoading || applicationsQuery.isFetching}
              />

              <ApplicationDetailsCard
                application={selectedApplication}
                statuses={STATUS_OPTIONS}
                onUpdateStatus={(id, values) =>
                  updateStatusMutation.mutate({ id, values })
                }
                onAddComment={(id, values) =>
                  addCommentMutation.mutate({ id, values })
                }
                isUpdatingStatus={updateStatusMutation.isPending}
                isAddingComment={addCommentMutation.isPending}
                updateError={updateStatusMutation.error?.message}
                commentError={addCommentMutation.error?.message}
                updateSuccessMessage={statusSuccess}
                commentSuccessMessage={commentSuccess}
              />
            </div>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

interface StatusSummary {
  total: number;
  progressing: number;
  interviews: number;
  thisMonth: number;
}

function summarizeStatuses(applications: ApplicationDTO[]): StatusSummary {
  const total = applications.length;
  const progressing = applications.filter(
    (application) => !["rejected", "withdrawn"].includes(application.status),
  ).length;
  const interviews = applications.filter((application) =>
    ["phone_screen_scheduled", "technical_interview", "offer_received"].includes(
      application.status,
    ),
  ).length;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonth = applications.filter(
    (application) => application.appliedAt >= startOfMonth,
  ).length;

  return { total, progressing, interviews, thisMonth };
}

function StatusOverview({ summary }: { summary: StatusSummary }) {
  const items = [
    {
      label: "Total tracked",
      value: summary.total,
      accent: "from-sky-500/20 to-sky-500/5",
      helper: "All recorded applications",
    },
    {
      label: "In motion",
      value: summary.progressing,
      accent: "from-emerald-500/20 to-emerald-500/5",
      helper: "Active opportunities",
    },
    {
      label: "Interviews",
      value: summary.interviews,
      accent: "from-violet-500/20 to-violet-500/5",
      helper: "Upcoming or ongoing stages",
    },
    {
      label: "This month",
      value: summary.thisMonth,
      accent: "from-amber-500/25 to-amber-500/5",
      helper: "Applications created since day 1",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`relative overflow-hidden rounded-2xl border border-white/40 bg-gradient-to-br ${item.accent} p-4 shadow-sm backdrop-blur-md dark:border-white/10`}
        >
          <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-300">
            {item.label}
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {item.value}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {item.helper}
          </p>
        </div>
      ))}
    </div>
  );
}
