"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  MoreVertical,
  Trash2,
  Eye,
  Code2,
  Map,
  Loader2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

const ToursPage = () => {
  const router = useRouter();
  // Convex hooks
  const userSettings = useQuery(api.userSettings.getUserSettings);
  const tours = useQuery(api.tours.getUserTours);
  const deleteTour = useMutation(api.tours.deleteTour);

  // Local state
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter tours based on search
  const filteredTours = tours?.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  ) || [];


  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteTour({ tourId: deleteId as Id<"tours"> });
      toast.success("Tour deleted successfully");
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting tour:", error);
      toast.error("Failed to delete tour");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyEmbedCode = (id: string) => {
    const code = `<Script
    src="https://zenguide-widget.vercel.app/widget-bundle.js"
    data-tour-id="${id}"
    data-auto-start="${userSettings?.defaultAutoStart}"
    data-show-avatar="${userSettings?.defaultShowAvatar}"
  />`;

    navigator.clipboard.writeText(code);
    toast.success("Embed code copied!");
  };

  // Loading state
  if (tours === undefined) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Tours
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your onboarding tours
            </p>
          </div>
          <Link href="/dashboard/tours/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Tour
            </Button>
          </Link>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tours..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* GRID */}
        {filteredTours.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Map className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                {search ? "No tours match your search" : "No tours yet"}
              </p>

              {!search && (
                <Link href="/dashboard/tours/new">
                  <Button>Create Your First Tour</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTours.map((tour, i) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => router.push(`/dashboard/tours/${tour.id}`)}
                className="cursor-pointer"
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    {/* STATUS + MENU */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${tour.isActive
                            ? "bg-green-500"
                            : "bg-muted-foreground"
                            }`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {tour.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/tours/${tour.id}`}>
                              <Eye className="w-4 h-4 mr-2" /> View
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => copyEmbedCode(tour.id)}
                          >
                            <Code2 className="w-4 h-4 mr-2" /> Copy Embed Code
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => setDeleteId(tour.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* CLICK TO OPEN PREVIEW */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {tour.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {tour.description || "No description"}
                      </p>
                    </div>

                    {/* METRICS */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {tour.steps.length} steps
                      </span>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> {tour.analytics.views}
                        </span>
                        <span>{tour.analytics.avgCompletionRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>


      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tour?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              tour and its analytics data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ToursPage;