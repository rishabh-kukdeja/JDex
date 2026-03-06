import type { Platform, JobDescription, Applicant, Interview, EmailTemplate, TeamMember, PipelineStage } from "@/types";

export const platforms: Platform[] = [
  { id: "p1", name: "LinkedIn", logo: "LI", enabled: true, connected: true },
  { id: "p2", name: "Naukri", logo: "NK", enabled: true, connected: true },
  { id: "p3", name: "Indeed", logo: "IN", enabled: false, connected: true },
  { id: "p4", name: "WorkIndia", logo: "WI", enabled: true, connected: false },
  { id: "p5", name: "Internshala", logo: "IS", enabled: false, connected: false },
];

export const jobDescriptions: JobDescription[] = [
  {
    id: "j1", title: "Senior Frontend Developer", department: "Engineering", location: "Bangalore, India",
    type: "Full-time", workMode: "Hybrid", experience: "4-6 years", salaryMin: 1800000, salaryMax: 2800000, currency: "INR",
    description: "We are looking for a Senior Frontend Developer to lead our web application development. You will work closely with design and backend teams to deliver exceptional user experiences.",
    requirements: ["4+ years of React experience", "Strong TypeScript skills", "Experience with state management", "Knowledge of testing frameworks", "Understanding of CI/CD pipelines"],
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest", "GraphQL", "Git"],
    openings: 2, status: "published", publishedOn: ["LinkedIn", "Naukri"], applicantCount: 8, createdAt: "2026-02-10", updatedAt: "2026-02-15",
  },
  {
    id: "j2", title: "UI/UX Designer", department: "Design", location: "Mumbai, India",
    type: "Full-time", workMode: "Remote", experience: "2-4 years", salaryMin: 1200000, salaryMax: 2000000, currency: "INR",
    description: "Join our design team to create beautiful, intuitive interfaces for our SaaS products. You'll own the design process from research to high-fidelity prototypes.",
    requirements: ["Strong portfolio with web/mobile designs", "Proficiency in Figma", "User research experience", "Understanding of design systems"],
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems", "Interaction Design"],
    openings: 1, status: "published", publishedOn: ["LinkedIn", "Indeed"], applicantCount: 5, createdAt: "2026-02-12", updatedAt: "2026-02-18",
  },
  {
    id: "j3", title: "Product Manager", department: "Product", location: "Delhi NCR, India",
    type: "Full-time", workMode: "Hybrid", experience: "6-10 years", salaryMin: 2500000, salaryMax: 4000000, currency: "INR",
    description: "We need a seasoned Product Manager to drive our product strategy and roadmap. You'll work with cross-functional teams to deliver features that delight our customers.",
    requirements: ["6+ years in product management", "Experience with B2B SaaS", "Strong analytical skills", "Excellent communication"],
    skills: ["Product Strategy", "Agile", "SQL", "Analytics", "Roadmapping", "Stakeholder Management"],
    openings: 1, status: "published", publishedOn: ["LinkedIn", "Naukri", "Indeed"], applicantCount: 3, createdAt: "2026-02-05", updatedAt: "2026-02-20",
  },
  {
    id: "j4", title: "Digital Marketing Manager", department: "Marketing", location: "Bangalore, India",
    type: "Full-time", workMode: "On-site", experience: "2-4 years", salaryMin: 1000000, salaryMax: 1600000, currency: "INR",
    description: "Drive our digital marketing initiatives including SEO, SEM, social media, and content marketing to grow our brand presence and generate qualified leads.",
    requirements: ["Experience with Google Ads and Meta Ads", "SEO expertise", "Content strategy experience", "Data-driven mindset"],
    skills: ["SEO", "Google Ads", "Social Media Marketing", "Content Marketing", "Analytics", "Email Marketing"],
    openings: 1, status: "draft", publishedOn: [], applicantCount: 0, createdAt: "2026-02-22", updatedAt: "2026-02-22",
  },
  {
    id: "j5", title: "Sales Executive", department: "Sales", location: "Hyderabad, India",
    type: "Full-time", workMode: "On-site", experience: "1-2 years", salaryMin: 600000, salaryMax: 1000000, currency: "INR",
    description: "We're hiring ambitious Sales Executives to expand our client base. You'll be responsible for outbound prospecting, demos, and closing deals.",
    requirements: ["1+ year B2B sales experience", "Excellent communication skills", "CRM proficiency", "Target-driven attitude"],
    skills: ["B2B Sales", "CRM", "Cold Calling", "Negotiation", "Presentation Skills"],
    openings: 3, status: "published", publishedOn: ["Naukri"], applicantCount: 4, createdAt: "2026-02-08", updatedAt: "2026-02-14",
  },
  {
    id: "j6", title: "Backend Engineer", department: "Engineering", location: "Pune, India",
    type: "Full-time", workMode: "Remote", experience: "2-4 years", salaryMin: 1400000, salaryMax: 2200000, currency: "INR",
    description: "Build scalable backend services and APIs for our growing platform. Work with modern cloud infrastructure and microservices architecture.",
    requirements: ["Strong in Node.js or Python", "Database design experience", "REST/GraphQL API design", "Cloud services (AWS/GCP)"],
    skills: ["Node.js", "Python", "PostgreSQL", "Redis", "Docker", "AWS", "REST APIs"],
    openings: 2, status: "closed", publishedOn: ["LinkedIn", "Naukri"], applicantCount: 0, createdAt: "2026-01-15", updatedAt: "2026-02-01",
  },
  {
    id: "j7", title: "Data Analyst", department: "Engineering", location: "Bangalore, India",
    type: "Contract", workMode: "Remote", experience: "1-2 years", salaryMin: 800000, salaryMax: 1400000, currency: "INR",
    description: "Analyze large datasets to provide actionable insights that drive business decisions. Create dashboards and reports for stakeholders.",
    requirements: ["Proficiency in SQL and Python", "Experience with BI tools", "Statistical analysis skills", "Strong communication"],
    skills: ["SQL", "Python", "Tableau", "Excel", "Statistics", "Power BI"],
    openings: 1, status: "draft", publishedOn: [], applicantCount: 0, createdAt: "2026-02-25", updatedAt: "2026-02-25",
  },
  {
    id: "j8", title: "HR Coordinator", department: "HR", location: "Chennai, India",
    type: "Internship", workMode: "On-site", experience: "Fresher", salaryMin: 200000, salaryMax: 400000, currency: "INR",
    description: "Support our HR team with recruitment coordination, onboarding processes, and employee engagement activities. Great opportunity for fresh graduates.",
    requirements: ["MBA in HR or equivalent", "Strong organizational skills", "Proficiency in MS Office", "Excellent interpersonal skills"],
    skills: ["Recruitment", "MS Office", "Communication", "Organization", "HRIS"],
    openings: 2, status: "published", publishedOn: ["Internshala", "Naukri"], applicantCount: 0, createdAt: "2026-02-20", updatedAt: "2026-02-21",
  },
];

