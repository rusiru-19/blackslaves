"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [loginin , setLoinin] = useState(false)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    try {
      //auth
      setLoinin(true)
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('uid', userCredential.user.uid);
      // get user role 
    const docRef = doc(db, "users", userCredential.user.uid);  
    const docSnap = await getDoc(docRef);
    //added a role in here bcz we cant get the const role outside the if condition heeee
    let role = "customer"; 
    if (docSnap.exists()) {
      const userData = docSnap.data();
      role = userData.role;
    } else {
      setLoinin(false)
      console.log("No such document!");
      }
   
    // set the cookie
      document.cookie = `token=${token};  path=/; ${formData.rememberMe ? 'max-age=' + 60 * 60 * 24 * 30 : ''}`;
      document.cookie = `role=${role}; path=/; ${formData.rememberMe ? 'max-age=' + 60 * 60 * 24 * 30 : ''}`;
      setLoinin(false)
      toast.success("Login successful!");
      if (role === 'admin') {
        router.push("/admin");
        return;
      }else{
        router.push("/products");
      }
    } catch (error) {
      setLoinin(false)

      toast.error(`Error: ${error}`);
    }
  }

const router = useRouter()
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <ToastContainer />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground/60 hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-foreground/60">Sign in to your Luxe account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-card/50 border-border/40 text-foreground placeholder:text-foreground/40 rounded-lg h-12"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-card/50 border-border/40 text-foreground placeholder:text-foreground/40 rounded-lg h-12 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-foreground/60">Remember me</span>
            </label>
    
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold text-base"
          >
          {loginin ? 'login...' : 'login'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 flex items-center gap-3">
          <div className="flex-1 border-t border-border/40" />
          <div className="flex-1 border-t border-border/40" />
        </div>


        {/* Signup Link */}
        <p className="text-center mt-8 text-foreground/60">
          Don't have an account?{" "}
          <Link href="/signup" className="text-accent hover:underline font-semibold">
            Create one
          </Link>
        </p>

      </div>
    </div>
  )
}
