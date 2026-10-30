import type { RichArticle } from "./types";

const SHELL =
  "Daily travel planning tools that run in your browser. Not financial, legal, or insurance advice. Schedules, policy terms, emissions factors, and quote prices change — verify with carriers, insurers, and operators before you book.";

const CHART = {
  kind: "none" as const,
  title: "Overview",
  caption:
    "Share URL preserves your travel inputs. Planning estimate only — fares, fees, FX, and policies vary.",
};

const HUBS = {
  time: {
    href: "/daily/travel/travel-time-distance",
    label: "Daily life · Travel · Time and distance travel calculators",
  },
  insurance: {
    href: "/daily/travel/travel-insurance",
    label: "Daily life · Travel · Travel insurance calculators",
  },
  eco: {
    href: "/daily/travel/travel-eco-sustainability",
    label: "Daily life · Travel · Eco and sustainable travel calculators",
  },
  group: {
    href: "/daily/travel/travel-group-split",
    label: "Daily life · Travel · Group and split-cost travel calculators",
  },
  business: {
    href: "/daily/travel/travel-business",
    label: "Daily life · Travel · Business travel calculators",
  },
  ai: {
    href: "/daily/travel/travel-ai-tools",
    label: "Daily life · Travel · AI-assisted travel planning calculators",
  },
  compare: {
    href: "/daily/travel/travel-bonus-comparisons",
    label: "Daily life · Travel · Quote and comparison travel calculators",
  },
} as const;

function article(
  slug: string,
  heading: string,
  paragraphs: string[],
  faq: { question: string; answer: string },
  seoTitle: string,
  seoDescription: string,
  keywords: string[],
  hub: { href: string; label: string },
  tableRows: string[][],
): RichArticle {
  return {
    slug,
    vertical: "finance-loan",
    category: "daily",
    shellNote: SHELL,
    sections: [{ heading, paragraphs }],
    tables: [
      {
        title: "Travel planning tools",
        columnHeaders: ["Tool", "Core idea"],
        rows: tableRows,
      },
    ],
    chart: CHART,
    faq: [faq],
    meta: { seoTitle, seoDescription, keywords },
    hubHref: hub.href,
    hubLabel: hub.label,
  };
}

const TIME_ROWS = [
  ["Drive time", "Distance ÷ speed"],
  ["Time zone difference", "Dest UTC offset − origin"],
  ["Jet lag", "Zones crossed ÷ 1.5 (rough)"],
  ["Average speed", "Distance ÷ hours"],
];

const INSURANCE_ROWS = [
  ["Premium estimate", "Trip cost × premium %"],
  ["Cancellation cover value", "Premium vs claim value"],
  ["Medical cover compare", "Cover A vs B limits"],
  ["Gear cover", "Gear value × cover %"],
];

const ECO_ROWS = [
  ["Carbon footprint", "Distance × kg CO₂/km"],
  ["Offset cost", "Tons CO₂ × price/ton"],
  ["Train vs fly", "Compare kg CO₂ options"],
  ["Eco hotel premium", "Eco rate − standard rate"],
];

const GROUP_ROWS = [
  ["Group expense split", "Expense ÷ people"],
  ["Shared lodging", "Lodging ÷ people"],
  ["Pooled fuel", "Fuel ÷ people"],
  ["Tour per head", "Package ÷ people"],
];

const BUSINESS_ROWS = [
  ["Business per diem", "Per diem × days"],
  ["Reimbursable mileage", "Miles × rate/mile"],
  ["Blended trip cost", "Total × business share %"],
  ["Client billable travel", "Cost × (1 + markup %)"],
];

const AI_ROWS = [
  ["AI budget envelope", "Base itinerary budget envelope"],
  ["Scenario cost tweak", "Base × (1 ± tweak %)"],
  ["Alt destination cost", "Dest A vs Dest B totals"],
];

const COMPARE_ROWS = [
  ["Package quotes", "Quote A vs B"],
  ["Insurance quotes", "Premium A vs B"],
  ["Transport bundle", "Bundle A vs B"],
  ["OTA vs direct", "OTA price vs direct price"],
];

