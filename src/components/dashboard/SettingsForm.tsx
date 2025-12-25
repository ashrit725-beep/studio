"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect } from "react";
import { doc } from "firebase/firestore";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUser, useFirestore, useAuth, useMemoFirebase, useDoc, setDocumentNonBlocking } from "@/firebase";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export default function SettingsForm() {
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const [isSavingProfile, setIsSavingProfile] = React.useState(false);
    const [isSavingPassword, setIsSavingPassword] = React.useState(false);

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: { name: "", email: "" },
    });
    
    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

    useEffect(() => {
        if (userProfile) {
            profileForm.reset({
                name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
                email: userProfile.email || '',
            });
        }
    }, [userProfile, profileForm]);

    async function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
        if (!userDocRef) return;
        setIsSavingProfile(true);
        
        const [firstName, ...lastName] = values.name.split(' ');
        const updatedProfile = {
            firstName,
            lastName: lastName.join(' '),
        };

        setDocumentNonBlocking(userDocRef, updatedProfile, { merge: true }).then(() => {
            toast({ title: "Profile updated successfully!" });
        }).catch((error: any) => {
            toast({ variant: "destructive", title: "Update failed", description: error.message });
        }).finally(() => {
            setIsSavingProfile(false);
        });
    }
    
    async function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
        if (!user || !user.email) {
            toast({ variant: "destructive", title: "Not authenticated" });
            return;
        }
        setIsSavingPassword(true);

        try {
            const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, values.newPassword);
            
            toast({ title: "Password changed successfully!" });
            passwordForm.reset();
        } catch (error: any) {
             if (error.code === 'auth/invalid-credential') {
                toast({ variant: "destructive", title: "Password Change Failed", description: "The current password you entered is incorrect. Please try again." });
             } else {
                toast({ variant: "destructive", title: "Password change failed", description: error.message });
             }
        } finally {
            setIsSavingPassword(false);
        }
    }


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} readOnly disabled />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSavingProfile || isProfileLoading}>
                {isSavingProfile ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password for better security.</CardDescription>
        </-CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                  <FormItem><FormLabel>Current Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                  <FormItem><FormLabel>New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                  <FormItem><FormLabel>Confirm New Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isSavingPassword}>{isSavingPassword ? "Saving..." : "Change Password"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your account's security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
            <div className="space-y-0.5">
                <FormLabel>Two-Factor Authentication</FormLabel>
                <CardDescription>
                    Enhance your account security by enabling 2FA. (Coming soon)
                </CardDescription>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
