'use client';

import React, { useState } from 'react';
import { useHRStore, TrainingCourse } from '@/store/useHRStore';
import {
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Printer,
  Sparkles,
  Users,
  PlayCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  X
} from 'lucide-react';

export default function TrainingDevelopment() {
  const { theme, courses, enrollInCourse, updateCourseProgress, employees } = useHRStore();
  const isLight = theme === 'light';

  const [selectedCourse, setSelectedCourse] = useState<TrainingCourse | null>(null);
  const [viewCertificateModal, setViewCertificateModal] = useState<{ course: TrainingCourse; certId: string; empName: string; date: string } | null>(null);

  const activeEmployee = employees[1] || employees[0]; // Aarav Sharma or Rajesh

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId, activeEmployee.id);
    alert(`Enrolled ${activeEmployee.name} in course successfully!`);
  };

  const handleCompleteProgress = (courseId: string) => {
    updateCourseProgress(courseId, activeEmployee.id, 100);
    alert('Congratulations! Course completed and digital certificate generated!');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black tracking-tight">Training, Upskilling & Certifications</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              SrijanDev Academy
            </span>
          </div>
          <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Catalog of internal architecture courses, ISO compliance training, skill radar, and digital badges.
          </p>
        </div>

        <div className={`p-2.5 px-4 rounded-2xl border flex items-center gap-3 ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-white/10'
        }`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
            {activeEmployee.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs font-bold">{activeEmployee.name}</p>
            <p className="text-[10px] text-amber-500 font-semibold">2 Certified Badges Earned</p>
          </div>
        </div>
      </div>

      {/* Course Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => {
          const userEnrollment = course.enrolledEmployees.find((e) => e.employeeId === activeEmployee.id);
          const isEnrolled = !!userEnrollment;
          const isCompleted = userEnrollment?.isCompleted;

          return (
            <div
              key={course.id}
              className={`rounded-3xl border overflow-hidden transition-all flex flex-col justify-between group ${
                isLight ? 'bg-white border-slate-200 shadow-sm hover:shadow-xl' : 'bg-slate-900/80 border-white/10 hover:border-amber-500/30 shadow-lg'
              }`}
            >
              <div>
                {/* Banner Thumbnail */}
                <div className={`h-28 bg-gradient-to-r ${course.thumbnailGradient} p-4 flex flex-col justify-between relative`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-white backdrop-blur-md">
                      {course.category}
                    </span>
                    <span className="text-[10px] font-bold text-white/90 bg-black/30 px-2 py-0.5 rounded-md">
                      {course.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                    <PlayCircle size={16} />
                    <span>{course.modulesCount} Modules</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold leading-snug group-hover:text-amber-500 transition-colors">
                    {course.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {course.description}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.skillsGained.map((skill) => (
                      <span
                        key={skill}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                          isLight ? 'bg-slate-100 text-slate-700' : 'bg-white/5 text-slate-300'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Footer Actions */}
              <div className={`p-5 pt-3 border-t ${isLight ? 'border-slate-100 bg-slate-50/50' : 'border-white/5 bg-slate-950/40'}`}>
                {isCompleted ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                    <button
                      onClick={() =>
                        setViewCertificateModal({
                          course,
                          certId: userEnrollment.certificateId || 'CERT-SRJ-9921',
                          empName: activeEmployee.name,
                          date: userEnrollment.completedAt || '2026-05-12',
                        })
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 shadow-md hover:opacity-90"
                    >
                      View Certificate 🏆
                    </button>
                  </div>
                ) : isEnrolled ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-bold text-amber-500">{userEnrollment.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${userEnrollment.progress}%` }} />
                    </div>
                    <button
                      onClick={() => handleCompleteProgress(course.id)}
                      className="w-full py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Mark 100% & Issue Certificate
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(course.id)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700"
                  >
                    Enroll Now ({course.enrolledCount} Active)
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Digital Certificate Modal */}
      {viewCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-8 transition-all relative ${
              isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-950 border-white/15 text-white'
            }`}
          >
            <button
              onClick={() => setViewCertificateModal(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {/* Certificate Frame with Gold / Indigo Border Accent */}
            <div className="border-4 border-double border-amber-500/50 rounded-2xl p-8 text-center space-y-4 relative overflow-hidden bg-gradient-to-b from-amber-500/5 to-indigo-600/5">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-xl">
                  <Award size={28} />
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">
                  SRIJANDEV ACADEMY OF ADVANCED DIGITAL ENGINEERING
                </p>
                <h2 className="text-2xl font-black mt-1">CERTIFICATE OF EXCELLENCE</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {viewCertificateModal.certId}</p>
              </div>

              <p className="text-xs text-slate-400 italic">This is proudly presented to</p>

              <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600">
                {viewCertificateModal.empName}
              </h3>

              <p className="text-xs max-w-md mx-auto leading-relaxed text-slate-300">
                For successful mastery and completion of the advanced curriculum in{' '}
                <strong>{viewCertificateModal.course.title}</strong> covering {viewCertificateModal.course.skillsGained.join(', ')}.
              </p>

              <div className="pt-6 mt-6 border-t border-inherit flex items-center justify-between text-xs text-slate-400 px-6">
                <div className="text-left">
                  <p className="font-bold text-white">Rajesh Bhatti</p>
                  <p className="text-[10px]">Chief Technology Officer</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white">{viewCertificateModal.date}</p>
                  <p className="text-[10px]">Date of Certification</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-indigo-600 hover:opacity-90 shadow-md"
              >
                <Printer size={14} /> Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
