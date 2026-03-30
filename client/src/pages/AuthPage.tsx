import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Pill, ShieldPlus } from 'lucide-react';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'customer' | 'pharmacist'>('customer'); // pharmacist mapping

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      window.location.href = "/";
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Role needs to be specifically pharmacist to match backend logic
    const userData = {
      name: fullName,
      email,
      password,
      role: role === 'pharmacist' ? 'pharmacist' : 'customer',
      address
    };

    const err = await signup(userData, role === 'pharmacist' ? pharmacyName : undefined);
    
    if (err) {
      toast.error(err);
    } else {
      toast.success('Account created! You can now log in.');
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-emerald-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-teal-600">
            <Pill className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-teal-800">PharmaCare</CardTitle>
          <CardDescription>Your trusted pharmacy management system</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Role selector */}
          {mode === 'signup' && (
            <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  Customer
                </TabsTrigger>
                <TabsTrigger value="pharmacist" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                  <ShieldPlus className="mr-1 h-4 w-4" /> Pharmacist
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Login / Signup toggle */}
          <div className="flex gap-2 mb-4">
            <Button variant={mode === 'login' ? 'default' : 'outline'} className={mode === 'login' ? 'bg-teal-600 hover:bg-teal-700 flex-1' : 'flex-1'} onClick={() => setMode('login')}>Login</Button>
            <Button variant={mode === 'signup' ? 'default' : 'outline'} className={mode === 'signup' ? 'bg-teal-600 hover:bg-teal-700 flex-1' : 'flex-1'} onClick={() => setMode('signup')}>Sign Up</Button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div><Label>Email</Label><Input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required /></div>
              <div><Label>Password</Label><Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required /></div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login</Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              <div><Label>Full Name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              <div><Label>Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} required /></div>
              
              {role === 'pharmacist' && (
                <>
                  <div><Label>Pharmacy Name</Label><Input value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} required /></div>
                </>
              )}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Create Account</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
