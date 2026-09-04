/**
 * =========================================================================
 * MEDSCOPE PERSONALIZED DIET & WORKOUT CLINICAL MATRIX
 * =========================================================================
 * 
 * Hardcoded clinically vetted dietary regimens and exercise prescriptions
 * dynamically resolved from patient onboarding parameters:
 * - Diet Preference: vegetarian | non-vegetarian | vegan | mixed
 * - Activity Level: low | moderate | active
 * - Medical Conditions: Diabetes, Hypertension, Heart condition, Arthritis, PCOS/PCOD, Asthma, Thyroid, None
 * - Stress & Sleep Quality
 */

export interface MealItem {
  name: string;
  portion: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  notes: string;
}

export interface DayDietPlan {
  planId: string;
  title: string;
  category: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Mixed / Flexitarian";
  targetGoal: string;
  caloriesTarget: string;
  macroRatio: {
    protein: string;
    carbs: string;
    fats: string;
    fiber: string;
  };
  hydrationGoal: string;
  clinicalBadges: string[];
  medicalRationale: string;
  meals: {
    breakfast: MealItem;
    midMorningSnack?: MealItem;
    lunch: MealItem;
    eveningSnack?: MealItem;
    dinner: MealItem;
  };
  foodsToEmphasize: string[];
  foodsToLimit: string[];
  vitalTips: string[];
}

export interface WorkoutExercise {
  name: string;
  setsReps: string;
  rest: string;
  targetArea: string;
  formCue: string;
}