const makeApplicant = (
  id: string, name: string, email: string, phone: string, jobId: string, jobTitle: string,
  source: Applicant["source"], status: Applicant["status"], atsScore: number,
  skills: string[], experience: string, education: string,
  breakdown: Applicant["atsBreakdown"],
  resumeData: Applicant["resumeData"],
  appliedAt: string, notes: string,
  activityLog: Applicant["activityLog"]
): Applicant => ({
  id, name, email, phone, avatar: "", jobId, jobTitle, source, status, atsScore,
  atsBreakdown: breakdown, skills, experience, education, resumeData, appliedAt, notes, activityLog,
});

export const applicants: Applicant[] = [
  makeApplicant("a1", "Priya Sharma", "priya.sharma@email.com", "+91 98765 43210", "j1", "Senior Frontend Developer",
    "LinkedIn", "shortlisted", 88, ["React", "TypeScript", "Next.js", "Tailwind CSS", "Jest"],
    "5 years", "B.Tech in Computer Science", { skillsMatch: 92, experienceMatch: 85, educationMatch: 88 },
    {
      summary: "Passionate frontend developer with 5 years of experience building scalable web applications using React and TypeScript.",
      workHistory: [
        { company: "TechCorp India", role: "Senior Frontend Developer", duration: "2023-Present", description: "Led frontend architecture for SaaS platform serving 50K+ users." },
        { company: "WebSolutions Pvt Ltd", role: "Frontend Developer", duration: "2021-2023", description: "Built responsive UIs with React and integrated REST APIs." },
      ],
      educationHistory: [{ institution: "IIT Delhi", degree: "B.Tech Computer Science", year: "2021" }],
      certifications: ["AWS Certified Cloud Practitioner", "Meta Frontend Developer Certificate"],
    }, "2026-02-18", "Strong candidate with excellent React experience.", [
    { action: "Application received", date: "2026-02-18", by: "System" },
    { action: "Shortlisted by HR", date: "2026-02-20", by: "Anita Desai" },
  ]),
  makeApplicant("a2", "Rahul Verma", "rahul.v@email.com", "+91 87654 32109", "j1", "Senior Frontend Developer",
    "Naukri", "interview_scheduled", 82, ["React", "JavaScript", "CSS", "Redux", "Git"],
    "4 years", "MCA", { skillsMatch: 78, experienceMatch: 85, educationMatch: 82 },
    {
      summary: "Frontend developer with 4+ years of experience in React ecosystem.",
      workHistory: [
        { company: "DigitalFirst", role: "Frontend Developer", duration: "2022-Present", description: "Developed customer-facing dashboards with React." },
        { company: "StartupXYZ", role: "Junior Developer", duration: "2020-2022", description: "Full-stack development with MERN stack." },
      ],
      educationHistory: [{ institution: "NIT Trichy", degree: "MCA", year: "2020" }],
      certifications: ["Google UX Design Certificate"],
    }, "2026-02-19", "", [
    { action: "Application received", date: "2026-02-19", by: "System" },
    { action: "Shortlisted", date: "2026-02-21", by: "Anita Desai" },
    { action: "Interview scheduled", date: "2026-02-23", by: "Vikram Singh" },
  ]),
  makeApplicant("a3", "Sneha Patel", "sneha.p@email.com", "+91 76543 21098", "j1", "Senior Frontend Developer",
    "Direct", "new", 74, ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
    "3 years", "B.E. in IT", { skillsMatch: 68, experienceMatch: 75, educationMatch: 80 },
    {
      summary: "Enthusiastic developer with 3 years of web development experience looking to grow in frontend technologies.",
      workHistory: [
        { company: "InfoTech Solutions", role: "Web Developer", duration: "2023-Present", description: "Built and maintained company websites and internal tools." },
      ],
      educationHistory: [{ institution: "VJTI Mumbai", degree: "B.E. Information Technology", year: "2023" }],
      certifications: [],
    }, "2026-02-25", "", [
    { action: "Application received", date: "2026-02-25", by: "System" },
  ]),
  makeApplicant("a4", "Arjun Nair", "arjun.n@email.com", "+91 65432 10987", "j1", "Senior Frontend Developer",
    "LinkedIn", "rejected", 45, ["jQuery", "HTML", "CSS", "PHP"],
    "6 years", "BCA", { skillsMatch: 35, experienceMatch: 60, educationMatch: 40 },
    {
      summary: "Web developer with 6 years experience mainly in jQuery and PHP-based applications.",
      workHistory: [
        { company: "OldTech Pvt Ltd", role: "Web Developer", duration: "2020-Present", description: "Maintained legacy PHP applications." },
      ],
      educationHistory: [{ institution: "Bangalore University", degree: "BCA", year: "2020" }],
      certifications: [],
    }, "2026-02-16", "Skills don't match modern React stack requirements.", [
    { action: "Application received", date: "2026-02-16", by: "System" },
    { action: "Rejected", date: "2026-02-18", by: "Anita Desai" },
  ]),
  makeApplicant("a5", "Kavya Iyer", "kavya.i@email.com", "+91 54321 09876", "j2", "UI/UX Designer",
    "LinkedIn", "shortlisted", 91, ["Figma", "Adobe XD", "Prototyping", "User Research", "Design Systems"],
    "3 years", "B.Des in Interaction Design", { skillsMatch: 95, experienceMatch: 85, educationMatch: 92 },
    {
      summary: "Creative UI/UX designer with a passion for user-centered design. Experienced in building design systems for SaaS products.",
      workHistory: [
        { company: "DesignStudio Co", role: "UI/UX Designer", duration: "2023-Present", description: "Led design for 3 major product launches." },
        { company: "Creative Agency", role: "Junior Designer", duration: "2021-2023", description: "Created UI designs for client projects." },
      ],
      educationHistory: [{ institution: "NID Ahmedabad", degree: "B.Des Interaction Design", year: "2021" }],
      certifications: ["Google UX Design Professional Certificate"],
    }, "2026-02-14", "Exceptional portfolio. Strong candidate.", [
    { action: "Application received", date: "2026-02-14", by: "System" },
    { action: "Shortlisted", date: "2026-02-16", by: "Vikram Singh" },
  ]),
  makeApplicant("a6", "Amit Kumar", "amit.k@email.com", "+91 43210 98765", "j2", "UI/UX Designer",
    "Indeed", "new", 67, ["Figma", "Sketch", "Photoshop", "Illustrator"],
    "2 years", "B.A. in Graphic Design", { skillsMatch: 65, experienceMatch: 70, educationMatch: 65 },
    {
      summary: "Graphic designer transitioning to UI/UX with 2 years of visual design experience.",
      workHistory: [
        { company: "PrintMedia Inc", role: "Graphic Designer", duration: "2024-Present", description: "Designed marketing materials and social media content." },
      ],
      educationHistory: [{ institution: "Symbiosis Pune", degree: "B.A. Graphic Design", year: "2024" }],
      certifications: [],
    }, "2026-02-22", "", [
    { action: "Application received", date: "2026-02-22", by: "System" },
  ]),
  makeApplicant("a7", "Deepika Reddy", "deepika.r@email.com", "+91 32109 87654", "j2", "UI/UX Designer",
    "Naukri", "interview_scheduled", 78, ["Figma", "User Research", "Wireframing", "Prototyping", "Interaction Design"],
    "4 years", "M.Des in HCI", { skillsMatch: 82, experienceMatch: 78, educationMatch: 75 },
    {
      summary: "HCI specialist with strong research skills and a user-first design approach.",
      workHistory: [
        { company: "TechProduct Co", role: "UX Designer", duration: "2022-Present", description: "Conducted user research and designed interfaces for enterprise products." },
      ],
      educationHistory: [{ institution: "IIT Bombay", degree: "M.Des HCI", year: "2022" }],
      certifications: ["Nielsen Norman UX Certification"],
    }, "2026-02-17", "", [
    { action: "Application received", date: "2026-02-17", by: "System" },
    { action: "Shortlisted", date: "2026-02-19", by: "Vikram Singh" },
    { action: "Interview scheduled", date: "2026-02-24", by: "Meera Joshi" },
  ]),
  makeApplicant("a8", "Vikash Gupta", "vikash.g@email.com", "+91 21098 76543", "j3", "Product Manager",
    "LinkedIn", "selected", 94, ["Product Strategy", "Agile", "SQL", "Analytics", "Roadmapping"],
    "8 years", "MBA in Product Management", { skillsMatch: 96, experienceMatch: 95, educationMatch: 90 },
    {
      summary: "Seasoned product manager with 8 years of experience driving product strategy for B2B SaaS companies.",
      workHistory: [
        { company: "SaaSLeader Inc", role: "Senior Product Manager", duration: "2021-Present", description: "Managed product roadmap for a $10M ARR product." },
        { company: "StartupGrowth", role: "Product Manager", duration: "2018-2021", description: "Launched 5 new features driving 40% user growth." },
      ],
      educationHistory: [{ institution: "ISB Hyderabad", degree: "MBA", year: "2018" }],
      certifications: ["Certified Scrum Product Owner"],
    }, "2026-02-10", "Outstanding candidate. Offer extended.", [
    { action: "Application received", date: "2026-02-10", by: "System" },
    { action: "Shortlisted", date: "2026-02-12", by: "Anita Desai" },
    { action: "Selected after final round", date: "2026-02-25", by: "Vikram Singh" },
  ]),
  makeApplicant("a9", "Neha Jain", "neha.j@email.com", "+91 10987 65432", "j3", "Product Manager",
    "LinkedIn", "on_hold", 72, ["Product Strategy", "Agile", "Jira", "Stakeholder Management"],
    "5 years", "MBA", { skillsMatch: 70, experienceMatch: 72, educationMatch: 75 },
    {
      summary: "Product manager with experience in fintech and e-commerce domains.",
      workHistory: [
        { company: "FinTechPro", role: "Product Manager", duration: "2023-Present", description: "Managed payments product serving 100K+ merchants." },
      ],
      educationHistory: [{ institution: "XLRI Jamshedpur", degree: "MBA", year: "2021" }],
      certifications: [],
    }, "2026-02-12", "Good candidate but Vikash is stronger. Keeping on hold.", [
    { action: "Application received", date: "2026-02-12", by: "System" },
    { action: "Put on hold", date: "2026-02-20", by: "Vikram Singh" },
  ]),
  makeApplicant("a10", "Rohan Mehta", "rohan.m@email.com", "+91 09876 54321", "j5", "Sales Executive",
    "Naukri", "new", 63, ["B2B Sales", "CRM", "Cold Calling"],
    "1 year", "BBA", { skillsMatch: 60, experienceMatch: 65, educationMatch: 65 },
    {
      summary: "Entry-level sales professional with 1 year of experience in inside sales.",
      workHistory: [
        { company: "SalesForce India", role: "Inside Sales Representative", duration: "2025-Present", description: "Generated leads through cold calling and email outreach." },
      ],
      educationHistory: [{ institution: "Christ University", degree: "BBA", year: "2025" }],
      certifications: [],
    }, "2026-02-20", "", [
    { action: "Application received", date: "2026-02-20", by: "System" },
  ]),
  makeApplicant("a11", "Ananya Bose", "ananya.b@email.com", "+91 98712 34567", "j5", "Sales Executive",
    "WorkIndia", "shortlisted", 76, ["B2B Sales", "CRM", "Negotiation", "Presentation Skills"],
    "2 years", "MBA in Marketing", { skillsMatch: 80, experienceMatch: 72, educationMatch: 75 },
    {
      summary: "Dynamic sales professional with strong negotiation skills and experience in SaaS sales.",
      workHistory: [
        { company: "CloudSales Pvt Ltd", role: "Sales Executive", duration: "2024-Present", description: "Achieved 120% of quarterly targets consistently." },
      ],
      educationHistory: [{ institution: "MICA Ahmedabad", degree: "MBA Marketing", year: "2024" }],
      certifications: ["HubSpot Sales Certification"],
    }, "2026-02-15", "Good communicator with target-driven mindset.", [
    { action: "Application received", date: "2026-02-15", by: "System" },
    { action: "Shortlisted", date: "2026-02-18", by: "Meera Joshi" },
  ]),
  makeApplicant("a12", "Suresh Rao", "suresh.r@email.com", "+91 87612 34567", "j1", "Senior Frontend Developer",
    "LinkedIn", "new", 79, ["React", "TypeScript", "Vue.js", "CSS", "Webpack"],
    "5 years", "M.Tech in Software Engineering", { skillsMatch: 80, experienceMatch: 82, educationMatch: 75 },
    {
      summary: "Versatile frontend developer proficient in both React and Vue ecosystems.",
      workHistory: [
        { company: "MultiTech Corp", role: "Frontend Engineer", duration: "2022-Present", description: "Built complex data visualization dashboards." },
        { company: "WebAgency", role: "Developer", duration: "2021-2022", description: "Client-facing web development projects." },
      ],
      educationHistory: [{ institution: "IIIT Hyderabad", degree: "M.Tech Software Engineering", year: "2021" }],
      certifications: ["AWS Certified Developer"],
    }, "2026-02-26", "", [
    { action: "Application received", date: "2026-02-26", by: "System" },
  ]),
  makeApplicant("a13", "Meghna Chatterjee", "meghna.c@email.com", "+91 76512 34567", "j1", "Senior Frontend Developer",
    "Naukri", "selected", 90, ["React", "TypeScript", "Next.js", "GraphQL", "Testing", "Tailwind CSS"],
    "6 years", "B.Tech + M.Tech", { skillsMatch: 94, experienceMatch: 88, educationMatch: 88 },
    {
      summary: "Senior frontend architect with deep expertise in React, performance optimization, and design systems.",
      workHistory: [
        { company: "BigTech India", role: "Staff Frontend Engineer", duration: "2022-Present", description: "Architected micro-frontend platform used by 200+ developers." },
        { company: "GrowthStartup", role: "Frontend Developer", duration: "2020-2022", description: "Led frontend development for Series A startup." },
      ],
      educationHistory: [{ institution: "IIT Kharagpur", degree: "B.Tech + M.Tech CS", year: "2020" }],
      certifications: ["Google Professional Cloud Developer"],
    }, "2026-02-11", "Exceptional candidate. Offer extended.", [
    { action: "Application received", date: "2026-02-11", by: "System" },
    { action: "Shortlisted", date: "2026-02-13", by: "Anita Desai" },
    { action: "Selected after final round", date: "2026-02-24", by: "Vikram Singh" },
  ]),
  makeApplicant("a14", "Karthik Sundaram", "karthik.s@email.com", "+91 65412 34567", "j1", "Senior Frontend Developer",
    "Indeed", "on_hold", 68, ["React", "JavaScript", "Angular", "CSS"],
    "4 years", "B.E. in CSE", { skillsMatch: 65, experienceMatch: 70, educationMatch: 70 },
    {
      summary: "Frontend developer with mixed experience in Angular and React.",
      workHistory: [
        { company: "EnterpriseApps", role: "Frontend Developer", duration: "2022-Present", description: "Migrated Angular apps to React." },
      ],
      educationHistory: [{ institution: "Anna University", degree: "B.E. CSE", year: "2022" }],
      certifications: [],
    }, "2026-02-17", "Decent skills but not as strong in React as other candidates.", [
    { action: "Application received", date: "2026-02-17", by: "System" },
    { action: "Put on hold", date: "2026-02-22", by: "Anita Desai" },
  ]),
  makeApplicant("a15", "Fatima Sheikh", "fatima.s@email.com", "+91 54312 34567", "j2", "UI/UX Designer",
    "LinkedIn", "new", 84, ["Figma", "Design Systems", "Prototyping", "User Research", "Adobe Suite"],
    "3 years", "B.Des Visual Communication", { skillsMatch: 88, experienceMatch: 80, educationMatch: 85 },
    {
      summary: "Visual designer with a strong eye for aesthetics and a user-centered approach to problem solving.",
      workHistory: [
        { company: "DesignHub", role: "UI Designer", duration: "2023-Present", description: "Designed mobile and web interfaces for fintech products." },
      ],
      educationHistory: [{ institution: "Srishti Manipal", degree: "B.Des Visual Communication", year: "2023" }],
      certifications: ["Interaction Design Foundation Certificate"],
    }, "2026-02-24", "", [
    { action: "Application received", date: "2026-02-24", by: "System" },
  ]),
  makeApplicant("a16", "Rajat Tiwari", "rajat.t@email.com", "+91 43212 34567", "j2", "UI/UX Designer",
    "Direct", "rejected", 38, ["Photoshop", "Canva", "PowerPoint"],
    "1 year", "B.Com", { skillsMatch: 30, experienceMatch: 40, educationMatch: 45 },
    {
      summary: "Self-taught designer with basic graphic design skills.",
      workHistory: [
        { company: "Freelance", role: "Graphic Designer", duration: "2025-Present", description: "Created social media posts and flyers." },
      ],
      educationHistory: [{ institution: "Delhi University", degree: "B.Com", year: "2025" }],
      certifications: [],
    }, "2026-02-21", "Skills don't match UX requirements.", [
    { action: "Application received", date: "2026-02-21", by: "System" },
    { action: "Rejected", date: "2026-02-23", by: "Meera Joshi" },
  ]),
  makeApplicant("a17", "Pooja Kulkarni", "pooja.k@email.com", "+91 32112 34567", "j3", "Product Manager",
    "Naukri", "new", 58, ["Agile", "Jira", "Communication"],
    "3 years", "MBA", { skillsMatch: 55, experienceMatch: 58, educationMatch: 62 },
    {
      summary: "Project manager looking to transition into product management.",
      workHistory: [
        { company: "ConsultingFirm", role: "Project Manager", duration: "2023-Present", description: "Managed delivery of IT projects for clients." },
      ],
      educationHistory: [{ institution: "Symbiosis Pune", degree: "MBA Operations", year: "2023" }],
      certifications: ["PMP Certification"],
    }, "2026-02-23", "", [
    { action: "Application received", date: "2026-02-23", by: "System" },
  ]),
  makeApplicant("a18", "Aditya Saxena", "aditya.s@email.com", "+91 21012 34567", "j5", "Sales Executive",
    "Naukri", "interview_scheduled", 71, ["B2B Sales", "CRM", "Cold Calling", "Negotiation"],
    "2 years", "BBA", { skillsMatch: 72, experienceMatch: 70, educationMatch: 70 },
    {
      summary: "Results-oriented sales professional with proven track record in B2B software sales.",
      workHistory: [
        { company: "TechSales Inc", role: "Business Development Executive", duration: "2024-Present", description: "Closed deals worth ₹2Cr in first year." },
      ],
      educationHistory: [{ institution: "SP Jain Mumbai", degree: "BBA", year: "2024" }],
      certifications: [],
    }, "2026-02-16", "", [
    { action: "Application received", date: "2026-02-16", by: "System" },
    { action: "Shortlisted", date: "2026-02-19", by: "Meera Joshi" },
    { action: "Interview scheduled", date: "2026-02-25", by: "Meera Joshi" },
  ]),
  makeApplicant("a19", "Divya Menon", "divya.m@email.com", "+91 10912 34567", "j5", "Sales Executive",
    "WorkIndia", "new", 55, ["Sales", "Communication", "MS Office"],
    "Fresher", "BBA", { skillsMatch: 50, experienceMatch: 55, educationMatch: 60 },
    {
      summary: "Fresh graduate eager to start a career in sales.",
      workHistory: [],
      educationHistory: [{ institution: "Loyola College Chennai", degree: "BBA", year: "2026" }],
      certifications: [],
    }, "2026-02-27", "", [
    { action: "Application received", date: "2026-02-27", by: "System" },
  ]),
  makeApplicant("a20", "Siddharth Malhotra", "sid.m@email.com", "+91 09812 34567", "j1", "Senior Frontend Developer",
    "LinkedIn", "interview_scheduled", 85, ["React", "TypeScript", "Next.js", "CSS-in-JS", "Jest", "Git"],
    "5 years", "B.Tech in CSE", { skillsMatch: 88, experienceMatch: 84, educationMatch: 82 },
    {
      summary: "Performance-focused frontend developer with strong testing and architecture skills.",
      workHistory: [
        { company: "ScaleUp Technologies", role: "Senior Frontend Developer", duration: "2023-Present", description: "Optimized app performance, reducing load time by 60%." },
        { company: "CodeCraft", role: "Frontend Developer", duration: "2021-2023", description: "Built complex form builders and workflow editors." },
      ],
      educationHistory: [{ institution: "BITS Pilani", degree: "B.Tech CSE", year: "2021" }],
      certifications: ["Meta React Developer Certificate"],
    }, "2026-02-13", "Very strong candidate. Schedule final round.", [
    { action: "Application received", date: "2026-02-13", by: "System" },
    { action: "Shortlisted", date: "2026-02-15", by: "Anita Desai" },
    { action: "Interview scheduled", date: "2026-02-22", by: "Vikram Singh" },
  ]),
];