export const TRAVEL_MISC_ARTICLES: Record<string, RichArticle> = {
  "travel-drive-time-calculator": article(
    "travel-drive-time-calculator",
    "Drive time",
    [
      "Estimates driving hours from distance and average speed for road-trip scheduling.",
      "Traffic, borders, and breaks add time — pad long days and avoid planning to the minute.",
    ],
    {
      question: "What average speed should I use?",
      answer:
        "Highway days might use 80–100 km/h average including stops; mountain or city routes need much lower speeds.",
    },
    "Drive Time Calculator — Distance ÷ Average Speed",
    "Estimate road-trip drive time from distance and speed. Planning aid — traffic and breaks vary.",
    ["drive time calculator", "road trip hours", "distance speed time"],
    HUBS.time,
    TIME_ROWS,
  ),
  "travel-time-zone-difference-calculator": article(
    "travel-time-zone-difference-calculator",
    "Time zone difference",
    [
      "Computes the hour difference between two UTC offsets so you can schedule calls and arrivals correctly.",
      "Daylight saving shifts offsets seasonally — use the offsets valid on your travel dates.",
    ],
    {
      question: "Is the difference always dest minus origin?",
      answer:
        "Yes in this tool: positive means destination clocks are ahead of origin by that many hours.",
    },
    "Time Zone Difference Calculator — UTC Offset Delta",
    "Find hour difference between origin and destination time zones. Travel scheduling — DST rules vary.",
    ["time zone difference calculator", "utc offset travel", "flight arrival local time"],
    HUBS.time,
    TIME_ROWS,
  ),
  "travel-jet-lag-adjustment-estimator": article(
    "travel-jet-lag-adjustment-estimator",
    "Jet lag adjustment",
    [
      "Gives a rough recovery-day estimate from time zones crossed (teaching heuristic ≈ zones ÷ 1.5).",
      "Eastbound flights often feel harder than westbound — treat the result as a planning hint, not medical advice.",
    ],
    {
      question: "Can I reduce jet lag with this number?",
      answer:
        "The estimate only sizes recovery. Light, sleep timing, and hydration help; ask a clinician for medical concerns.",
    },
    "Jet Lag Adjustment Estimator — Zones Crossed Recovery",
    "Roughly estimate jet-lag recovery days from zones crossed. Travel wellness hint — not medical advice.",
    ["jet lag estimator", "time zones crossed recovery", "jet lag days calculator"],
    HUBS.time,
    TIME_ROWS,
  ),
  "travel-average-speed-trip-calculator": article(
    "travel-average-speed-trip-calculator",
    "Average speed trip",
    [
      "Divides trip distance by total hours to show realized average speed including stops.",
      "Useful after a drive day to set more realistic speeds for the next leg of a road trip.",
    ],
    {
      question: "Should hours include overnight rests?",
      answer:
        "Use moving-day hours only if you want driving average. Include full calendar time if measuring door-to-door pace.",
    },
    "Average Speed Trip Calculator — Distance ÷ Hours",
    "Calculate trip average speed from distance and elapsed hours. Road planning — conditions change results.",
    ["average speed trip calculator", "trip average kmh", "road trip pace"],
    HUBS.time,
    TIME_ROWS,
  ),
  "travel-insurance-premium-estimator": article(
    "travel-insurance-premium-estimator",
    "Insurance premium estimate",
    [
      "Estimates a travel insurance premium as a percent of trip cost for rough budgeting.",
      "Age, destination, adventure sports, and medical history change real quotes — get a formal offer before buying.",
    ],
    {
      question: "Is a percent of trip cost accurate?",
      answer:
        "It is a teaching shortcut only. Insurers price by risk factors, not a fixed percent of hotel and airfare.",
    },
    "Travel Insurance Premium Estimator — % of Trip Cost",
    "Roughly estimate travel insurance premium from trip cost and percent. Planning aid — not a policy quote.",
    ["travel insurance premium estimator", "trip insurance cost", "insurance percent of trip"],
    HUBS.insurance,
    INSURANCE_ROWS,
  ),
  "travel-cancellation-cover-value-calculator": article(
    "travel-cancellation-cover-value-calculator",
    "Cancellation cover value",
    [
      "Compares cancellation-cover premium to the trip amount you could reclaim if you cancel for a covered reason.",
      "Exclusions (change of mind, some pandemics, pre-existing conditions) matter more than the headline limit.",
    ],
    {
      question: "When is cancellation cover worth buying?",
      answer:
        "When non-refundable trip cost is high and you have covered risks. Read exclusions before relying on it.",
    },
    "Cancellation Cover Value Calculator — Premium vs Claim",
    "Weigh cancellation insurance premium against potential reclaim value. Policy planning — exclusions apply.",
    ["cancellation cover value", "trip cancel insurance worth", "cancel for any reason value"],
    HUBS.insurance,
    INSURANCE_ROWS,
  ),
  "travel-medical-cover-comparison-calculator": article(
    "travel-medical-cover-comparison-calculator",
    "Medical cover comparison",
    [
      "Compares two medical cover limit amounts so you can see which policy offers higher emergency medical ceiling.",
      "Evacuation, dental, and deductible terms differ — limits alone do not make a full policy comparison.",
    ],
    {
      question: "How much medical cover do travelers need?",
      answer:
        "It depends on destination healthcare costs and your health. Many aim for high limits in the US and remote areas.",
    },
    "Medical Cover Comparison Calculator — Policy Limit A vs B",
    "Compare travel medical cover limits side by side. Insurance planning — read full policy wording.",
    ["medical cover comparison", "travel medical insurance limit", "emergency medical cover compare"],
    HUBS.insurance,
    INSURANCE_ROWS,
  ),
  "travel-gear-cover-calculator": article(
    "travel-gear-cover-calculator",
    "Gear cover",
    [
      "Estimates gear/baggage cover as a percent of declared gear value for cameras, sports kit, or electronics.",
      "Single-item sub-limits often cap expensive cameras below total gear value — check item caps on the policy.",
    ],
    {
      question: "Does home contents insurance cover travel gear?",
      answer:
        "Sometimes with limits and exclusions. Travel policies may be clearer for overseas theft — verify both.",
    },
    "Gear Cover Calculator — Baggage and Equipment Cover %",
    "Estimate travel gear cover from equipment value and cover percent. Policy aid — item sub-limits apply.",
    ["gear cover calculator", "travel equipment insurance", "baggage cover percent"],
    HUBS.insurance,
    INSURANCE_ROWS,
  ),
  "travel-trip-carbon-footprint-estimator": article(
    "travel-trip-carbon-footprint-estimator",
    "Trip carbon footprint",
    [
      "Estimates trip CO₂ from distance and an emissions factor (kg CO₂ per km) you enter for the mode.",
      "Radiative forcing for flights and occupancy assumptions change published factors — use a trusted source.",
    ],
    {
      question: "Is this exact enough for reporting?",
      answer:
        "No — it is a planning estimate. Corporate or official reporting needs approved methodologies and factors.",
    },
    "Trip Carbon Footprint Estimator — Distance × kg CO₂/km",
    "Estimate trip CO₂ from distance and an emissions factor. Eco planning — factors vary by mode and source.",
    ["trip carbon footprint", "travel co2 calculator", "kg co2 per km trip"],
    HUBS.eco,
    ECO_ROWS,
  ),
  "travel-carbon-offset-cost-calculator": article(
    "travel-carbon-offset-cost-calculator",
    "Carbon offset cost",
    [
      "Multiplies estimated tons of CO₂ by a price per ton to budget voluntary carbon offset spend.",
      "Offset quality varies widely — research project standards; offsets do not replace reducing emissions.",
    ],
    {
      question: "Should I offset instead of taking the train?",
      answer:
        "Prefer lower-emission modes when practical. Offsets are a residual tool, not a substitute for reduction.",
    },
    "Carbon Offset Cost Calculator — Tons × Price per Ton",
    "Estimate voluntary carbon offset cost from tons CO₂ and price/ton. Eco budget aid — project quality varies.",
    ["carbon offset cost calculator", "offset trip emissions", "co2 offset price"],
    HUBS.eco,
    ECO_ROWS,
  ),
  "travel-train-vs-fly-emissions-calculator": article(
    "travel-train-vs-fly-emissions-calculator",
    "Train vs fly emissions",
    [
      "Compares entered kg CO₂ for train versus flight options on the same corridor to highlight the lower-emission choice.",
      "Door-to-door time and price still matter — use emissions as one axis alongside schedule and budget.",
    ],
    {
      question: "Why can train beat short-haul flights so clearly?",
      answer:
        "Short flights have high per-km emissions and airport overhead. Efficient rail often has a much lower factor.",
    },
    "Train vs Fly Emissions Calculator — Compare kg CO₂",
    "Compare train and flight CO₂ estimates for the same trip. Sustainable travel aid — factors vary.",
    ["train vs fly emissions", "rail vs plane co2", "lower emission travel compare"],
    HUBS.eco,
    ECO_ROWS,
  ),
  "travel-eco-hotel-premium-calculator": article(
    "travel-eco-hotel-premium-calculator",
    "Eco hotel premium",
    [
      "Shows how much more an eco-certified or greener hotel costs versus a standard comparable rate.",
      "Certifications and practices differ — a higher price alone does not prove lower impact.",
    ],
    {
      question: "Is the premium always worth paying?",
      answer:
        "It depends on your values and what the property actually improves (energy, waste, community). Read the claims.",
    },
    "Eco Hotel Premium Calculator — Green Rate vs Standard",
    "Calculate the price premium of an eco hotel versus a standard stay. Green travel planning — claims vary.",
    ["eco hotel premium", "green hotel price difference", "sustainable lodging premium"],
    HUBS.eco,
    ECO_ROWS,
  ),
  "travel-group-expense-split-calculator": article(
    "travel-group-expense-split-calculator",
    "Group expense split",
    [
      "Divides a shared trip expense equally among people for simple group settlements.",
      "Uneven rooms or prepaid items may need weighted splits after the equal baseline.",
    ],
    {
      question: "Who should collect and pay?",
      answer:
        "Pick one paymaster per expense or use a settle-up app. Keep receipts for opaque FX conversions.",
    },
    "Group Expense Split Calculator — Shared Trip Costs",
    "Split shared travel expenses equally among group members. Group trip aid — FX and tips vary.",
    ["group expense split calculator", "split trip costs", "travel settle up"],
    HUBS.group,
    GROUP_ROWS,
  ),
  "travel-shared-accommodation-per-person-calculator": article(
    "travel-shared-accommodation-per-person-calculator",
    "Shared accommodation per person",
    [
      "Divides lodging cost by number of guests sharing the room or rental.",
      "Couples sometimes split 50/50 while friends split by bed count — agree before booking.",
    ],
    {
      question: "Do cleaning fees split the same way?",
      answer:
        "Usually yes for equal shares. Add cleaning into lodging total before dividing for a fair per-person night cost.",
    },
    "Shared Accommodation per Person Calculator — Room Split",
    "Calculate lodging cost per person for shared rooms or rentals. Group stay aid — house rules vary.",
    ["shared accommodation per person", "split hotel cost", "Airbnb per person"],
    HUBS.group,
    GROUP_ROWS,
  ),
  "travel-pooled-fuel-split-calculator": article(
    "travel-pooled-fuel-split-calculator",
    "Pooled fuel split",
    [
      "Splits road-trip fuel cost equally among passengers who agreed to share the tank.",
      "Drivers sometimes take a smaller share if they also provide the car — adjust manually if needed.",
    ],
    {
      question: "Include tolls with fuel?",
      answer:
        "You can add tolls into the fuel total before splitting, or settle tolls as a separate line.",
    },
    "Pooled Fuel Split Calculator — Share Road-trip Petrol",
    "Split pooled fuel costs among road-trip passengers. Group driving aid — agree shares before departure.",
    ["pooled fuel split", "split gas money trip", "road trip fuel share"],
    HUBS.group,
    GROUP_ROWS,
  ),
  "travel-tour-package-per-head-calculator": article(
    "travel-tour-package-per-head-calculator",
    "Tour package per head",
    [
      "Divides a group tour package total by headcount for the per-person sticker price.",
      "Single supplements and child rates mean the true per-person amount may differ from a flat split.",
    ],
    {
      question: "Are tips included in package totals?",
      answer:
        "Often not. Ask whether guide/driver tips and optional excursions are extra before comparing packages.",
    },
    "Tour Package per Head Calculator — Group Quote ÷ People",
    "Find per-person cost of a group tour package. Vacation planning — supplements and tips may be extra.",
    ["tour package per head", "group tour per person", "package price split"],
    HUBS.group,
    GROUP_ROWS,
  ),
  "travel-business-per-diem-calculator": article(
    "travel-business-per-diem-calculator",
    "Business per diem",
    [
      "Multiplies a daily business per-diem rate by trip days for meals and incidentals budgeting.",
      "Employer or government tables set official rates by city — use your policy rate, not a guess.",
    ],
    {
      question: "Is lodging included in per diem?",
      answer:
        "Often lodging is separate from M&IE per diem. Follow your company's travel policy categories.",
    },
    "Business Per Diem Calculator — Daily Rate × Trip Days",
    "Estimate business travel per-diem totals from daily rate and days. Expense planning — follow company policy.",
    ["business per diem calculator", "travel per diem total", "M&IE trip budget"],
    HUBS.business,
    BUSINESS_ROWS,
  ),
  "travel-reimbursable-mileage-calculator": article(
    "travel-reimbursable-mileage-calculator",
    "Reimbursable mileage",
    [
      "Multiplies business miles by an allowed reimbursement rate per mile (or km equivalent you enter).",
      "Commuting miles are often excluded — only claim miles your policy treats as reimbursable.",
    ],
    {
      question: "Which mileage rate should I use?",
      answer:
        "Use your employer or tax authority's published rate for the year. Personal guesses are not claimable.",
    },
    "Reimbursable Mileage Calculator — Miles × Rate",
    "Calculate reimbursable business mileage from miles and rate. Expense aid — follow policy and tax rules.",
    ["reimbursable mileage calculator", "business miles reimbursement", "mileage rate claim"],
    HUBS.business,
    BUSINESS_ROWS,
  ),
  "travel-blended-business-leisure-cost-calculator": article(
    "travel-blended-business-leisure-cost-calculator",
    "Blended business-leisure cost",
    [
      "Applies a business-share percent to a trip total for bleisure trips that mix work and personal days.",
      "Employers often require clear allocation of flights and hotels — document the business portion.",
    ],
    {
      question: "Can I expense the whole bleisure trip?",
      answer:
        "Usually no. Personal days and companions are typically out of pocket unless policy says otherwise.",
    },
    "Blended Business-leisure Cost Calculator — Business Share %",
    "Allocate bleisure trip cost by business share percent. Expense planning — follow employer rules.",
    ["bleisure cost calculator", "business leisure trip split", "blended travel expense"],
    HUBS.business,
    BUSINESS_ROWS,
  ),
  "travel-client-billable-travel-calculator": article(
    "travel-client-billable-travel-calculator",
    "Client billable travel",
    [
      "Marks up travel cost by a percent for client-billable engagements where contract allows pass-through plus fee.",
      "Some contracts require at-cost billing only — confirm the SOW before adding markup.",
    ],
    {
      question: "What receipts do clients expect?",
      answer:
        "Usually itemized airfare, hotel, and ground transport. Keep FX conversions clear on foreign receipts.",
    },
    "Client Billable Travel Calculator — Cost × Markup %",
    "Estimate client-billable travel with optional markup. Consulting aid — contract terms control billing.",
    ["client billable travel", "travel markup calculator", "pass through travel cost"],
    HUBS.business,
    BUSINESS_ROWS,
  ),
  "travel-ai-itinerary-budget-envelope-calculator": article(
    "travel-ai-itinerary-budget-envelope-calculator",
    "AI itinerary budget envelope",
    [
      "Sets a simple budget envelope around an AI-drafted or prompt-based itinerary total for planning guardrails.",
      "Treat AI day plans as drafts — verify opening hours, visas, and live prices before locking bookings.",
    ],
    {
      question: "Does this call a live AI model?",
      answer:
        "No. It is a local budget envelope helper for numbers you already have from any itinerary draft.",
    },
    "AI Itinerary Budget Envelope Calculator — Draft Trip Cap",
    "Set a budget envelope around an AI or draft itinerary total. Planning aid — verify live fares and hours.",
    ["ai itinerary budget", "trip budget envelope", "draft itinerary cost cap"],
    HUBS.ai,
    AI_ROWS,
  ),
  "travel-ai-scenario-cost-tweak-calculator": article(
    "travel-ai-scenario-cost-tweak-calculator",
    "AI scenario cost tweak",
    [
      "Applies a percent tweak up or down to a base itinerary budget for what-if scenario planning.",
      "Useful when an AI suggestion adds a day trip or drops a paid tour — quantify the swing quickly.",
    ],
    {
      question: "What tweak percent should I start with?",
      answer:
        "Try ±10–20% for soft changes. Large mode switches (fly → train) may need a full re-estimate instead.",
    },
    "AI Scenario Cost Tweak Calculator — What-if Budget %",
    "Adjust a trip budget by percent for AI or manual what-if scenarios. Planning estimate — prices vary.",
    ["ai scenario cost tweak", "trip what if budget", "itinerary cost sensitivity"],
    HUBS.ai,
    AI_ROWS,
  ),
  "travel-ai-alternative-destination-cost-calculator": article(
    "travel-ai-alternative-destination-cost-calculator",
    "AI alternative destination cost",
    [
      "Compares two destination budget totals so AI or human shortlists can be ranked by cost.",
      "Normalize trip length and travel month; peak dates in one city can erase a 'cheaper' destination label.",
    ],
    {
      question: "Should flights be in each destination total?",
      answer:
        "Yes for fairness. Include round-trip transport from your home city in both destination budgets.",
    },
    "AI Alternative Destination Cost Calculator — Dest A vs B",
    "Compare alternative destination trip budgets side by side. Planning aid — seasonality changes prices.",
    ["alternative destination cost", "compare trip destinations", "ai destination budget"],
    HUBS.ai,
    AI_ROWS,
  ),
  "travel-package-quote-comparison-calculator": article(
    "travel-package-quote-comparison-calculator",
    "Package quote comparison",
    [
      "Compares two vacation or tour package quotes and highlights the lower total.",
      "Align inclusions (flights, transfers, meals) before trusting the cheaper number.",
    ],
    {
      question: "What if quotes use different currencies?",
      answer:
        "Convert both to one currency at the same FX rate and date before comparing.",
    },
    "Package Quote Comparison Calculator — Tour Deal A vs B",
    "Compare two travel package quotes and pick the lower total. Booking aid — inclusions must match.",
    ["package quote comparison", "tour package compare", "vacation quote calculator"],
    HUBS.compare,
    COMPARE_ROWS,
  ),
  "travel-insurance-quote-comparison-calculator": article(
    "travel-insurance-quote-comparison-calculator",
    "Insurance quote comparison",
    [
      "Compares two travel insurance premiums so you can see the cheaper quote at a glance.",
      "Cheaper is not better if medical limits or exclusions differ — read the schedule of benefits.",
    ],
    {
      question: "Can I compare premiums alone?",
      answer:
        "Use premiums only after normalizing cover limits, deductibles, and key exclusions.",
    },
    "Insurance Quote Comparison Calculator — Premium A vs B",
    "Compare two travel insurance premiums side by side. Shopping aid — policy terms matter more than price.",
    ["insurance quote comparison", "travel insurance compare", "policy premium compare"],
    HUBS.compare,
    COMPARE_ROWS,
  ),
  "travel-transport-bundle-comparison-calculator": article(
    "travel-transport-bundle-comparison-calculator",
    "Transport bundle comparison",
    [
      "Compares two transport bundles (e.g. flight+rail or transfer packages) and shows the lower cost option.",
      "Check change fees and baggage rules inside each bundle — flexibility can outweigh a small saving.",
    ],
    {
      question: "Are bundles always cheaper than separate tickets?",
      answer:
        "Not always. Price each segment separately once; bundles win mainly when packaged discounts are real.",
    },
    "Transport Bundle Comparison Calculator — Combo Fare A vs B",
    "Compare transport bundle quotes for flights, rail, or transfers. Booking aid — rules and fees vary.",
    ["transport bundle comparison", "flight rail package compare", "combo transport quote"],
    HUBS.compare,
    COMPARE_ROWS,
  ),
  "travel-ota-vs-direct-booking-calculator": article(
    "travel-ota-vs-direct-booking-calculator",
    "OTA vs direct booking",
    [
      "Compares an online travel agency (OTA) price against booking direct with the hotel or airline.",
      "Direct sometimes unlocks better change flexibility or loyalty credit even when the sticker is higher.",
    ],
    {
      question: "Who do I call if something goes wrong?",
      answer:
        "OTA bookings often require contacting the agency first. Direct bookings go to the airline or hotel.",
    },
    "OTA vs Direct Booking Calculator — Agency Price vs Direct",
    "Compare OTA and direct booking prices for the same trip. Booking strategy — policies and points differ.",
    ["ota vs direct booking", "book direct or expedia", "hotel direct vs ota"],
    HUBS.compare,
    COMPARE_ROWS,
  ),
};
