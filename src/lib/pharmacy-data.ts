export type Drug = {
  name: string;
  category: string;
  uses: string;
  sideEffects: string;
  considerations: string;
};

export const drugData: Drug[] = [
  {
    name: 'Lisinopril',
    category: 'ACE Inhibitor',
    uses: 'High blood pressure, heart failure, post-heart attack.',
    sideEffects: 'Dry cough, dizziness, headache, fatigue.',
    considerations: 'Monitor potassium levels and kidney function. Can cause angioedema (rare but serious).',
  },
  {
    name: 'Metformin',
    category: 'Biguanide',
    uses: 'Type 2 diabetes.',
    sideEffects: 'Nausea, diarrhea, stomach upset, metallic taste.',
    considerations: 'Should be taken with meals to reduce GI side effects. Risk of lactic acidosis, especially in patients with kidney impairment.',
  },
  {
    name: 'Atorvastatin (Lipitor)',
    category: 'Statin',
    uses: 'High cholesterol, prevention of cardiovascular disease.',
    sideEffects: 'Muscle pain, headache, nausea, joint pain.',
    considerations: 'Monitor liver enzymes. Risk of myopathy and rhabdomyolysis. Avoid grapefruit juice.',
  },
  {
    name: 'Amoxicillin',
    category: 'Penicillin Antibiotic',
    uses: 'Bacterial infections such as strep throat, pneumonia, ear infections.',
    sideEffects: 'Nausea, vomiting, diarrhea, rash.',
    considerations: 'Check for penicillin allergy. Can cause C. difficile-associated diarrhea.',
  },
  {
    name: 'Sertraline (Zoloft)',
    category: 'SSRI Antidepressant',
    uses: 'Depression, obsessive-compulsive disorder (OCD), panic disorder, PTSD.',
    sideEffects: 'Nausea, dizziness, drowsiness, insomnia, sexual dysfunction.',
    considerations: 'May take 4-6 weeks to see full effect. Risk of serotonin syndrome. Black box warning for suicidal thoughts in young adults.',
  },
  {
    name: 'Levothyroxine (Synthroid)',
    category: 'Thyroid Hormone',
    uses: 'Hypothyroidism (underactive thyroid).',
    sideEffects: 'Generally well-tolerated; if dose is too high, can cause symptoms of hyperthyroidism (e.g., rapid heart rate, weight loss, anxiety).',
    considerations: 'Take on an empty stomach, 30-60 minutes before breakfast. Many drugs and supplements can interfere with absorption.',
  },
  {
    name: 'Ibuprofen (Advil, Motrin)',
    category: 'NSAID',
    uses: 'Pain, fever, inflammation.',
    sideEffects: 'Stomach upset, heartburn, nausea, risk of GI bleeding.',
    considerations: 'Can increase risk of heart attack or stroke. Use with caution in patients with kidney disease or high blood pressure.',
  },
  {
    name: 'Albuterol (ProAir, Ventolin)',
    category: 'Beta-2 Agonist',
    uses: 'Asthma, bronchospasm.',
    sideEffects: 'Tremor, nervousness, fast or pounding heartbeat.',
    considerations: 'This is a rescue inhaler for acute symptoms. Overuse may indicate poor asthma control.',
  },
];
