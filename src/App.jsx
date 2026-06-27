import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  X,
  Plus,
  Check,
  Droplet,
  Footprints,
  Scale,
  RotateCcw,
} from "lucide-react";

/* ---------------------------------- DATA ---------------------------------- */

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBR = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const MESS_MENU = {
  Monday: {
    breakfast: { eat: "Idli + sambar + chutney, glass of milk", limit: "Chocos / bread jam (sugar-heavy)", protein: 18 },
    lunch: { eat: "Roti + Rajma Masala + cucumber salad, small rice", limit: "Extra mango dal rice portion", protein: 20 },
    snacks: { eat: "Fruit or milk/tea", limit: "Samosa / Pyaz Kachori (fried)", protein: 8 },
    dinner: { eat: "Egg Bhurji + Dal + salad + small roti/rice", limit: "Potato fry, Phirni", protein: 22 },
  },
  Tuesday: {
    breakfast: { eat: "Sprouts + Uttapam or Aloo Paratha (pick one)", limit: "Having both paratha and bread jam", protein: 16 },
    lunch: { eat: "Roti + Moong Dal + Soya Rice + salad", limit: "Fried items, sweetened butter milk", protein: 24 },
    snacks: { eat: "Cut fruits", limit: "Aloo Tikki / Dahi Bhalla (fried)", protein: 2 },
    dinner: { eat: "Paneer Paratha or Ghee Karam Dosa (pick one) + Navratan Dal + salad", limit: "Besan ka laddoo", protein: 26 },
  },
  Wednesday: {
    breakfast: { eat: "Besan Chilla + small cornflakes/milk", limit: "Vada Sambar in large portion", protein: 16 },
    lunch: { eat: "Black Chana Masala + Dal Fry + salad", limit: "Macaroni salad, extra rice", protein: 20 },
    snacks: { eat: "Milk / tea", limit: "Masala Pasta (large portion)", protein: 8 },
    dinner: { eat: "Paneer/Veg Kofta or moderate Pulao + salad", limit: "Double ka meetha", protein: 18 },
  },
  Thursday: {
    breakfast: { eat: "Boiled Egg + Banana", limit: "Pav Bhaji oil, extra bread jam", protein: 8 },
    lunch: { eat: "Chole + Curd + Beetroot Salad", limit: "Methi Poori (fried), large fruit custard", protein: 20 },
    snacks: { eat: "Pani Puri — occasional treat only", limit: "Making this a daily habit", protein: 2 },
    dinner: { eat: "Dal Makhani (moderate) + Bhindi Fry + salad", limit: "Amarkhand dessert", protein: 14 },
  },
  Friday: {
    breakfast: { eat: "Sambar + small bread jam", limit: "Puri Bhaji (fried), syrupy pancakes", protein: 8 },
    lunch: { eat: "Soya Chunks + Dal Makhani + salad", limit: "Excess rice", protein: 30 },
    snacks: { eat: "Coleslaw sandwich", limit: "Rusk in excess", protein: 8 },
    dinner: { eat: "Egg Curry + Rajma + salad", limit: "Gulab Jamun — small bite only", protein: 24 },
  },
  Saturday: {
    breakfast: { eat: "Pesarattu + Sambar (great protein)", limit: "Heavy Sabudana Khichdi portion", protein: 18 },
    lunch: { eat: "Mixed Dal + Gobi Masala + cucumber salad", limit: "Sugared watermelon juice, extra rice", protein: 16 },
    snacks: { eat: "Banana", limit: "Vada Pav / Pav Bhaji (fried)", protein: 1 },
    dinner: { eat: "Dal + Veg Noodles (moderate) + Sambar", limit: "Rasmalai — small bite only", protein: 14 },
  },
  Sunday: {
    breakfast: { eat: "Poha or Sweet Corn", limit: "Chole Bhature — save for occasional treat", protein: 5 },
    lunch: { eat: "Gongura Dal + cucumber salad", limit: "Heavy Aloo Dopyaza/Kadi Pakoda, moti choor laddoo", protein: 12 },
    snacks: { eat: "Bhel Puri (moderate)", limit: "Parle-G in excess", protein: 4 },
    dinner: { eat: "Paneer Biryani + Raita (great protein pick)", limit: "Ice cream — small portion only", protein: 28 },
  },
};

