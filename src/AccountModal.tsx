import { useState } from 'react';
import { X, ShieldCheck, MapPin, Sparkles, Check, LogOut, Clock } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'sizing'>('profile');
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText('VY-2026-9482');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center font-bold text-sm tracking-widest">
              AM
            </div>
            <div>
              <h2 className="text-base font-semibold tracking-wide uppercase">
                Aayush Mandavia
              </h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#111827] text-white">
                  <Sparkles className="w-2.5 h-2.5" />
                  VIP BLACK TIER
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-[10px] font-mono text-[#6B7280] hover:text-black transition-colors cursor-pointer"
                  title="Copy Client ID"
                >
                  {copiedId ? 'COPIED!' : '#VY-9482'}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-[#E5E7EB] hover:border-black flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Account Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Tab Navigation */}
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

        {/* Scrollable Content */}
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
                    <p className="text-sm font-semibold tracking-wider">Aayush Mandavia</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-neutral-400 uppercase">Member Since</p>
                    <p className="text-sm font-mono">09 / 2026</p>
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
                    <span className="font-medium text-[#111827]">aayushmandavia1412@gmail.com</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#F3F4F6]">
                    <span className="text-[#6B7280]">Phone</span>
                    <span className="font-medium text-[#111827]">+91 98765 43210</span>
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
                      Priority pre-allocation for Upcoming Drops 10 & 11 before public release.
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
                  Used by our atelier to recommend the exact bespoke drape for coats, knitwear, and trousers.
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

        {/* Footer Actions */}
        <footer className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-black flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Close Panel</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#111827] text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] hover:bg-black transition-colors cursor-pointer"
          >
            Continue Shopping
          </button>
        </footer>
      </div>
    </div>
  );
}
