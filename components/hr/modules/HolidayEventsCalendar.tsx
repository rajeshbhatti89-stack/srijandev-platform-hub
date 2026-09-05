'use client';

import React, { useState } from 'react';
import { useHRStore, HolidayEvent } from '@/store/useHRStore';
import {
  CalendarDays,
  Calendar,
  Gift,
  Award,
  Sparkles,
  Download,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function HolidayEventsCalendar() {
  const { theme, holidays, addHoliday, deleteHoliday } = useHRStore();
  const isLight = theme === 'light';

  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Oct (0-indexed 9)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventType, setEventType] = useState<any>('Public Holiday');
  const [eventDesc, setEventDesc] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;
    const newEvent: HolidayEvent = {
      id: `EVT-${Date.now()}`,
      title: eventTitle,
      date: eventDate,
      type: eventType,
      description: eventDesc,
    };
    addHoliday(newEvent);
    setIsAddModalOpen(false);
    setEventTitle('');
    setEventDesc('');
  };

  const downloadICal = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SrijanDev Technologies//HR Calendar//EN\n";
    holidays.forEach((h) => {
      const dateFormatted = h.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${h.title}\nDESCRIPTION:${h.description || h.type}\nDTSTART;VALUE=DATE:${dateFormatted}\nDTEND;VALUE=DATE:${dateFormatted}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'srijandev_corporate_calendar_2026.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Corporate Calendar & Company Events</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
              FY 2026-27 Schedule
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Gazetted public holidays, hackathons, all-hands meets, birthdays & work anniversaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadICal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              isLight ? 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700' : 'bg-slate-900 border-white/10 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Download size={14} />
            <span>Export to iCal</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md transition-all active:scale-95"
          >
            <Plus size={15} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Month Navigator Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {months.map((m, idx) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMonth === idx
                ? 'bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md'
                : isLight
                ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                : 'bg-slate-900/60 text-slate-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {holidays.map((event) => {
          const isBirthday = event.type === 'Birthday';
          const isAnniversary = event.type === 'Work Anniversary';
          const isHackathon = event.type === 'Hackathon';
          return (
            <div
              key={event.id}
              className={`p-5 rounded-2xl border transition-all hover:scale-[1.01] relative overflow-hidden group ${
                isHackathon
                  ? 'bg-gradient-to-br from-amber-500/20 via-orange-500/15 to-indigo-900/40 border-amber-500/40'
                  : isLight
                  ? 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                  : 'bg-slate-900/80 border-white/10 hover:border-amber-500/30 shadow-md'
              }`}
            >
              {/* Type Badge */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isBirthday
                      ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                      : isAnniversary
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : isHackathon
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {isBirthday && '🎂 '}
                  {isAnniversary && '🏆 '}
                  {isHackathon && '⚡ '}
                  {event.type}
                </span>

                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  {event.date}
                </span>
              </div>

              <h3 className="text-sm font-bold group-hover:text-amber-500 transition-colors">
                {event.title}
              </h3>

              {event.description && (
                <p className={`text-xs mt-1.5 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {event.description}
                </p>
              )}

              {event.employeeName && (
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Honoring: <strong className="text-amber-400">{event.employeeName}</strong></span>
                  <span>{event.department}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0b0f19] border-white/10 text-white'
            }`}
          >
            <div className={`p-5 border-b flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-white/10'}`}>
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarDays size={16} className="text-amber-500" />
                Add Corporate Event
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="p-6 space-y-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Celebration & Office Pooja"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Category</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className={`w-full text-xs p-2 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                  >
                    <option value="Public Holiday">Public Holiday</option>
                    <option value="Company Event">Company Event</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Work Anniversary">Work Anniversary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Event details..."
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  className={`w-full text-xs p-2.5 rounded-xl border outline-none ${isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-white/15'}`}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-300 dark:border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-lg"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
