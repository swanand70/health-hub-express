import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Pill, ShieldPlus } from 'lucide-react';

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'customer' | 'owner'>('customer');

  // Login state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(loginUsername, loginPassword, role);
    if (success) toast.success('Welcome back!');
    else toast.error('Invalid credentials');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const err = signup(
      { role, username, password, fullName, phone, address, dob, gender, licenseNumber },
      role === 'owner' ? pharmacyName : undefined
    );
    if (err) toast.error(err);
    else toast.success('Account created!');
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
          <Tabs value={role} onValueChange={(v) => setRole(v as any)} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                Customer
              </TabsTrigger>
              <TabsTrigger value="owner" className="data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                <ShieldPlus className="mr-1 h-4 w-4" /> Pharmacy Owner
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Login / Signup toggle */}
          <div className="flex gap-2 mb-4">
            <Button variant={mode === 'login' ? 'default' : 'outline'} className={mode === 'login' ? 'bg-teal-600 hover:bg-teal-700 flex-1' : 'flex-1'} onClick={() => setMode('login')}>Login</Button>
            <Button variant={mode === 'signup' ? 'default' : 'outline'} className={mode === 'signup' ? 'bg-teal-600 hover:bg-teal-700 flex-1' : 'flex-1'} onClick={() => setMode('signup')}>Sign Up</Button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div><Label>Username</Label><Input value={loginUsername} onChange={e => setLoginUsername(e.target.value)} required /></div>
              <div><Label>Password</Label><Input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required /></div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">Login as {role === 'customer' ? 'Customer' : 'Pharmacy Owner'}</Button>
              <p className="text-xs text-center text-muted-foreground mt-2">Demo: username <strong>john</strong> / password <strong>pass123</strong> (customer) or <strong>medplus</strong> / <strong>pass123</strong> (owner)</p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              <div><Label>Full Name</Label><Input value={fullName} onChange={e => setFullName(e.target.value)} required /></div>
              <div><Label>Username</Label><Input value={username} onChange={e => setUsername(e.target.value)} required /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
              <div><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} required /></div>
              <div><Label>Address</Label><Input value={address} onChange={e => setAddress(e.target.value)} required /></div>
              {role === 'customer' && (
                <>
                  <div><Label>Date of Birth</Label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
                  <div>
                    <Label>Gender</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={gender} onChange={e => setGender(e.target.value)}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}
              {role === 'owner' && (
                <>
                  <div><Label>Pharmacy Name</Label><Input value={pharmacyName} onChange={e => setPharmacyName(e.target.value)} required /></div>
                  <div><Label>License Number</Label><Input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} required /></div>
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
