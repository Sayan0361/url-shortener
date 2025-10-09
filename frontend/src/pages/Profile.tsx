import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfo } from "@/hooks/useUserQueries";
import { UserIcon, MailIcon, CalendarIcon, ShieldIcon, RefreshCwIcon } from "lucide-react";
import { toast } from "react-hot-toast";

const Profile = () => {
    const { data: userData, isLoading, error, refetch } = useUserInfo();

    const handleRefresh = () => {
        refetch();
        toast.success("Profile updated!");
    };

    if (error) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                        <div className="text-center text-destructive">
                            <p>Failed to load profile information.</p>
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                className="mt-4"
                            >
                                <RefreshCwIcon className="w-4 h-4 mr-2" />
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage your account information and settings
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    <RefreshCwIcon className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-6">
                {/* Personal Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            Your basic profile details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            First Name
                                        </label>
                                        <div className="p-3 rounded-lg border bg-muted/50">
                                            {userData?.data?.firstname || "Not provided"}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Last Name
                                        </label>
                                        <div className="p-3 rounded-lg border bg-muted/50">
                                            {userData?.data?.lastname || "Not provided"}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <MailIcon className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <div className="p-3 rounded-lg border bg-muted/50">
                                        {userData?.data?.email}
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Account Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldIcon className="w-5 h-5" />
                            Account Information
                        </CardTitle>
                        <CardDescription>
                            Your account status and details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Account Status
                                    </label>
                                    <div>
                                        <Badge
                                            variant={userData?.data?.verified ? "default" : "secondary"}
                                            className={userData?.data?.verified
                                                ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300"
                                                : ""
                                            }
                                        >
                                            {userData?.data?.verified ? "Verified" : "Not Verified"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Role
                                    </label>
                                    <div>
                                        <Badge variant="outline" className="capitalize bg-blue-600">
                                            {userData?.data?.role || "user"}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        Member Since
                                    </label>
                                    <div className="p-2 text-sm">
                                        {userData?.data?.createdAt
                                            ? new Date(userData.data.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : "N/A"
                                        }
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Last Updated
                                    </label>
                                    <div className="p-2 text-sm">
                                        {userData?.data?.updatedAt
                                            ? new Date(userData.data.updatedAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })
                                            : "N/A"
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* User ID Card */}
                <Card className="bg-muted/30">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <span>User ID</span>
                            <Badge variant="outline" className="text-xs bg-muted">Technical</Badge>
                        </CardTitle>
                        <CardDescription className="text-xs">
                            For support and reference purposes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-6 w-64" />
                        ) : (
                            <div className="flex items-center gap-2">
                                <div className="font-mono text-xs p-2 bg-background rounded border break-all flex-1">
                                    {userData?.data?.id || "N/A"}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(userData?.data?.id);
                                        toast.success("User ID copied to clipboard!");
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default Profile;