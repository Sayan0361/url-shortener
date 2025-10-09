import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

interface UrlQrCodeProps {
    qrCodeUrl: string;
    shortCode: string;
}

export const UrlQrCode = ({ qrCodeUrl, shortCode }: UrlQrCodeProps) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `qr-code-${shortCode}.png`;
        link.click();
    };

    return (
        <div className="p-4 border rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
            </h4>
            <div className="flex items-center gap-4">
                <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-32 h-32 border rounded"
                />
                <div className="space-y-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                    >
                        Download QR Code
                    </Button>
                </div>
            </div>
        </div>
    );
};