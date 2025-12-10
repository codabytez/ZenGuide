'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Save, User, Palette, Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { NextPage } from 'next';

const SettingsPage: NextPage = () => {

  // Convex hooks
  const currentUser = useQuery(api.userSettings.getCurrentUser)
  const userSettings = useQuery(api.userSettings.getUserSettings)
  const saveSettings = useMutation(api.userSettings.saveUserSettings)
  const updateProfile = useMutation(api.userSettings.updateUserProfile)

  // Local state for form edits (only tracks user changes, not server data)
  const [localEdits, setLocalEdits] = useState<{
    name?: string
    email?: string
    emailNotifs?: boolean
    weeklyReport?: boolean
    showAvatar?: boolean
    autoStart?: boolean
  }>({})

  const name = localEdits.name ?? currentUser?.name ?? ""
  const email = localEdits.email ?? currentUser?.email ?? ""
  // const emailNotifs = localEdits.emailNotifs ?? userSettings?.emailNotifications ?? true
  // const weeklyReport = localEdits.weeklyReport ?? userSettings?.weeklyReport ?? true
  const showAvatar = localEdits.showAvatar ?? userSettings?.defaultShowAvatar ?? true
  const autoStart = localEdits.autoStart ?? userSettings?.defaultAutoStart ?? true

  const setName = (value: string) => setLocalEdits((prev) => ({ ...prev, name: value }))
  const setEmail = (value: string) => setLocalEdits((prev) => ({ ...prev, email: value }))
  // const setEmailNotifs = (value: boolean) => setLocalEdits((prev) => ({ ...prev, emailNotifs: value }))
  // const setWeeklyReport = (value: boolean) => setLocalEdits((prev) => ({ ...prev, weeklyReport: value }))
  const setShowAvatar = (value: boolean) => setLocalEdits((prev) => ({ ...prev, showAvatar: value }))
  const setAutoStart = (value: boolean) => setLocalEdits((prev) => ({ ...prev, autoStart: value }))



  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, email });
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // const handleSaveNotifications = async () => {
  //   try {
  //     await saveSettings({
  //       emailNotifications: emailNotifs,
  //       weeklyReport: weeklyReport,
  //     });
  //     toast.success('Notification preferences saved');
  //   } catch (error) {
  //     console.error('Error saving notifications:', error);
  //     toast.error('Failed to save preferences');
  //   }
  // };

  const handleSaveWidget = async () => {
    try {
      await saveSettings({
        defaultShowAvatar: showAvatar,
        defaultAutoStart: autoStart,
      });
      toast.success('Widget defaults saved');
    } catch (error) {
      console.error('Error saving widget defaults:', error);
      toast.error('Failed to save defaults');
    }
  };

  // Loading state
  if (currentUser === undefined || userSettings === undefined) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-foreground">
                  {name.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{name || 'User'}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
              </div>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button onClick={handleSaveProfile} className="gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        {/* <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>Customize the look and feel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('light')}
                  className="gap-2"
                >
                  <Sun className="w-4 h-4" /> Light
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="gap-2"
                >
                  <Moon className="w-4 h-4" /> Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Notification Settings */}
        {/* <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about your tours</p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Report</p>
                <p className="text-sm text-muted-foreground">Get a summary of your tour analytics</p>
              </div>
              <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
            </div>
            <Button onClick={handleSaveNotifications} variant="outline" className="gap-2">
              <Save className="w-4 h-4" /> Save Preferences
            </Button>
          </CardContent>
        </Card> */}

        {/* Widget Defaults */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle>Tour Widget Defaults</CardTitle>
            </div>
            <CardDescription>Set default options for new tours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Show Avatar</p>
                <p className="text-sm text-muted-foreground">Display 3D avatar animation</p>
              </div>
              <Switch checked={showAvatar} onCheckedChange={setShowAvatar} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto Start</p>
                <p className="text-sm text-muted-foreground">Start tour automatically on page load</p>
              </div>
              <Switch checked={autoStart} onCheckedChange={setAutoStart} />
            </div>
            <Button onClick={handleSaveWidget} variant="outline" className="gap-2">
              <Save className="w-4 h-4" /> Save Defaults
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Password management and two-factor authentication features coming soon.
            </p>
            <Button variant="outline" disabled>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SettingsPage;