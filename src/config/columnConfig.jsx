import { Clock, Zap, CheckCircle } from "lucide-react";

export const columnConfig = {
  todo: {
    title: "To Do",
    icon: Clock,
    accent: "bg-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    gradient: "from-blue-50 to-indigo-50",
    iconColor: "text-blue-600",
  },
  inprogress: {
    title: "In Progress",
    icon: Zap,
    accent: "bg-indigo-600",
    textColor: "text-blue-600",
    borderColor: "border-indigo-200",
    gradient: "from-indigo-50 to-blue-50",
    iconColor: "text-indigo-600",
  },
  done: {
    title: "Completed",
    icon: CheckCircle,
    accent: "bg-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    gradient: "from-blue-50 to-indigo-100",
    iconColor: "text-blue-600",
  },
};
