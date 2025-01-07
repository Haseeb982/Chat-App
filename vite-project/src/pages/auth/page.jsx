
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";
import { SIGNUP_ROUTE, LOGIN_ROUTE } from "@/utiles/constant";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";

const Auth = () => {
    const { setUserInfo } = useAuthStore();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { toast } = useToast();

    const validateSignup = () => {
        if (!email || !password) {
            toast({ description: "Email and password are required" });
            return false;
        }
        if (password !== confirmPassword) {
            toast({ description: "Password and confirm password do not match" });
            return false;
        }
        if (password.length < 8) {
            toast({ description: "Password must be at least 8 characters long" });
            return false;
        }
        return true;
    };

    const handleSignup = async () => {
        if (!validateSignup()) return;
        try {            
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password, confirmPassword }, {withCredentials: true});
            console.log("Signup successful:", response);
            toast({ description: "Signup successful" });
            if (response.status === 201) {
                navigate("/profile");
            }
            setUserInfo(response.data);
        } catch (error) {
            console.log("Error during signup:", error);
            toast({ description: error.message });
        }        
    };

    const validateLogin = () => {
        if (!email || !password) {
            toast({ description: "Email and password are required" });
            return false;
        }
        if (password.length < 8) {
            toast({ description: "Password must be at least 8 characters long" });
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateLogin()) return;
        try {            
            const response = await apiClient.post(LOGIN_ROUTE, { email, password }, {withCredentials : true});
            console.log("Login successful");
            toast({ description: response.data.message });
            if (response.data.id) {
                if (response.data.profileSetup) {
                    navigate("/chat");
                } else {
                    navigate("/profile");
                }
                setUserInfo(response.data);
            }
            
        } catch (error) {
            console.log("Error during login:", error);
            toast({ description: error.message });
        }        
    };

    return (
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
            <div className="px-6 py-4">
                <h3 className="mt-3 text-xl font-medium text-center">Welcome Back</h3>
                <p className="mt-1 text-center">Login or create an account</p>
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup" className="flex flex-col gap-4">
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        <Button className="w-full bg-blue-500 rounded-full text-white hover:bg-blue-600" onClick={handleSignup}>Signup</Button>
                    </TabsContent>
                    <TabsContent value="login" className="flex flex-col gap-4">
                        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <Button className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600" onClick={handleLogin}>Login</Button>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Auth;
