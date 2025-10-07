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

export function SignIn() {
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
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Enter your credentials to access your account
                        </CardDescription>
                    </div>
                    <div className="flex justify-center">
                        <Button 
                            onClick={() => navigate("/signup")} 
                            variant="link"
                            className="text-sm text-primary hover:text-primary/80"
                        >
                            Don't have an account? Sign up
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-5">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    className="transition-colors focus-visible:ring-primary h-11"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="p-0 h-auto text-xs text-primary hover:text-primary/80"
                                    >
                                        Forgot your password?
                                    </Button>
                                </div>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    required
                                    placeholder="Enter your password"
                                    className="transition-colors focus-visible:ring-primary h-11"
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                
                <CardFooter className="flex-col gap-4 pt-2">
                    <Button 
                        type="submit" 
                        className="w-full bg-primary hover:bg-primary/90 h-11 text-sm font-medium"
                        onClick={handleSubmit}
                    >
                        Sign In
                    </Button>
                    
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            By continuing, you agree to our{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button variant="link" className="p-0 h-auto text-xs text-primary">
                                Privacy Policy
                            </Button>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}