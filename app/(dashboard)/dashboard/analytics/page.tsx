'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  Area, AreaChart
} from 'recharts';
import {
  Eye, CheckCircle2,
  Loader2, Users, Clock, Target
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EnhancedAnalytics: React.FC = () => {
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  // Fetch all tours for overview
  const tours = useQuery(api.tours.getUserTours);

  // Fetch detailed analytics for selected tour
  const tourAnalytics = useQuery(
    api.analytics.getTourAnalytics,
    selectedTourId ? {
      tourId: selectedTourId as Id<"tours">,
      timeRange
    } : "skip"
  );

  // Fetch funnel analysis
  const funnelAnalysis = useQuery(
    api.analytics.getFunnelAnalysis,
    selectedTourId ? { tourId: selectedTourId as Id<"tours"> } : "skip"
  );

  // Auto-select first tour
  React.useEffect(() => {
    if (tours && tours.length > 0 && !selectedTourId) {
      setSelectedTourId(tours[0].id);
    }
  }, [tours, selectedTourId]);

  if (tours === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="p-6 lg:p-8">
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Tours Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create a tour to start tracking analytics
          </p>
        </div>
      </div>
    );
  }

  const overview = tourAnalytics?.overview;
  const stepMetrics = tourAnalytics?.stepMetrics || [];
  const dailyBreakdown = tourAnalytics?.dailyBreakdown || [];

  const stats = [
    {
      label: 'Total Views',
      value: overview?.totalViews?.toLocaleString() || '0',
      icon: Eye,
      color: 'text-blue-500'
    },
    {
      label: 'Completions',
      value: overview?.totalCompletions?.toLocaleString() || '0',
      icon: CheckCircle2,
      color: 'text-green-500'
    },
    {
      label: 'Unique Visitors',
      value: overview?.uniqueVisitors?.toLocaleString() || '0',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      label: 'Avg. Duration',
      value: overview?.avgSessionDuration
        ? `${Math.round(overview.avgSessionDuration / 1000)}s`
        : '0s',
      icon: Clock,
      color: 'text-amber-500'
    },
  ];

  const pieData = [
    {
      name: 'Completed',
      value: overview?.totalCompletions || 0,
      color: 'hsl(var(--primary))'
    },
    {
      name: 'Skipped',
      value: overview?.totalSkips || 0,
      color: 'hsl(var(--destructive))'
    },
    {
      name: 'In Progress',
      value: (overview?.totalViews || 0) - (overview?.totalCompletions || 0) - (overview?.totalSkips || 0),
      color: 'hsl(var(--accent))'
    },
  ].filter(d => d.value > 0);

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground mt-1">Detailed tour performance metrics</p>
          </div>

          <div className="flex gap-3">
            {/* Tour Selector */}
            <Select value={selectedTourId || ''} onValueChange={setSelectedTourId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select tour" />
              </SelectTrigger>
              <SelectContent>
                {tours.map(tour => (
                  <SelectItem key={tour.id} value={tour.id}>
                    {tour.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Time Range Selector */}
            <Select value={timeRange} onValueChange={(v: '24h' | '7d' | '30d') => setTimeRange(v)}>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Trend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Daily Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyBreakdown}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorViews)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="completions"
                      stroke="hsl(var(--accent))"
                      fillOpacity={1}
                      fill="url(#colorCompletions)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Completion Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Completion Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex flex-col items-center justify-center">
                {pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height="70%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-2 mt-4">
                      {pieData.map((entry) => (
                        <div key={entry.name} className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-sm text-muted-foreground">{entry.name}</span>
                          </div>
                          <span className="text-sm font-medium">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No data yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funnel Analysis */}
        {funnelAnalysis && funnelAnalysis.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step-by-Step Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelAnalysis.map((step, index) => {
                  const completionRate = step.viewed > 0
                    ? (step.viewed / (overview?.totalCompletions ?? 1)) * 100
                    : 0;
                  const dropOffRate = step.viewed > 0 && (overview?.totalCompletions ?? 0) > 0
                    ? ((overview?.totalCompletions ?? 0) - step.viewed) / (overview?.totalCompletions ?? 1) * 100
                    : 0;

                  return (
                    <div key={step.stepId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            Step {index + 1}
                          </span>
                          <span className="text-sm font-medium">{step.title}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {step.viewed} viewed
                          </span>
                          <span className="text-green-500 font-medium">
                            {completionRate.toFixed(1)}% completed
                          </span>
                          {dropOffRate > 30 && (
                            <span className="text-red-500 font-medium">
                              ⚠️ {dropOffRate.toFixed(1)}% drop-off
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Performance */}
        {stepMetrics.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Step Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stepMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="stepId"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `Step ${value.split('-')[1] || value}`}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="completions" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
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

export default EnhancedAnalytics;