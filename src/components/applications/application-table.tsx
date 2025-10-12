"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { ApplicationStatus } from "@/domain/applications";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ApplicationDTO } from "@/lib/validation/applicationSchemas";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  cv_sent: "CV sent",
  phone_screen_scheduled: "Phone screen scheduled",
  technical_interview: "Technical interview",
  offer_received: "Offer received",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  cv_sent:
    "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:border-sky-400/40 dark:bg-sky-400/15 dark:text-sky-100",
  phone_screen_scheduled:
    "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:border-amber-400/40 dark:bg-amber-400/15 dark:text-amber-100",
  technical_interview:
    "border-violet-500/40 bg-violet-500/10 text-violet-700 dark:border-violet-400/40 dark:bg-violet-400/15 dark:text-violet-100",
  offer_received:
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-400/15 dark:text-emerald-100",
  rejected:
    "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:border-rose-400/40 dark:bg-rose-400/15 dark:text-rose-100",
  withdrawn:
    "border-slate-500/40 bg-slate-500/10 text-slate-700 dark:border-slate-400/40 dark:bg-slate-400/15 dark:text-slate-100",
};

const columns: ColumnDef<ApplicationDTO>[] = [
  {
    accessorKey: "companyName",
    header: "Company",
    cell: ({ row }) => (
      <div className="font-semibold text-foreground">{row.original.companyName}</div>
    ),
  },
  {
    accessorKey: "roleTitle",
    header: "Role",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.original.roleTitle}</div>
    ),
  },
  {
    accessorKey: "appliedAt",
    header: "Applied on",
    cell: ({ row }) =>
      new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(row.original.appliedAt),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "border px-3 py-1 font-medium capitalize",
          STATUS_BADGE_CLASS[row.original.status],
        )}
      >
        {STATUS_LABELS[row.original.status] ?? row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "url",
    header: "Posting",
    cell: ({ row }) =>
      row.original.url ? (
        <a
          href={row.original.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-500"
          onClick={(event) => event.stopPropagation()}
        >
          View ↗
        </a>
      ) : (
        <span className="text-xs text-slate-400 dark:text-slate-600">—</span>
      ),
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-200">
        {row.original.comments.length} note{row.original.comments.length === 1 ? "" : "s"}
      </span>
    ),
  },
];

interface ApplicationTableProps {
  data: ApplicationDTO[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export function ApplicationTable({
  data,
  selectedId,
  onSelect,
  isLoading,
}: ApplicationTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        Loading applications...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        No applications yet. Create your first entry using the form on the left.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/30 bg-white/60 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/40">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="bg-white/60 text-xs uppercase tracking-[0.28em] text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.original.id === selectedId ? "selected" : undefined}
              className={cn(
                "cursor-pointer transition-all hover:bg-slate-900/5 dark:hover:bg-slate-100/5",
                row.original.id === selectedId
                  ? "bg-slate-900/10 shadow-inner dark:bg-slate-100/10"
                  : "",
              )}
              onClick={() => onSelect(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="align-middle text-sm text-slate-700 dark:text-slate-200">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
