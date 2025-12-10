"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion, Reorder } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  ArrowLeft,
  Save,
  Plus,
  GripVertical,
  Trash2,
  Copy,
  Check,
  Code2,
  Loader2,
  Edit,
  X,
} from "lucide-react";

import { toast } from "sonner";

const TourEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const isNew = id === "new";

  // Convex queries and mutations
  const existingTour = useQuery(
    api.tours.getTour,
    !isNew && id ? { tourId: id as Id<"tours"> } : "skip"
  );
  const createTour = useMutation(api.tours.createTour);
  const updateTour = useMutation(api.tours.updateTour);
  const saveSteps = useMutation(api.tours.saveSteps);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<Array<{
    id: string;
    title: string;
    description: string;
    order: number;
  }>>([]);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isEditing, setIsEditing] = useState(isNew); // Auto-enable editing for new tours

  // Load existing tour data
  useEffect(() => {
    if (existingTour) {
      setName(existingTour.name);
      setDescription(existingTour.description || "");
      setIsActive(existingTour.isActive);
      setSteps(existingTour.steps);
      setIsLoading(false);
    }
  }, [existingTour]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a tour name");
      return;
    }

    if (steps.length < 5) {
      toast.error("Please add at least 5 steps");
      return;
    }

    setIsSaving(true);

    try {
      // Update order property for all steps based on current position
      const updatedSteps = steps.map((step, index) => ({
        ...step,
        order: index,
      }));

      if (isNew) {
        // Create new tour
        const newTourId = await createTour({
          name,
          description: description || undefined,
        });

        // Save steps
        await saveSteps({
          tourId: newTourId,
          steps: updatedSteps,
        });

        // Update active status if needed
        if (isActive) {
          await updateTour({
            tourId: newTourId,
            isActive: true,
          });
        }

        toast.success("Tour created successfully!");
        router.push(`/dashboard/tours/${newTourId}`);
      } else {
        // Update existing tour
        await updateTour({
          tourId: id as Id<"tours">,
          name,
          description: description || undefined,
          isActive,
        });

        // Save steps
        await saveSteps({
          tourId: id as Id<"tours">,
          steps: updatedSteps,
        });

        toast.success("Tour saved successfully!", {
          description: "Your changes have been saved.",
        });
        setIsEditing(false); // Exit editing mode after save
      }
    } catch (error) {
      toast.error("Failed to save tour");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original data
    if (existingTour) {
      setName(existingTour.name);
      setDescription(existingTour.description || "");
      setIsActive(existingTour.isActive);
      setSteps(existingTour.steps);
    }
    setIsEditing(false);
  };

  const handleAddStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      title: `Step ${steps.length + 1}`,
      description: "",
      order: steps.length,
    };

    setSteps([...steps, newStep]);
  };

  const handleUpdateStep = (stepId: string, field: string, value: string) => {
    setSteps(
      steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s))
    );
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId));
  };

  const handleReorder = (newOrder: typeof steps) => {
    // Update the steps array with new order
    const reorderedSteps = newOrder.map((step, index) => ({
      ...step,
      order: index,
    }));
    setSteps(reorderedSteps);
  };

  const copyEmbedCode = () => {
    const code = `<Script
    src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
    strategy="afterInteractive"
    data-tour-id="${id}"
    data-auto-start="false"
    data-position="bottom-right"
    data-theme="light"
    data-show-avatar="true"
    data-avatar-position="center"
  />`;

    navigator.clipboard.writeText(code);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast.success("Embed code copied!");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/tours">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>

          <div className="flex-1">
            <h1 className="text-2xl font-display font-bold text-foreground">
              {isNew ? "Create Tour" : isEditing ? "Edit Tour" : "Tour Details"}
            </h1>
          </div>

          {isEditing ? (
            <div className="flex gap-2">
              {!isNew && (
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              )}
              <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>

        {/* Tour Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tour Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Tour Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Product Onboarding"
                  className="mt-1.5"
                />
              ) : (
                <p className="mt-1.5 text-sm">{name || "No name"}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              {isEditing ? (
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this tour is for..."
                  className="mt-1.5"
                  rows={3}
                />
              ) : (
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {description || "No description"}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable this tour on your site
                </p>
              </div>
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              Steps ({steps.length}/5 minimum)
            </CardTitle>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddStep}
                className="gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {steps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">
                  No steps yet. {isEditing && "Add at least 5 steps to your tour."}
                </p>
                {isEditing && (
                  <Button onClick={handleAddStep} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Step
                  </Button>
                )}
              </div>
            ) : isEditing ? (
              <Reorder.Group
                axis="y"
                values={steps}
                onReorder={handleReorder}
                className="space-y-4"
              >
                {steps.map((step, index) => (
                  <Reorder.Item
                    key={step.id}
                    value={step}
                    className="flex gap-3 p-4 rounded-lg border border-border bg-muted/30 cursor-grab active:cursor-grabbing"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center text-muted-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          ID: {step.id}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          Step {index + 1}
                        </span>
                      </div>

                      <Input
                        value={step.title}
                        onChange={(e) =>
                          handleUpdateStep(step.id, "title", e.target.value)
                        }
                        placeholder="Step title"
                      />

                      <Textarea
                        value={step.description}
                        onChange={(e) =>
                          handleUpdateStep(
                            step.id,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Step description..."
                        rows={2}
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteStep(step.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="p-4 rounded-lg border border-border bg-muted/30"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        ID: {step.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                    <h3 className="font-medium mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description || "No description"}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {isEditing && steps.length > 0 && steps.length < 5 && (
              <p className="text-sm text-amber-500 mt-4">
                Add {5 - steps.length} more step(s) to meet the minimum
                requirement.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Embed Code */}
        {!isNew && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="w-5 h-5" />
                Embed Code
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="relative">

                <pre className="bg-zinc-900 text-zinc-100 rounded-lg p-4 text-sm overflow-x-auto">
                  {`  <Script
    src="https://timely-swan-1a2b58.netlify.app/widget-bundle.js"
    strategy="afterInteractive"
    data-tour-id="${id}"
    data-auto-start="false"
    data-position="bottom-right"
    data-theme="light"
    data-show-avatar="true"
    data-avatar-position="center"
  />`}
                </pre>

                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-100"
                  onClick={copyEmbedCode}
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-3">
                Add this code to your website to display the tour widget.
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default TourEditor;