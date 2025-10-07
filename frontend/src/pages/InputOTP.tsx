import * as React from "react"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export function InputOTPForm() {
    const [value, setValue] = React.useState("")

    return (
        <div className="flex flex-col items-center justify-center space-y-4 p-6">
            <div className="text-center space-y-2 mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Verification Code</h2>
                <p className="text-sm text-muted-foreground">
                    Enter the 6-digit code sent to your device
                </p>
            </div>
            
            <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
                className="justify-center"
            >
                <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSeparator />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2" />
                </InputOTPGroup>
            </InputOTP>
            
            <div className="text-center text-sm text-muted-foreground pt-2">
                {value === "" ? (
                    <>Enter your one-time password</>
                ) : (
                    <div className="space-y-1">
                        <div>You entered: <span className="font-mono font-bold text-foreground">{value}</span></div>
                        <div className="text-xs">Complete all 6 digits to continue</div>
                    </div>
                )}
            </div>
        </div>
    )
}