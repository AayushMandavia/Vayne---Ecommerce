import { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  Check,
  LogOut,
  Clock,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserSession {
  name: string;
  email: string;
  tier: string;
  memberSince: string;
  clientId: string;
  department?: string;
}

const DEFAULT_VIP_USER: UserSession = {
  name: 'Aayush Mandavia',
  email: 'aayushmandavia1412@gmail.com',
  tier: 'VIP BLACK TIER',
  memberSince: '09 / 2026',
  clientId: '#VY-9482',
  department: 'Men',
};

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  // Authentication & session state
  const [currentUser, setCurrentUser] = useState<UserSession | null>(DEFAULT_VIP_USER);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'sizing'>('profile');

  // Form states
  const [emailInput, setEmailInput] = useState('aayushmandavia1412@gmail.com');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [nameInput, setNameInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('Men');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [authNotice, setAuthNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyId = () => {
    if (currentUser) {
      navigator.clipboard.writeText(currentUser.clientId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setAuthNotice('Please provide a valid email.');
      return;
    }

    const matchedName = emailInput.includes('aayush') ? 'Aayush Mandavia' : emailInput.split('@')[0];
    setCurrentUser({
      name: matchedName || 'VIP Member',
      email: emailInput,
      tier: 'VIP BLACK TIER',
      memberSince: '09 / 2026',
      clientId: '#VY-' + Math.floor(1000 + Math.random() * 9000),
      department: departmentInput,
    });
    setAuthNotice('Signed in successfully.');
    setTimeout(() => setAuthNotice(null), 2500);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !nameInput.trim()) {
      setAuthNotice('Please fill in your name and email.');
      return;
    }

    setCurrentUser({
      name: nameInput.trim(),
      email: emailInput.trim(),
      tier: 'ATELIER MEMBER',
      memberSince: '09 / 2026',
      clientId: '#VY-' + Math.floor(1000 + Math.random() * 9000),
      department: departmentInput,
    });
    setAuthNotice('Account created successfully. Welcome to VAYNE.');
    setTimeout(() => setAuthNotice(null), 2500);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setEmailInput('');
    setPasswordInput('');
    setNameInput('');
    setAuthMode('signin');
    setAuthNotice('You have been signed out.');
    setTimeout(() => setAuthNotice(null), 2500);
  };

  const handleQuickDemoLogin = () => {
    setCurrentUser(DEFAULT_VIP_USER);
    setEmailInput(DEFAULT_VIP_USER.email);
    setPasswordInput('••••••••••••');
    setAuthNotice('Logged in as VIP Client.');
    setTimeout(() => setAuthNotice(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="relative w-full max-w-md md:max-w-lg bg-white text-[#111827] h-full shadow-2xl z-10 flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <header className="p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-white/90 backdrop-blur-md sticky top-0 z-20">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-sm tracking-widest uppercase">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-wide uppercase">
                  {currentUser.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#111827] text-white">
                    <Sparkles className="w-2.5 h-2.5" />
                    {currentUser.tier}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-[10px] font-mono text-[#6B7280] hover:text-black transition-colors cursor-pointer"
                    title="Copy Client ID"
                  >
                    {copiedId ? 'COPIED!' : currentUser.clientId}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#6B7280] uppercase block">
                ATELIER CLIENT PORTAL
              </span>
              <h2 className="text-base font-bold tracking-wide uppercase text-[#111827]">
                Sign In & Register
              </h2>
            </div>
          )}

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="px-2.5 py-1 text-[11px] font-medium text-[#6B7280] hover:text-black border border-[#E5E7EB] hover:border-black rounded-[2px] transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-[#E5E7EB] hover:border-black flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Account Panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Feedback Alert Toast */}
        {authNotice && (
          <div className="mx-6 mt-4 p-3 bg-neutral-900 text-white text-xs font-mono rounded-[2px] flex items-center justify-between animate-in fade-in duration-200">
            <span>{authNotice}</span>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}

        {currentUser ? (
          <>
            {/* Authenticated Tab Navigation */}
            <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB] px-6 text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer flex-1 text-center ${
                  activeTab === 'profile'
                    ? 'border-[#111827] text-[#111827]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Client Profile
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer flex-1 text-center ${
                  activeTab === 'orders'
                    ? 'border-[#111827] text-[#111827]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Orders (2)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('sizing')}
                className={`py-3.5 border-b-2 transition-colors cursor-pointer flex-1 text-center ${
                  activeTab === 'sizing'
                    ? 'border-[#111827] text-[#111827]'
                    : 'border-transparent text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Tailoring Fit
              </button>
            </div>

            {/* Scrollable Authenticated Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  {/* Membership Card */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1F2937] via-[#111827] to-black text-white p-6 shadow-xl">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
                          VAYNE ATELIER PRIVATE
                        </span>
                        <h3 className="text-lg font-bold tracking-widest uppercase mt-1">
                          BLACK PASS
                        </h3>
                      </div>
                      <ShieldCheck className="w-6 h-6 text-white/80" />
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-mono text-neutral-400 uppercase">Client Name</p>
                        <p className="text-sm font-semibold tracking-wider">{currentUser.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-neutral-400 uppercase">Member Since</p>
                        <p className="text-sm font-mono">{currentUser.memberSince}</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Details Box */}
                  <div className="border border-[#E5E7EB] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                      Account Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                        <span className="text-[#6B7280]">Email</span>
                        <span className="font-medium text-[#111827]">{currentUser.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                        <span className="text-[#6B7280]">Status</span>
                        <span className="font-semibold text-emerald-600">Active VIP Member</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                        <span className="text-[#6B7280]">Default Delivery</span>
                        <span className="font-medium text-[#111827] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#6B7280]" />
                          Studio Atelier Suite, Mumbai
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-[#6B7280]">Complimentary Courier</span>
                        <span className="font-semibold text-emerald-600">VIP Express Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Private Perks */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                      Member Privileges
                    </h4>
                    <div className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#111827] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">Private Runway Reservation</p>
                        <p className="text-[11px] text-[#6B7280] mt-0.5">
                          Priority pre-allocation for upcoming collection drops before public access.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Order 1 */}
                  <div className="border border-[#E5E7EB] rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase text-[#111827]">Order #VY-9842</span>
                        <p className="text-[10px] font-mono text-[#6B7280]">Placed Today • 2 Items</p>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> IN TRANSIT
                      </span>
                    </div>

                    <div className="space-y-2 py-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#111827]">Heavyweight Boxy Tee (Onyx / M)</span>
                        <span className="font-mono text-[#6B7280]">$95.00</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#111827]">Architectural Trench Coat (Caviar / L)</span>
                        <span className="font-mono text-[#6B7280]">$620.00</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#111827]">Total Paid</span>
                      <span className="text-sm font-bold text-[#111827]">$715.00</span>
                    </div>

                    <div className="pt-1">
                      <div className="w-full bg-[#F3F4F6] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#111827] h-full rounded-full w-3/4" />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#6B7280] mt-1.5">
                        <span>Processing</span>
                        <span>Dispatched</span>
                        <span className="font-semibold text-[#111827]">Delivering Tomorrow</span>
                      </div>
                    </div>
                  </div>

                  {/* Order 2 */}
                  <div className="border border-[#E5E7EB] rounded-xl p-5 space-y-3 opacity-80">
                    <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
                      <div>
                        <span className="text-xs font-bold uppercase text-[#111827]">Order #VY-7120</span>
                        <p className="text-[10px] font-mono text-[#6B7280]">Delivered 2 days ago</p>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 font-semibold flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> DELIVERED
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#111827]">Pleated Wool Wide Trousers (Charcoal / L)</span>
                      <span className="font-mono text-[#6B7280]">$280.00</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'sizing' && (
                <div className="space-y-5">
                  <div className="border border-[#E5E7EB] rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                      Your Tailored Sizing Matrix
                    </h4>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      Used by our atelier to recommend bespoke drape for coats, knitwear, and trousers.
                    </p>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Tops & Outerwear</span>
                        <span className="text-base font-bold text-[#111827]">M / Boxy Cut</span>
                      </div>
                      <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Trousers & Waist</span>
                        <span className="text-base font-bold text-[#111827]">32 / Wide Leg</span>
                      </div>
                      <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Shoulder Width</span>
                        <span className="text-base font-bold text-[#111827]">48 cm</span>
                      </div>
                      <div className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
                        <span className="text-[10px] font-mono text-[#6B7280] uppercase block">Footwear Size</span>
                        <span className="text-base font-bold text-[#111827]">43 EU / 10 US</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-xl border border-dashed border-[#E5E7EB] text-center space-y-2">
                    <p className="text-xs text-[#6B7280]">Need custom alterations on your next piece?</p>
                    <button
                      type="button"
                      onClick={() => alert('Complimentary atelier tailoring request received. Your stylist will reach out.')}
                      className="px-4 py-2 bg-[#111827] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-black cursor-pointer"
                    >
                      Book Stylist Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* AUTHENTICATION VIEW: SIGN IN & REGISTER                                   */
          /* ========================================================================= */
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Mode Selector */}
            <div className="grid grid-cols-2 p-1 bg-[#F3F4F6] rounded-lg text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`py-2.5 rounded-[6px] transition-all cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`py-2.5 rounded-[6px] transition-all cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                Create Account
              </button>
            </div>

            {authMode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="client@atelier.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280]">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your registered email.')}
                      className="text-[10px] text-[#6B7280] hover:text-black cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-9 py-2.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] focus:outline-none focus:border-black transition-colors font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-black"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#111827] text-white text-xs font-semibold uppercase tracking-widest rounded-[2px] hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Sign In to VAYNE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative py-2 flex items-center justify-center">
                  <div className="border-t border-[#E5E7EB] w-full" />
                  <span className="bg-white px-3 text-[10px] font-mono text-[#9CA3AF] uppercase absolute">
                    or demo access
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 border border-[#111827] text-[#111827] text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-[#111827] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Quick 1-Click VIP Member Sign-In</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Aayush Mandavia"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="client@atelier.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] focus:outline-none focus:border-black transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#6B7280] mb-1.5">
                    Primary Lookbook Department
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {['Men', 'Women', 'Kids'].map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        onClick={() => setDepartmentInput(dept)}
                        className={`py-2 border rounded-[2px] font-medium transition-all cursor-pointer ${
                          departmentInput === dept
                            ? 'bg-[#111827] text-white border-[#111827]'
                            : 'bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB] hover:text-[#111827]'
                        }`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#111827] text-white text-xs font-semibold uppercase tracking-widest rounded-[2px] hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Create Atelier Membership</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] text-center space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#111827] block">
                Exclusive Atelier Benefits
              </span>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Members unlock private runway reservations, live order courier dispatch tracking, and customized atelier tailoring dimensions.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <footer className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-black flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#111827] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-black transition-colors cursor-pointer"
          >
            Continue Browsing
          </button>
        </footer>
      </div>
    </div>
  );
}
