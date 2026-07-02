export interface DoctorInfo {
  name: string;
  specialty: string;
  avatar?: string;
  isOnline: boolean;
  avatarColor: string;
}

export interface Comment {
  id: string;
  author: {
    name: string;
    role: "patient" | "moderator" | "doctor";
    specialty?: string;
    avatar?: string;
    avatarColor?: string;
  };
  timeAgo: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  groupId: string;
  groupName: string;
  author: {
    name: string;
    role: "patient" | "moderator" | "doctor";
    specialty?: string;
    avatar?: string;
    avatarColor?: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  likes: number; // Net votes
  userVote: "up" | "down" | null;
  commentsCount: number;
  comments: Comment[];
  category: string;
  tags: string[];
  isPinned?: boolean;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  members: number;
  onlineCount: number;
  category: string;
  icon: string;
  tags: string[];
  rules: string[];
}

export const MOCK_DOCTORS: DoctorInfo[] = [
  { name: "Dr. Emily Chen", specialty: "Clinical Psychologist", isOnline: true, avatarColor: "bg-teal-500/20 text-teal-300" },
  { name: "Dr. Marcus Vance", specialty: "Cardiologist", isOnline: true, avatarColor: "bg-rose-500/20 text-rose-300" },
  { name: "Dr. Sarah Jenkins", specialty: "Endocrinologist", isOnline: false, avatarColor: "bg-indigo-500/20 text-indigo-300" },
  { name: "Dr. Amit Patel", specialty: "Gastroenterologist", isOnline: true, avatarColor: "bg-amber-500/20 text-amber-300" }
];

export const MOCK_GROUPS: CommunityGroup[] = [
  {
    id: "g1",
    name: "Managing Anxiety",
    description: "A supportive space for sharing coping strategies, mindfulness techniques, and daily wins against anxiety.",
    members: 12450,
    onlineCount: 342,
    category: "Mental Health",
    icon: "BrainCircuit",
    tags: ["Anxiety", "Mental Health", "Support"],
    rules: [
      "Be empathetic and kind. Avoid judgment.",
      "Do not give prescriptive medical advice; share what worked for you.",
      "Do not share personal identifiable information (PHI)."
    ]
  },
  {
    id: "g2",
    name: "PCOS Warriors",
    description: "Connect with others managing PCOS. Discuss nutrition, lifestyle changes, and medical updates.",
    members: 8320,
    onlineCount: 128,
    category: "Chronic Conditions",
    icon: "UsersRound",
    tags: ["Woman's Health", "PCOS", "Lifestyle"],
    rules: [
      "No shaming or unsolicited diet advising.",
      "Label triggering content (e.g., fertility issues).",
      "Consult your doctor before starting any supplement regime."
    ]
  },
  {
    id: "g3",
    name: "Diabetes Diet & Tech",
    description: "Share recipes, continuous glucose monitor tips, and support for daily diabetes management.",
    members: 42100,
    onlineCount: 1105,
    category: "Nutrition",
    icon: "Heart",
    tags: ["Diabetes", "Diet", "CGM"],
    rules: [
      "Specify if you are Type 1, Type 2, LADA, or Gestational in posts.",
      "Treat glucose levels without shame. Highs and lows happen.",
      "Check insulin dosages with medical professionals first."
    ]
  },
  {
    id: "g4",
    name: "Post-Surgery Recovery",
    description: "Tips and emotional support for patients recovering from major surgeries.",
    members: 2150,
    onlineCount: 45,
    category: "Recovery",
    icon: "HandHeart",
    tags: ["Surgery", "Recovery", "Healing"],
    rules: [
      "Keep surgery details clear but avoid overly graphic pictures.",
      "Support pain management decisions without judgment.",
      "Share wound care routines only if recommended by specialists."
    ]
  },
  {
    id: "g5",
    name: "New Parents Support",
    description: "Everything from sleep deprivation to pediatric care questions. You aren't alone!",
    members: 15600,
    onlineCount: 512,
    category: "Lifestyle",
    icon: "UsersRound",
    tags: ["Parenting", "Mental Health", "Baby"],
    rules: [
      "No parenting style shaming (breastfeeding, sleep training, etc.).",
      "Keep safety recommendations up to date.",
      "Support postpartum mental health with high priority."
    ]
  },
  {
    id: "g6",
    name: "Heart Health Champions",
    description: "Focused on cardiovascular wellness, exercises, and heart-healthy living.",
    members: 9800,
    onlineCount: 89,
    category: "Fitness",
    icon: "Heart",
    tags: ["Cardio", "Fitness", "Heart"],
    rules: [
      "List exercise ideas as options, not mandatory templates.",
      "Strictly no promotion of extreme heart-cleansing diets.",
      "Recognize emergency symptoms instantly and call 911/SOS."
    ]
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    groupId: "g1",
    groupName: "Managing Anxiety",
    author: { name: "Dr. Emily Chen", role: "doctor", specialty: "Clinical Psychologist", avatarColor: "bg-teal-500/20 text-teal-300" },
    timeAgo: "2 hours ago",
    title: "Understanding Setbacks: Healing is Not Linear",
    content: "A quick reminder to everyone in our anxiety support group: setbacks are not failures. Having a high-anxiety day after a week of calm is a normal part of the nervous system resetting. \n\nWhat is one small coping mechanism giving you comfort today? For me, it's 5-5-5 grounding (finding 5 things I see, 4 I can touch, 3 I hear, 2 I smell, and 1 I taste). Let's share some daily wins below!",
    likes: 184,
    userVote: "up",
    commentsCount: 3,
    category: "Mental Health",
    tags: ["Anxiety", "Grounding", "Mental Health"],
    isPinned: true,
    comments: [
      {
        id: "c1",
        author: { name: "Sarah J.", role: "patient", avatarColor: "bg-blue-500/20 text-blue-300" },
        timeAgo: "1 hour ago",
        content: "Thank you Dr. Emily! The 5-5-5 method is my absolute go-to. It pulled me out of a mild spiral during a work meeting yesterday.",
        likes: 12
      },
      {
        id: "c2",
        author: { name: "Alex Mercer", role: "patient", avatarColor: "bg-indigo-500/20 text-indigo-300" },
        timeAgo: "45 minutes ago",
        content: "I've been trying box breathing (inhale 4, hold 4, exhale 4, hold 4) and it's worked wonders for chest tightness.",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "Dr. Amit Patel", role: "doctor", specialty: "Gastroenterologist", avatarColor: "bg-amber-500/20 text-amber-300" },
        timeAgo: "30 minutes ago",
        content: "Excellent reminders here. From a gastro perspective, regulating anxiety is crucial since the gut-brain axis reacts heavily to fight-or-flight states. Grounding literally calms your digestion down too!",
        likes: 24
      }
    ]
  },
  {
    id: "p2",
    groupId: "g1",
    groupName: "Managing Anxiety",
    author: { name: "Anonymous Patient", role: "patient", avatarColor: "bg-gray-500/20 text-gray-300" },
    timeAgo: "4 hours ago",
    title: "Small win: Managed to do 5 mins of deep breathing instead of spiraling",
    content: "Had a really tough morning. Felt my heart racing and the typical chest pressure starting. Usually, I'd immediately Google symptoms and spiral, but today I sat down, set a timer for 5 minutes, and focused purely on belly breathing. The panic didn't vanish entirely, but it subsided enough for me to keep going. It feels small, but I'm proud of it.",
    likes: 95,
    userVote: null,
    commentsCount: 2,
    category: "Mental Health",
    tags: ["Anxiety", "Support", "Victory"],
    comments: [
      {
        id: "c4",
        author: { name: "Dr. Emily Chen", role: "doctor", specialty: "Clinical Psychologist", avatarColor: "bg-teal-500/20 text-teal-300" },
        timeAgo: "3 hours ago",
        content: "This is NOT a small win, it is a huge milestone! You re-trained your brain to choose safety over threat. Proud of you for staying present.",
        likes: 42
      },
      {
        id: "c5",
        author: { name: "Rylee K.", role: "patient", avatarColor: "bg-purple-500/20 text-purple-300" },
        timeAgo: "2 hours ago",
        content: "So inspiring. Googling symptoms is my worst habit. I will try the breathing timer next time!",
        likes: 5
      }
    ]
  },
  {
    id: "p3",
    groupId: "g2",
    groupName: "PCOS Warriors",
    author: { name: "Jessica T.", role: "patient", avatarColor: "bg-purple-500/20 text-purple-300" },
    timeAgo: "5 hours ago",
    title: "6-Month Progress Report: My A1C is finally down!",
    content: "Just got my lab results back and I am crying happy tears! My A1C is down from 6.1 to 5.4, and my fasting insulin levels have stabilized. \n\nI did this by moving to a low-glycemic, anti-inflammatory diet, prioritizing strength training twice a week, and starting a high-quality Inositol supplement (as recommended by my endocrinologist). It took consistency and so much patience, but the changes are working!",
    likes: 312,
    userVote: "up",
    commentsCount: 2,
    category: "Chronic Conditions",
    tags: ["PCOS", "Insulin Resistance", "Victory"],
    comments: [
      {
        id: "c6",
        author: { name: "Mariah D.", role: "patient", avatarColor: "bg-rose-500/20 text-rose-300" },
        timeAgo: "4 hours ago",
        content: "Congratulations! That is amazing progress. What dose of Inositol did your endocrinologist suggest? I am thinking of asking mine about it.",
        likes: 15
      },
      {
        id: "c7",
        author: { name: "Dr. Sarah Jenkins", role: "doctor", specialty: "Endocrinologist", avatarColor: "bg-indigo-500/20 text-indigo-300" },
        timeAgo: "2 hours ago",
        content: "Outstanding results, Jessica! Combining strength training (which increases muscle insulin sensitivity) with low-glycemic eating is the gold standard for PCOS management. Keep up this beautiful, sustainable lifestyle approach.",
        likes: 56
      }
    ]
  },
  {
    id: "p4",
    groupId: "g3",
    groupName: "Diabetes Diet & Tech",
    author: { name: "Danielle S.", role: "patient", avatarColor: "bg-green-500/20 text-green-300" },
    timeAgo: "1 day ago",
    title: "Dexcom G7 vs Guardian 4: Which CGM has been better for you?",
    content: "Thinking of swapping my current Continuous Glucose Monitor (CGM) next month when my insurance updates. I have read conflicting things about sensor accuracy, ease of insertion, and app compatibility. Would love to hear real patient feedback on either of these devices, especially concerning adhesion during workouts.",
    likes: 54,
    userVote: null,
    commentsCount: 3,
    category: "Nutrition",
    tags: ["Diabetes", "Tech", "CGM"],
    comments: [
      {
        id: "c8",
        author: { name: "Gavin H.", role: "patient", avatarColor: "bg-sky-500/20 text-sky-300" },
        timeAgo: "18 hours ago",
        content: "I've been on the Dexcom G7 for 3 months now. Calibration is rarely needed and insertion is virtually painless. Adhesion is decent but I highly recommend an overpatch if you sweat a lot.",
        likes: 18
      },
      {
        id: "c9",
        author: { name: "Liam R.", role: "patient", avatarColor: "bg-rose-500/20 text-rose-300" },
        timeAgo: "14 hours ago",
        content: "Switched to G7 from Libre 2 and the 30-minute warm-up time is a lifesaver. The app is clean and pairs with my Apple Watch easily.",
        likes: 7
      },
      {
        id: "c10",
        author: { name: "Dr. Marcus Vance", role: "doctor", specialty: "Cardiologist", avatarColor: "bg-rose-500/20 text-rose-300" },
        timeAgo: "12 hours ago",
        content: "CGM tech has revolutionized diabetes care. From a vascular health standpoint, reducing glucose volatility directly protects your endothelial lining. Whichever sensor you choose, focus on maximizing your 'Time in Range' (TIR).",
        likes: 29
      }
    ]
  },
  {
    id: "p5",
    groupId: "g6",
    groupName: "Heart Health Champions",
    author: { name: "Dr. Marcus Vance", role: "doctor", specialty: "Cardiologist", avatarColor: "bg-rose-500/20 text-rose-300" },
    timeAgo: "2 days ago",
    title: "Cardiac Health: The Power of Zone 2 Exercise",
    content: "Many patients think they need to run sprints or collapse in exhaustion to improve cardiovascular capacity. In reality, Zone 2 training—aerobic exercise where you can maintain a conversation but feel your heart working (approx. 60-70% max heart rate)—is the most efficient way to build mitochondrial density and lower resting heart rate.\n\nAim for 150 minutes a week of steady-state brisk walking, light cycling, or swimming. Your heart will thank you!",
    likes: 242,
    userVote: "up",
    commentsCount: 1,
    category: "Fitness",
    tags: ["Cardio", "Zone 2", "Heart Health"],
    comments: [
      {
        id: "c11",
        author: { name: "FitPatient99", role: "patient", avatarColor: "bg-emerald-500/20 text-emerald-300" },
        timeAgo: "1 day ago",
        content: "This is so reassuring. I was forcing myself to do HIIT and it left me exhausted and anxious. Brisk walking makes me feel great and I can actually sustain it!",
        likes: 14
      }
    ]
  }
];