export interface WorkoutPlan {
  planId: string;
  title: string;
  intensity: "Low Impact" | "Moderate Intensity" | "High Intensity";
  duration: string;
  estimatedBurn: string;
  frequency: string;
  targetGoal: string;
  safeForConditions: string[];
  contraindications: string[];
  warmup: {
    duration: string;
    movements: string[];
  };
  mainCircuit: WorkoutExercise[];
  cooldown: {
    duration: string;
    movements: string[];
  };
  physiologicalBenefit: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. HARDCODED DIET PLANS CATALOG
// ─────────────────────────────────────────────────────────────────────────────

export const DIET_PLANS: Record<string, DayDietPlan> = {
  // --- VEGETARIAN PLANS ---
  "veg-diabetes-moderate": {
    planId: "veg-diabetes-moderate",
    title: "Glycemic-Control High-Fiber Vegetarian Plan",
    category: "Vegetarian",
    targetGoal: "Stable Blood Glucose & Metabolic Endurance",
    caloriesTarget: "1,750 kcal / day",
    macroRatio: { protein: "85g (20%)", carbs: "190g (45%)", fats: "65g (35%)", fiber: "38g" },
    hydrationGoal: "2.8 - 3.2 Liters / day",
    clinicalBadges: ["Low Glycemic Index", "Type 2 Diabetes Adapted", "High Fiber"],
    medicalRationale: "Prioritizes slow-release complex carbohydrates with fenugreek and legume protein to prevent postprandial glucose spikes.",
    meals: {
      breakfast: {
        name: "Sprouted Moong & Oats Chilla with Mint Chutney",
        portion: "2 medium savory pancakes (140g)",
        calories: 330,
        protein: "18g",
        carbs: "42g",
        fat: "8g",
        notes: "Rich in soluble fiber and resistant starch for insulin sensitivity."
      },
      midMorningSnack: {
        name: "Handful of Soaked Almonds & Roasted Flaxseeds",
        portion: "25g seeds & nuts",
        calories: 140,
        protein: "5g",
        carbs: "4g",
        fat: "12g",
        notes: "Provides ALA Omega-3 to mitigate systemic inflammation."
      },
      lunch: {
        name: "Brown Rice Khichdi with Steamed Spinach & Tofu Bhurji",
        portion: "1.5 cup bowl + 100g spiced tofu",
        calories: 480,
        protein: "26g",
        carbs: "58g",
        fat: "14g",
        notes: "High magnesium content supports cellular glucose uptake."
      },
      eveningSnack: {
        name: "Roasted Spiced Chickpeas (Chana) & Cinnamon Infusion",
        portion: "40g roasted chana",
        calories: 160,
        protein: "8g",
        carbs: "22g",
        fat: "3g",
        notes: "Cinnamon helps attenuate evening insulin resistance."
      },
      dinner: {
        name: "Methi Paneer Tikka with Grilled Bell Peppers & Cucumber Salad",
        portion: "120g low-fat paneer + grilled veggies",
        calories: 420,
        protein: "28g",
        carbs: "18g",
        fat: "16g",
        notes: "Low carbohydrate load before sleep promotes stable overnight fasting glucose."
      }
    },
    foodsToEmphasize: ["Sprouted legumes", "Fenugreek (Methi)", "Chia/Flax seeds", "Cottage cheese (Paneer)", "Bitter gourd"],
    foodsToLimit: ["Refined white flour (Maida)", "Fruit juices", "White potatoes", "Added sugars", "Bakery goods"],
    vitalTips: [
      "Drink a glass of water 15 minutes before each meal to reduce post-meal glucose surge.",
      "Engage in a light 10-minute walk immediately following lunch and dinner."
    ]
  },

  "veg-hypertension-low": {
    planId: "veg-hypertension-low",
    title: "Cardio-Protective DASH Vegetarian Protocol",
    category: "Vegetarian",
    targetGoal: "Blood Pressure Reduction & Sodium Moderation",
    caloriesTarget: "1,650 kcal / day",
    macroRatio: { protein: "75g (18%)", carbs: "220g (55%)", fats: "50g (27%)", fiber: "42g" },
    hydrationGoal: "2.5 Liters / day",
    clinicalBadges: ["DASH Diet Aligned", "Sodium < 1500mg", "High Potassium & Magnesium"],
    medicalRationale: "Engineered around potassium-rich vegetables, magnesium, and natural nitrates that facilitate nitric oxide vasodilation.",
    meals: {
      breakfast: {
        name: "Steel-Cut Oats with Walnuts, Blueberries & Unsweetened Almond Milk",
        portion: "1 large bowl (200g cooked)",
        calories: 340,
        protein: "12g",
        carbs: "52g",
        fat: "10g",
        notes: "Beta-glucan fiber actively reduces arterial stiffness and serum LDL."
      },
      midMorningSnack: {
        name: "Fresh Pomegranate Arils with Pumpkin Seeds",
        portion: "1 small cup (100g)",
        calories: 120,
        protein: "4g",
        carbs: "18g",
        fat: "5g",
        notes: "Polyphenols stimulate endogenous endothelial nitric oxide."
      },
      lunch: {
        name: "Quinoa Bowl with Stewed Kidney Beans (Rajma) & Lemon Dressing",
        portion: "1.5 cup quinoa & bean bowl",
        calories: 460,
        protein: "22g",
        carbs: "68g",
        fat: "9g",
        notes: "No added sodium; seasoned with roasted cumin and crushed garlic."
      },
      eveningSnack: {
        name: "Cucumber and Carrot Sticks with Homemade Garlic Hummus",
        portion: "3 tbsp hummus + raw sticks",
        calories: 150,
        protein: "6g",
        carbs: "16g",
        fat: "7g",
        notes: "Raw garlic contains allicin, proven to support healthy blood pressure."
      },
      dinner: {
        name: "Steamed Edamame & Lentil Soup with Sautéed Broccoli & Zucchini",
        portion: "1 large bowl (350ml)",
        calories: 380,
        protein: "26g",
        carbs: "42g",
        fat: "8g",
        notes: "Light, low-sodium evening meal preventing nighttime fluid retention."
      }
    },
    foodsToEmphasize: ["Dark leafy greens", "Bananas & Pomegranates", "Unsalted nuts", "Garlic", "Beetroot juice"],
    foodsToLimit: ["Processed cheese", "Pickles & papads", "Canned soups with sodium", "Salted chips", "Soy sauce"],
    vitalTips: [
      "Use potassium chloride or lemon juice as natural salt alternatives.",
      "Avoid eating packaged snack items with more than 140mg sodium per serving."
    ]
  },

  "veg-active-fitness": {
    planId: "veg-active-fitness",
    title: "High-Protein Vegetarian Athlete & Hypertrophy Fuel",
    category: "Vegetarian",
    targetGoal: "Lean Muscle Building & Workout Recovery",
    caloriesTarget: "2,350 kcal / day",
    macroRatio: { protein: "140g (25%)", carbs: "280g (50%)", fats: "65g (25%)", fiber: "40g" },
    hydrationGoal: "3.5 - 4.0 Liters / day",
    clinicalBadges: ["High Protein 140g", "Active Recovery", "Pre/Post Workout Paced"],
    medicalRationale: "Optimizes leucine thresholds and glycogen replenishment for active and athletic individuals relying on vegetarian sources.",
    meals: {
      breakfast: {
        name: "High-Protein Greek Yogurt Chia Bowl with Bananas & Peanut Butter",
        portion: "200g Greek yogurt + 1 tbsp peanut butter",
        calories: 460,
        protein: "32g",
        carbs: "48g",
        fat: "16g",
        notes: "Delivers sustained morning amino acid release for muscle repair."
      },
      midMorningSnack: {
        name: "Roasted Soya Chunks with Chaat Masala & Lemon",
        portion: "50g dehydrated soya chunks boiled & spiced",
        calories: 210,
        protein: "24g",
        carbs: "15g",
        fat: "2g",
        notes: "Exceptional vegetarian protein density with complete amino acid profile."
      },
      lunch: {
        name: "Paneer & Black Bean Burrito Bowl with Brown Basmati Rice",
        portion: "150g grilled low-fat paneer + 1 cup rice & beans",
        calories: 620,
        protein: "38g",
        carbs: "72g",
        fat: "18g",
        notes: "Replenishes hepatic and muscular glycogen post-exercise."
      },
      eveningSnack: {
        name: "Protein Shake with Almond Milk & 1 Medjool Date",
        portion: "1 scoop plant/whey protein + 250ml milk",
        calories: 220,
        protein: "26g",
        carbs: "18g",
        fat: "4g",
        notes: "Rapid protein synthesis trigger for training recovery."
      },
      dinner: {
        name: "Lentil Dahl with Steamed Quinoa and Roasted Asparagus",
        portion: "1 large bowl (300g dahl + 1 cup quinoa)",
        calories: 520,
        protein: "28g",
        carbs: "68g",
        fat: "11g",
        notes: "Clean night meal promoting uninterrupted restorative deep sleep."
      }
    },
    foodsToEmphasize: ["Greek yogurt", "Paneer / Cottage cheese", "Tofu / Tempeh", "Lentils & Chickpeas", "Peanut butter"],
    foodsToLimit: ["Deep-fried savories", "Sugary pre-workout drinks", "Excess vegetable oils", "Processed sweets"],
    vitalTips: [
      "Distribute protein intake evenly across 4-5 eating windows to maximize muscle protein synthesis.",
      "Drink 500ml water with a pinch of pink salt prior to rigorous exercise sessions."
    ]
  },

  "veg-balanced-general": {
    planId: "veg-balanced-general",
    title: "Mediterranean Vegetarian Vitality & Longevity Protocol",
    category: "Vegetarian",
    targetGoal: "All-Day Energy, Gut Health & Optimal Vitals",
    caloriesTarget: "1,850 kcal / day",
    macroRatio: { protein: "80g (18%)", carbs: "225g (50%)", fats: "65g (32%)", fiber: "36g" },
    hydrationGoal: "2.8 Liters / day",
    clinicalBadges: ["Gut Microbiome Friendly", "Balanced Macros", "Antioxidant Rich"],
    medicalRationale: "Curated with prebiotic inulin, colorful phytonutrients, and healthy mono-unsaturated fats to promote sustained all-day vitality.",
    meals: {
      breakfast: {
        name: "Avocado Toast on Sourdough with Soft Poached Paneer & Hemp Seeds",
        portion: "2 slices sourdough + 1/2 avocado",
        calories: 380,
        protein: "16g",
        carbs: "44g",
        fat: "15g",
        notes: "Slow-fermented sourdough provides prebiotic fuel for gut flora."
      },
      midMorningSnack: {
        name: "Seasonal Fruit Bowl (Papaya / Apple) with Walnuts",
        portion: "150g fruit + 15g walnuts",
        calories: 160,
        protein: "4g",
        carbs: "22g",
        fat: "8g",
        notes: "Rich in vitamin C and digestive enzymes."
      },
      lunch: {
        name: "Chickpea & Quinoa Mediterranean Salad with Tahini Drizzle",
        portion: "1.5 cup bowl",
        calories: 510,
        protein: "22g",
        carbs: "66g",
        fat: "17g",
        notes: "Sesame tahini supplies highly bioavailable plant calcium."
      },
      eveningSnack: {
        name: "Spiced Masala Buttermilk (Chaas) with Roasted Makhana",
        portion: "250ml buttermilk + 30g lotus seeds",
        calories: 140,
        protein: "6g",
        carbs: "20g",
        fat: "3g",
        notes: "Probiotics in buttermilk refresh gut digestion."
      },
      dinner: {
        name: "Zucchini & Yellow Lentil Khichdi with Steamed Mixed Vegetables",
        portion: "1.5 cup bowl",
        calories: 440,
        protein: "20g",
        carbs: "62g",
        fat: "9g",
        notes: "Light and comforting evening comfort food that avoids morning puffiness."
      }
    },
    foodsToEmphasize: ["Sprouted grains", "Buttermilk & Yogurt", "Olive oil & Avocado", "Fox nuts (Makhana)", "Colorful peppers"],
    foodsToLimit: ["Packaged instant meals", "Excess tea/coffee after 4 PM", "Refined seed oils", "Sugared treats"],
    vitalTips: [
      "Chew each bite thoroughly to stimulate salivary amylase and ease stomach digestion.",
      "Enjoy a 12-hour overnight digestive rest window between dinner and breakfast."
    ]
  },

  // --- NON-VEGETARIAN PLANS ---
  "nonveg-diabetes-moderate": {
    planId: "nonveg-diabetes-moderate",
    title: "Lean-Protein Insulin-Sensitizing Non-Veg Protocol",
    category: "Non-Vegetarian",
    targetGoal: "HbA1c Reduction & Lean Tissue Preservation",
    caloriesTarget: "1,700 kcal / day",
    macroRatio: { protein: "110g (26%)", carbs: "160g (38%)", fats: "60g (36%)", fiber: "34g" },
    hydrationGoal: "3.0 Liters / day",
    clinicalBadges: ["Low Carb / High Protein", "HbA1c Optimizing", "Zero Added Sugar"],
    medicalRationale: "Combines high-satiety lean poultry and wild fish with non-starchy vegetables to flatten blood sugar fluctuations.",
    meals: {
      breakfast: {
        name: "Spinach & Herb 3-Egg White Omelet with 1 Whole Egg & Avocado",
        portion: "3 whites + 1 whole egg + 1/4 avocado",
        calories: 290,
        protein: "24g",
        carbs: "6g",
        fat: "18g",
        notes: "Choline in egg yolk supports liver metabolic fat clearance."
      },
      midMorningSnack: {
        name: "Greek Yogurt with Crushed Flaxseeds & Ceylon Cinnamon",
        portion: "150g unsweetened yogurt",
        calories: 130,
        protein: "14g",
        carbs: "7g",
        fat: "4g",
        notes: "Enhances insulin sensitivity through bioactive cinnamon compounds."
      },
      lunch: {
        name: "Grilled Chicken Breast Salad with Olive Oil, Cucumber & Quinoa",
        portion: "150g chicken breast + 1/2 cup quinoa",
        calories: 480,
        protein: "42g",
        carbs: "34g",
        fat: "16g",
        notes: "High satiety score prevents mid-afternoon sugar cravings."
      },
      eveningSnack: {
        name: "Boiled Egg with Paprika & Celery Sticks",
        portion: "1 large egg + raw celery",
        calories: 90,
        protein: "7g",
        carbs: "2g",
        fat: "6g",
        notes: "Zero-carb bridge preventing dinner overeating."
      },
      dinner: {
        name: "Pan-Seared Salmon Fillet with Steamed Asparagus & Cauliflower Mash",
        portion: "140g wild salmon + 150g mash",
        calories: 440,
        protein: "36g",
        carbs: "14g",
        fat: "24g",
        notes: "Omega-3 fatty acids attenuate microvascular diabetic inflammation."
      }
    },
    foodsToEmphasize: ["Skinless chicken breast", "Wild salmon & Mackerel", "Eggs", "Cauliflower & Asparagus", "Olive oil"],
    foodsToLimit: ["Breaded / fried chicken", "Processed bacon/sausages", "White pasta", "Sugary marinades & BBQ sauce"],
    vitalTips: [
      "Prioritize protein first at every meal, vegetables second, and complex carbs last to blunt glucose spikes.",
      "Keep fasting glucose logs synced with Medscope records every Monday morning."
    ]
  },

  "nonveg-active-fitness": {
    planId: "nonveg-active-fitness",
    title: "High-Performance Athlete Lean Muscle Building Plan",
    category: "Non-Vegetarian",
    targetGoal: "Max Hypertrophy, Power Output & Rapid Recovery",
    caloriesTarget: "2,500 kcal / day",
    macroRatio: { protein: "165g (27%)", carbs: "290g (46%)", fats: "75g (27%)", fiber: "38g" },
    hydrationGoal: "3.8 - 4.2 Liters / day",
    clinicalBadges: ["High Protein 165g", "Athletic Fueling", "Creatine & Zinc Rich"],
    medicalRationale: "Formulated for active individuals needing maximal glycogen reloading and amino acid availability for intense training.",
    meals: {
      breakfast: {
        name: "4-Egg Scramble with Turkey Bacon, Sourdough & Roasted Tomatoes",
        portion: "2 whole eggs + 2 whites + 2 slices sourdough",
        calories: 510,
        protein: "36g",
        carbs: "48g",
        fat: "18g",
        notes: "Provides immediate B-vitamins and sustained amino acid delivery."
      },
      midMorningSnack: {
        name: "Whey Protein Shake with Banana & Natural Peanut Butter",
        portion: "1 scoop whey + 1 banana + 15g PB",
        calories: 320,
        protein: "30g",
        carbs: "34g",
        fat: "8g",
        notes: "Fast-absorbing whey triggers post-morning training hypertrophy."
      },
      lunch: {
        name: "Herb Grilled Chicken Breast with Sweet Potato Mash & Green Beans",
        portion: "180g chicken breast + 200g sweet potato",
        calories: 640,
        protein: "48g",
        carbs: "66g",
        fat: "14g",
        notes: "Complex beta-carotene carbohydrates reload intramuscular glycogen."
      },
      eveningSnack: {
        name: "Canned Tuna Salad on Whole Grain Crackers",
        portion: "100g light tuna + 4 crackers",
        calories: 220,
        protein: "24g",
        carbs: "18g",
        fat: "4g",
        notes: "Lean and high-protein snack that prevents catabolic muscle breakdown."
      },
      dinner: {
        name: "Grilled Steak or Salmon Fillet with Brown Basmati Rice & Broccoli",
        portion: "160g protein + 1 cup rice + veggies",
        calories: 610,
        protein: "44g",
        carbs: "58g",
        fat: "18g",
        notes: "Provides natural creatine, bioavailable iron, and zinc for hormone optimization."
      }
    },
    foodsToEmphasize: ["Lean turkey & Chicken", "Wild salmon & Tuna", "Pasture-raised eggs", "Sweet potatoes", "Avocados"],
    foodsToLimit: ["Deep-fried fast food", "Processed meats with nitrates", "Sugary sports beverages", "Trans fats"],
    vitalTips: [
      "Consume your post-workout meal within 90 minutes of completing resistance training.",
      "Monitor electrolyte balance (sodium, potassium, magnesium) during high-sweat sessions."
    ]
  },

  "nonveg-hypertension-heart": {
    planId: "nonveg-hypertension-heart",
    title: "Mediterranean Low-Sodium Cardio-Care Non-Veg Plan",
    category: "Non-Vegetarian",
    targetGoal: "Endothelial Protection & Blood Pressure Regulation",
    caloriesTarget: "1,750 kcal / day",
    macroRatio: { protein: "95g (22%)", carbs: "195g (45%)", fats: "60g (33%)", fiber: "36g" },
    hydrationGoal: "2.8 Liters / day",
    clinicalBadges: ["Heart Healthy", "DASH Certified", "Omega-3 Fortified"],
    medicalRationale: "Leverages EPA/DHA from fatty cold-water fish and monounsaturated extra virgin olive oil to lower arterial vascular resistance.",
    meals: {
      breakfast: {
        name: "Poached Eggs on Multigrain Toast with Crushed Avocado & Tomato",
        portion: "2 poached eggs + 1 slice multigrain",
        calories: 320,
        protein: "16g",
        carbs: "26g",
        fat: "16g",
        notes: "Potassium in avocado balances cellular sodium levels."
      },
      midMorningSnack: {
        name: "Fresh Walnut Halves with Kiwi Slices",
        portion: "20g walnuts + 1 kiwi",
        calories: 160,
        protein: "4g",
        carbs: "16g",
        fat: "10g",
        notes: "Kiwifruit is proven in clinical trials to assist systolic BP reduction."
      },
      lunch: {
        name: "Baked Lemon & Dill Cod Fillet with Roasted Potatoes & Greek Salad",
        portion: "150g cod fillet + 1 small potato + salad",
        calories: 460,
        protein: "36g",
        carbs: "42g",
        fat: "14g",
        notes: "High in lean protein, zero saturated fat burden on coronary vessels."
      },
      eveningSnack: {
        name: "Low-Fat Cottage Cheese with Blueberries & Flaxseed Dust",
        portion: "120g cottage cheese",
        calories: 140,
        protein: "15g",
        carbs: "12g",
        fat: "3g",
        notes: "Calcium and magnesium synergistic blend supports vascular tone."
      },
      dinner: {
        name: "Herb-Roasted Turkey Cutlet with Steamed Asparagus & Quinoa Pilaf",
        portion: "130g turkey + 1/2 cup quinoa",
        calories: 420,
        protein: "34g",
        carbs: "40g",
        fat: "10g",
        notes: "Low sodium, highly digestible lean protein aiding overnight vascular relaxation."
      }
    },
    foodsToEmphasize: ["Cod, Salmon, Sardines", "Skinless turkey", "Extra virgin olive oil", "Asparagus", "Walnuts"],
    foodsToLimit: ["Red meat steaks", "Bacon, ham & sausages", "Cured fish (anchovies with salt)", "Store-bought dressings"],
    vitalTips: [
      "Cook with fresh herbs, lemon juice, and roasted garlic rather than table salt.",
      "Check resting blood pressure in the morning before breakfast."
    ]
  },

  // --- VEGAN PLANS ---
  "vegan-balanced-wellness": {
    planId: "vegan-balanced-wellness",
    title: "Rainbow Whole-Food Plant Protocol",
    category: "Vegan",
    targetGoal: "Cellular Detoxification, Energy & Digestive Health",
    caloriesTarget: "1,800 kcal / day",
    macroRatio: { protein: "80g (18%)", carbs: "245g (54%)", fats: "55g (28%)", fiber: "45g" },
    hydrationGoal: "3.0 Liters / day",
    clinicalBadges: ["100% Plant Based", "Zero Cholesterol", "Prebiotic & Probiotic Dense"],
    medicalRationale: "Packed with polyphenols, beta-glucan, and clean plant proteins to optimize lipid profiles and rejuvenate gut flora.",
    meals: {
      breakfast: {
        name: "Creamy Overnight Oats with Chia Seeds, Soy Milk & Mango Slices",
        portion: "1 jar (60g oats + 200ml fortified soy milk)",
        calories: 380,
        protein: "16g",
        carbs: "58g",
        fat: "9g",
        notes: "Fortified with Vitamin B12 and Vitamin D3 for essential vegan nutrition."
      },
      midMorningSnack: {
        name: "Spiced Roasted Pumpkin Seeds & Brazil Nuts",
        portion: "25g seeds + 2 Brazil nuts",
        calories: 160,
        protein: "7g",
        carbs: "5g",
        fat: "13g",
        notes: "Provides 100% daily recommended Selenium for thyroid hormone support."
      },
      lunch: {
        name: "Tempeh & Edamame Nourish Bowl with Brown Rice & Tahini Drizzle",
        portion: "100g organic tempeh + 1 cup brown rice & greens",
        calories: 520,
        protein: "30g",
        carbs: "62g",
        fat: "16g",
        notes: "Fermented tempeh provides bioactive peptides and easy digestion."
      },
      eveningSnack: {
        name: "Turmeric Ginger Herbal Elixir with Roasted Makhana",
        portion: "1 mug herbal tea + 30g roasted lotus seeds",
        calories: 120,
        protein: "4g",
        carbs: "20g",
        fat: "2g",
        notes: "Potent anti-inflammatory curcumin reduces evening joint stiffness."
      },
      dinner: {
        name: "Rich Lentil Shepherd's Pie with Sweet Potato Mash & Steamed Broccoli",
        portion: "1 individual casserole serving (300g)",
        calories: 450,
        protein: "22g",
        carbs: "68g",
        fat: "8g",
        notes: "Comforting, high-fiber, low-fat plant dinner promoting deep restorative sleep."
      }
    },
    foodsToEmphasize: ["Organic Tempeh & Tofu", "Fortified soy milk", "Hemp seeds & Chia", "Edamame", "Dark berries"],
    foodsToLimit: ["Ultra-processed vegan junk meat", "Palm oil based vegan cheeses", "High-fructose corn syrups"],
    vitalTips: [
      "Ensure daily intake of a sublingual B12 supplement (1,000 mcg weekly or 100 mcg daily).",
      "Pair iron-rich lentils with lemon juice to increase non-heme iron absorption."
    ]
  },

  "vegan-active-performance": {
    planId: "vegan-active-performance",
    title: "High-Octane Vegan Strength & Endurance Fuel",
    category: "Vegan",
    targetGoal: "High Volume Plant-Protein Hypertrophy & Athletic Stamina",
    caloriesTarget: "2,400 kcal / day",
    macroRatio: { protein: "135g (23%)", carbs: "310g (52%)", fats: "65g (25%)", fiber: "48g" },
    hydrationGoal: "3.8 Liters / day",
    clinicalBadges: ["High Protein 135g Vegan", "BCAA Fortified", "Zero Animal Fat"],
    medicalRationale: "Combines pea, rice, and soy proteins with complex starches for rapid glycogen replenishment and muscular stamina.",
    meals: {
      breakfast: {
        name: "Pea Protein Power Oatmeal with Peanut Butter & Blueberries",
        portion: "70g oats + 1 scoop pea protein + 20g peanut butter",
        calories: 520,
        protein: "38g",
        carbs: "62g",
        fat: "15g",
        notes: "Optimal leucine ratio to trigger morning protein synthesis."
      },
      midMorningSnack: {
        name: "Sprouted Moong Salad with Lemon, Cucumber & Roasted Almonds",
        portion: "150g sprouted beans + 20g almonds",
        calories: 240,
        protein: "14g",
        carbs: "26g",
        fat: "9g",
        notes: "Living enzymes and bioavailable minerals for cellular hydration."
      },
      lunch: {
        name: "Tofu & Seitan Stir-Fry with Soba Buckwheat Noodles & Sesame Greens",
        portion: "120g firm tofu + 50g seitan + 1.5 cup noodles",
        calories: 640,
        protein: "44g",
        carbs: "74g",
        fat: "16g",
        notes: "Complete amino acid profile matching whey protein potency."
      },
      eveningSnack: {
        name: "Plant Protein Shake with Oat Milk & Rice Cakes with Jam",
        portion: "1 scoop protein + 2 rice cakes",
        calories: 260,
        protein: "26g",
        carbs: "30g",
        fat: "3g",
        notes: "Fast carbohydrate and protein combination for workout recovery."
      },
      dinner: {
        name: "Black Bean & Sweet Potato Chili with Quinoa & Avocado Slices",
        portion: "1 large bowl (350g chili + 1/2 cup quinoa)",
        calories: 560,
        protein: "26g",
        carbs: "84g",
        fat: "14g",
        notes: "High potassium and magnesium profile to prevent muscle cramping."
      }
    },
    foodsToEmphasize: ["Seitan & Tofu", "Pea / Rice protein isolate", "Nut butters", "Soba noodles", "Quinoa"],
    foodsToLimit: ["Deep-fried vegan snacks", "High-sodium canned fake meats", "Refined sugar desserts"],
    vitalTips: [
      "Combine grains (rice/oats) with legumes (beans/lentils) to guarantee all 9 essential amino acids.",
      "Stay consistently hydrated during workouts with coconut water or electrolyte powder."
    ]
  },

  // --- MIXED / FLEXITARIAN PLANS ---
  "mixed-pcos-hormone": {
    planId: "mixed-pcos-hormone",
    title: "Hormone-Balancing & Anti-Inflammatory Flexitarian Protocol",
    category: "Mixed / Flexitarian",
    targetGoal: "PCOS/PCOD Insulin Resistance Relief & Hormonal Harmony",
    caloriesTarget: "1,750 kcal / day",
    macroRatio: { protein: "100g (23%)", carbs: "165g (38%)", fats: "70g (39%)", fiber: "36g" },
    hydrationGoal: "3.0 Liters / day",
    clinicalBadges: ["PCOS & Thyroid Optimized", "Low Inflammatory Index", "Zinc & Inositol Rich"],
    medicalRationale: "Formulated specifically to lower circulating insulin and androgens, promoting regular ovulation and stable energy.",
    meals: {
      breakfast: {
        name: "Spinach, Tomato & 2 Pasture-Raised Eggs with Pumpkin Seeds",
        portion: "2 whole eggs + 1 tbsp raw pumpkin seeds",
        calories: 310,
        protein: "20g",
        carbs: "8g",
        fat: "22g",
        notes: "Zinc in pumpkin seeds blocks excess 5-alpha reductase activity."
      },
      midMorningSnack: {
        name: "Spearmint Tea with a Handful of Soaked Walnuts",
        portion: "1 mug organic spearmint tea + 20g walnuts",
        calories: 140,
        protein: "3g",
        carbs: "4g",
        fat: "13g",
        notes: "Spearmint tea has clinically proven anti-androgenic benefits for PCOS."
      },
      lunch: {
        name: "Grilled Herb Salmon Salad with Avocado, Olive Oil & Brown Rice",
        portion: "120g wild salmon + 1/2 cup brown rice",
        calories: 520,
        protein: "34g",
        carbs: "38g",
        fat: "24g",
        notes: "Omega-3 fatty acids regulate ovarian follicle inflammation."
      },
      eveningSnack: {
        name: "Roasted Spiced Edamame with a Touch of Sea Salt",
        portion: "50g dry roasted edamame",
        calories: 160,
        protein: "14g",
        carbs: "10g",
        fat: "6g",
        notes: "Plant isoflavones gently support endocrine balance."
      },
      dinner: {
        name: "Slow-Cooked Chicken Breast Stew with Brassica Veggies (Broccoli/Kale)",
        portion: "140g chicken breast + 1.5 cup vegetable broth bowl",
        calories: 440,
        protein: "38g",
        carbs: "22g",
        fat: "14g",
        notes: "Diindolylmethane (DIM) in brassica veggies aids healthy estrogen metabolism."
      }
    },
    foodsToEmphasize: ["Wild fatty fish", "Spearmint tea", "Pumpkin seeds", "Broccoli & Brussels sprouts", "Avocados"],
    foodsToLimit: ["Commercial dairy with added hormones", "Refined grains", "Sugary milkshakes", "Industrial trans fats"],
    vitalTips: [
      "Drink 2 cups of pure spearmint tea daily (morning and late afternoon).",
      "Avoid eating late night sugary snacks to keep fasting insulin low."
    ]
  },

  "mixed-stress-sleep": {
    planId: "mixed-stress-sleep",
    title: "Cortisol-Regulating & Restorative Sleep Flexitarian Plan",
    category: "Mixed / Flexitarian",
    targetGoal: "Adrenal Calm, Stress Relief & Deep Slow-Wave Sleep",
    caloriesTarget: "1,850 kcal / day",
    macroRatio: { protein: "95g (21%)", carbs: "210g (45%)", fats: "65g (34%)", fiber: "35g" },
    hydrationGoal: "2.8 Liters / day",
    clinicalBadges: ["Magnesium & Tryptophan Rich", "Adrenal Support", "Cortisol Lowering"],
    medicalRationale: "Packed with natural tryptophan, vitamin B6, and magnesium to facilitate melatonin synthesis and reduce evening sympathetic nervous arousal.",
    meals: {
      breakfast: {
        name: "Warm Spiced Oatmeal with Chia, Crushed Almonds & 2 Soft Boiled Eggs",
        portion: "45g oats + 2 eggs",
        calories: 420,
        protein: "22g",
        carbs: "42g",
        fat: "17g",
        notes: "Complex carbs combined with complete protein prevents morning cortisol surge."
      },
      midMorningSnack: {
        name: "Chamomile Infusion with 2 Dark Chocolate Squares (85%)",
        portion: "1 mug tea + 20g dark chocolate",
        calories: 130,
        protein: "2g",
        carbs: "10g",
        fat: "9g",
        notes: "Flavanols reduce salivary cortisol and alleviate perceived mental stress."
      },
      lunch: {
        name: "Grilled Lemon Chicken Bowl with Quinoa, Roasted Beets & Spinach",
        portion: "130g chicken breast + 1 cup quinoa bowl",
        calories: 510,
        protein: "38g",
        carbs: "54g",
        fat: "14g",
        notes: "Beetroot betaine supports cellular methylation and liver detox."
      },
      eveningSnack: {
        name: "Warm Almond Milk with Ashwagandha & Nutmeg",
        portion: "200ml unsweetened almond milk + spices",
        calories: 90,
        protein: "3g",
        carbs: "4g",
        fat: "6g",
        notes: "Ashwagandha is an adaptogen clinically proven to lower systemic cortisol."
      },
      dinner: {
        name: "Herb-Baked Turkey Breast with Roasted Sweet Potato & Steamed Green Beans",
        portion: "140g turkey breast + 150g sweet potato",
        calories: 480,
        protein: "36g",
        carbs: "52g",
        fat: "10g",
        notes: "Tryptophan in turkey + sweet potato carbs trigger natural brain melatonin release."
      }
    },
    foodsToEmphasize: ["Turkey & Eggs", "Tart cherries", "Almonds & Pumpkin seeds", "Sweet potatoes", "Ashwagandha & Chamomile"],
    foodsToLimit: ["Caffeine past 1:00 PM", "High-sugar desserts", "Alcohol before sleep", "Heavy spicy meals at night"],
    vitalTips: [
      "Cut off all caffeine consumption at least 8 hours prior to your target bedtime.",
      "Keep dinner light and finish it at least 2.5 hours before lying down."
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. HARDCODED WORKOUT PLANS CATALOG
// ─────────────────────────────────────────────────────────────────────────────

export const WORKOUT_PLANS: Record<string, WorkoutPlan> = {
  // --- LOW INTENSITY PLANS ---
  "low-joint-safe": {
    planId: "low-joint-safe",
    title: "Joint-Safe Restorative Mobility & Low-Impact Flow",
    intensity: "Low Impact",
    duration: "25 minutes",
    estimatedBurn: "120 - 150 kcal",
    frequency: "3 - 5 days / week",
    targetGoal: "Synovial Fluid Circulation & Arthritis/Joint Relief",
    safeForConditions: ["Arthritis", "Hypertension", "Heart condition", "Asthma", "Post-Surgery Recovery"],
    contraindications: ["Avoid jumping", "Avoid heavy spinal loading", "Avoid ballistic movements"],
    warmup: {
      duration: "5 mins",
      movements: [
        "Gentle Neck Rotations (10 reps each side)",
        "Shoulder Rolls & Chest Openers (15 reps)",
        "Seated Torso Twists (10 reps per side)"
      ]
    },
    mainCircuit: [
      {
        name: "Cat-Cow Spinal Wave",
        setsReps: "3 sets • 10 slow reps",
        rest: "30s rest",
        targetArea: "Spinal Decompression & Thoracic Mobility",
        formCue: "Move with your breath: inhale as belly dips, exhale as spine arches gently."
      },
      {
        name: "Glute Bridge with 2-Second Squeeze",
        setsReps: "3 sets • 12 reps",
        rest: "45s rest",
        targetArea: "Glutes, Hamstrings & Lower Back Stabilization",
        formCue: "Drive through heels, squeeze glutes at top without hyperextending lower back."
      },
      {
        name: "Seated Leg Extensions (Chair Friendly)",
        setsReps: "3 sets • 12 reps each leg",
        rest: "30s rest",
        targetArea: "Quadriceps & Knee Joint Lubrication",
        formCue: "Extend leg straight, hold for 1 second to engage quad, lower with control."
      },
      {
        name: "Bird-Dog Core Stability Hold",
        setsReps: "3 sets • 8 reps per side",
        rest: "45s rest",
        targetArea: "Deep Core & Posterior Chain Stability",
        formCue: "Keep hips level to ground; reach opposite arm and leg without arching spine."
      }
    ],
    cooldown: {
      duration: "5 mins",
      movements: [
        "Child's Pose Rest (2 minutes)",
        "Hamstring Towel Stretch (60s each leg)",
        "Diaphragmatic Belly Breathing (2 minutes)"
      ]
    },
    physiologicalBenefit: "Stimulates synovial fluid secretion around cartilage without joint friction; safe for arthritic flare-ups and elevated blood pressure."
  },

  "low-stress-somatic": {
    planId: "low-stress-somatic",
    title: "Vagus Nerve Somatic Reset & Mindful Yoga Flow",
    intensity: "Low Impact",
    duration: "20 minutes",
    estimatedBurn: "90 - 120 kcal",
    frequency: "Daily (Morning or Evening)",
    targetGoal: "Nervous System De-escalation & Sleep Optimization",
    safeForConditions: ["High Stress", "Poor Sleep", "Hypertension", "Anxiety", "Chronic Fatigue"],
    contraindications: ["Avoid forceful exertion", "Avoid rapid position changes"],
    warmup: {
      duration: "4 mins",
      movements: [
        "Box Breathing (4-4-4-4) Seated Hold",
        "Gentle Shoulder Shrugs with Sigh Exhales",
        "Slow Seated Pelvic Tilts"
      ]
    },
    mainCircuit: [
      {
        name: "Supported Downward Dog / Wall Puppy Pose",
        setsReps: "3 sets • 45s hold",
        rest: "30s rest",
        targetArea: "Hamstrings, Calves & Upper Thoracic Opening",
        formCue: "Keep knees slightly bent; focus on lengthening the spine rather than flat feet."
      },
      {
        name: "Supine Reclined Butterfly (Supta Baddha Konasana)",
        setsReps: "2 sets • 90s hold",
        rest: "30s rest",
        targetArea: "Inner Thighs, Psoas & Pelvic Floor Release",
        formCue: "Place pillows beneath outer knees for zero joint tension; place hands over abdomen."
      },
      {
        name: "Gentle Supine Spinal Twist",
        setsReps: "2 sets • 60s each side",
        rest: "30s rest",
        targetArea: "Spinal De-rotation & Digestive Stimulation",
        formCue: "Keep both shoulders grounded on the floor while knees float gently to the side."
      },
      {
        name: "Legs-Up-The-Wall Pose (Viparita Karani)",
        setsReps: "1 set • 4 to 5 minutes",
        rest: "Relaxation",
        targetArea: "Venous Drainage & Parasympathetic Activation",
        formCue: "Rest hips near a wall, legs extended vertically. Breathe deeply into lower belly."
      }
    ],
    cooldown: {
      duration: "4 mins",
      movements: [
        "Corpse Pose (Savasana) (3 minutes)",
        "3 Deep Cleansing Sighs"
      ]
    },
    physiologicalBenefit: "Activates parasympathetic vagal tone, lowering resting heart rate, cortisol secretion, and evening autonomic nervous agitation."
  },

  // --- MODERATE INTENSITY PLANS ---
  "moderate-metabolic-cardio": {
    planId: "moderate-metabolic-cardio",
    title: "Glycemic Step Circuit & Functional Core Protocol",
    intensity: "Moderate Intensity",
    duration: "32 minutes",
    estimatedBurn: "220 - 270 kcal",
    frequency: "4 days / week",
    targetGoal: "Insulin Sensitivity, Glucose Disposal & Cardiovascular Fitness",
    safeForConditions: ["Diabetes", "Mild Hypertension", "PCOS/PCOD", "Thyroid", "Weight Management"],
    contraindications: ["Avoid breath holding (Valsalva)", "Hydrate between circuits"],
    warmup: {
      duration: "5 mins",
      movements: [
        "Brisk In-Place Marching with Arm Swings (2 mins)",
        "Side Step Reaches (1.5 mins)",
        "Ankle & Hip Dynamic Circles (1.5 mins)"
      ]
    },
    mainCircuit: [
      {
        name: "Bodyweight Chair Squats (Tempo 3-1-1)",
        setsReps: "3 sets • 15 reps",
        rest: "45s rest",
        targetArea: "Quadriceps, Glutes & Glycogen Uptake",
        formCue: "Tap chair lightly with hips before standing tall; keeps tension in target muscles."
      },
      {
        name: "Incline Wall or Countertop Push-Ups",
        setsReps: "3 sets • 12 reps",
        rest: "45s rest",
        targetArea: "Pectorals, Anterior Deltoids & Triceps",
        formCue: "Maintain rigid plank line from head to heels; do not let lower back sag."
      },
      {
        name: "Standing Alternating Knee-to-Elbow Marches",
        setsReps: "3 sets • 20 total reps",
        rest: "45s rest",
        targetArea: "Obliques, Core & Heart Rate Conditioning",
        formCue: "Twist through the torso while driving knee upward; control each step."
      },
      {
        name: "Resistance Band or Towel Seated Rows",
        setsReps: "3 sets • 15 reps",
        rest: "45s rest",
        targetArea: "Rhomboids, Latissimus Dorsi & Posture",
        formCue: "Squeeze shoulder blades together for 2 seconds at full contraction."
      },
      {
        name: "Step-Jack Cardio Finisher (Low Impact Jumping Jacks)",
        setsReps: "3 sets • 45s active",
        rest: "30s rest",
        targetArea: "Aerobic Capacity & Capillary Density",
        formCue: "Step one foot out at a time with overhead arms; zero floor impact."
      }
    ],
    cooldown: {
      duration: "5 mins",
      movements: [
        "Standing Quad Stretch with Wall Support (60s each side)",
        "Chest & Bicep Wall Stretch (60s each side)",
        "Calf Stretch on Step (60s each leg)"
      ]
    },
    physiologicalBenefit: "Upregulates GLUT4 glucose transporters independently of insulin; highly effective for reducing 24-hour glycemic variability."
  },

  "moderate-functional-strength": {
    planId: "moderate-functional-strength",
    title: "Full-Body Functional Strength & Postural Balance",
    intensity: "Moderate Intensity",
    duration: "35 minutes",
    estimatedBurn: "250 - 300 kcal",
    frequency: "3 - 4 days / week",
    targetGoal: "Muscle Tone, Bone Density & Everyday Ergonomic Power",
    safeForConditions: ["General Health", "Mild Osteopenia", "Desk Worker Posture", "Thyroid Support"],
    contraindications: ["Avoid rounded back during lifting movements"],
    warmup: {
      duration: "6 mins",
      movements: [
        "Arm Circles & Torso Rotations (2 mins)",
        "Inchworm Walkouts (6 reps)",
        "World's Greatest Stretch (5 reps each side)"
      ]
    },
    mainCircuit: [
      {
        name: "Goblet Squat (Dumbbell or Backpack)",
        setsReps: "3 sets • 12 reps",
        rest: "60s rest",
        targetArea: "Legs, Glutes & Core Stability",
        formCue: "Hold weight at chest height; keep elbows inside knees at bottom of squat."
      },
      {
        name: "Dumbbell Floor Press",
        setsReps: "3 sets • 12 reps",
        rest: "60s rest",
        targetArea: "Chest, Triceps & Shoulder Stability",
        formCue: "Lying flat on floor; upper arms gently touch floor before pressing back up."
      },
      {
        name: "Romanian Deadlift (Hinge Pattern)",
        setsReps: "3 sets • 12 reps",
        rest: "60s rest",
        targetArea: "Hamstrings, Glutes & Erector Spinae",
        formCue: "Push hips backward as if touching a wall; keep slight bend in knees."
      },
      {
        name: "Supported Single-Arm Dumbbell Row",
        setsReps: "3 sets • 10 reps each arm",
        rest: "45s rest",
        targetArea: "Upper Back, Lats & Scapular Retractors",
        formCue: "Pull elbow toward hip; do not twist torso at top of movement."
      },
      {
        name: "Forearm Plank Hold",
        setsReps: "3 sets • 35-45s hold",
        rest: "45s rest",
        targetArea: "Transverse Abdominis & Deep Spine Support",
        formCue: "Keep neck neutral; squeeze glutes and pull navel inward toward spine."
      }
    ],
    cooldown: {
      duration: "5 mins",
      movements: [
        "Child's Pose with Lateral Reach (2 mins)",
        "Seated Figure-4 Glute Stretch (60s each side)",
        "Standing Deep Breaths (1 min)"
      ]
    },
    physiologicalBenefit: "Stimulates osteoblast bone mineral deposition, improves lean muscle-to-fat ratio, and corrects anterior pelvic tilt from prolonged sitting."
  },

  // --- ACTIVE / HIGH INTENSITY PLANS ---
  "active-athletic-hypertrophy": {
    planId: "active-athletic-hypertrophy",
    title: "High-Volume Athletic Strength & Hypertrophy Circuit",
    intensity: "High Intensity",
    duration: "45 minutes",
    estimatedBurn: "380 - 450 kcal",
    frequency: "4 - 5 days / week",
    targetGoal: "Maximum Strength, Muscle Hypertrophy & Athletic Power",
    safeForConditions: ["Active Profiles", "Healthy Vitals", "Condition-Free or Cleared"],
    contraindications: ["Not suitable during acute flare-ups of hypertension or joint arthritis"],
    warmup: {
      duration: "7 mins",
      movements: [
        "Dynamic Leg Swings (Front/Back & Side) (2 mins)",
        "Spiderman Lunge with Thoracic Reach (10 reps total)",
        "Push-Up to Downward Dog (8 reps)",
        "High Knees & Butt Kicks (1.5 mins)"
      ]
    },
    mainCircuit: [
      {
        name: "Bulgarian Split Squats (Dumbbell or Bodyweight)",
        setsReps: "4 sets • 10 reps each leg",
        rest: "60s rest",
        targetArea: "Quadriceps, Gluteus Medius & Unilateral Balance",
        formCue: "Back foot elevated on bench/chair; descend straight down until front thigh is parallel."
      },
      {
        name: "Decline or Explosive Push-Ups",
        setsReps: "4 sets • 12-15 reps",
        rest: "60s rest",
        targetArea: "Upper Pectorals, Deltoids & Triceps",
        formCue: "Feet elevated on surface or push up explosively with full lockout at top."
      },
      {
        name: "Dumbbell Renegade Rows in Pushup Position",
        setsReps: "4 sets • 8 reps each arm",
        rest: "60s rest",
        targetArea: "Anti-Rotational Core, Lats & Biceps",
        formCue: "Widen feet for stability; prevent hips from rocking side-to-side as you row."
      },
      {
        name: "Dumbbell Walking Lunges",
        setsReps: "3 sets • 20 total strides",
        rest: "60s rest",
        targetArea: "Posterior Chain, Hip Flexors & Stamina",
        formCue: "Keep torso upright; gently hover back knee 1 inch above floor."
      },
      {
        name: "Hanging Knee Raises or V-Ups",
        setsReps: "3 sets • 15 reps",
        rest: "45s rest",
        targetArea: "Rectus Abdominis & Hip Flexor Strength",
        formCue: "Curl pelvis upward at top of repetition; control the eccentric lowering phase."
      }
    ],
    cooldown: {
      duration: "6 mins",
      movements: [
        "Deep Pigeon Pose (90s each side)",
        "Standing Lats & Triceps Stretch (60s each arm)",
        "Full Body Shavasana with 4-7-8 Breathing (2 mins)"
      ]
    },
    physiologicalBenefit: "Maximizes mechanical tension and metabolic stress to trigger hypertrophy, VO2 max elevation, and EPOC post-exercise calorie burn."
  },

  "active-hiit-conditioning": {
    planId: "active-hiit-conditioning",
    title: "High-Intensity Functional Metabolic Conditioning (HIIT)",
    intensity: "High Intensity",
    duration: "30 minutes",
    estimatedBurn: "320 - 400 kcal",
    frequency: "3 days / week",
    targetGoal: "Cardiovascular Endurance, Peak VO2 Max & Rapid Calorie Burn",
    safeForConditions: ["Active Individuals", "Cleared Cardiovascular System"],
    contraindications: ["Avoid if resting blood pressure > 140/90 or experiencing chest discomfort"],
    warmup: {
      duration: "5 mins",
      movements: [
        "Light Jogging in Place (2 mins)",
        "Arm Crosses & Torso Twists (1 min)",
        "Air Squats & Inchworms (2 mins)"
      ]
    },
    mainCircuit: [
      {
        name: "Kettlebell or Dumbbell Swings",
        setsReps: "4 sets • 45s work / 15s rest",
        rest: "15s between rounds",
        targetArea: "Explosive Hip Hinge, Glutes & Hamstrings",
        formCue: "Hinge at hips, snap glutes forward; power comes from hips, not arms."
      },
      {
        name: "Mountain Climbers (Rapid Pace)",
        setsReps: "4 sets • 40s work / 20s rest",
        rest: "20s between rounds",
        targetArea: "Shoulder Endurance, Core & Heart Rate",
        formCue: "Keep hips low in line with shoulders; drive knees rapidly toward chest."
      },
      {
        name: "Dumbbell Thrusters (Squat to Overhead Press)",
        setsReps: "4 sets • 10-12 reps",
        rest: "45s rest",
        targetArea: "Full Body Kinetic Chain & Anaerobic Capacity",
        formCue: "Use the upward momentum of the squat to launch dumbbells overhead in one fluid motion."
      },
      {
        name: "Burpees or Speed Sprawls",
        setsReps: "3 sets • 30s work / 30s rest",
        rest: "30s rest",
        targetArea: "Total Body Conditioning & Agility",
        formCue: "Step or jump feet back, chest touches ground, jump up with hands overhead."
      }
    ],
    cooldown: {
      duration: "5 mins",
      movements: [
        "Slow Walking Arm-Swings (2 mins)",
        "Standing Forward Fold with Soft Knees (2 mins)",
        "Deep Chest-Opening Breaths (1 min)"
      ]
    },
    physiologicalBenefit: "Triggers mitochondrial biogenesis and elevates excess post-exercise oxygen consumption (EPOC) for up to 18 hours post-workout."
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESOLVER ENGINE: GET PERSONALIZED DIET & WORKOUT
// ─────────────────────────────────────────────────────────────────────────────

export interface PersonalizedPlanResult {
  dietPlan: DayDietPlan;
  workoutPlan: WorkoutPlan;
  matchReasons: string[];
  personalizedSummary: string;
}

export function getPersonalizedDietAndWorkout(profile: Record<string, any>): PersonalizedPlanResult {
  const dietPref = (profile.diet || "vegetarian").toLowerCase();
  const activityLevel = (profile.activityLevel || "moderate").toLowerCase();
  const conditions = Array.isArray(profile.conditions) ? profile.conditions : [];
  const stressLevel = (profile.stressLevel || "moderate").toLowerCase();
  const sleepQuality = (profile.sleepQuality || "average").toLowerCase();

  const matchReasons: string[] = [];

  // 1. Resolve Diet Plan Key
  let dietKey = "veg-balanced-general";

  const hasDiabetes = conditions.includes("Diabetes");
  const hasHypertension = conditions.includes("Hypertension");
  const hasHeartCondition = conditions.includes("Heart condition");
  const hasArthritis = conditions.includes("Arthritis");
  const hasPCOS = conditions.includes("PCOS/PCOD");
  const isHighStressPoorSleep = stressLevel === "high" || sleepQuality === "poor";

  if (dietPref === "vegetarian") {
    if (hasDiabetes) {
      dietKey = "veg-diabetes-moderate";
      matchReasons.push("Tailored for Type 2 Diabetes with high-fiber, low-GI vegetarian meals.");
    } else if (hasHypertension || hasHeartCondition) {
      dietKey = "veg-hypertension-low";
      matchReasons.push("Adapted to DASH Low-Sodium (<1500mg) cardio guidelines.");
    } else if (activityLevel === "active") {
      dietKey = "veg-active-fitness";
      matchReasons.push("Calibrated with 140g vegetarian protein to support athletic recovery.");
    } else {
      dietKey = "veg-balanced-general";
      matchReasons.push("Curated for balanced Mediterranean vegetarian vitality.");
    }
  } else if (dietPref === "non-vegetarian") {
    if (hasDiabetes) {
      dietKey = "nonveg-diabetes-moderate";
      matchReasons.push("Optimized with lean poultry & wild fish to minimize glycemic spikes.");
    } else if (hasHypertension || hasHeartCondition) {
      dietKey = "nonveg-hypertension-heart";
      matchReasons.push("EPA/DHA rich wild fish protocol configured for vascular health.");
    } else if (activityLevel === "active") {
      dietKey = "nonveg-active-fitness";
      matchReasons.push("Loaded with 165g lean animal & plant protein for peak athletic output.");
    } else {
      dietKey = "nonveg-diabetes-moderate";
      matchReasons.push("Clean lean protein & vegetable regimen for everyday wellness.");
    }
  } else if (dietPref === "vegan") {
    if (activityLevel === "active") {
      dietKey = "vegan-active-performance";
      matchReasons.push("High-octane plant protein formula (135g) engineered for endurance & strength.");
    } else {
      dietKey = "vegan-balanced-wellness";
      matchReasons.push("100% whole-food plant protocol rich in B12, selenium, and prebiotics.");
    }
  } else {
    // Mixed / Flexitarian
    if (hasPCOS) {
      dietKey = "mixed-pcos-hormone";
      matchReasons.push("Formulated with inositol & spearmint anti-androgenic nutrition for PCOS.");
    } else if (isHighStressPoorSleep) {
      dietKey = "mixed-stress-sleep";
      matchReasons.push("Infused with natural tryptophan & magnesium for adrenal calm and deep sleep.");
    } else if (activityLevel === "active") {
      dietKey = "nonveg-active-fitness";
      matchReasons.push("High-protein flexitarian athlete matrix.");
    } else {
      dietKey = "mixed-stress-sleep";
      matchReasons.push("Balanced flexitarian nutrition optimized for energy and stress relief.");
    }
  }

  // 2. Resolve Workout Plan Key
  let workoutKey = "moderate-functional-strength";

  if (activityLevel === "low") {
    if (hasArthritis || hasHeartCondition) {
      workoutKey = "low-joint-safe";
      matchReasons.push("Joint-safe low-impact movements to safeguard knees, back, and heart.");
    } else if (isHighStressPoorSleep) {
      workoutKey = "low-stress-somatic";
      matchReasons.push("Somatic vagus nerve reset designed to lower cortisol and induce restful sleep.");
    } else {
      workoutKey = "low-joint-safe";
      matchReasons.push("Gentle restorative mobility sequence suitable for low daily activity.");
    }
  } else if (activityLevel === "active") {
    if (hasHypertension || hasHeartCondition) {
      // Safety guard: active patient with cardiovascular flag should avoid extreme strain
      workoutKey = "moderate-metabolic-cardio";
      matchReasons.push("Aerobic metabolic protocol to keep heart rate in safe aerobic zones.");
    } else if (conditions.length === 0 || conditions.includes("None")) {
      workoutKey = "active-athletic-hypertrophy";
      matchReasons.push("High-volume progressive hypertrophy & strength conditioning.");
    } else {
      workoutKey = "active-hiit-conditioning";
      matchReasons.push("Dynamic functional conditioning tailored for athletic endurance.");
    }
  } else {
    // Moderate activity level
    if (hasDiabetes || hasPCOS) {
      workoutKey = "moderate-metabolic-cardio";
      matchReasons.push("Targeted compound step circuit to maximize muscle GLUT4 glucose uptake.");
    } else if (isHighStressPoorSleep) {
      workoutKey = "low-stress-somatic";
      matchReasons.push("Calming parasympathetic movement to alleviate chronic daytime stress.");
    } else {
      workoutKey = "moderate-functional-strength";
      matchReasons.push("Full-body ergonomic functional strength and postural realignment.");
    }
  }

  const selectedDiet = DIET_PLANS[dietKey] || DIET_PLANS["veg-balanced-general"];
  const selectedWorkout = WORKOUT_PLANS[workoutKey] || WORKOUT_PLANS["moderate-functional-strength"];

  const summary = `Personalized for ${profile.fullName || "Patient"}: A ${selectedDiet.category} nutritional regimen paired with a ${selectedWorkout.intensity} exercise protocol (${selectedWorkout.duration}).`;

  return {
    dietPlan: selectedDiet,
    workoutPlan: selectedWorkout,
    matchReasons,
    personalizedSummary: summary
  };
}
