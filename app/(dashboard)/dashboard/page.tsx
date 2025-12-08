"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {useTours} from "@/context/ToursContext";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Map,
  Eye,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";

const DashboardOverview: React.FC = () => {
  const { tours } = useTours();

  const totalStats = tours.reduce(
    (acc, tour) => ({
      views: acc.views + tour.analytics.views,
      completions: acc.completions + tour.analytics.completions,
      skips: acc.skips + tour.analytics.skips,
    }),
    { views: 0, completions: 0, skips: 0 }
  );

  const avgCompletionRate =
    tours.length > 0
      ? tours.reduce((acc, t) => acc + t.analytics.avgCompletionRate, 0) /
        tours.length
      : 0;

  const stats = [
    { label: "Total Tours", value: tours.length, icon: Map, color: "text-primary" },
    { label: "Total Views", value: totalStats.views.toLocaleString(), icon: Eye, color: "text-blue-500" },
    { label: "Completions", value: totalStats.completions.toLocaleString(), icon: CheckCircle2, color: "text-green-500" },
    { label: "Avg. Completion", value: `${avgCompletionRate.toFixed(1)}%`, icon: TrendingUp, color: "text-amber-500" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back! Here&apos;s an overview of your tours.
              </p>
            </div>

            <Link href="/dashboard/tours/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Tour
              </Button>
            </Link>
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

          {/* Recent Tours */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Tours</CardTitle>

              <Link href="/dashboard/tours">
                <Button variant="ghost" size="sm" className="gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              {tours.length === 0 ? (
                <div className="text-center py-8">
                  <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    No tours yet. Create your first tour!
                  </p>

                  <Link href="/dashboard/tours/new">
                    <Button>Create Tour</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {tours.slice(0, 5).map((tour) => (
                    <Link
                      key={tour.id}
                      href={`/dashboard/tours/${tour.id}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            tour.isActive ? "bg-green-500" : "bg-muted-foreground"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-foreground">{tour.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {tour.steps.length} steps
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {tour.analytics.views} views
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tour.analytics.avgCompletionRate}% completion
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
  );
};

export default DashboardOverview;
