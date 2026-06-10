import React, { useState, useEffect, useRef } from 'react';
import { 
  Cat, 
  Flame, 
  ChefHat, 
  Plus, 
  Minus, 
  Check, 
  X, 
  Play, 
  Pause, 
  Calendar, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles, 
  Clock 
} from 'lucide-react';

const STEPS = [
  {
    id: 1,
    name: "הכנת הבצק ומנוחה (אוטוליזה)",
    duration: 45 * 60, // 45 minutes in seconds
    description: "מערבבים את הקמח, המים, המחמצת והמלח עד לקבלת בצק אחיד. מכסים בניילון נצמד ומניחים לבצק לנוח.",
    hasIngredients: true,
    hasCheckbox: true,
    checkboxText: "ערבבתי את כל החומרים לבצק אחיד",
  },
  {
    id: 2,
    name: "קיפול 1",
    duration: 45 * 60,
    description: "מבצעים קיפול עדין של הבצק מארבעת הצדדים (מרימים קצה אחד, מותחים למעלה ומקפלים למרכז, ומסובבים את הקערה).",
  },
  {
    id: 3,
    name: "קיפול 2",
    duration: 45 * 60,
    description: "מבצעים קיפול שני ללא מתיחה. תרגישו שהבצק מתחיל לקבל גוף, אלסטיות והתנגדות.",
  },
  {
    id: 4,
    name: "קיפול 3",
    duration: 45 * 60,
    description: "מבצעים קיפול שלישי. הבצק הופך לחלק, מתוח ויציב יותר.",
  },
  {
    id: 5,
    name: "קיפול 4 ותפיחה בטמפרטורת חדר",
    duration: 240 * 60, // 4 hours in seconds
    description: "מבצעים קיפול אחרון ועדין במיוחד. לאחר מכן משאירים את הבצק להתפחה ארוכה בטמפרטורת החדר בקערה מכוסה, עד שהוא תופח בכ-30-50% ומפתח בועות עדינות.",
  },
  {
    id: 6,
    name: "עיצוב ותפיחה במקרר (התפחה קרה)",
    duration: 420 * 60, // 7 hours in seconds
    description: "מוציאים את הבצק למשטח עבודה. בשלב זה מעצבים אותו לכיכר עגולה או אובלית. זהו הזמן להוסיף תוספות (זיתים, אגוזים, שוקולד וכו') על ידי פתיחת הבצק ופיזורן לפני הגלגול. מעבירים לסלסילת התפחה מקומחת ומכניסים למקרר ל-7 שעות לפחות.",
  },
  {
    id: 7,
    name: "אפייה עם מכסה",
    duration: 45 * 60,
    description: "מחממים מראש תנור ל-250 מעלות עם סיר יצוק בפנים. חורצים את כיכר הלחם הקרה, מעבירים בזהירות לסיר, סוגרים את המכסה ואופים כדי לכלוא את האדים.",
  },
  {
    id: 8,
    name: "אפייה ללא מכסה",
    duration: 10 * 60,
    description: "מסירים בזהירות את מכסה הסיר ומנמיכים את החום ל-220 מעלות. ממשיכים לאפות כדי לאפשר לקרום להפוך לשחום, עמוק ופריך.",
  },
  {
    id: 9,
    name: "הלחם מוכן! 🥖🎉",
    duration: 0,
    description: "מחלצים את הלחם מהסיר ומניחים לו להצטנן לחלוטין על רשת לפחות שעה לפני הפריסה הראשונה. חיתוך לחם חם יהרוס את המרקם הפנימי!",
    isFinal: true
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('sourdough_activeTab') || 'starter');

  // Tab 1 (Starter) State
  const [lastFeeding, setLastFeeding] = useState(() => localStorage.getItem('sourdough_lastFeeding') || '');
  const [starterWeight, setStarterWeight] = useState(() => {
    const saved = localStorage.getItem('sourdough_starterWeight');
    return saved ? parseInt(saved, 10) : 50;
  });
  const [fedFlour, setFedFlour] = useState(() => localStorage.getItem('sourdough_fedFlour') === 'true');
  const [fedWater, setFedWater] = useState(() => localStorage.getItem('sourdough_fedWater') === 'true');
  const [showSuccessFeed, setShowSuccessFeed] = useState(false);

  // Tab 2 (Prep) State
  const [loaves, setLoaves] = useState(() => {
    const saved = localStorage.getItem('sourdough_loaves');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [prepFlourChecked, setPrepFlourChecked] = useState(() => localStorage.getItem('sourdough_prepFlourChecked') === 'true');
  const [prepWaterChecked, setPrepWaterChecked] = useState(() => localStorage.getItem('sourdough_prepWaterChecked') === 'true');
  
  // Tab 2 Timer State
  const [prepTimerActive, setPrepTimerActive] = useState(() => localStorage.getItem('sourdough_prepTimerActive') === 'true');
  const [prepTimerPaused, setPrepTimerPaused] = useState(() => localStorage.getItem('sourdough_prepTimerPaused') === 'true');
  const [prepTimerRemaining, setPrepTimerRemaining] = useState(() => {
    const saved = localStorage.getItem('sourdough_prepTimerRemaining');
    return saved ? parseInt(saved, 10) : 7 * 60 * 60 * 1000;
  });
  const [prepTimerEndTime, setPrepTimerEndTime] = useState(() => {
    const saved = localStorage.getItem('sourdough_prepTimerEndTime');
    return saved ? parseInt(saved, 10) : null;
  });

  // Tab 3 (Baking) State
  const [bakeStep, setBakeStep] = useState(() => {
    const saved = localStorage.getItem('sourdough_bakeStep');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bakeStep1Checked, setBakeStep1Checked] = useState(() => localStorage.getItem('sourdough_bakeStep1Checked') === 'true');
  
  // Tab 3 Timer State
  const [bakeTimerActive, setBakeTimerActive] = useState(() => localStorage.getItem('sourdough_bakeTimerActive') === 'true');
  const [bakeTimerPaused, setBakeTimerPaused] = useState(() => localStorage.getItem('sourdough_bakeTimerPaused') === 'true');
  const [bakeTimerRemaining, setBakeTimerRemaining] = useState(() => {
    const saved = localStorage.getItem('sourdough_bakeTimerRemaining');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [bakeTimerEndTime, setBakeTimerEndTime] = useState(() => {
    const saved = localStorage.getItem('sourdough_bakeTimerEndTime');
    return saved ? parseInt(saved, 10) : null;
  });
  const [bakeTimerIsFinished, setBakeTimerIsFinished] = useState(() => localStorage.getItem('sourdough_bakeTimerIsFinished') === 'true');

  // Custom Confirmation Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
    onConfirm: null
  });

  // Reconcile and start active timers on initial load
  useEffect(() => {
    const now = Date.now();
    
    // Tab 2 Timer Recovery
    if (prepTimerActive && !prepTimerPaused && prepTimerEndTime) {
      const remaining = Math.max(0, prepTimerEndTime - now);
      if (remaining === 0) {
        setPrepTimerActive(false);
        setPrepTimerEndTime(null);
        setPrepTimerRemaining(0);
      } else {
        setPrepTimerRemaining(remaining);
      }
    }

    // Tab 3 Timer Recovery
    if (bakeTimerActive && !bakeTimerPaused && bakeTimerEndTime) {
      const remaining = Math.max(0, bakeTimerEndTime - now);
      if (remaining === 0) {
        setBakeTimerActive(false);
        setBakeTimerEndTime(null);
        setBakeTimerRemaining(0);
        setBakeTimerIsFinished(true);
      } else {
        setBakeTimerRemaining(remaining);
      }
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem('sourdough_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('sourdough_lastFeeding', lastFeeding);
    localStorage.setItem('sourdough_starterWeight', starterWeight.toString());
    localStorage.setItem('sourdough_fedFlour', fedFlour.toString());
    localStorage.setItem('sourdough_fedWater', fedWater.toString());
  }, [lastFeeding, starterWeight, fedFlour, fedWater]);

  useEffect(() => {
    localStorage.setItem('sourdough_loaves', loaves.toString());
    localStorage.setItem('sourdough_prepFlourChecked', prepFlourChecked.toString());
    localStorage.setItem('sourdough_prepWaterChecked', prepWaterChecked.toString());
    localStorage.setItem('sourdough_prepTimerActive', prepTimerActive.toString());
    localStorage.setItem('sourdough_prepTimerPaused', prepTimerPaused.toString());
    localStorage.setItem('sourdough_prepTimerRemaining', prepTimerRemaining.toString());
    if (prepTimerEndTime) {
      localStorage.setItem('sourdough_prepTimerEndTime', prepTimerEndTime.toString());
    } else {
      localStorage.removeItem('sourdough_prepTimerEndTime');
    }
  }, [loaves, prepFlourChecked, prepWaterChecked, prepTimerActive, prepTimerPaused, prepTimerRemaining, prepTimerEndTime]);

  useEffect(() => {
    localStorage.setItem('sourdough_bakeStep', bakeStep.toString());
    localStorage.setItem('sourdough_bakeStep1Checked', bakeStep1Checked.toString());
    localStorage.setItem('sourdough_bakeTimerActive', bakeTimerActive.toString());
    localStorage.setItem('sourdough_bakeTimerPaused', bakeTimerPaused.toString());
    localStorage.setItem('sourdough_bakeTimerRemaining', bakeTimerRemaining.toString());
    localStorage.setItem('sourdough_bakeTimerIsFinished', bakeTimerIsFinished.toString());
    if (bakeTimerEndTime) {
      localStorage.setItem('sourdough_bakeTimerEndTime', bakeTimerEndTime.toString());
    } else {
      localStorage.removeItem('sourdough_bakeTimerEndTime');
    }
  }, [bakeStep, bakeStep1Checked, bakeTimerActive, bakeTimerPaused, bakeTimerRemaining, bakeTimerEndTime, bakeTimerIsFinished]);

  // Timers countdown Interval Effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = Date.now();

      // Tab 2 Prep Timer decrement
      if (prepTimerActive && !prepTimerPaused && prepTimerEndTime) {
        const remaining = Math.max(0, prepTimerEndTime - now);
        setPrepTimerRemaining(remaining);
        if (remaining === 0) {
          setPrepTimerActive(false);
          setPrepTimerEndTime(null);
          // Play a gentle beep or vibration if API allows
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        }
      }

      // Tab 3 Bake Timer decrement
      if (bakeTimerActive && !bakeTimerPaused && bakeTimerEndTime) {
        const remaining = Math.max(0, bakeTimerEndTime - now);
        setBakeTimerRemaining(remaining);
        if (remaining === 0) {
          setBakeTimerActive(false);
          setBakeTimerEndTime(null);
          setBakeTimerIsFinished(true);
          if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 300]);
        }
      }
    }, 250);

    return () => clearInterval(timerInterval);
  }, [prepTimerActive, prepTimerPaused, prepTimerEndTime, bakeTimerActive, bakeTimerPaused, bakeTimerEndTime]);

  // Helper formatting functions
  const formatDateHebrew = (dateString) => {
    if (!dateString) return 'טרם תועדה האכלה';
    const d = new Date(dateString);
    return d.toLocaleDateString('he-IL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNextFeedingDate = (lastFedStr) => {
    if (!lastFedStr) return null;
    const d = new Date(lastFedStr);
    return new Date(d.getTime() + 14 * 24 * 60 * 60 * 1000);
  };

  const formatTimer = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    const pad = (n) => n.toString().padStart(2, '0');
    
    if (hrs > 0) {
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Dynamic ICS File download
  const handleDownloadIcs = () => {
    const nextFeeding = getNextFeedingDate(lastFeeding);
    if (!nextFeeding) return;

    // Set reminder to 9:00 AM on the scheduled day
    nextFeeding.setHours(9, 0, 0, 0);

    const formatDateIcs = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const dtStamp = formatDateIcs(new Date());
    const dtStart = formatDateIcs(nextFeeding);
    // 15 min appointment
    const dtEnd = formatDateIcs(new Date(nextFeeding.getTime() + 15 * 60 * 1000));

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//My Sourdough Bread App//HE',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@sourdough.app`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'SUMMARY:להאכיל את המחמצת שלי! 🌾',
      'DESCRIPTION:עברו 14 יום מאז ההאכלה האחרונה. הגיע הזמן להאכיל את הגור במקרר ביחס 1:1:1.',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:תזכורת להאכלת המחמצת',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sourdough-feeding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Tab 1 Actions
  const handleFinishFeeding = () => {
    const nowStr = new Date().toISOString();
    setLastFeeding(nowStr);
    setFedFlour(false);
    setFedWater(false);
    setShowSuccessFeed(true);
    setTimeout(() => {
      setShowSuccessFeed(false);
    }, 4000);
  };

  // Tab 2 Actions
  const handleStartPrepTimer = () => {
    const durationMs = 7 * 60 * 60 * 1000;
    const targetEnd = Date.now() + durationMs;
    setPrepTimerEndTime(targetEnd);
    setPrepTimerRemaining(durationMs);
    setPrepTimerPaused(false);
    setPrepTimerActive(true);
  };

  const handlePauseResumePrepTimer = () => {
    if (prepTimerPaused) {
      // Resume
      const targetEnd = Date.now() + prepTimerRemaining;
      setPrepTimerEndTime(targetEnd);
      setPrepTimerPaused(false);
    } else {
      // Pause
      setPrepTimerPaused(true);
      setPrepTimerEndTime(null);
    }
  };

  const handleSkipPrepTimer = () => {
    setPrepTimerActive(false);
    setPrepTimerEndTime(null);
    setPrepTimerRemaining(0);
    setPrepFlourChecked(false);
    setPrepWaterChecked(false);
  };

  const triggerCancelPrepTimerModal = () => {
    setModalConfig({
      isOpen: true,
      title: "ביטול טיימר הכנה לאפייה",
      message: "האם אתה בטוח שברצונך לבטל לחלוטין את הטיימר? ההתקדמות הנוכחית תימחק.",
      confirmText: "כן, בטל טיימר",
      cancelText: "חזור לטיימר",
      onConfirm: () => {
        setPrepTimerActive(false);
        setPrepTimerPaused(false);
        setPrepTimerEndTime(null);
        setPrepTimerRemaining(7 * 60 * 60 * 1000);
        setPrepFlourChecked(false);
        setPrepWaterChecked(false);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Tab 3 Actions
  const handleStartBakeTimer = (durationSeconds) => {
    const durationMs = durationSeconds * 1000;
    const targetEnd = Date.now() + durationMs;
    setBakeTimerEndTime(targetEnd);
    setBakeTimerRemaining(durationMs);
    setBakeTimerPaused(false);
    setBakeTimerActive(true);
    setBakeTimerIsFinished(false);
  };

  const handlePauseResumeBakeTimer = () => {
    if (bakeTimerPaused) {
      // Resume
      const targetEnd = Date.now() + bakeTimerRemaining;
      setBakeTimerEndTime(targetEnd);
      setBakeTimerPaused(false);
    } else {
      // Pause
      setBakeTimerPaused(true);
      setBakeTimerEndTime(null);
    }
  };

  const handleSkipBakeTimer = () => {
    setBakeTimerActive(false);
    setBakeTimerEndTime(null);
    setBakeTimerRemaining(0);
    setBakeTimerIsFinished(true);
  };

  const triggerCancelBakeTimerModal = () => {
    setModalConfig({
      isOpen: true,
      title: "ביטול טיימר השלב הנוכחי",
      message: "האם ברצונך לבטל את הטיימר לשלב זה? תוכל להפעיל אותו מחדש בכל עת.",
      confirmText: "כן, בטל טיימר",
      cancelText: "המשך בטיימר",
      onConfirm: () => {
        setBakeTimerActive(false);
        setBakeTimerPaused(false);
        setBakeTimerEndTime(null);
        setBakeTimerRemaining(0);
        setBakeTimerIsFinished(false);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleNextStep = () => {
    setBakeTimerIsFinished(false);
    setBakeTimerActive(false);
    setBakeTimerEndTime(null);
    setBakeTimerRemaining(0);
    setBakeStep1Checked(false);
    setBakeStep(prev => Math.min(STEPS.length - 1, prev + 1));
  };

  const triggerResetBakeModal = () => {
    setModalConfig({
      isOpen: true,
      title: "איפוס תהליך האפייה",
      message: "האם אתה בטוח שברצונך לאפס את התהליך ולהתחיל מחדש מהשלב הראשון? כל ההתקדמות והטיימרים הפעילים של האפייה יימחקו.",
      confirmText: "כן, אפס תהליך",
      cancelText: "ביטול",
      onConfirm: () => {
        setBakeStep(0);
        setBakeStep1Checked(false);
        setBakeTimerActive(false);
        setBakeTimerPaused(false);
        setBakeTimerEndTime(null);
        setBakeTimerRemaining(0);
        setBakeTimerIsFinished(false);
        setModalConfig(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleResetBakeSilent = () => {
    setBakeStep(0);
    setBakeStep1Checked(false);
    setBakeTimerActive(false);
    setBakeTimerPaused(false);
    setBakeTimerEndTime(null);
    setBakeTimerRemaining(0);
    setBakeTimerIsFinished(false);
  };

  // Compute values
  const nextFeedingDate = getNextFeedingDate(lastFeeding);
  
  // Tab 2 quantities
  const requiredStarterPrep = loaves * 70;
  const flourToFeedPrep = requiredStarterPrep * 2;
  const waterToFeedPrep = requiredStarterPrep * 2;
  
  // Tab 3 Step 1 quantities
  const starterAmountBake = loaves * 125;
  const waterAmountBake = loaves * 350;
  const flourAmountBake = loaves * 500;
  const saltAmountBake = loaves * 13;

  const currentStepData = STEPS[bakeStep];

  return (
    <div dir="rtl" className="min-h-screen bg-stone-100 flex justify-center py-0 sm:py-8 font-sans antialiased text-stone-800">
      <div className="max-w-md w-full bg-stone-50 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden border-0 sm:border border-stone-200 relative">
        
        {/* Decorative background accents */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-amber-100/50 to-transparent pointer-events-none" />

        {/* Top Header */}
        <header className="p-5 pb-3 bg-white/80 backdrop-blur-md border-b border-stone-200/60 z-10 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-amber-900 tracking-tight flex items-center gap-2">
              <span>🥖</span>
              לחם המחמצת שלי
            </h1>
            <p className="text-xs text-stone-500 font-medium">מעקב וליווי אישי לאפייה מושלמת</p>
          </div>
          
          {/* Header Action Link (Bake reset) */}
          {activeTab === 'bake' && bakeStep < STEPS.length - 1 && (
            <button 
              onClick={triggerResetBakeModal}
              className="flex items-center gap-1 text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 py-1.5 px-3 rounded-full transition-all border border-amber-200/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>איפוס אפייה</span>
            </button>
          )}
        </header>

        {/* Main Content Scrollable Window */}
        <main className="flex-1 p-5 overflow-y-auto z-10">
          
          {/* Tabs Pill bar Navigation */}
          <div className="bg-stone-200/70 p-1.5 rounded-full flex gap-1.5 mb-6 border border-stone-300/30">
            <button 
              onClick={() => setActiveTab('starter')} 
              className={`flex-1 py-3 px-1 rounded-full flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === 'starter' ? 'bg-amber-700 text-white shadow-md' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/30'}`}
            >
              <Cat className="w-4 h-4" />
              <span>הגור שלי</span>
            </button>
            <button 
              onClick={() => setActiveTab('prep')} 
              className={`flex-1 py-3 px-1 rounded-full flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === 'prep' ? 'bg-amber-700 text-white shadow-md' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/30'}`}
            >
              <Flame className="w-4 h-4" />
              <span>הכנה לאפייה</span>
            </button>
            <button 
              onClick={() => setActiveTab('bake')} 
              className={`flex-1 py-3 px-1 rounded-full flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs sm:text-sm font-bold transition-all duration-300 ${activeTab === 'bake' ? 'bg-amber-700 text-white shadow-md' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/30'}`}
            >
              <ChefHat className="w-4 h-4" />
              <span>אפיית לחם</span>
            </button>
          </div>

          {/* SUCCESS FEEDING POPUP */}
          {showSuccessFeed && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-start gap-3 shadow-sm animate-pulse">
              <div className="bg-emerald-500 text-white p-1 rounded-full mt-0.5">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-sm">ההאכלה נרשמה בהצלחה!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">הגור שלך שבע ומאושר במקרר. נתראה בהאכלה הבאה! 🌾</p>
              </div>
            </div>
          )}

          {/* TAB 1: MY STARTER */}
          {activeTab === 'starter' && (
            <div className="space-y-6">
              
              {/* Feeding Date Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-900 flex items-center gap-2 text-base">
                  <Clock className="w-5 h-5 text-amber-600" />
                  סטטוס ההאכלה של הגור
                </h3>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                    <span className="text-stone-500 block text-xs">האכלה אחרונה:</span>
                    <strong className="text-stone-800 font-semibold">{lastFeeding ? formatDateHebrew(lastFeeding) : 'לא תועדה האכלה'}</strong>
                  </div>
                  {lastFeeding && nextFeedingDate && (
                    <div className={`p-3 rounded-xl border ${Date.now() > nextFeedingDate.getTime() ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-stone-50 border-stone-100'}`}>
                      <span className="text-stone-500 block text-xs">האכלה הבאה (מומלץ פעם בשבועיים):</span>
                      <strong className="font-bold">{formatDateHebrew(nextFeedingDate.toISOString())}</strong>
                      {Date.now() > nextFeedingDate.getTime() && (
                        <p className="text-xs text-rose-600 font-bold mt-1">⚠️ הגור רעב! מומלץ להאכיל אותו בהקדם.</p>
                      )}
                    </div>
                  )}
                </div>

                {lastFeeding && nextFeedingDate && (
                  <button 
                    onClick={handleDownloadIcs}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-sm font-bold transition-all"
                  >
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>הורד תזכורת ליומן (.ics)</span>
                  </button>
                )}
              </div>

              {/* Feeding Calculator & Checklist */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-5">
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-base">מחשבון האכלה (יחס 1:1:1)</h3>
                  <p className="text-xs text-stone-500">הזן את משקל הגור בקערה כדי לחשב כמה מים וקמח להוסיף</p>
                </div>

                {/* Weight input stepper */}
                <div className="flex items-center justify-between bg-stone-100 p-3 rounded-xl border border-stone-200/30">
                  <span className="font-semibold text-stone-700 text-sm">משקל הגור הנוכחי:</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setStarterWeight(w => Math.max(10, w - 5))}
                      className="w-10 h-10 bg-white hover:bg-stone-200 active:scale-95 text-stone-700 rounded-lg flex items-center justify-center shadow-sm border border-stone-200 font-bold transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      <input 
                        type="number" 
                        value={starterWeight}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setStarterWeight(isNaN(val) ? 0 : val);
                        }}
                        className="w-16 text-center font-bold text-lg bg-transparent focus:outline-none focus:ring-0 border-b-2 border-amber-600 py-1"
                      />
                      <span className="font-bold text-stone-500 text-sm">גרם</span>
                    </div>
                    <button 
                      onClick={() => setStarterWeight(w => w + 5)}
                      className="w-10 h-10 bg-white hover:bg-stone-200 active:scale-95 text-stone-700 rounded-lg flex items-center justify-center shadow-sm border border-stone-200 font-bold transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {starterWeight > 0 && (
                  <div className="space-y-4 pt-2">
                    <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/40 text-stone-700 text-sm">
                      <span className="font-bold text-amber-900">הוראות האכלה:</span> להאכלה מלאה ביחס שווה, עליך להוסיף לקערה בדיוק <strong className="text-amber-800">{starterWeight} גרם קמח</strong> ו- <strong className="text-amber-800">{starterWeight} גרם מים</strong>.
                    </div>

                    {/* Interactive checklists */}
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={() => setFedFlour(!fedFlour)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-right transition-all duration-300 active:scale-98 ${fedFlour ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                      >
                        <span className="text-sm font-semibold">הוספתי {starterWeight} גרם קמח</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${fedFlour ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'}`}>
                          {fedFlour && <Check className="w-4 h-4" />}
                        </div>
                      </button>

                      <button 
                        onClick={() => setFedWater(!fedWater)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-right transition-all duration-300 active:scale-98 ${fedWater ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                      >
                        <span className="text-sm font-semibold">הוספתי {starterWeight} גרם מים</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${fedWater ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'}`}>
                          {fedWater && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    </div>

                    {/* Complete button */}
                    <button
                      onClick={handleFinishFeeding}
                      disabled={!(starterWeight > 0 && fedFlour && fedWater)}
                      className="w-full py-4 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base transition-all shadow-md mt-2"
                    >
                      הכנסתי למקרר, סיימתי!
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PREP FOR BAKING */}
          {activeTab === 'prep' && (
            <div className="space-y-6">
              
              {/* If prep timer is NOT active */}
              {!prepTimerActive ? (
                <div className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-sm space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-bold text-stone-900 text-base">הכנת כמות גדולה לאפייה (יחס 1:2:2)</h3>
                    <p className="text-xs text-stone-500">שלב זה נועד להגדיל את כמות המחמצת עבור הלחמים שתאפה</p>
                  </div>

                  {/* Loaf counter */}
                  <div className="flex items-center justify-between bg-stone-100 p-3 rounded-xl border border-stone-200/30">
                    <span className="font-semibold text-stone-700 text-sm">כמות כיכרות לחם מתוכננת:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setLoaves(l => Math.max(1, l - 1))}
                        className="w-10 h-10 bg-white hover:bg-stone-200 active:scale-95 text-stone-700 rounded-lg flex items-center justify-center shadow-sm border border-stone-200 font-bold transition-all"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-lg text-stone-800 w-6 text-center">{loaves}</span>
                      <button 
                        onClick={() => setLoaves(l => Math.min(10, l + 1))}
                        className="w-10 h-10 bg-white hover:bg-stone-200 active:scale-95 text-stone-700 rounded-lg flex items-center justify-center shadow-sm border border-stone-200 font-bold transition-all"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recipe and Checklist */}
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/40 text-stone-700 text-sm space-y-2">
                      <p className="font-bold text-amber-900">מתכון להכנת המחמצת:</p>
                      <p>קח <strong className="text-amber-800">{requiredStarterPrep} גרם</strong> מהגור שלך, והוסף לו:</p>
                      <ul className="list-disc list-inside mr-2 space-y-1 font-semibold text-stone-800">
                        <li>קמח: {flourToFeedPrep} גרם (יחס פי 2)</li>
                        <li>מים: {waterToFeedPrep} גרם (יחס פי 2)</li>
                      </ul>
                      <p className="text-xs text-stone-500 mt-1">בסיום התהליך יתקבל מספיק סטרטר עבור {loaves} כיכרות ({loaves * 125} גרם סך הכל מתכון + קצת עודף לשמירה כגור הבא).</p>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-1 gap-3">
                      <button 
                        onClick={() => setPrepFlourChecked(!prepFlourChecked)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-right transition-all duration-300 active:scale-98 ${prepFlourChecked ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                      >
                        <span className="text-sm font-semibold">הוספתי {flourToFeedPrep} גרם קמח</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${prepFlourChecked ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'}`}>
                          {prepFlourChecked && <Check className="w-4 h-4" />}
                        </div>
                      </button>

                      <button 
                        onClick={() => setPrepWaterChecked(!prepWaterChecked)}
                        className={`flex items-center justify-between p-4 rounded-xl border text-right transition-all duration-300 active:scale-98 ${prepWaterChecked ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                      >
                        <span className="text-sm font-semibold">הוספתי {waterToFeedPrep} גרם מים</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${prepWaterChecked ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'}`}>
                          {prepWaterChecked && <Check className="w-4 h-4" />}
                        </div>
                      </button>
                    </div>

                    {/* Start Button */}
                    <button
                      onClick={handleStartPrepTimer}
                      disabled={!(prepFlourChecked && prepWaterChecked)}
                      className="w-full py-4 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed text-white font-bold rounded-xl text-base transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                    >
                      <Clock className="w-5 h-5" />
                      <span>התחל התפחה לאפייה (7 שעות)</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Timer UI active */
                <div className="bg-white p-6 rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50/20 to-white shadow-lg space-y-6 text-center relative overflow-hidden">
                  
                  {/* Cancel small 'X' button */}
                  <button 
                    onClick={triggerCancelPrepTimerModal}
                    className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-all"
                    title="בטל טיימר"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-1">
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      התפחת סטרטר לאפייה
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-lg pt-1">המחמצת בפעולה! 💥</h3>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">משאירים את המחמצת להתפחה בטמפרטורת החדר למשך 7 שעות עד שהיא תשלש את נפחה ותהיה תוססת.</p>
                  </div>

                  {/* Big Circular/Visual Timer Display */}
                  <div className="relative py-8 flex items-center justify-center">
                    {/* Ring background */}
                    <div className="w-48 h-48 rounded-full border-8 border-stone-100 flex flex-col items-center justify-center bg-white shadow-inner relative">
                      
                      {/* Ticking light accent */}
                      <div className={`absolute inset-0 rounded-full border-8 border-amber-600/75 border-t-transparent ${prepTimerPaused ? '' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />

                      <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">זמן נותר</span>
                      <strong className="text-3xl font-black text-stone-800 tracking-tight my-1 font-mono">
                        {formatTimer(prepTimerRemaining)}
                      </strong>
                      <span className="text-xs text-amber-700 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        7 שעות סך הכל
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-stone-100 rounded-full h-2 shadow-inner">
                    <div 
                      className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((7 * 60 * 60 * 1000 - prepTimerRemaining) / (7 * 60 * 60 * 1000)) * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col gap-3 pt-2">
                    {prepTimerRemaining > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={handlePauseResumePrepTimer}
                          className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-stone-200"
                        >
                          {prepTimerPaused ? (
                            <>
                              <Play className="w-4 h-4 fill-stone-700" />
                              <span>המשך</span>
                            </>
                          ) : (
                            <>
                              <Pause className="w-4 h-4 fill-stone-700" />
                              <span>השהה</span>
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={handleSkipPrepTimer}
                          className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                          <Check className="w-4 h-4" />
                          <span>דלג לסוף</span>
                        </button>
                      </div>
                    ) : (
                      /* Timer Finished Alert */
                      <div className="space-y-4">
                        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl font-bold text-sm">
                          🎉 הזמן עבר! הסטרטר שלך מוכן, תוסס ומוכן לאפייה!
                        </div>
                        <button 
                          onClick={handleSkipPrepTimer}
                          className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition-all shadow-md"
                        >
                          עבור לאפיית הלחם
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 3: BAKING BREAD */}
          {activeTab === 'bake' && (
            <div className="space-y-5">
              
              {/* Progress Indicator */}
              {bakeStep < STEPS.length - 1 && (
                <div className="bg-white p-4 rounded-2xl border border-stone-200/60 shadow-sm space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-500">
                    <span>תהליך האפייה</span>
                    <span>שלב {bakeStep + 1} מתוך {STEPS.length - 1}</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div 
                      className="bg-amber-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(bakeStep / (STEPS.length - 2)) * 100}%` }}
                    />
                  </div>
                  
                  <div className="text-sm font-bold text-stone-800 block text-right pt-0.5">
                    {currentStepData.name}
                  </div>
                </div>
              )}

              {/* Main Step Card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200/60 shadow-md space-y-6">
                
                {/* Step Header */}
                <div className="text-center space-y-1.5">
                  <h2 className="text-xl font-black text-stone-900">
                    {currentStepData.name}
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                    {currentStepData.description}
                  </p>
                </div>

                {/* STEP 1 SPECIFIC: Ingredients display and initial checkbox */}
                {currentStepData.id === 1 && !bakeTimerActive && !bakeTimerIsFinished && (
                  <div className="space-y-5">
                    
                    {/* Ingredients List */}
                    <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-200/30 space-y-2">
                      <h4 className="font-bold text-amber-900 text-sm">חומרי הגלם הנדרשים ל-{loaves} כיכרות:</h4>
                      <ul className="text-sm text-stone-700 space-y-1.5 mr-2">
                        <li className="flex justify-between border-b border-stone-200/40 pb-1">
                          <span>🌾 מחמצת סטרטר פעילה:</span>
                          <strong className="text-stone-900">{starterAmountBake} גרם</strong>
                        </li>
                        <li className="flex justify-between border-b border-stone-200/40 pb-1">
                          <span>💧 מים פושרים:</span>
                          <strong className="text-stone-900">{waterAmountBake} (גרם/מ״ל)</strong>
                        </li>
                        <li className="flex justify-between border-b border-stone-200/40 pb-1">
                          <span>🥣 קמח לחם לבן / מלא:</span>
                          <strong className="text-stone-900">{flourAmountBake} גרם</strong>
                        </li>
                        <li className="flex justify-between pb-0.5">
                          <span>🧂 מלח דק:</span>
                          <strong className="text-stone-900">{saltAmountBake} גרם</strong>
                        </li>
                      </ul>
                      <span className="text-[10px] text-stone-400 block pt-1">(החישוב מבוסס על מתכון קלאסי של 125 גרם סטרטר, 350 מים, 500 קמח ו-13 מלח לכל כיכר)</span>
                    </div>

                    {/* Pre-mixing Checkbox */}
                    <button 
                      onClick={() => setBakeStep1Checked(!bakeStep1Checked)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border text-right transition-all active:scale-98 ${bakeStep1Checked ? 'border-amber-600 bg-amber-50 text-amber-900 font-medium' : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'}`}
                    >
                      <span className="text-sm font-semibold">{currentStepData.checkboxText}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${bakeStep1Checked ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300 bg-white'}`}>
                        {bakeStep1Checked && <Check className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Start Step 1 Timer Button */}
                    {bakeStep1Checked && (
                      <button
                        onClick={() => handleStartBakeTimer(currentStepData.duration)}
                        className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-base transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        <span>התחל מנוחה (45 דקות)</span>
                      </button>
                    )}
                  </div>
                )}

                {/* STEPS WITH TIMER (Steps 2-8 or Step 1 active) */}
                {currentStepData.duration > 0 && (currentStepData.id > 1 || (currentStepData.id === 1 && (bakeTimerActive || bakeTimerIsFinished))) && (
                  <div className="space-y-6">
                    
                    {/* Timer controls/status */}
                    {!bakeTimerActive && !bakeTimerIsFinished ? (
                      /* Timer is NOT started yet for step 2-8 */
                      <div className="text-center py-4 space-y-4">
                        <div className="text-stone-400 font-mono text-4xl font-bold tracking-wider">
                          {formatTimer(currentStepData.duration * 1000)}
                        </div>
                        
                        <button
                          onClick={() => handleStartBakeTimer(currentStepData.duration)}
                          className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-base transition-all shadow-md flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>התחל טיימר לשלב זה</span>
                        </button>
                      </div>
                    ) : (
                      /* Timer is running or completed */
                      <div className="text-center space-y-6">
                        
                        {/* Countdown Clock Face */}
                        <div className="relative py-4 flex items-center justify-center">
                          <div className="w-44 h-44 rounded-full border-8 border-stone-100 flex flex-col items-center justify-center bg-white shadow-inner relative">
                            
                            {/* Rotating border animation when active */}
                            {bakeTimerActive && !bakeTimerPaused && (
                              <div className="absolute inset-0 rounded-full border-8 border-amber-700/70 border-t-transparent animate-spin" style={{ animationDuration: '8s' }} />
                            )}
                            
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">זמן נותר</span>
                            <strong className="text-3xl font-black text-stone-800 font-mono tracking-tight my-1">
                              {formatTimer(bakeTimerRemaining)}
                            </strong>
                            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 py-0.5 px-2.5 rounded-full border border-amber-100">
                              שלב {bakeStep + 1}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar for Step */}
                        <div className="w-full bg-stone-100 rounded-full h-1.5 shadow-inner">
                          <div 
                            className="bg-amber-700 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${((currentStepData.duration * 1000 - bakeTimerRemaining) / (currentStepData.duration * 1000)) * 100}%` }}
                          />
                        </div>

                        {/* Control buttons */}
                        <div className="flex flex-col gap-3">
                          {bakeTimerRemaining > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={handlePauseResumeBakeTimer}
                                className="py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-stone-200"
                              >
                                {bakeTimerPaused ? (
                                  <>
                                    <Play className="w-4 h-4 fill-stone-700" />
                                    <span>המשך</span>
                                  </>
                                ) : (
                                  <>
                                    <Pause className="w-4 h-4 fill-stone-700" />
                                    <span>השהה</span>
                                  </>
                                )}
                              </button>
                              
                              <button 
                                onClick={handleSkipBakeTimer}
                                className="py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                              >
                                <Check className="w-4 h-4" />
                                <span>דלג לשלב הבא</span>
                              </button>
                            </div>
                          ) : (
                            /* Step Timer Complete Alert */
                            <div className="space-y-4">
                              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl font-bold text-sm shadow-sm flex items-center gap-3 animate-pulse">
                                <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
                                <div className="text-right">
                                  <p className="text-amber-950 font-bold">הזמן עבר! השלב הבא מוכן</p>
                                  <p className="text-xs text-amber-700 font-normal mt-0.5">לחץ על הכפתור מטה כדי להתקדם בתהליך.</p>
                                </div>
                              </div>
                              <button 
                                onClick={handleNextStep}
                                className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl transition-all shadow-md text-base"
                              >
                                המשך לשלב הבא
                              </button>
                            </div>
                          )}

                          {/* X cancel button at bottom */}
                          {bakeTimerRemaining > 0 && (
                            <button 
                              onClick={triggerCancelBakeTimerModal}
                              className="text-xs font-bold text-rose-600 hover:text-rose-800 py-2 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              ביטול טיימר
                            </button>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                )}

                {/* STEP 9: SUCCESS / FINAL STATE */}
                {currentStepData.isFinal && (
                  <div className="text-center py-6 space-y-6">
                    <div className="relative flex justify-center">
                      <div className="w-24 h-24 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center shadow-lg border border-amber-200">
                        <Sparkles className="w-12 h-12 text-amber-600" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-amber-950">הלחם שלך מוכן! 🥖🎉</h3>
                      <p className="text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
                        ברכותינו! העבודה הקשה השתלמה. כיכרות הלחם שלך שחומות, פריכות ומלאות ארומה של בית.
                      </p>
                    </div>

                    <button
                      onClick={handleResetBakeSilent}
                      className="w-full py-4 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-base transition-all shadow-md"
                    >
                      התחל אפייה חדשה
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>

        {/* Footer */}
        <footer className="p-4 bg-stone-100 text-center text-[10px] text-stone-400 border-t border-stone-200/50 z-10">
          לחם המחמצת שלי • מעבד זמנים ועזר לאפייה
        </footer>

        {/* CUSTOM CONFIRMATION MODAL OVERLAY */}
        {modalConfig.isOpen && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-stone-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
              
              <div className="bg-amber-50 p-3.5 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                {modalConfig.title}
              </h3>
              
              <p className="text-sm text-stone-600 mb-6 leading-relaxed">
                {modalConfig.message}
              </p>
              
              <div className="w-full space-y-2">
                <button
                  onClick={modalConfig.onConfirm}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all shadow-sm text-sm"
                >
                  {modalConfig.confirmText}
                </button>
                <button
                  onClick={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                  className="w-full py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-all text-sm border border-stone-200/30"
                >
                  {modalConfig.cancelText}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
