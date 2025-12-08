'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Eye, CheckCircle2, SkipForward, TrendingUp } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  // TODO: Fetch real data from Convex
  const tours: { name: string; analytics: { views: number; completions: number; skips: number; avgCompletionRate: number } }[] = [];

  const totalStats = tours.reduce(
    (acc, tour) => ({
      views: acc.views + tour.analytics.views,
      completions: acc.completions + tour.analytics.completions,
      skips: acc.skips + tour.analytics.skips,
    }),
    { views: 0, completions: 0, skips: 0 }
  );

  const avgCompletionRate = tours.length > 0
    ? tours.reduce((acc, t) => acc + t.analytics.avgCompletionRate, 0) / tours.length
    : 0;

  const barData = tours.map(t => ({
    name: t.name.length > 15 ? t.name.substring(0, 15) + '...' : t.name,
    views: t.analytics.views,
    completions: t.analytics.completions,
  }));

  const pieData = [
    { name: 'Completed', value: totalStats.completions, color: 'hsl(var(--primary))' },
    { name: 'Skipped', value: totalStats.skips, color: 'hsl(var(--muted-foreground))' },
    { name: 'In Progress', value: totalStats.views - totalStats.completions - totalStats.skips, color: 'hsl(var(--accent))' },
  ].filter(d => d.value > 0);

  // Mock weekly data
  const weeklyData = [
    { day: 'Mon', views: 120, completions: 85 },
    { day: 'Tue', views: 145, completions: 102 },
    { day: 'Wed', views: 180, completions: 128 },
    { day: 'Thu', views: 165, completions: 115 },
    { day: 'Fri', views: 190, completions: 142 },
    { day: 'Sat', views: 95, completions: 68 },
    { day: 'Sun', views: 80, completions: 55 },
  ];

  const stats = [
    { label: 'Total Views', value: totalStats.views.toLocaleString(), icon: Eye, color: 'text-blue-500' },
    { label: 'Completions', value: totalStats.completions.toLocaleString(), icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Skips', value: totalStats.skips.toLocaleString(), icon: SkipForward, color: 'text-amber-500' },
    { label: 'Avg. Rate', value: `${avgCompletionRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-primary' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your tour performance and user engagement</p>
        </div>

          {/* Stats */}
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
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 sm:h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="completions" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
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
                <div className="h-80 sm:h-64 flex items-center justify-center">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No data yet</p>
                  )}
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tours Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Tours Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 sm:h-72">
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Create tours to see comparison data
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsPage;
