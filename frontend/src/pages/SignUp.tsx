import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export function SignUp() {
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission here
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-0">
                <CardHeader className="space-y-4 text-center pb-2">
                    <div className="space-y-2">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            Create your account
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Enter your details to get started
                        </CardDescription>
                    </div>
                    <div className="flex justify-center">
                        <Button 
                            onClick={() => navigate("/signin")} 
                            variant="link"
                            className="text-sm text-primary hover:text-primary/80"
                        >
                            Already have an account? Sign in
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        required
                                        className="transition-colors focus-visible:ring-primary"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        className="transition-colors focus-visible:ring-primary"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="transition-colors focus-visible:ring-primary"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">
                                    Password *
                                </Label>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required
                                    className="transition-colors focus-visible:ring-primary"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                
                <CardFooter className="flex-col gap-4 pt-4">
                    <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 h-11 text-sm font-medium"
                        onClick={handleSubmit}
                    >
                        Create Account
                    </Button>
                    
                    <div className="text-center space-y-2">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            By creating an account, you agree to our{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Privacy Policy
                            </Button>
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            * We'll send a verification code to your email to confirm your account
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}