export const interviews: Interview[] = [
  {
    id: "i1", applicantId: "a2", applicantName: "Rahul Verma", applicantAvatar: "", jobTitle: "Senior Frontend Developer",
    scheduledAt: "2026-03-02T10:00:00", duration: 60, mode: "Online", interviewers: ["Vikram Singh", "Anita Desai"],
    meetLink: "https://meet.google.com/abc-defg-hij", status: "scheduled"
  },
  {
    id: "i2", applicantId: "a7", applicantName: "Deepika Reddy", applicantAvatar: "", jobTitle: "UI/UX Designer",
    scheduledAt: "2026-03-02T14:00:00", duration: 45, mode: "Online", interviewers: ["Meera Joshi"],
    meetLink: "https://meet.google.com/klm-nopq-rst", status: "scheduled"
  },
  {
    id: "i3", applicantId: "a20", applicantName: "Siddharth Malhotra", applicantAvatar: "", jobTitle: "Senior Frontend Developer",
    scheduledAt: "2026-03-03T11:00:00", duration: 60, mode: "Online", interviewers: ["Vikram Singh", "Ravi Shankar"],
    meetLink: "https://meet.google.com/uvw-xyz-123", status: "scheduled"
  },
  {
    id: "i4", applicantId: "a18", applicantName: "Aditya Saxena", applicantAvatar: "", jobTitle: "Sales Executive",
    scheduledAt: "2026-03-03T15:00:00", duration: 30, mode: "Phone", interviewers: ["Meera Joshi"], status: "scheduled"
  },
  {
    id: "i5", applicantId: "a8", applicantName: "Vikash Gupta", applicantAvatar: "", jobTitle: "Product Manager",
    scheduledAt: "2026-02-25T10:00:00", duration: 90, mode: "Offline", interviewers: ["Vikram Singh", "Anita Desai"],
    location: "JDex HQ, Koramangala, Bangalore", status: "completed"
  },
  {
    id: "i6", applicantId: "a1", applicantName: "Priya Sharma", applicantAvatar: "", jobTitle: "Senior Frontend Developer",
    scheduledAt: "2026-02-22T11:00:00", duration: 60, mode: "Online", interviewers: ["Vikram Singh"],
    meetLink: "https://meet.google.com/past-meet-1", status: "completed"
  },
  {
    id: "i7", applicantId: "a13", applicantName: "Meghna Chatterjee", applicantAvatar: "", jobTitle: "Senior Frontend Developer",
    scheduledAt: "2026-02-24T10:00:00", duration: 60, mode: "Online", interviewers: ["Vikram Singh", "Ravi Shankar"],
    meetLink: "https://meet.google.com/past-meet-2", status: "completed"
  },
  {
    id: "i8", applicantId: "a5", applicantName: "Kavya Iyer", applicantAvatar: "", jobTitle: "UI/UX Designer",
    scheduledAt: "2026-03-05T10:00:00", duration: 45, mode: "Online", interviewers: ["Meera Joshi", "Vikram Singh"],
    meetLink: "https://meet.google.com/future-1", status: "scheduled"
  },
  {
    id: "i9", applicantId: "a11", applicantName: "Ananya Bose", applicantAvatar: "", jobTitle: "Sales Executive",
    scheduledAt: "2026-03-04T14:00:00", duration: 30, mode: "Offline", interviewers: ["Meera Joshi"],
    location: "JDex HQ, Hyderabad", status: "scheduled"
  },
  {
    id: "i10", applicantId: "a4", applicantName: "Arjun Nair", applicantAvatar: "", jobTitle: "Senior Frontend Developer",
    scheduledAt: "2026-02-18T10:00:00", duration: 45, mode: "Phone", interviewers: ["Anita Desai"], status: "cancelled"
  },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: "et1", name: "Shortlist Confirmation", type: "shortlist",
    subject: "Congratulations! You've been shortlisted for {{job_title}} at {{company_name}}",
    body: "Dear {{candidate_name}},\n\nWe are pleased to inform you that your application for the {{job_title}} position at {{company_name}} has been shortlisted.\n\nWe were impressed by your profile and would like to move forward with the next steps in our hiring process. Our team will reach out to you shortly to schedule an interview.\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\n{{company_name}} HR Team",
  },
  {
    id: "et2", name: "Rejection Letter", type: "reject",
    subject: "Update on your application for {{job_title}} at {{company_name}}",
    body: "Dear {{candidate_name}},\n\nThank you for taking the time to apply for the {{job_title}} position at {{company_name}} and for your interest in joining our team.\n\nAfter careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current requirements.\n\nWe encourage you to apply for future openings that match your skills. We wish you all the best in your career journey.\n\nWarm regards,\n{{company_name}} HR Team",
  },
  {
    id: "et3", name: "Interview Invitation", type: "interview",
    subject: "Interview Invitation — {{job_title}} at {{company_name}}",
    body: "Dear {{candidate_name}},\n\nWe would like to invite you for an interview for the {{job_title}} position at {{company_name}}.\n\n📅 Date: {{interview_date}}\n🔗 Meeting Link: {{interview_link}}\n\nPlease confirm your availability by replying to this email. If the proposed time doesn't work, let us know and we'll find an alternative.\n\nLooking forward to speaking with you!\n\nBest regards,\n{{company_name}} HR Team",
  },
  {
    id: "et4", name: "Offer Letter", type: "offer",
    subject: "🎉 Offer Letter — {{job_title}} at {{company_name}}",
    body: "Dear {{candidate_name}},\n\nWe are thrilled to extend an offer for the {{job_title}} position at {{company_name}}!\n\nAfter our evaluation process, we are confident that your skills and experience make you an excellent fit for our team. The detailed offer letter with compensation details and joining information is attached.\n\nPlease review the offer and let us know your decision within 5 business days.\n\nWe're excited about the possibility of you joining our team!\n\nBest regards,\n{{company_name}} HR Team",
  },
  {
    id: "et5", name: "Follow-up", type: "custom",
    subject: "Following up on your application — {{job_title}}",
    body: "Dear {{candidate_name}},\n\nWe wanted to follow up regarding your application for the {{job_title}} position at {{company_name}}.\n\nOur hiring process is still ongoing, and we wanted to assure you that your application is being reviewed. We will get back to you with an update shortly.\n\nThank you for your patience and continued interest in {{company_name}}.\n\nBest regards,\n{{company_name}} HR Team",
  },
];

