import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { useUserUrls, useDeleteUrl, useUpdateUrl, useGenerateQRCode } from "@/hooks/useUrlQueries";
import { toast } from "react-hot-toast";
import { UrlItem } from "@/components/Urls/UrlItem";
import type { Url } from "@/types/types";

const MyUrls = () => {
    const { data: urlsData, isLoading, error, refetch } = useUserUrls();
    const { mutate: deleteUrl } = useDeleteUrl();
    const { mutate: updateUrl } = useUpdateUrl();
    const { mutate: generateQRCode } = useGenerateQRCode();
    
    const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
    const [editingUrl, setEditingUrl] = useState<string | null>(null);
    const [editUrlValue, setEditUrlValue] = useState("");
    const [qrCodeUrls, setQrCodeUrls] = useState<{ [key: string]: string }>({});

    // Sort URLs by creation date in descending order (newest first)
    const sortedUrls: Url[] = useMemo(() => {
        const urls = urlsData?.codes || [];
        return [...urls].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [urlsData?.codes]);

    // Utility functions
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy to clipboard");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this URL?")) {
            deleteUrl(id, {
                onSuccess: () => {
                    toast.success("URL deleted successfully!");
                    if (expandedUrl === id) setExpandedUrl(null);
                }
            });
        }
    };

    const handleEdit = (url: Url) => {
        setEditingUrl(url.id);
        setEditUrlValue(url.targetURL);
    };

    const handleSaveEdit = (id: string) => {
        if (!editUrlValue.trim()) {
            toast.error("URL cannot be empty");
            return;
        }

        updateUrl({ id, newURL: editUrlValue }, {
            onSuccess: () => {
                toast.success("URL updated successfully!");
                setEditingUrl(null);
                setEditUrlValue("");
                refetch();
            }
        });
    };

    const handleCancelEdit = () => {
        setEditingUrl(null);
        setEditUrlValue("");
    };

    const handleGenerateQR = (shortCode: string) => {
        generateQRCode(shortCode, {
            onSuccess: (qrData) => {
                setQrCodeUrls(prev => ({ ...prev, [shortCode]: qrData || "" }));
                toast.success("QR code generated!");
            }
        });
    };

    const getShortUrl = (shortCode: string) => {
        const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        return `${backendUrl}/${shortCode}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleToggleExpand = (urlId: string) => {
        setExpandedUrl(expandedUrl === urlId ? null : urlId);
    };

    // Loading and error states
    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <Header urlsCount={sortedUrls.length} />
            
            {sortedUrls.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-4">
                    {sortedUrls.map((url) => (
                        <UrlItem
                            key={url.id}
                            url={url}
                            expandedUrl={expandedUrl}
                            editingUrl={editingUrl}
                            editUrlValue={editUrlValue}
                            qrCodeUrl={qrCodeUrls[url.shortCode]}
                            onCopy={copyToClipboard}
                            onTest={(url) => window.open(url, '_blank')}
                            onToggleExpand={handleToggleExpand}
                            onEdit={handleEdit}
                            onEditUrlChange={setEditUrlValue}
                            onSaveEdit={handleSaveEdit}
                            onCancelEdit={handleCancelEdit}
                            onGenerateQR={handleGenerateQR}
                            onDelete={handleDelete}
                            getShortUrl={getShortUrl}
                            formatDate={formatDate}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Sub-components for different states
const LoadingState = () => (
    <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My URLs</h1>
            <p className="text-muted-foreground">Loading your URLs...</p>
        </div>
    </div>
);

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
    <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">My URLs</h1>
            <p className="text-red-500">Error loading URLs: {error.message}</p>
            <Button onClick={onRetry} className="mt-4">
                Try Again
            </Button>
        </div>
    </div>
);

const Header = ({ urlsCount }: { urlsCount: number }) => (
    <div className="text-center">
        <h1 className="text-3xl font-bold">My URLs</h1>
        <p className="text-muted-foreground mt-2">
            Manage and track all your shortened URLs
        </p>
        <Badge variant="secondary" className="mt-2">
            {urlsCount} URL{urlsCount !== 1 ? 's' : ''}
        </Badge>
    </div>
);

const EmptyState = () => (
    <Card>
        <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No URLs yet</h3>
            <p className="text-muted-foreground mb-4">
                Start shortening URLs to see them here
            </p>
            <Button onClick={() => window.location.href = '/'}>
                Create Your First URL
            </Button>
        </CardContent>
    </Card>
);

export default MyUrls;