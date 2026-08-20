import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { StorageService } from '../services/storageService';
import confetti from 'canvas-confetti';
import {
  Sparkles, Search, Star, ShieldCheck, CheckCircle2,
  Calendar, Send, MessageSquare, ArrowRight, ExternalLink,
  CreditCard, QrCode, Smartphone, Building2, Coins,
  Clock, Shield, Check, X, Award, Video, UserCheck, Lock,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import { MentorProfile, MentorshipRequest } from '../types';

export const MentorshipPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useNotification();

  const [activeTab, setActiveTab] = useState<'browse' | 'my_bookings'>('browse');
  const [mentors] = useState<MentorProfile[]>(StorageService.getMentors());
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking & Payment Flow State
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [bookingStep, setBookingStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');

  // Step 1 Details
  const [topic, setTopic] = useState('DSA & Off-Campus Roadmap');
  const [preferredSlot, setPreferredSlot] = useState('Tomorrow, 6:00 PM - 6:45 PM');
  const [studentMessage, setStudentMessage] = useState('');

  // Step 2 Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'POINTS'>('UPI');
  const [upiId, setUpiId] = useState('student@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('742');
  const [selectedBank, setSelectedBank] = useState('State Bank of India (SBI)');
  const [useRemarksPoints, setUseRemarksPoints] = useState(false);

  // Completed Booking Details
  const [completedBooking, setCompletedBooking] = useState<MentorshipRequest | null>(null);

  const [myBookings, setMyBookings] = useState<MentorshipRequest[]>(() =>
    currentUser ? StorageService.getMyBookedSessions(currentUser.id) : []
  );

  const filteredMentors = mentors.filter(m => {
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.companyOrExam && m.companyOrExam.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomain =
      selectedDomain === 'all' ||
      m.domain.toLowerCase().includes(selectedDomain.toLowerCase());

    return matchesSearch && matchesDomain;
  });

  const openBookingModal = (mentor: MentorProfile) => {
    setSelectedMentor(mentor);
    setBookingStep('details');
    setStudentMessage('');
    setUseRemarksPoints(false);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentMessage.trim()) {
      showToast('Please add what specific questions you want help with.', 'info');
      return;
    }
    setBookingStep('payment');
  };

  const handleExecutePayment = () => {
    if (!currentUser || !selectedMentor) return;

    setBookingStep('processing');

    setTimeout(() => {
      const discount = useRemarksPoints ? 50 : 0;
      const finalAmount = Math.max(0, selectedMentor.hourlyRate - discount);
      const bookingId = `BEU-SES-${Date.now().toString().slice(-6)}`;
      const txnId = `TXN-${paymentMethod}-${Date.now().toString().slice(-8)}`;

      const newBooking: MentorshipRequest = {
        id: bookingId,
        mentorId: selectedMentor.userId,
        mentorName: selectedMentor.name,
        mentorAvatar: selectedMentor.avatar,
        mentorCollege: selectedMentor.college,
        studentId: currentUser.id,
        studentName: currentUser.name,
        studentCollege: currentUser.college,
        topic,
        message: studentMessage,
        status: 'accepted',
        amountPaid: finalAmount,
        paymentMethod,
        paymentStatus: 'PAID',
        transactionId: txnId,
        scheduledDate: preferredSlot.split(',')[0],
        scheduledTime: preferredSlot.split(',')[1]?.trim() || '6:00 PM',
        meetLink: `https://meet.google.com/beu-${Math.random().toString(36).substring(7)}`,
        createdAt: 'Just now'
      };

      StorageService.requestMentorship(newBooking);
      setCompletedBooking(newBooking);
      setMyBookings(StorageService.getMyBookedSessions(currentUser.id));
      setBookingStep('success');

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}

      showToast(`Mentorship Session Confirmed with ${selectedMentor.name}!`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-navy-900 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Senior-Junior Guidance & Career Acceleration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Find a Senior Mentor (1-on-1 Guidance)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Connect 1-on-1 with verified 4th-year seniors and BEU alumni placed at top tech companies, cracking GATE AIR top ranks, and government PSUs. Book personalized 45-minute live sessions with secure student payment.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'browse'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Browse Mentors
          </button>
          <button
            onClick={() => setActiveTab('my_bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeTab === 'my_bookings'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>My Bookings</span>
            {myBookings.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {myBookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Domain Filters & Search */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              {[
                { id: 'all', label: 'All Mentors' },
                { id: 'Software', label: '💻 Software & Web Dev' },
                { id: 'AI', label: '🤖 AI / ML & Research' },
                { id: 'GATE', label: '🎯 GATE & Electronics' },
                { id: 'Mechanical', label: '⚙️ Core Mechanical' },
                { id: 'Civil', label: '🏗️ Civil & Govt AE' }
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDomain(d.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedDomain === d.id
                      ? 'bg-navy-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mentor by company, college, skills..."
                className="w-full pl-10 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
              />
            </div>
          </div>

          {/* Mentor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map(mentor => (
              <div
                key={mentor.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={mentor.avatar}
                          alt={mentor.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xs"
                        />
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="text-base font-bold text-slate-900">{mentor.name}</h3>
                          {mentor.isVerified && (
                            <span title="Verified BEU Senior Mentor">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">{mentor.college}</p>
                        <p className="text-[11px] text-emerald-700 font-bold">{mentor.year} • {mentor.branch}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl">
                      <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                      <span>{mentor.rating} ({mentor.reviewsCount})</span>
                    </div>
                  </div>

                  {/* Company / Exam Badge */}
                  {mentor.companyOrExam && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-900 text-xs font-bold">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{mentor.companyOrExam}</span>
                    </div>
                  )}

                  {/* Bio */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {mentor.bio}
                  </p>

                  {/* Skills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Mentoring Topics:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.skills.map(sk => (
                        <span
                          key={sk}
                          className="text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-lg transition-colors"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Pricing & Booking Footer */}
                <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-slate-900">₹{mentor.hourlyRate}</span>
                      <span className="text-[11px] text-slate-500 font-medium">/ 45-min Call</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      🟢 {mentor.availableSlots} slots left this week
                    </span>
                  </div>

                  <button
                    onClick={() => openBookingModal(mentor)}
                    className="px-4 py-2.5 bg-navy-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-102"
                  >
                    <span>Book Session</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* MY BOOKINGS TAB */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">My Scheduled 1-on-1 Mentorship Sessions</h3>

          {myBookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No active bookings yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Browse our senior mentors and book a 1-on-1 video session for DSA roadmap, resume review, or GATE strategy!
              </p>
              <button
                onClick={() => setActiveTab('browse')}
                className="px-4 py-2 bg-navy-900 text-white text-xs font-bold rounded-xl mt-2 inline-flex items-center gap-2"
              >
                Browse Senior Mentors
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBookings.map(b => (
                <div
                  key={b.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {b.status.toUpperCase()} • PAID (₹{b.amountPaid})
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {b.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {b.mentorAvatar && (
                        <img
                          src={b.mentorAvatar}
                          alt={b.mentorName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                        />
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Session with {b.mentorName || 'Senior Mentor'}
                        </h4>
                        <p className="text-xs text-slate-500">{b.mentorCollege}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <p className="font-bold text-slate-800">Topic: {b.topic}</p>
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Scheduled: <strong>{b.scheduledDate} ({b.scheduledTime})</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">TXN: {b.transactionId}</span>

                    {b.meetLink && (
                      <a
                        href={b.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Call</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKING & PAYMENT MODAL */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Modal Top Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="w-10 h-10 rounded-xl object-cover border border-emerald-400"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Book 1-on-1 with {selectedMentor.name}
                    </h3>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300">
                    {selectedMentor.college} • Rate: <strong className="text-emerald-400">₹{selectedMentor.hourlyRate}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMentor(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: SESSION DETAILS FORM */}
            {bookingStep === 'details' && (
              <form onSubmit={handleProceedToPayment} className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Guidance Topic *</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    <option value="DSA & Off-Campus Roadmap">DSA & Off-Campus Placement Strategy</option>
                    <option value="Resume & Project Architecture Review">Resume & Project Architecture Review</option>
                    <option value="GATE Preparation Strategy">GATE Preparation & Subject Priority</option>
                    <option value="BEU End-Sem Scoring Strategy">BEU End-Sem 14-Mark Question Strategy</option>
                    <option value="Core Engineering Campus Prep">Core Engineering Technical Interviews</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Preferred Time Slot *</label>
                  <select
                    value={preferredSlot}
                    onChange={(e) => setPreferredSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 bg-white font-medium"
                  >
                    <option value="Tomorrow, 6:00 PM - 6:45 PM">Tomorrow, 6:00 PM - 6:45 PM</option>
                    <option value="Tomorrow, 8:00 PM - 8:45 PM">Tomorrow, 8:00 PM - 8:45 PM</option>
                    <option value="Saturday, 11:00 AM - 11:45 AM">Saturday, 11:00 AM - 11:45 AM</option>
                    <option value="Sunday, 4:00 PM - 4:45 PM">Sunday, 4:00 PM - 4:45 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">
                    Your Questions & Doubts for {selectedMentor.name.split(' ')[0]} *
                  </label>
                  <textarea
                    rows={4}
                    value={studentMessage}
                    onChange={(e) => setStudentMessage(e.target.value)}
                    required
                    placeholder="e.g. I am in 3rd Sem CSE and want advice on balancing BEU syllabus with LeetCode. Also need a review of my portfolio..."
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy-900 resize-none font-medium"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold">BEU Student Protection Guarantee</p>
                      <p className="text-[11px] text-emerald-800">100% refund if session is not conducted or rescheduled.</p>
                    </div>
                  </div>
                  <span className="font-black text-sm">₹{selectedMentor.hourlyRate}</span>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="flex-1 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-navy-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Payment (₹{selectedMentor.hourlyRate})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT GATEWAY SELECTION */}
            {bookingStep === 'payment' && (
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto text-xs">
                {/* Back to details button */}
                <button
                  type="button"
                  onClick={() => setBookingStep('details')}
                  className="flex items-center gap-1 text-slate-500 hover:text-navy-900 font-bold text-[11px]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to session details
                </button>

                {/* Payment Methods Grid */}
                <div>
                  <label className="block font-bold text-slate-800 mb-2">Select Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'UPI', label: 'UPI / QR', icon: QrCode, sub: 'GPay, PhonePe, Paytm' },
                      { id: 'CARD', label: 'Cards', icon: CreditCard, sub: 'Debit & Credit' },
                      { id: 'NET_BANKING', label: 'Net Banking', icon: Building2, sub: 'SBI, HDFC, ICICI' }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const isSelected = paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPaymentMethod(pm.id as any)}
                          className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 font-bold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                          <span className="text-xs leading-none mt-1">{pm.label}</span>
                          <span className="text-[10px] text-slate-400">{pm.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Payment Input Details */}
                {paymentMethod === 'UPI' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Enter UPI ID or VPA</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-medium text-xs focus:ring-2 focus:ring-navy-900"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supports Google Pay, PhonePe, Paytm, BHIM, and all UPI apps</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'CARD' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div>
                      <label className="block font-bold text-slate-800 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 0000 0000 0000"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs focus:ring-2 focus:ring-navy-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">Valid Thru</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NET_BANKING' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-800 mb-1">Select Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs font-medium"
                    >
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="Punjab National Bank (PNB)">Punjab National Bank (PNB)</option>
                      <option value="Canara Bank">Canara Bank</option>
                    </select>
                  </div>
                )}

                {/* Remarks Points Discount toggle */}
                <div
                  onClick={() => setUseRemarksPoints(!useRemarksPoints)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    useRemarksPoints
                      ? 'bg-amber-50 border-amber-300 text-amber-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="font-bold text-xs">Redeem 100 BEU Remarks Points</p>
                      <p className="text-[11px] text-slate-500">Get instant ₹50 discount using your contribution points</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={useRemarksPoints}
                    onChange={() => {}}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* Bill Summary */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex justify-between text-slate-300 text-xs">
                    <span>1-on-1 Session (45 Mins):</span>
                    <span className="font-bold text-white">₹{selectedMentor.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-xs">
                    <span>Student Welfare / Platform Fee:</span>
                    <span className="text-emerald-400 font-bold">₹0 (Free)</span>
                  </div>
                  {useRemarksPoints && (
                    <div className="flex justify-between text-amber-300 text-xs">
                      <span>Remarks Points Discount:</span>
                      <span className="font-bold">-₹50</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-black">
                    <span>Total Amount Payable:</span>
                    <span className="text-emerald-400 text-base">
                      ₹{Math.max(0, selectedMentor.hourlyRate - (useRemarksPoints ? 50 : 0))}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted & RBI Compliant Payment Gateway</span>
                </div>

                <button
                  type="button"
                  onClick={handleExecutePayment}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:scale-101"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    Pay ₹{Math.max(0, selectedMentor.hourlyRate - (useRemarksPoints ? 50 : 0))} & Confirm Booking
                  </span>
                </button>
              </div>
            )}

            {/* STEP 3: PROCESSING STATE */}
            {bookingStep === 'processing' && (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
                <h4 className="text-base font-bold text-slate-900">Connecting to Payment Gateway...</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Authorizing transaction via {paymentMethod} and locking {preferredSlot} slot with {selectedMentor.name}.
                </p>
              </div>
            )}

            {/* STEP 4: SUCCESS CONFIRMATION RECEIPT */}
            {bookingStep === 'success' && completedBooking && (
              <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    PAYMENT SUCCESSFUL • BOOKING CONFIRMED
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-2">
                    Session Booked with {completedBooking.mentorName}!
                  </h3>
                  <p className="text-xs text-slate-500">
                    A confirmation email & calendar invite has been sent to your registered account.
                  </p>
                </div>

                {/* Receipt Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-sans">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 font-medium">Booking ID:</span>
                    <span className="font-mono font-bold text-slate-900">{completedBooking.id}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 font-medium">Transaction ID:</span>
                    <span className="font-mono font-bold text-slate-900">{completedBooking.transactionId}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 font-medium">Scheduled Time:</span>
                    <span className="font-bold text-slate-900">{completedBooking.scheduledDate} ({completedBooking.scheduledTime})</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500 font-medium">Amount Paid:</span>
                    <span className="font-bold text-emerald-700">₹{completedBooking.amountPaid} via {completedBooking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-500 font-medium">Meeting Room:</span>
                    <a
                      href={completedBooking.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <span>Join Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedMentor(null);
                      setActiveTab('my_bookings');
                    }}
                    className="flex-1 py-3 bg-navy-900 hover:bg-slate-800 text-white font-extrabold rounded-xl shadow-md text-xs"
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={() => setSelectedMentor(null)}
                    className="flex-1 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
