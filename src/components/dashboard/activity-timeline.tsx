import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle, Bookmark, FileText, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: "PROGRESS" | "NOTE" | "BOOKMARK";
  status?: string;
  problemTitle: string;
  problemSlug: string;
  date: Date;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
        <Clock className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="text-lg font-bold">No activity yet</h3>
        <p className="text-muted-foreground text-sm">Start practicing to build your timeline.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
      {activities.map((activity) => (
        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
          {/* Dot */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-[#0A0A0A] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-transform group-hover:scale-110 z-10">
            {activity.type === "PROGRESS" && activity.status === "Solved" && (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            )}
            {activity.type === "PROGRESS" && activity.status === "Attempted" && (
              <PlayCircle className="h-5 w-5 text-yellow-500" />
            )}
            {activity.type === "PROGRESS" && activity.status === "Todo" && (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            {activity.type === "NOTE" && (
              <FileText className="h-5 w-5 text-blue-400" />
            )}
            {activity.type === "BOOKMARK" && (
              <Bookmark className="h-5 w-5 text-purple-400 fill-purple-400/20" />
            )}
          </div>

          {/* Content */}
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-card/40 backdrop-blur-sm shadow-xl transition-all group-hover:border-primary/30 group-hover:bg-card/60">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-foreground text-sm md:text-base">
                {activity.type === "PROGRESS" && activity.status === "Solved" && "Solved"}
                {activity.type === "PROGRESS" && activity.status === "Attempted" && "Attempted"}
                {activity.type === "NOTE" && "Added a note to"}
                {activity.type === "BOOKMARK" && "Bookmarked"}
              </div>
              <time className="font-mono text-[10px] text-muted-foreground uppercase">
                {formatDate(activity.date)}
              </time>
            </div>
            <Link 
              href={`/problems/${activity.problemSlug}`}
              className="text-primary font-medium hover:underline transition-colors block truncate"
            >
              {activity.problemTitle}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