export const teamMembers: TeamMember[] = [
  { id: "tm1", name: "Vikram Singh", email: "vikram.s@JDex.com", role: "Admin", avatar: "", department: "HR", joinedAt: "2024-01-15" },
  { id: "tm2", name: "Anita Desai", email: "anita.d@JDex.com", role: "HR Manager", avatar: "", department: "HR", joinedAt: "2024-03-10" },
  { id: "tm3", name: "Meera Joshi", email: "meera.j@JDex.com", role: "Recruiter", avatar: "", department: "HR", joinedAt: "2024-06-20" },
  { id: "tm4", name: "Ravi Shankar", email: "ravi.s@JDex.com", role: "Interviewer", avatar: "", department: "Engineering", joinedAt: "2024-08-05" },
  { id: "tm5", name: "Priyanka Das", email: "priyanka.d@JDex.com", role: "Recruiter", avatar: "", department: "HR", joinedAt: "2025-01-12" },
  { id: "tm6", name: "Sameer Khan", email: "sameer.k@JDex.com", role: "Interviewer", avatar: "", department: "Design", joinedAt: "2025-04-18" },
];

export const pipelineStages: PipelineStage[] = [
  { id: "ps1", label: "New Application", color: "#3B82F6", order: 1 },
  { id: "ps2", label: "Shortlisted", color: "#8B5CF6", order: 2 },
  { id: "ps3", label: "Interview Scheduled", color: "#F59E0B", order: 3 },
  { id: "ps4", label: "Final Round", color: "#EC4899", order: 4 },
  { id: "ps5", label: "Selected", color: "#10B981", order: 5 },
  { id: "ps6", label: "Rejected", color: "#EF4444", order: 6 },
];

export const dashboardStats = {
  totalJobs: 5,
  totalApplicants: 20,
  interviewsToday: 2,
  hiredThisMonth: 3,
  applicantsThisWeek: [3, 5, 2, 7, 4, 6, 3],
  applicantsBySource: [
    { source: "LinkedIn", count: 7 },
    { source: "Naukri", count: 5 },
    { source: "Indeed", count: 3 },
    { source: "WorkIndia", count: 3 },
    { source: "Direct", count: 2 },
  ],
  applicantsByStatus: [
    { status: "New", count: 6 },
    { status: "Shortlisted", count: 4 },
    { status: "Interview", count: 4 },
    { status: "Selected", count: 3 },
    { status: "Rejected", count: 2 },
    { status: "On Hold", count: 2 },
  ],
};