const GYM_TEMPLATE = {
  Monday: { type: "lower", label: "Lower Body A + Core" },
  Tuesday: { type: "upper", label: "Upper Body + Biceps" },
  Wednesday: { type: "rest", label: "Rest Day" },
  Thursday: { type: "lower", label: "Lower Body B + Core" },
  Friday: { type: "upper", label: "Upper Body + Core" },
  Saturday: { type: "cardio", label: "Cardio + Core" },
  Sunday: { type: "rest", label: "Full Rest" },
};

const EXERCISES = {
  phase0: {
    lower: [
      "Leg press — 3×12",
      "Leg extension — 3×15",
      "Leg curl — 3×15",
      "Walking lunges (bodyweight) — 3×12/leg",
      "Calf raises — 3×20",
      "Lying leg raises — 3×15",
    ],
    upper: [
      "Stationary bike — 15 min",
      "Bodyweight squats — 3×15",
      "Glute bridge — 3×15",
      "Lying leg raises — 3×15",
      "Seated twists, no weight — 3×20",
    ],
    cardio: [
      "Treadmill incline walk — 20 min",
      "Stationary bike — 15 min",
      "Reverse crunches — 3×15",
      "Seated twists, no weight — 3×20",
    ],
  },
  phase1: {
    lower: [
      "Leg press — 3×12",
      "Leg extension — 3×15",
      "Leg curl — 3×15",
      "Walking lunges (bodyweight) — 3×12/leg",
      "Calf raises — 3×20",
      "Lying leg raises — 3×15",
    ],
    upper: [
      "Machine chest press, light — 3×12",
      "Seated row machine, light — 3×12",
      "DB curls, light — 3×12",
      "Lying leg raises — 3×15",
    ],
    cardio: [
      "Treadmill incline walk — 20 min",
      "Stationary bike — 15 min",
      "Reverse crunches — 3×15",
      "Seated twists, no weight — 3×20",
    ],
  },
  phase2: {
    lower: [
      "Goblet or barbell squat — 3×10",
      "Leg press — 3×12",
      "Leg curl — 3×15",
      "Walking lunges — 3×12/leg",
      "Calf raises — 3×20",
      "Hanging leg raises — 3×15",
    ],
    upper: [
      "Machine or barbell bench press — 3×10",
      "Lat pulldown or seated row — 3×10",
      "DB shoulder press, light-moderate — 3×10",
      "DB bicep curls — 3×12",
      "Hammer curls — 3×12",
      "Plank — 3×30-45s",
    ],
    cardio: [
      "Treadmill incline walk or bike — 20-25 min",
      "Plank — 3×30s",
      "Bicycle crunch — 3×15",
      "Seated twists — 3×20",
    ],
  },
};

const CARDIO_GOALS = {
  lower: "10–15 min incline walk to finish",
  upper: "10–15 min incline walk to finish",
  cardio: "20–25 min steady bike or walk, moderate pace",
  rest: "Optional gentle walk only — nothing structured",
};

const PROTEIN_FOODS = [
  { name: "Paneer",       defaultAmount: 100, unit: "g",     step: 25,  proteinPerUnit: 0.18 },
  { name: "Boiled Egg",   defaultAmount: 1,   unit: "egg",   step: 1,   proteinPerUnit: 6    },
  { name: "Dal",          defaultAmount: 1,   unit: "cup",   step: 1,   proteinPerUnit: 9    },
  { name: "Curd",         defaultAmount: 1,   unit: "cup",   step: 1,   proteinPerUnit: 7    },
  { name: "Milk",         defaultAmount: 1,   unit: "glass", step: 1,   proteinPerUnit: 8    },
  { name: "Soya Chunks",  defaultAmount: 50,  unit: "g",     step: 25,  proteinPerUnit: 0.52 },
  { name: "Sprouts",      defaultAmount: 1,   unit: "cup",   step: 1,   proteinPerUnit: 7    },
  { name: "Whey Scoop",   defaultAmount: 1,   unit: "scoop", step: 1,   proteinPerUnit: 24   },
];

