export const CAREER_PATHS: Record<string, { roles: string[]; skills: string[]; timeline: number }> = {
  tech: { roles: ["Junior dev", "Mid engineer", "Senior / lead", "Staff / architect"], skills: ["Programming", "System design", "Cloud", "Communication"], timeline: 8 },
  finance: { roles: ["Analyst", "Associate", "Manager", "Director"], skills: ["Modeling", "Compliance", "Excel/BI", "Networking"], timeline: 10 },
  health: { roles: ["Assistant", "Specialist", "Senior clinician", "Lead / admin"], skills: ["Clinical skills", "Patient care", "Regulations", "Leadership"], timeline: 12 },
  creative: { roles: ["Junior creative", "Mid designer", "Art director", "Creative lead"], skills: ["Portfolio", "Tools (Figma/Adobe)", "Storytelling", "Client mgmt"], timeline: 7 },
  business: { roles: ["Coordinator", "Manager", "Senior manager", "Executive"], skills: ["Strategy", "Operations", "Finance basics", "People mgmt"], timeline: 9 },
};

export const SKILL_TARGETS: Record<string, string[]> = {
  "software-engineer": ["Algorithms", "System design", "Testing", "DevOps"],
  "data-analyst": ["SQL", "Statistics", "Visualization", "Python"],
  "product-manager": ["Roadmapping", "User research", "Metrics", "Stakeholder mgmt"],
  "designer": ["UI/UX", "Prototyping", "Design systems", "Research"],
  "marketer": ["SEO/SEM", "Content", "Analytics", "Brand strategy"],
};

export const SIDE_HUSTLES = [
  { id: "freelance", label: "Freelance services", minHrs: 5, minCap: 0, income: 25000, risk: "low" },
  { id: "content", label: "Content / courses", minHrs: 8, minCap: 5000, income: 15000, risk: "medium" },
  { id: "ecommerce", label: "E-commerce / reselling", minHrs: 10, minCap: 20000, income: 35000, risk: "medium" },
  { id: "consulting", label: "Micro-consulting", minHrs: 4, minCap: 0, income: 40000, risk: "low" },
  { id: "saas", label: "Micro-SaaS / tools", minHrs: 15, minCap: 50000, income: 80000, risk: "high" },
  { id: "tutoring", label: "Online tutoring", minHrs: 6, minCap: 0, income: 18000, risk: "low" },
];

export const BUSINESS_IDEAS = [
  { theme: "local-services", label: "Hyper-local services app", capital: 50000, market: 7, comp: 5 },
  { theme: "b2b-saas", label: "Niche B2B workflow tool", capital: 200000, market: 8, comp: 7 },
  { theme: "education", label: "Skill micro-courses", capital: 30000, market: 9, comp: 8 },
  { theme: "health-wellness", label: "Wellness subscription box", capital: 80000, market: 6, comp: 6 },
  { theme: "sustainability", label: "Eco product line", capital: 100000, market: 7, comp: 5 },
];

export const INCOME_GROWTH_LEVERS = [
  { label: "Skill certification", boost: 8, months: 3 },
  { label: "Role switch / promotion", boost: 25, months: 12 },
  { label: "Side income stream", boost: 15, months: 6 },
  { label: "Negotiate raise", boost: 12, months: 1 },
  { label: "Invest surplus", boost: 5, months: 24 },
];

export const CAREER_TIPS = [
  "Build a visible portfolio before switching fields — projects beat credentials alone.",
  "Find 2 mentors: one in your current role, one in your target path.",
  "Schedule quarterly skill audits — top 20% skills drive 80% of opportunities.",
];

export const VALIDATION_STEPS = [
  "Interview 10 target customers before building.",
  "Launch MVP in 4 weeks — validate willingness to pay.",
  "Track unit economics from customer #1.",
  "Pivot or persevere decision at 90-day mark.",
];
