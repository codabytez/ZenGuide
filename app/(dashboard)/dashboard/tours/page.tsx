"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useTours } from "@/context/ToursContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Code2,
  Map,
  X,
  Calendar,
  Activity,
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

const ToursPage = () => {
  const router = useRouter();
  const { tours, deleteTour } = useTours();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewTourId, setPreviewTourId] = useState<string | null>(null);

  const filteredTours = tours.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const previewTour = tours.find((t) => t.id === previewTourId);

  const handleDelete = () => {
    if (deleteId) {
      deleteTour(deleteId);
      toast.success("Tour deleted");
      setDeleteId(null);
    }
  };

  const copyEmbedCode = (tourId: string) => {
    const code = `<script src="https://cdn.tourguide.app/widget.js"></script>
<script>TourGuide.init({ tourId: '${tourId}' });</script>`;

    navigator.clipboard.writeText(code);
    toast.success("Embed code copied!");
  };

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
              >
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    {/* STATUS + MENU */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            tour.isActive
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
                              <Edit className="w-4 h-4 mr-2" /> Edit
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
                    <div
                      onClick={() => setPreviewTourId(tour.id)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {tour.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {tour.description}
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
                        <span>{tour.analytics.avgCompletionRate}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* PREVIEW DIALOG */}
      <Dialog open={!!previewTourId} onOpenChange={() => setPreviewTourId(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-[95vw] sm:w-full">
          {previewTour && (
            <>
              <DialogHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <DialogTitle className="text-xl sm:text-2xl mb-2">
                      {previewTour.name}
                    </DialogTitle>
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          previewTour.isActive
                            ? "bg-green-500"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-muted-foreground">
                        {previewTour.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                  <Link href={`/dashboard/tours/${previewTour.id}`} className="w-full sm:w-auto">
                    <Button className="gap-2 w-full sm:w-auto">
                      <Edit className="w-4 h-4" />
                      Edit Tour
                    </Button>
                  </Link>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* DESCRIPTION */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Description
                  </h3>
                  <p className="text-foreground">{previewTour.description}</p>
                </div>

                {/* ANALYTICS */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Analytics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-xs">Views</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold">
                          {previewTour.analytics.views}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Activity className="w-4 h-4" />
                          <span className="text-xs">Completion Rate</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold">
                          {previewTour.analytics.avgCompletionRate}%
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <Calendar className="w-4 h-4" />
                          <span className="text-xs">Total Steps</span>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold">
                          {previewTour.steps.length}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* STEPS */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
                    Tour Steps
                  </h3>
                  <div className="space-y-3">
                    {previewTour.steps.map((step, index) => (
                      <Card key={step.id}>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground mb-1">
                                {step.title}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* EMBED CODE */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-2">
                    Embed Code
                  </h3>
                  <div className="relative">
                    <pre className="bg-muted p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs overflow-x-auto">
                      <code>{`<script src="https://cdn.tourguide.app/widget.js"></script>
<script>TourGuide.init({ tourId: '${previewTour.id}' });</script>`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2 text-xs"
                      onClick={() => copyEmbedCode(previewTour.id)}
                    >
                      <Code2 className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ToursPage;