const PHASE_INFO = {
  phase0: { label: "Phase 0", desc: "Shoulder restricted — zero load through the arm" },
  phase1: { label: "Phase 1", desc: "Light upper body cleared" },
  phase2: { label: "Phase 2", desc: "Full training cleared" },
};

const DEFAULT_SETTINGS = { phase: "phase0", waterTarget: 3500, proteinTarget: 150 };

function defaultDay() {
  return {
    proteinLog: [],
    water: 0,
    gymDone: false,
    exercisesDone: {},
    creatine: false,
    meals: { breakfast: false, lunch: false, snacks: false, dinner: false },
    todos: [],
  };
}

/* ------------------------------- DATE HELPERS ------------------------------ */

function pad(n) {
  return n.toString().padStart(2, "0");
}
function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function startOfWeek(d) {
  const dow = (d.getDay() + 6) % 7; // Monday = 0
  const monday = new Date(d);
  monday.setDate(d.getDate() - dow);
  monday.setHours(0, 0, 0, 0);
  return monday;
}
function addDays(d, n) {
  const r = new Date(d);
  r.setDate(d.getDate() + n);
  return r;
}
function weekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}
function dayNameFromDate(d) {
  return DAY_NAMES[(d.getDay() + 6) % 7];
}
function formatHeader(d) {
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
function formatWeekRange(weekStart) {
  const end = addDays(weekStart, 6);
  const startStr = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${startStr} – ${endStr}`;
}

/* --------------------------------- VISUALS --------------------------------- */

function Ring({ pct, size = 32, stroke = 3 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, pct)) / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-stone-200" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-stone-900"
      />
    </svg>
  );
}

function SectionCard({ title, eyebrow, children, right }) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          {eyebrow && <p className="text-[10px] tracking-widest text-stone-400 font-sans uppercase mb-0.5">{eyebrow}</p>}
          <h3 className="font-serif text-base text-stone-900">{title}</h3>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function Checkbox({ checked, onClick, label, strike = true }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 text-left w-full py-1.5 group">
      <span
        className={
          "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors " +
          (checked ? "bg-stone-900 border-stone-900" : "border-stone-300 group-hover:border-stone-400")
        }
      >
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </span>
      <span className={"text-sm font-sans " + (checked && strike ? "text-stone-400 line-through" : "text-stone-700")}>{label}</span>
    </button>
  );
}

/* ---------------------------------- MODAL ---------------------------------- */

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-stone-900/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 sticky top-0 bg-white">
          <h2 className="font-serif text-lg text-stone-900">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------ LOCAL STORAGE ------------------------------ */
/* Standalone version: uses the browser's own localStorage instead of the
   Claude artifact storage API, so this works on any static web host.
   Note: data is saved per-browser, per-device — it won't sync across devices. */
const storage = {
  async get(key) {
    const raw = window.localStorage.getItem(key);
    if (raw === null) throw new Error("not found: " + key);
    return { key, value: raw };
  },
  async set(key, value) {
    window.localStorage.setItem(key, value);
    return { key, value };
  },
};

/* ---------------------------------- APP ------------------------------------ */

export default function App() {
  const [loading, setLoading] = useState(true);
  const [today] = useState(new Date());
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(toISO(new Date()));
  const [dayData, setDayData] = useState({});
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [weights, setWeights] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [todoInput, setTodoInput] = useState("");
  const [foodAmounts, setFoodAmounts] = useState(() =>
    Object.fromEntries(PROTEIN_FOODS.map((f) => [f.name, f.defaultAmount]))
  );

  /* initial load: settings + weights */
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get("settings", false);
        setSettings(res ? JSON.parse(res.value) : DEFAULT_SETTINGS);
      } catch (e) {
        setSettings(DEFAULT_SETTINGS);
      }
      try {
        const res = await storage.get("weights", false);
        setWeights(res ? JSON.parse(res.value) : []);
      } catch (e) {
        setWeights([]);
      }
      setLoading(false);
    })();
  }, []);

  const loadDay = useCallback(
    async (dateStr) => {
      if (dayData[dateStr]) return;
      try {
        const res = await storage.get(`day:${dateStr}`, false);
        const record = res ? JSON.parse(res.value) : defaultDay();
        setDayData((prev) => ({ ...prev, [dateStr]: record }));
      } catch (e) {
        setDayData((prev) => ({ ...prev, [dateStr]: defaultDay() }));
      }
    },
    [dayData]
  );

  /* load whole visible week whenever it changes */
  useEffect(() => {
    weekDates(weekStart).forEach((d) => loadDay(toISO(d)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart]);

  useEffect(() => {
    loadDay(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  function saveDay(dateStr, record) {
    setDayData((prev) => ({ ...prev, [dateStr]: record }));
    storage.set(`day:${dateStr}`, JSON.stringify(record), false).catch((e) => console.error(e));
  }

  function saveSettings(partial) {
    const next = { ...settings, ...partial };
    setSettings(next);
    storage.set("settings", JSON.stringify(next), false).catch((e) => console.error(e));
  }

  function saveWeights(next) {
    setWeights(next);
    storage.set("weights", JSON.stringify(next), false).catch((e) => console.error(e));
  }

  const record = dayData[selectedDate] || defaultDay();
  const selDateObj = new Date(selectedDate + "T00:00:00");
  const dayName = dayNameFromDate(selDateObj);
  const menu = MESS_MENU[dayName];
  const tmpl = GYM_TEMPLATE[dayName];
  const exerciseList = tmpl.type === "rest" ? [] : EXERCISES[settings.phase][tmpl.type];
  const cardioGoal = CARDIO_GOALS[tmpl.type];
  const totalProtein = record.proteinLog.reduce((s, e) => s + e.g, 0);
  const proteinPct = Math.min(100, (totalProtein / settings.proteinTarget) * 100);
  const waterGlasses = Math.round(settings.waterTarget / 250);
  const currentGlasses = Math.round(record.water / 250);
  const waterPct = Math.min(100, (record.water / settings.waterTarget) * 100);
  const isRestDay = tmpl.type === "rest";

  function dayCompletion(dateStr) {
    const d = dayData[dateStr];
    if (!d) return 0;
    const dn = dayNameFromDate(new Date(dateStr + "T00:00:00"));
    const rest = GYM_TEMPLATE[dn].type === "rest";
    const p = Math.min(100, (d.proteinLog.reduce((s, e) => s + e.g, 0) / settings.proteinTarget) * 100);
    const w = Math.min(100, (d.water / settings.waterTarget) * 100);
    const g = rest ? 100 : d.gymDone ? 100 : 0;
    return Math.round((p + w + g) / 3);
  }

  function update(partial) {
    saveDay(selectedDate, { ...record, ...partial });
  }

  function addProtein(food) {
    const amount = foodAmounts[food.name] ?? food.defaultAmount;
    const g = Math.round(amount * food.proteinPerUnit);
    const serving = food.unit === "g" ? `${amount}g` : `${amount} ${food.unit}`;
    update({ proteinLog: [...record.proteinLog, { id: Date.now(), name: food.name, serving, g }] });
  }
  function removeProtein(id) {
    update({ proteinLog: record.proteinLog.filter((e) => e.id !== id) });
  }
  function toggleExercise(name) {
    update({ exercisesDone: { ...record.exercisesDone, [name]: !record.exercisesDone[name] } });
  }
  function toggleMeal(key) {
    const nowChecked = !record.meals[key];
    const mealId = `meal-${key}`;
    let newLog = record.proteinLog.filter((e) => e.id !== mealId);
    if (nowChecked) {
      newLog = [...newLog, {
        id: mealId,
        name: `${key.charAt(0).toUpperCase() + key.slice(1)} (mess)`,
        serving: "meal",
        g: menu[key].protein,
      }];
    }
    update({ meals: { ...record.meals, [key]: nowChecked }, proteinLog: newLog });
  }
  function setGlasses(n) {
    update({ water: n * 250 });
  }
  function addTodo() {
    if (!todoInput.trim()) return;
    update({ todos: [...record.todos, { id: Date.now(), text: todoInput.trim(), done: false }] });
    setTodoInput("");
  }
  function toggleTodo(id) {
    update({ todos: record.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
  }
  function removeTodo(id) {
    update({ todos: record.todos.filter((t) => t.id !== id) });
  }
  function resetDay() {
    saveDay(selectedDate, defaultDay());
  }
  function logWeight() {
    const kg = parseFloat(weightInput);
    if (!kg || kg <= 0) return;
    const next = [...weights.filter((w) => w.date !== selectedDate), { date: selectedDate, kg }].sort((a, b) =>
      a.date.localeCompare(b.date)
    );
    saveWeights(next);
    setWeightInput("");
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-stone-50 font-sans text-stone-400 text-sm">
        Loading your plan…
      </div>
    );
  }

  const wDates = weekDates(weekStart);
  const recentWeights = weights.slice(-6);
  const maxKg = Math.max(...recentWeights.map((w) => w.kg), 1);
  const minKg = Math.min(...recentWeights.map((w) => w.kg), maxKg - 1);

  return (
    <div className="bg-stone-50 min-h-screen font-sans">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] tracking-widest text-stone-400 uppercase mb-0.5">Week of {formatWeekRange(weekStart)}</p>
            <h1 className="font-serif text-2xl text-stone-900">Lean Plan</h1>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-stone-400 mr-1">{PHASE_INFO[settings.phase].label}</span>
            <button onClick={() => setSettingsOpen(true)} className="p-2 text-stone-500 hover:text-stone-900">
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>

        {/* Week ribbon */}
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="p-1 text-stone-400 hover:text-stone-900 flex-shrink-0">
            <ChevronLeft size={18} />
          </button>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {wDates.map((d) => {
              const iso = toISO(d);
              const isSelected = iso === selectedDate;
              const isToday = iso === toISO(today);
              const pct = dayCompletion(iso);
              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(iso)}
                  className={
                    "flex flex-col items-center gap-1 py-2 rounded-xl transition-colors " +
                    (isSelected ? "bg-stone-900" : "bg-white border border-stone-200 hover:border-stone-300")
                  }
                >
                  <span className={"text-[9px] tracking-wide font-sans " + (isSelected ? "text-stone-300" : "text-stone-400")}>
                    {DAY_ABBR[(d.getDay() + 6) % 7]}
                  </span>
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <Ring pct={pct} size={28} stroke={2.5} />
                    <span className={"absolute text-[11px] font-sans " + (isSelected ? "text-white" : "text-stone-700") + (isToday ? " font-bold" : "")}>
                      {d.getDate()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="p-1 text-stone-400 hover:text-stone-900 flex-shrink-0">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-serif text-lg text-stone-900">{formatHeader(selDateObj)}</h2>
          <span className={"text-[11px] px-2.5 py-1 rounded-full font-sans " + (isRestDay ? "bg-stone-100 text-stone-500" : "bg-stone-900 text-white")}>
            {tmpl.label}
          </span>
        </div>

        {/* Meals */}
        <SectionCard title="Meals" eyebrow="Mess Menu">
          <div className="space-y-3">
            {["breakfast", "lunch", "snacks", "dinner"].map((key) => (
              <div key={key} className="border-t border-stone-100 first:border-t-0 pt-3 first:pt-0">
                <button onClick={() => toggleMeal(key)} className="flex items-start gap-2.5 w-full text-left group">
                  <span
                    className={
                      "flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border flex items-center justify-center transition-colors " +
                      (record.meals[key] ? "bg-stone-900 border-stone-900" : "border-stone-300 group-hover:border-stone-400")
                    }
                  >
                    {record.meals[key] && <Check size={12} className="text-white" strokeWidth={3} />}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[11px] uppercase tracking-wide text-stone-400">{key}</p>
                      <span className={
                        "text-[10px] px-1.5 py-0.5 rounded-full font-sans " +
                        (record.meals[key] ? "bg-stone-100 text-stone-400" : "bg-stone-50 text-stone-500")
                      }>
                        ~{menu[key].protein}g protein
                      </span>
                    </div>
                    <p className={"text-sm " + (record.meals[key] ? "text-stone-400 line-through" : "text-stone-800")}>{menu[key].eat}</p>
                    <p className="text-xs text-stone-400 mt-0.5">Limit: {menu[key].limit}</p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Protein */}
        <SectionCard title="Protein" eyebrow={`${Math.round(totalProtein)}g / ${settings.proteinTarget}g`}>
          <div className="w-full h-1.5 bg-stone-100 rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-stone-900 transition-all" style={{ width: `${proteinPct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {PROTEIN_FOODS.map((f) => {
              const amount = foodAmounts[f.name] ?? f.defaultAmount;
              const g = Math.round(amount * f.proteinPerUnit);
              return (
                <div key={f.name} className="border border-stone-200 rounded-xl px-3 py-2 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-stone-800 font-sans">{f.name}</span>
                    <span className="text-[10px] text-stone-400">{g}g protein</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFoodAmounts((prev) => ({ ...prev, [f.name]: Math.max(f.step, (prev[f.name] ?? f.defaultAmount) - f.step) }))}
                      className="w-6 h-6 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center text-sm hover:bg-stone-200 flex-shrink-0"
                    >−</button>
                    <span className="flex-1 text-center text-xs text-stone-700">{amount}{f.unit === "g" ? "g" : ` ${f.unit}`}</span>
                    <button
                      onClick={() => setFoodAmounts((prev) => ({ ...prev, [f.name]: (prev[f.name] ?? f.defaultAmount) + f.step }))}
                      className="w-6 h-6 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center text-sm hover:bg-stone-200 flex-shrink-0"
                    >+</button>
                    <button
                      onClick={() => addProtein(f)}
                      className="w-6 h-6 rounded-lg bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 flex-shrink-0"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {record.proteinLog.length > 0 && (
            <div className="space-y-1 pt-2 border-t border-stone-100">
              {record.proteinLog.map((e) => (
                <div key={e.id} className="flex items-center justify-between text-xs text-stone-600 py-0.5">
                  <span className={String(e.id).startsWith("meal-") ? "text-stone-400 italic" : ""}>
                    {e.name} ({e.serving}) — {e.g}g
                  </span>
                  <button onClick={() => removeProtein(e.id)} className="text-stone-300 hover:text-stone-600">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Gym */}
        <SectionCard title="Gym" eyebrow={isRestDay ? "Rest" : "Training"}>
          {settings.phase === "phase0" && tmpl.type === "upper" && (
            <p className="text-xs text-stone-500 bg-stone-50 border border-stone-100 rounded-lg px-3 py-2 mb-3">
              Phase 0 active — this is a shoulder-safe substitute, no load through the arm.
            </p>
          )}
          {isRestDay ? (
            <p className="text-sm text-stone-500">No training scheduled. {settings.phase === "phase0" ? "A gentle walk is fine if you feel like it." : ""}</p>
          ) : (
            <div className="space-y-0.5 mb-3">
              {exerciseList.map((ex) => (
                <Checkbox key={ex} checked={!!record.exercisesDone[ex]} onClick={() => toggleExercise(ex)} label={ex} />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-stone-500 border-t border-stone-100 pt-3 mt-1">
            <Footprints size={14} className="flex-shrink-0" />
            <span>{cardioGoal}</span>
          </div>
          {!isRestDay && (
            <button
              onClick={() => update({ gymDone: !record.gymDone })}
              className={
                "w-full mt-4 py-2.5 rounded-xl text-sm font-sans transition-colors " +
                (record.gymDone ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200")
              }
            >
              {record.gymDone ? "Gym complete ✓" : "Mark gym complete"}
            </button>
          )}
        </SectionCard>

        {/* Water */}
        <SectionCard title="Water" eyebrow={`${(record.water / 1000).toFixed(1)}L / ${(settings.waterTarget / 1000).toFixed(1)}L`}>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: waterGlasses }).map((_, i) => (
              <button key={i} onClick={() => setGlasses(i < currentGlasses ? i : i + 1)} className="p-1">
                <Droplet
                  size={20}
                  className={i < currentGlasses ? "text-stone-900" : "text-stone-200"}
                  fill={i < currentGlasses ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Todo */}
        <SectionCard title="Today's Checklist" eyebrow="Todo">
          <div className="space-y-0.5 mb-3">
            <Checkbox
              checked={record.creatine}
              onClick={() => update({ creatine: !record.creatine })}
              label="Creatine taken (3-5g)"
            />
            {record.todos.map((t) => (
              <div key={t.id} className="flex items-center gap-1">
                <div className="flex-1">
                  <Checkbox checked={t.done} onClick={() => toggleTodo(t.id)} label={t.text} />
                </div>
                <button onClick={() => removeTodo(t.id)} className="text-stone-300 hover:text-stone-600 p-1">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add an item…"
              className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-stone-400"
            />
            <button onClick={addTodo} className="bg-stone-900 text-white rounded-lg px-3 hover:bg-stone-800">
              <Plus size={15} />
            </button>
          </div>
        </SectionCard>

        {/* Weight */}
        <SectionCard title="Weight" eyebrow="Progress" right={<Scale size={16} className="text-stone-300" />}>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              step="0.1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && logWeight()}
              placeholder="kg, e.g. 74.5"
              className="flex-1 text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-stone-400"
            />
            <button onClick={logWeight} className="bg-stone-900 text-white rounded-lg px-4 text-sm hover:bg-stone-800">
              Log
            </button>
          </div>
          {recentWeights.length > 0 ? (
            <div className="flex items-end gap-2 h-16">
              {recentWeights.map((w) => {
                const h = 8 + ((w.kg - minKg) / Math.max(1, maxKg - minKg)) * 48;
                return (
                  <div key={w.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-stone-900 rounded-t" style={{ height: `${h}px` }} />
                    <span className="text-[9px] text-stone-400">{w.kg}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-stone-400">No entries yet — log your weight to start the trend.</p>
          )}
        </SectionCard>

        <button onClick={resetDay} className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 mx-auto py-2">
          <RotateCcw size={12} /> Reset this day
        </button>
      </div>

      {settingsOpen && (
        <Modal title="Settings" onClose={() => setSettingsOpen(false)}>
          <div className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Shoulder Phase</p>
              <div className="space-y-2">
                {Object.entries(PHASE_INFO).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => saveSettings({ phase: key })}
                    className={
                      "w-full text-left border rounded-xl px-3 py-2.5 transition-colors " +
                      (settings.phase === key ? "border-stone-900 bg-stone-50" : "border-stone-200 hover:border-stone-300")
                    }
                  >
                    <p className="text-sm text-stone-900">{info.label}</p>
                    <p className="text-xs text-stone-500">{info.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Daily Protein Target (g)</p>
              <input
                type="number"
                value={settings.proteinTarget}
                onChange={(e) => saveSettings({ proteinTarget: parseInt(e.target.value) || 0 })}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-400"
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-400 mb-2">Daily Water Target (ml)</p>
              <input
                type="number"
                step="250"
                value={settings.waterTarget}
                onChange={(e) => saveSettings({ waterTarget: parseInt(e.target.value) || 0 })}
                className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:border-stone-400"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
