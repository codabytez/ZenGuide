'use client';

import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import {
  Eye, CheckCircle2, Users, Clock, Target, Loader2
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts";

// ----------------------------------------
// Types
// ----------------------------------------
interface OverviewData {
  totalViews: number;
  totalCompletions: number;
  totalSkips: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
}

const AnalyticsPage = () => {
  const [selectedTourId, setSelectedTourId] = React.useState<Id<"tours"> | null>(null);
  const [timeRange, setTimeRange] = React.useState<"24h" | "7d" | "30d">("7d");

  // Fetch user
  const user = useQuery(api.users.getCurrentUser);

  // Don't load tours until user is known
  const tours = useQuery(
    api.tours.listTours,
    user ? {} : "skip"
  );

  // Load analytics only when a tour is selected
  const analytics = useQuery(
    api.analytics.getTourAnalytics,
    selectedTourId ? { tourId: selectedTourId, timeRange } : "skip"
  );

  // Defaults to prevent undefined errors
  const overview: OverviewData = analytics?.overview ?? {
    totalViews: 0,
    totalCompletions: 0,
    totalSkips: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0
  };

  const stepMetrics = analytics?.stepMetrics ?? [];
  const dailyBreakdown = analytics?.dailyBreakdown ?? [];

  // Auto-select first tour
  React.useEffect(() => {
    if (tours && tours.length > 0 && !selectedTourId) {
      setSelectedTourId(tours[0]._id);
    }
  }, [tours, selectedTourId]);

  // ----------------------------------------
  // Loading states
  // ----------------------------------------

  if (user === undefined || tours === undefined) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-muted-foreground">You must be logged in to view analytics.</p>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="p-6 text-center">
        <Target className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-medium">No Tours Found</h2>
        <p className="text-muted-foreground">Create a tour to start collecting analytics.</p>
      </div>
    );
  }

  // ----------------------------------------
  // Stats Display
  // ----------------------------------------

  const stats = [
    { label: "Total Views", value: overview.totalViews, icon: Eye },
    { label: "Completions", value: overview.totalCompletions, icon: CheckCircle2 },
    { label: "Unique Visitors", value: overview.uniqueVisitors, icon: Users },
    { label: "Avg. Duration", value: `${Math.round(overview.avgSessionDuration / 1000)}s`, icon: Clock }
  ];

  const pieData = [
    { name: "Completed", value: overview.totalCompletions, color: "hsl(var(--primary))" },
    { name: "Skipped", value: overview.totalSkips, color: "hsl(var(--destructive))" },
    {
      name: "In Progress",
      value: overview.totalViews - overview.totalCompletions - overview.totalSkips,
      color: "hsl(var(--accent))"
    }
  ].filter(d => d.value > 0);

  // ----------------------------------------

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Track performance across your tours</p>
          </div>

          <div className="flex gap-3">
            {/* Tour Selector */}
            <Select
              value={selectedTourId ?? ""}
              onValueChange={(v) => setSelectedTourId(v as Id<"tours">)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select tour" />
              </SelectTrigger>
              <SelectContent>
                {tours.map((tour) => (
                  <SelectItem key={tour._id} value={tour._id}>
                    {tour.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Range Selector */}
            <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="completions" stroke="#82ca9d" fill="#82ca9d" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90}>
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Step Performance */}
        {stepMetrics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stepMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="hsl(var(--primary))" />
                    <Bar dataKey="completions" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
