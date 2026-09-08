import { useState } from 'react';
import {
  Lock,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Check,
  CheckCircle2,
  CreditCard,
  Package,
} from 'lucide-react';
import { type CartItem } from './CartDrawer';

interface CheckoutProps {
  items: CartItem[];
  onBackToCart: () => void;
  onOrderComplete: () => void;
}

export default function Checkout({ items, onBackToCart, onOrderComplete }: CheckoutProps) {
  // Current active step (1: Shipping, 2: Payment, 3: Review)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSummaryOpen, setIsSummaryOpen] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Step 1: Shipping Form State
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  // Step 2: Payment Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Totals calculations
  const subtotal = items.reduce((acc, item) => acc + item.priceNum * item.quantity, 0);
  const shipping = subtotal >= 200 || items.length === 0 ? 0 : 15;
  const taxes = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.max(0, subtotal + shipping + taxes);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName && lastName && address && city && zip) {
      setCurrentStep(2);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber && cardExp && cardCvv && cardName) {
      setCurrentStep(3);
    }
  };

  const handleFinalOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      onOrderComplete();
    }, 1200);
  };

  // Order Confirmed State
  if (isCompleted) {
    return (
      <div
        className="min-h-screen bg-white text-[#111827] flex flex-col items-center justify-center px-6 py-16 antialiased"
        style={{ fontFamily: "'Satoshi', sans-serif" }}
      >
        <div className="w-full max-w-[520px] border border-[#E5E7EB] rounded-[2px] p-8 sm:p-10 space-y-6 text-center shadow-sm">
          {/* Logo / Brand */}
          <div
            className="text-xl font-semibold tracking-tight text-black"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            VAYNE
          </div>

          <div className="w-12 h-12 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto text-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-mono">
              CONFIRMATION #VYN-92481
            </span>
            <h1
              className="text-[20px] font-semibold tracking-tight text-[#111827]"
              style={{ fontFamily: "'General Sans', sans-serif" }}
            >
              Order Confirmed
            </h1>
            <p className="text-sm text-[#6B7280]">
              Thank you, {firstName || 'Customer'}. We have received your order and dispatched receipt details to {email || 'your email'}.
            </p>
          </div>

          <div className="border-t border-[#F3F4F6] pt-5 space-y-2.5 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Destination</span>
              <span className="font-medium text-[#111827] truncate max-w-[240px]">
                {address}, {city} {zip}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Payment Method</span>
              <span className="font-medium text-[#111827] font-mono">
                Card ending in {cardNumber.slice(-4) || '4242'}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#F3F4F6] pt-2 font-medium">
              <span className="text-[#111827]">Total Paid</span>
              <span className="text-[#111827]">${total.toFixed(2)} USD</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToCart}
            className="w-full py-4 bg-[#000000] text-white text-sm font-medium rounded-[2px] transition-all duration-200 active:scale-[0.99] cursor-pointer"
            style={{ fontFamily: "'General Sans', sans-serif" }}
          >
            Return to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white text-[#111827] antialiased"
      style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      <div className="max-w-[520px] mx-auto px-4 py-8 sm:py-12">
        {/* ========================================================================= */}
        {/* HEADER: Bottom border #F3F4F6, 20px font-weight 600 title with 24px icon  */}
        {/* on left, and 'Step X of X' in 10px uppercase tracking-wider text #9CA3AF   */}
        {/* ========================================================================= */}
        <header className="border-b border-[#F3F4F6] pb-5 mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToCart}
            className="flex items-center gap-3 text-left group cursor-pointer"
          >
            <div className="w-6 h-6 flex items-center justify-center text-[#111827] group-hover:-translate-x-0.5 transition-transform duration-200">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <h1
              className="text-[20px] font-semibold tracking-tight text-[#111827]"
              style={{ fontFamily: "'General Sans', sans-serif" }}
            >
              Checkout
            </h1>
          </button>

          <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-mono">
            STEP {currentStep} OF 3
          </span>
        </header>

        {/* ========================================================================= */}
        {/* STACKED STEP SECTIONS                                                     */}
        {/* ========================================================================= */}
        <div className="space-y-8">
          {/* ----------------------------------------------------------------------- */}
          {/* STEP 1: SHIPPING ADDRESS                                                */}
          {/* ----------------------------------------------------------------------- */}
          <section
            className={`transition-all duration-200 ${
              currentStep === 1
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-40 grayscale pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* 24x24px Numbered Progress Badge */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors duration-200 ${
                    currentStep >= 1
                      ? 'bg-[#000000] text-[#FFFFFF]'
                      : 'bg-transparent border border-[#D1D5DB] text-[#9CA3AF]'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : '1'}
                </div>
                <h2
                  className="text-[18px] font-medium text-[#111827]"
                  style={{ fontFamily: "'General Sans', sans-serif" }}
                >
                  Shipping Address
                </h2>
              </div>

              {/* Edit trigger if completed */}
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-[#6B7280] hover:text-black underline pointer-events-auto cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {currentStep === 1 ? (
              <form onSubmit={handleShippingSubmit} className="space-y-4 pt-1">
                {/* Email (Full width) */}
                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    placeholder="alex.vane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Name Fields (2-Column Grid, 16px gap) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-firstname"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                    >
                      First Name
                    </label>
                    <input
                      id="checkout-firstname"
                      type="text"
                      required
                      placeholder="Alex"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-lastname"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                    >
                      Last Name
                    </label>
                    <input
                      id="checkout-lastname"
                      type="text"
                      required
                      placeholder="Vane"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Street Address (Full width) */}
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                  >
                    Street Address
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* City & ZIP (2-Column Grid, 16px gap) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                    >
                      City
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      required
                      placeholder="New York"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-zip"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                    >
                      ZIP Code
                    </label>
                    <input
                      id="checkout-zip"
                      type="text"
                      required
                      placeholder="10001"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Step 1 Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-[#000000] text-white text-sm font-medium rounded-[2px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer"
                    style={{ fontFamily: "'General Sans', sans-serif" }}
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] text-xs text-[#6B7280] space-y-0.5">
                <p className="font-medium text-[#111827]">
                  {firstName} {lastName}
                </p>
                <p>{address}</p>
                <p>
                  {city}, {zip}
                </p>
                <p className="text-[11px] text-[#9CA3AF] pt-1 font-mono">{email}</p>
              </div>
            )}
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 2: PAYMENT METHOD                                                  */}
          {/* ----------------------------------------------------------------------- */}
          <section
            className={`transition-all duration-200 ${
              currentStep === 2
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-40 grayscale pointer-events-none'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* 24x24px Numbered Progress Badge */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors duration-200 ${
                    currentStep >= 2
                      ? 'bg-[#000000] text-[#FFFFFF]'
                      : 'bg-transparent border border-[#D1D5DB] text-[#9CA3AF]'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> : '2'}
                </div>
                <h2
                  className="text-[18px] font-medium text-[#111827]"
                  style={{ fontFamily: "'General Sans', sans-serif" }}
                >
                  Payment Method
                </h2>
              </div>

              {/* Edit trigger if completed */}
              {currentStep > 2 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-[#6B7280] hover:text-black underline pointer-events-auto cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {currentStep === 2 ? (
              <form onSubmit={handlePaymentSubmit} className="space-y-4 pt-1">
                {/* Card Number */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="card-number"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium"
                    >
                      Card Number
                    </label>
                    <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px]">ENCRYPTED</span>
                    </div>
                  </div>
                  <input
                    id="card-number"
                    type="text"
                    required
                    placeholder="4242 •••• •••• 4242"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] font-mono focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label
                    htmlFor="card-name"
                    className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                  >
                    Name on Card
                  </label>
                  <input
                    id="card-name"
                    type="text"
                    required
                    placeholder="Alex Vane"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                  />
                </div>

                {/* Expiry & CVV (2-Column Grid, 16px gap) */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="card-exp"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                    >
                      Expiration Date
                    </label>
                    <input
                      id="card-exp"
                      type="text"
                      required
                      placeholder="MM / YY"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] font-mono focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="card-cvv"
                      className="block text-[12px] uppercase tracking-[0.05em] text-[#6B7280] font-medium mb-1.5"
                    >
                      Security Code (CVV)
                    </label>
                    <input
                      id="card-cvv"
                      type="password"
                      maxLength={4}
                      required
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] py-3 px-4 text-sm text-[#111827] font-mono focus:border-[#000000] focus:ring-1 focus:ring-[#000000] focus:outline-none focus:bg-white transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Step 2 Submit Button */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="py-4 px-5 border border-[#E5E7EB] text-[#6B7280] hover:text-black text-sm font-medium rounded-[2px] transition-all duration-200 active:scale-[0.99] cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#000000] text-white text-sm font-medium rounded-[2px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer"
                    style={{ fontFamily: "'General Sans', sans-serif" }}
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : currentStep > 2 ? (
              <div className="p-3.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[2px] text-xs text-[#6B7280] flex items-center justify-between">
                <div>
                  <p className="font-medium text-[#111827]">{cardName || 'Cardholder'}</p>
                  <p className="font-mono text-[11px]">
                    Ending in {cardNumber.slice(-4) || '••••'}
                  </p>
                </div>
                <CreditCard className="w-4 h-4 text-[#9CA3AF]" />
              </div>
            ) : null}
          </section>

          {/* ----------------------------------------------------------------------- */}
          {/* STEP 3: REVIEW & ORDER                                                  */}
          {/* ----------------------------------------------------------------------- */}
          <section
            className={`transition-all duration-200 ${
              currentStep === 3
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-40 grayscale pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {/* 24x24px Numbered Progress Badge */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 transition-colors duration-200 ${
                  currentStep === 3
                    ? 'bg-[#000000] text-[#FFFFFF]'
                    : 'bg-transparent border border-[#D1D5DB] text-[#9CA3AF]'
                }`}
              >
                3
              </div>
              <h2
                className="text-[18px] font-medium text-[#111827]"
                style={{ fontFamily: "'General Sans', sans-serif" }}
              >
                Review & Confirm
              </h2>
            </div>

            {currentStep === 3 && (
              <div className="space-y-6 pt-1">
                {/* ================================================================= */}
                {/* COLLAPSIBLE ORDER SUMMARY: A 'details' element styling with       */}
                {/* top/bottom border #F3F4F6, 14px font, chevron rotating 180 deg   */}
                {/* ================================================================= */}
                <details
                  open={isSummaryOpen}
                  onToggle={(e) => setIsSummaryOpen((e.target as HTMLDetailsElement).open)}
                  className="border-t border-b border-[#F3F4F6] py-3 group"
                >
                  <summary className="flex items-center justify-between text-sm font-medium text-[#111827] cursor-pointer select-none list-none">
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#6B7280]" />
                      <span>Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-black">${total.toFixed(2)}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#6B7280] transition-transform duration-200 ${
                          isSummaryOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </summary>

                  {/* Expanded Summary Content */}
                  <div className="pt-4 pb-2 space-y-4">
                    {/* Line Items */}
                    <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3.5">
                          {/* 64x64px Product Thumbnail with #F3F4F6 bg */}
                          <div className="w-16 h-16 bg-[#F3F4F6] border border-[#E5E7EB] rounded-[2px] shrink-0 overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover object-center"
                            />
                          </div>

                          {/* Titles in 14px medium, sub-details in 12px gray */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-[#111827] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#6B7280] mt-0.5">
                              {item.color} • Size {item.size} • Qty {item.quantity}
                            </p>
                          </div>

                          <div className="text-sm font-medium text-[#111827] shrink-0">
                            ${(item.priceNum * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Breakdown */}
                    <div className="border-t border-[#F3F4F6] pt-3 space-y-1.5 text-xs text-[#6B7280]">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-[#111827] font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-[#111827] font-medium">
                          {shipping === 0 ? 'Complimentary' : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Taxes</span>
                        <span className="text-[#111827] font-medium">${taxes.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </details>

                {/* ================================================================= */}
                {/* FOOTER CTA: Full-width button #000000, white text, 16px padding, */}
                {/* arrow icon, active:scale-[0.99]. Lock icon & 'Secured' #9CA3AF    */}
                {/* ================================================================= */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleFinalOrder}
                    disabled={isProcessing}
                    className={`w-full py-4 bg-[#000000] text-white text-sm font-medium rounded-[2px] flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] cursor-pointer hover:bg-neutral-900 ${
                      isProcessing ? 'opacity-70 cursor-wait' : ''
                    }`}
                    style={{ fontFamily: "'General Sans', sans-serif" }}
                  >
                    {isProcessing ? (
                      <span className="font-mono text-xs uppercase tracking-wider">
                        Processing Order...
                      </span>
                    ) : (
                      <>
                        <span>Complete Order • ${total.toFixed(2)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Below the button: small 10px lock icon and 'Secured' text centered in #9CA3AF */}
                  <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider text-[#9CA3AF]">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Secured</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
