import { useState } from "react";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, QrCode, Link } from "lucide-react";

export const Home = () => {
    const [longUrl, setLongUrl] = useState("");
    const [shortCode, setShortCode] = useState("");
    const [generatedUrl, setGeneratedUrl] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleShortenUrl = async () => {
        if (!longUrl) {
            setError("Please enter a URL to shorten");
            return;
        }

        setIsLoading(true);
        setError("");

        // Simulate API call delay
        setTimeout(() => {
            const baseUrl = window.location.origin;
            const finalShortCode = shortCode || Math.random().toString(36).substring(2, 8);
            setGeneratedUrl(`${baseUrl}/${finalShortCode}`);
            setIsLoading(false);
        }, 1000);
    };

    const handleGenerateQRCode = async () => {
        if (!generatedUrl) {
            setError("Please generate a short URL first");
            return;
        }

        // Simulate QR code generation
        setTimeout(() => {
            // Create a placeholder QR code (in real app, this would be from your API)
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 200;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
                // Simple placeholder pattern
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 200, 200);
                ctx.fillStyle = '#000000';
                ctx.font = '16px Arial';
                ctx.fillText('QR Code', 70, 100);
                ctx.fillText('Placeholder', 60, 120);
            }
            
            setQrCodeUrl(canvas.toDataURL());
        }, 500);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
            console.log("Copied to clipboard:", text);
        } catch (err) {
            console.error("Failed to copy to clipboard:", err);
        }
    };

    const resetForm = () => {
        setLongUrl("");
        setShortCode("");
        setGeneratedUrl("");
        setQrCodeUrl("");
        setError("");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">URL Shortener</h1>
                <p className="mt-2 text-muted-foreground">
                    Shorten your long URLs and generate QR codes instantly.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Shorten Your URL</CardTitle>
                    <CardDescription>
                        Enter your long URL and optionally a custom short code
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="longUrl">Long URL</FieldLabel>
                                <Input
                                    id="longUrl"
                                    type="url"
                                    placeholder="https://example.com/very-long-url-path"
                                    value={longUrl}
                                    onChange={(e) => setLongUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                                <FieldDescription>
                                    Enter the URL you want to shorten
                                </FieldDescription>
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="shortCode">Custom Short Code (Optional)</FieldLabel>
                                <Input
                                    id="shortCode"
                                    placeholder="my-custom-link"
                                    value={shortCode}
                                    onChange={(e) => setShortCode(e.target.value)}
                                    disabled={isLoading}
                                />
                                <FieldDescription>
                                    Leave empty for auto-generated code
                                </FieldDescription>
                            </Field>

                            {error && (
                                <Field>
                                    <FieldError>{error}</FieldError>
                                </Field>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={handleShortenUrl}
                                    disabled={isLoading || !longUrl}
                                    className="flex items-center gap-2"
                                >
                                    <Link className="h-4 w-4" />
                                    {isLoading ? "Shortening..." : "Shorten URL"}
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={resetForm}
                                    disabled={isLoading}
                                >
                                    Reset
                                </Button>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </CardContent>
            </Card>

            {generatedUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle>Your Short URL</CardTitle>
                        <CardDescription>
                            Here's your shortened URL ready to share
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="generatedUrl">Short URL</FieldLabel>
                                    <div className="flex gap-2">
                                        <Input
                                            id="generatedUrl"
                                            value={generatedUrl}
                                            readOnly
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => copyToClipboard(generatedUrl)}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Field>

                                <div className="flex gap-2 pt-2">
                                    <Button
                                        onClick={handleGenerateQRCode}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <QrCode className="h-4 w-4" />
                                        Generate QR Code
                                    </Button>
                                </div>
                            </FieldGroup>
                        </FieldSet>

                        {qrCodeUrl && (
                            <div className="border rounded-lg p-4">
                                <FieldLabel>QR Code</FieldLabel>
                                <div className="mt-2 flex justify-center">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        className="w-48 h-48 border rounded"
                                    />
                                </div>
                                <div className="flex justify-center mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = qrCodeUrl;
                                            link.download = `qr-code-${generatedUrl.split('/').pop()}.png`;
                                            link.click();
                                        }}
                                    >
                                        Download QR Code
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};