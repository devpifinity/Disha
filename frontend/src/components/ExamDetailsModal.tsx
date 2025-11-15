import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Users, ExternalLink, Clock, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchExamByName } from "@/lib/examQueries";

interface ExamDetails {
  name: string;
  fullName: string;
  eligibility: string[];
  examPattern: {
    mode: string;
    duration: string;
    subjects: string[];
    totalMarks: string;
  };
  importantDates: {
    registration: string;
    examDate: string;
    results: string;
  };
  officialWebsite: string;
  description: string;
}

const examData: Record<string, ExamDetails> = {
  // Engineering Exams
  "JEE Main & Advanced": {
    name: "JEE Main & Advanced",
    fullName: "Joint Entrance Examination",
    description: "JEE is the most important engineering entrance exam in India for admission to IITs, NITs, and other premier engineering institutions.",
    eligibility: [
      "Minimum 75% in 12th (65% for SC/ST)",
      "PCM (Physics, Chemistry, Mathematics) mandatory",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "3 hours each session",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      totalMarks: "300 marks (JEE Main), 306 marks (JEE Advanced)"
    },
    importantDates: {
      registration: "December - January",
      examDate: "January, April (Main), May (Advanced)",
      results: "February, May, June"
    },
    officialWebsite: "https://jeemain.nta.nic.in"
  },
  "State CET exams": {
    name: "State CET",
    fullName: "State Common Entrance Test",
    description: "State-level engineering entrance exams conducted by various states for admission to state engineering colleges.",
    eligibility: [
      "Minimum 50% in 12th with PCM",
      "State domicile required",
      "Age limit varies by state"
    ],
    examPattern: {
      mode: "Online/Offline (varies by state)",
      duration: "2-3 hours",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      totalMarks: "150-200 marks"
    },
    importantDates: {
      registration: "February - April",
      examDate: "April - May",
      results: "May - June"
    },
    officialWebsite: "https://respective-state-cet.gov.in"
  },
  "BITSAT": {
    name: "BITSAT",
    fullName: "Birla Institute of Technology and Science Admission Test",
    description: "BITSAT is conducted by BITS Pilani for admission to its integrated first degree programs.",
    eligibility: [
      "Minimum 75% in 12th with PCM",
      "Minimum 60% in each subject",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "3 hours",
      subjects: ["Physics", "Chemistry", "Mathematics", "English Proficiency", "Logical Reasoning"],
      totalMarks: "450 marks"
    },
    importantDates: {
      registration: "January - March",
      examDate: "May - June",
      results: "June - July"
    },
    officialWebsite: "https://www.bitsadmission.com"
  },
  "VITEEE": {
    name: "VITEEE",
    fullName: "VIT Engineering Entrance Examination",
    description: "VITEEE is conducted by VIT University for admission to B.Tech programs.",
    eligibility: [
      "Minimum 60% in 12th with PCM",
      "English as compulsory subject",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "2.5 hours",
      subjects: ["Physics", "Chemistry", "Mathematics", "English"],
      totalMarks: "125 marks"
    },
    importantDates: {
      registration: "October - February",
      examDate: "April - May",
      results: "May"
    },
    officialWebsite: "https://viteee.vit.ac.in"
  },
  "University-specific exams": {
    name: "University Entrance Tests",
    fullName: "Institution-Specific Entrance Examinations",
    description: "Various universities conduct their own entrance tests for admission to their engineering programs.",
    eligibility: [
      "12th pass with required subjects",
      "Minimum percentage varies",
      "Age limits as per university norms"
    ],
    examPattern: {
      mode: "Online/Offline (varies)",
      duration: "2-3 hours",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      totalMarks: "Varies by university"
    },
    importantDates: {
      registration: "March - May",
      examDate: "May - July",
      results: "June - August"
    },
    officialWebsite: "https://respective-university.edu"
  },

  // Medical Exams
  "NEET UG": {
    name: "NEET UG",
    fullName: "National Eligibility cum Entrance Test - Undergraduate",
    description: "NEET is the single medical entrance exam for admission to MBBS, BDS, and other medical courses in India.",
    eligibility: [
      "Minimum 50% in PCB (40% for SC/ST/OBC)",
      "Age limit: 25 years (30 for SC/ST/OBC)",
      "Physics, Chemistry, Biology mandatory"
    ],
    examPattern: {
      mode: "Offline (Pen and Paper)",
      duration: "3 hours 20 minutes",
      subjects: ["Physics", "Chemistry", "Biology (Botany + Zoology)"],
      totalMarks: "720 marks (180 questions)"
    },
    importantDates: {
      registration: "February - March",
      examDate: "May (first Sunday)",
      results: "June"
    },
    officialWebsite: "https://neet.nta.nic.in"
  },
  "Karnataka NEET": {
    name: "Karnataka NEET",
    fullName: "Karnataka State NEET Counseling",
    description: "State quota counseling for NEET qualified candidates for admission to medical colleges in Karnataka.",
    eligibility: [
      "NEET qualification mandatory",
      "Karnataka domicile required",
      "Minimum qualifying percentile"
    ],
    examPattern: {
      mode: "Based on NEET UG scores",
      duration: "Counseling process",
      subjects: ["NEET UG qualified"],
      totalMarks: "Based on NEET scores"
    },
    importantDates: {
      registration: "June - July",
      examDate: "NEET UG based",
      results: "July - August"
    },
    officialWebsite: "https://kea.kar.nic.in"
  },
  "AIIMS MBBS": {
    name: "AIIMS MBBS",
    fullName: "All Institute of Medical Sciences",
    description: "Now merged with NEET UG for MBBS admission to AIIMS institutes.",
    eligibility: [
      "NEET UG qualification required",
      "Same as NEET UG eligibility",
      "Top NEET ranks considered"
    ],
    examPattern: {
      mode: "Based on NEET UG",
      duration: "NEET UG pattern",
      subjects: ["Physics", "Chemistry", "Biology"],
      totalMarks: "NEET UG scores"
    },
    importantDates: {
      registration: "NEET UG registration",
      examDate: "NEET UG exam date",
      results: "NEET UG results"
    },
    officialWebsite: "https://www.aiimsexams.ac.in"
  },

  // Architecture Exams
  "NATA": {
    name: "NATA",
    fullName: "National Aptitude Test in Architecture",
    description: "NATA is conducted for admission to B.Arch programs in India.",
    eligibility: [
      "12th pass with 50% in PCM",
      "Mathematics compulsory",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online + Offline (Drawing)",
      duration: "3 hours",
      subjects: ["Mathematics", "General Aptitude", "Drawing"],
      totalMarks: "200 marks"
    },
    importantDates: {
      registration: "February - March",
      examDate: "April & July",
      results: "May & August"
    },
    officialWebsite: "https://nata.in"
  },
  "JEE Main Paper 2": {
    name: "JEE Main Paper 2",
    fullName: "Joint Entrance Examination Main - Paper 2",
    description: "JEE Main Paper 2 is for admission to B.Arch and B.Planning courses.",
    eligibility: [
      "12th pass with 50% in PCM",
      "Mathematics compulsory",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online + Offline (Drawing)",
      duration: "3 hours",
      subjects: ["Mathematics", "Aptitude", "Drawing"],
      totalMarks: "400 marks"
    },
    importantDates: {
      registration: "December - January",
      examDate: "January & April",
      results: "February & May"
    },
    officialWebsite: "https://jeemain.nta.nic.in"
  },
  "KCET": {
    name: "KCET",
    fullName: "Karnataka Common Entrance Test",
    description: "KCET is conducted for admission to engineering, pharmacy, and architecture courses in Karnataka.",
    eligibility: [
      "12th pass with required subjects",
      "Karnataka domicile required",
      "Minimum 45% aggregate"
    ],
    examPattern: {
      mode: "Offline (Pen and Paper)",
      duration: "4 hours 40 minutes",
      subjects: ["Physics", "Chemistry", "Mathematics", "Biology"],
      totalMarks: "180 marks"
    },
    importantDates: {
      registration: "February - March",
      examDate: "April - May",
      results: "May - June"
    },
    officialWebsite: "https://kea.kar.nic.in"
  },

  // Law Exams
  "CLAT": {
    name: "CLAT",
    fullName: "Common Law Admission Test",
    description: "CLAT is a national-level entrance exam for admission to undergraduate and postgraduate law programs in top National Law Universities across India.",
    eligibility: [
      "Minimum 45% in 12th (40% for SC/ST)",
      "Age limit: 20 years for general, 22 for SC/ST",
      "Any stream (Science/Commerce/Arts)"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "2 hours",
      subjects: ["English", "Current Affairs", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
      totalMarks: "150 marks (150 questions)"
    },
    importantDates: {
      registration: "December - January",
      examDate: "May (usually second Sunday)",
      results: "June"
    },
    officialWebsite: "https://consortiumofnlus.ac.in"
  },
  "Karnataka PGCET Law": {
    name: "Karnataka PGCET Law",
    fullName: "Karnataka Post Graduate Common Entrance Test - Law",
    description: "Karnataka PGCET Law is for admission to LLM courses in Karnataka universities.",
    eligibility: [
      "LLB degree from recognized university",
      "Minimum 50% marks in LLB",
      "Karnataka domicile preference"
    ],
    examPattern: {
      mode: "Online",
      duration: "2 hours",
      subjects: ["Legal Aptitude", "Constitutional Law", "General Knowledge"],
      totalMarks: "100 marks"
    },
    importantDates: {
      registration: "June - July",
      examDate: "August",
      results: "September"
    },
    officialWebsite: "https://kea.kar.nic.in"
  },
  "KSLAT": {
    name: "KSLAT",
    fullName: "Karnataka State Law Admission Test",
    description: "KSLAT is conducted for admission to law courses in Karnataka State Law University.",
    eligibility: [
      "12th pass for 5-year LLB",
      "Graduation for 3-year LLB",
      "Karnataka domicile required"
    ],
    examPattern: {
      mode: "Online",
      duration: "90 minutes",
      subjects: ["Legal Aptitude", "General Knowledge", "English", "Logical Reasoning"],
      totalMarks: "120 marks"
    },
    importantDates: {
      registration: "March - April",
      examDate: "May",
      results: "June"
    },
    officialWebsite: "https://kslu.ac.in"
  },

  // Psychology Exams
  "CUET for central universities": {
    name: "CUET",
    fullName: "Common University Entrance Test",
    description: "CUET is conducted by NTA for admission to undergraduate, postgraduate, and research programs in central universities.",
    eligibility: [
      "Minimum 50% in 12th for UG courses",
      "Bachelor's degree for PG courses",
      "Any stream acceptable"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "2 hours per session",
      subjects: ["General Test", "Domain Specific Test", "Language Test"],
      totalMarks: "Varies by subject combination"
    },
    importantDates: {
      registration: "March - May",
      examDate: "July - August",
      results: "September"
    },
    officialWebsite: "https://cuet.samarth.ac.in"
  },
  "Karnataka PGCET": {
    name: "Karnataka PGCET",
    fullName: "Karnataka Post Graduate Common Entrance Test",
    description: "Karnataka PGCET is for admission to postgraduate courses including Psychology in Karnataka universities.",
    eligibility: [
      "Bachelor's degree with 50% marks",
      "Karnataka domicile preference",
      "Subject-specific requirements"
    ],
    examPattern: {
      mode: "Online",
      duration: "2.5 hours",
      subjects: ["Subject Knowledge", "Research Methodology", "General Aptitude"],
      totalMarks: "100 marks"
    },
    importantDates: {
      registration: "June - July",
      examDate: "August",
      results: "September"
    },
    officialWebsite: "https://kea.kar.nic.in"
  },

  // Design Exams
  "UCEED": {
    name: "UCEED",
    fullName: "Undergraduate Common Entrance Examination for Design",
    description: "UCEED is conducted for admission to Bachelor of Design programs at IITs.",
    eligibility: [
      "12th pass from recognized board",
      "No specific stream requirement",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online",
      duration: "3 hours",
      subjects: ["Visualization and Spatial Ability", "Observation and Design Sensitivity", "Drawing", "General Awareness"],
      totalMarks: "300 marks"
    },
    importantDates: {
      registration: "October - November",
      examDate: "January",
      results: "March"
    },
    officialWebsite: "https://uceed.iitb.ac.in"
  },
  "NIFT Entrance Exam": {
    name: "NIFT Entrance",
    fullName: "National Institute of Fashion Technology Entrance Exam",
    description: "NIFT entrance exam is for admission to undergraduate and postgraduate programs in fashion technology and design.",
    eligibility: [
      "12th pass for UG programs",
      "Bachelor's degree for PG programs",
      "Age limit varies by program"
    ],
    examPattern: {
      mode: "Online + Offline (Situation Test)",
      duration: "3 hours (written) + 3 hours (practical)",
      subjects: ["General Ability Test", "Creative Ability Test", "Situation Test"],
      totalMarks: "200 marks"
    },
    importantDates: {
      registration: "December - January",
      examDate: "February",
      results: "April"
    },
    officialWebsite: "https://www.nift.ac.in"
  },

  // Teaching Exams
  "TET (Teacher Eligibility Test)": {
    name: "TET",
    fullName: "Teacher Eligibility Test",
    description: "TET is mandatory for teaching positions in government schools from classes I to VIII.",
    eligibility: [
      "12th pass + 2-year Diploma in Elementary Education",
      "OR Bachelor's degree + B.Ed",
      "Age limit varies by state"
    ],
    examPattern: {
      mode: "Online/Offline (varies by state)",
      duration: "2.5 hours",
      subjects: ["Child Development & Pedagogy", "Language I & II", "Mathematics", "Environmental Studies"],
      totalMarks: "150 marks"
    },
    importantDates: {
      registration: "Varies by state",
      examDate: "Multiple times per year",
      results: "Within 2 months"
    },
    officialWebsite: "https://respective-state-tet.gov.in"
  },
  "B.Ed entrance exams": {
    name: "B.Ed Entrance",
    fullName: "Bachelor of Education Entrance Examinations",
    description: "Various entrance exams conducted for admission to B.Ed programs across different universities.",
    eligibility: [
      "Bachelor's degree with 50% marks",
      "Any stream acceptable",
      "Age limit varies"
    ],
    examPattern: {
      mode: "Online/Offline",
      duration: "2-3 hours",
      subjects: ["General Awareness", "Teaching Aptitude", "Subject Knowledge", "Reasoning"],
      totalMarks: "100-200 marks"
    },
    importantDates: {
      registration: "March - May",
      examDate: "May - July",
      results: "June - August"
    },
    officialWebsite: "https://respective-university.edu"
  },
  "CTET (Central TET)": {
    name: "CTET",
    fullName: "Central Teacher Eligibility Test",
    description: "CTET is conducted by CBSE for teaching positions in central government schools.",
    eligibility: [
      "12th pass + 2-year Diploma in Elementary Education",
      "OR Bachelor's degree + B.Ed",
      "No age limit"
    ],
    examPattern: {
      mode: "Online",
      duration: "2.5 hours",
      subjects: ["Child Development & Pedagogy", "Language I & II", "Mathematics", "Environmental Studies"],
      totalMarks: "150 marks"
    },
    importantDates: {
      registration: "April & September",
      examDate: "July & December",
      results: "August & January"
    },
    officialWebsite: "https://ctet.nic.in"
  },

  // Business & Commerce Exams
  "CAT": {
    name: "CAT",
    fullName: "Common Admission Test",
    description: "CAT is the gateway to Indian Institutes of Management (IIMs) and other top business schools in India.",
    eligibility: [
      "Bachelor's degree with 50% (45% for SC/ST/PWD)",
      "Final year students can apply",
      "No age limit"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "2 hours",
      subjects: ["Verbal Ability & Reading Comprehension", "Data Interpretation & Logical Reasoning", "Quantitative Ability"],
      totalMarks: "198 marks (66 questions)"
    },
    importantDates: {
      registration: "August - September",
      examDate: "November (last Sunday)",
      results: "January"
    },
    officialWebsite: "https://iimcat.ac.in"
  },
  "MAT": {
    name: "MAT",
    fullName: "Management Aptitude Test",
    description: "MAT is conducted for admission to MBA programs in various business schools across India.",
    eligibility: [
      "Bachelor's degree in any discipline",
      "Final year students can apply",
      "No age limit"
    ],
    examPattern: {
      mode: "Online & Offline",
      duration: "2.5 hours",
      subjects: ["Language Comprehension", "Mathematical Skills", "Data Analysis", "Intelligence & Critical Reasoning", "Indian & Global Environment"],
      totalMarks: "200 marks"
    },
    importantDates: {
      registration: "Multiple sessions throughout year",
      examDate: "February, May, September, December",
      results: "Within 15 days"
    },
    officialWebsite: "https://www.aima.in"
  },
  "Karnataka DCET": {
    name: "Karnataka DCET",
    fullName: "Karnataka Diploma Common Entrance Test",
    description: "Karnataka DCET is for lateral entry admission to engineering courses for diploma holders.",
    eligibility: [
      "Diploma in Engineering/Technology",
      "Karnataka domicile required",
      "Minimum 45% in diploma"
    ],
    examPattern: {
      mode: "Offline",
      duration: "3 hours",
      subjects: ["Mathematics", "Physics", "Chemistry"],
      totalMarks: "180 marks"
    },
    importantDates: {
      registration: "May - June",
      examDate: "July",
      results: "August"
    },
    officialWebsite: "https://kea.kar.nic.in"
  },

  // Computer Science & Data Science
  "GATE": {
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    description: "GATE is conducted for admission to postgraduate programs and recruitment in PSUs.",
    eligibility: [
      "Bachelor's degree in Engineering/Technology",
      "Final year students can apply",
      "No age limit"
    ],
    examPattern: {
      mode: "Online",
      duration: "3 hours",
      subjects: ["Subject-specific technical questions", "General Aptitude", "Engineering Mathematics"],
      totalMarks: "100 marks"
    },
    importantDates: {
      registration: "August - September",
      examDate: "February",
      results: "March"
    },
    officialWebsite: "https://gate.iitb.ac.in"
  },
  "JAM": {
    name: "JAM",
    fullName: "Joint Admission Test for Masters",
    description: "JAM is conducted for admission to postgraduate programs in science at IITs and other institutes.",
    eligibility: [
      "Bachelor's degree in relevant subject",
      "Final year students can apply",
      "No age limit"
    ],
    examPattern: {
      mode: "Online",
      duration: "3 hours",
      subjects: ["Subject-specific", "Multiple Choice", "Numerical Answer Type"],
      totalMarks: "100 marks"
    },
    importantDates: {
      registration: "September - October",
      examDate: "February",
      results: "March"
    },
    officialWebsite: "https://jam.iitb.ac.in"
  },

  // General/Default entries for common exam types
  "Direct admission based on 12th marks": {
    name: "Merit-based Admission",
    fullName: "Direct Admission Based on 12th Standard Marks",
    description: "Many colleges offer direct admission based on 12th standard marks without separate entrance exams.",
    eligibility: [
      "12th pass from recognized board",
      "Minimum percentage varies by college",
      "Stream requirements as per course"
    ],
    examPattern: {
      mode: "Merit-based selection",
      duration: "No exam required",
      subjects: ["12th standard subjects"],
      totalMarks: "Based on 12th percentage"
    },
    importantDates: {
      registration: "April - July",
      examDate: "No exam",
      results: "Merit list publication"
    },
    officialWebsite: "https://respective-college.edu"
  },
  "Online certification programs": {
    name: "Online Certifications",
    fullName: "Professional Online Certification Programs",
    description: "Industry-recognized certification programs that can supplement formal education.",
    eligibility: [
      "Basic computer literacy",
      "English proficiency",
      "No formal education requirements"
    ],
    examPattern: {
      mode: "Online",
      duration: "Self-paced",
      subjects: ["Industry-specific skills", "Practical projects"],
      totalMarks: "Project-based assessment"
    },
    importantDates: {
      registration: "Throughout the year",
      examDate: "Flexible",
      results: "Upon completion"
    },
    officialWebsite: "https://various-platforms.com"
  },
  "Bootcamp programs": {
    name: "Bootcamp Programs",
    fullName: "Intensive Skill Development Bootcamps",
    description: "Intensive, short-term training programs focused on practical skills and job readiness.",
    eligibility: [
      "Basic aptitude in relevant field",
      "Commitment to intensive learning",
      "No formal degree requirements"
    ],
    examPattern: {
      mode: "Practical + Online",
      duration: "3-6 months intensive",
      subjects: ["Hands-on projects", "Industry tools", "Real-world applications"],
      totalMarks: "Project portfolio assessment"
    },
    importantDates: {
      registration: "Multiple batches per year",
      examDate: "Continuous assessment",
      results: "Portfolio review"
    },
    officialWebsite: "https://various-bootcamp-providers.com"
  },

  // Additional exam entries to match CareerDetails exactly
  "JEE Main for Engineering colleges": {
    name: "JEE Main",
    fullName: "Joint Entrance Examination - Main",
    description: "JEE Main is the first stage of the Joint Entrance Examination for admission to engineering colleges.",
    eligibility: [
      "Minimum 75% in 12th (65% for SC/ST)",
      "PCM (Physics, Chemistry, Mathematics) mandatory",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "3 hours",
      subjects: ["Physics", "Chemistry", "Mathematics"],
      totalMarks: "300 marks"
    },
    importantDates: {
      registration: "December - January",
      examDate: "January, April",
      results: "February, May"
    },
    officialWebsite: "https://jeemain.nta.nic.in"
  },
  "Various university entrance exams": {
    name: "University Entrance Exams",
    fullName: "Various University Entrance Examinations",
    description: "Different universities conduct their own entrance exams for admission to various programs.",
    eligibility: [
      "12th pass from recognized board",
      "Minimum percentage varies by university",
      "Stream requirements as per course"
    ],
    examPattern: {
      mode: "Online/Offline (varies)",
      duration: "2-3 hours",
      subjects: ["Subject-specific", "General Aptitude", "English"],
      totalMarks: "100-300 marks"
    },
    importantDates: {
      registration: "March - June",
      examDate: "May - August",
      results: "June - September"
    },
    officialWebsite: "https://respective-university.edu"
  },
  "UCEED (for IITs)": {
    name: "UCEED",
    fullName: "Undergraduate Common Entrance Examination for Design",
    description: "UCEED is conducted for admission to Bachelor of Design programs at IITs.",
    eligibility: [
      "12th pass from recognized board",
      "No specific stream requirement",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online",
      duration: "3 hours",
      subjects: ["Visualization and Spatial Ability", "Observation and Design Sensitivity", "Drawing"],
      totalMarks: "300 marks"
    },
    importantDates: {
      registration: "October - November",
      examDate: "January",
      results: "March"
    },
    officialWebsite: "https://uceed.iitb.ac.in"
  },
  "NID Entrance": {
    name: "NID Entrance",
    fullName: "National Institute of Design Entrance Exam",
    description: "NID entrance exam for admission to design programs at National Institute of Design.",
    eligibility: [
      "12th pass from recognized board",
      "Portfolio submission required",
      "Age limit varies by program"
    ],
    examPattern: {
      mode: "Online + Portfolio + Studio Test",
      duration: "3 hours + practical",
      subjects: ["Design Aptitude", "Drawing", "Observation"],
      totalMarks: "Varies"
    },
    importantDates: {
      registration: "December - January",
      examDate: "February - March",
      results: "April"
    },
    officialWebsite: "https://www.nid.edu"
  },
  "CEED (for M.Des)": {
    name: "CEED",
    fullName: "Common Entrance Examination for Design",
    description: "CEED is for admission to Master of Design programs at premier institutes.",
    eligibility: [
      "Bachelor's degree in any field",
      "Final year students can apply",
      "No age limit"
    ],
    examPattern: {
      mode: "Online + Offline (Portfolio)",
      duration: "3 hours + portfolio",
      subjects: ["Design and Innovation", "Communication Design", "Product Design"],
      totalMarks: "100 marks"
    },
    importantDates: {
      registration: "September - October",
      examDate: "January",
      results: "March"
    },
    officialWebsite: "https://ceed.iitb.ac.in"
  },
  "College-specific design tests": {
    name: "College Design Tests",
    fullName: "Institution-Specific Design Entrance Tests",
    description: "Various design colleges conduct their own entrance tests for admission to design programs.",
    eligibility: [
      "12th pass for UG programs",
      "Bachelor's degree for PG programs",
      "Portfolio may be required"
    ],
    examPattern: {
      mode: "Online/Offline + Portfolio",
      duration: "2-4 hours",
      subjects: ["Design Aptitude", "Drawing", "Creative Thinking"],
      totalMarks: "Varies by institution"
    },
    importantDates: {
      registration: "Throughout the year",
      examDate: "Multiple sessions",
      results: "Within 4 weeks"
    },
    officialWebsite: "https://respective-college.edu"
  },
  "CAT/MAT for MBA": {
    name: "CAT/MAT",
    fullName: "CAT and MAT for MBA Admission",
    description: "Common entrance exams for MBA programs in India.",
    eligibility: [
      "Bachelor's degree with 50% marks",
      "Final year students can apply",
      "No age limit"
    ],
    examPattern: {
      mode: "Online",
      duration: "2-2.5 hours",
      subjects: ["Quantitative Ability", "Verbal Ability", "Logical Reasoning"],
      totalMarks: "198-200 marks"
    },
    importantDates: {
      registration: "August - September",
      examDate: "November - February",
      results: "January - March"
    },
    officialWebsite: "https://iimcat.ac.in"
  },
  "Digital marketing certifications": {
    name: "Digital Marketing Certifications",
    fullName: "Professional Digital Marketing Certification Programs",
    description: "Industry-recognized certifications in digital marketing from various platforms.",
    eligibility: [
      "Basic computer literacy",
      "English proficiency",
      "No formal education requirements"
    ],
    examPattern: {
      mode: "Online",
      duration: "Self-paced",
      subjects: ["SEO", "SEM", "Social Media Marketing", "Analytics"],
      totalMarks: "Project-based assessment"
    },
    importantDates: {
      registration: "Throughout the year",
      examDate: "Flexible",
      results: "Upon completion"
    },
    officialWebsite: "https://various-certification-platforms.com"
  },
  "NEET (National Eligibility Test)": {
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    description: "NEET is the single medical entrance exam for admission to MBBS, BDS, and other medical courses in India.",
    eligibility: [
      "Minimum 50% in PCB (40% for SC/ST/OBC)",
      "Age limit: 25 years (30 for SC/ST/OBC)",
      "Physics, Chemistry, Biology mandatory"
    ],
    examPattern: {
      mode: "Offline (Pen and Paper)",
      duration: "3 hours 20 minutes",
      subjects: ["Physics", "Chemistry", "Biology (Botany + Zoology)"],
      totalMarks: "720 marks (180 questions)"
    },
    importantDates: {
      registration: "February - March",
      examDate: "May (first Sunday)",
      results: "June"
    },
    officialWebsite: "https://neet.nta.nic.in"
  },
  "AIIMS entrance (now merged with NEET)": {
    name: "AIIMS",
    fullName: "All Institute of Medical Sciences (merged with NEET)",
    description: "AIIMS entrance is now merged with NEET UG for admission to AIIMS institutes.",
    eligibility: [
      "NEET UG qualification required",
      "Same as NEET UG eligibility",
      "Top NEET ranks considered"
    ],
    examPattern: {
      mode: "Based on NEET UG",
      duration: "NEET UG pattern",
      subjects: ["Physics", "Chemistry", "Biology"],
      totalMarks: "NEET UG scores"
    },
    importantDates: {
      registration: "NEET UG registration",
      examDate: "NEET UG exam date",
      results: "NEET UG results"
    },
    officialWebsite: "https://www.aiimsexams.ac.in"
  },
  "NATA (National Aptitude Test)": {
    name: "NATA",
    fullName: "National Aptitude Test in Architecture",
    description: "NATA is conducted for admission to B.Arch programs in India.",
    eligibility: [
      "12th pass with 50% in PCM",
      "Mathematics compulsory",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online + Offline (Drawing)",
      duration: "3 hours",
      subjects: ["Mathematics", "General Aptitude", "Drawing"],
      totalMarks: "200 marks"
    },
    importantDates: {
      registration: "February - March",
      examDate: "April & July",
      results: "May & August"
    },
    officialWebsite: "https://nata.in"
  },
  "JEE Main Paper 2 (B.Arch)": {
    name: "JEE Main Paper 2",
    fullName: "Joint Entrance Examination Main - Paper 2 for B.Arch",
    description: "JEE Main Paper 2 is for admission to B.Arch and B.Planning courses.",
    eligibility: [
      "12th pass with 50% in PCM",
      "Mathematics compulsory",
      "Age limit: 25 years"
    ],
    examPattern: {
      mode: "Online + Offline (Drawing)",
      duration: "3 hours",
      subjects: ["Mathematics", "Aptitude", "Drawing"],
      totalMarks: "400 marks"
    },
    importantDates: {
      registration: "December - January",
      examDate: "January & April",
      results: "February & May"
    },
    officialWebsite: "https://jeemain.nta.nic.in"
  },
  "CLAT (Common Law Admission Test)": {
    name: "CLAT",
    fullName: "Common Law Admission Test",
    description: "CLAT is a national-level entrance exam for admission to undergraduate and postgraduate law programs in top National Law Universities across India.",
    eligibility: [
      "Minimum 45% in 12th (40% for SC/ST)",
      "Age limit: 20 years for general, 22 for SC/ST",
      "Any stream (Science/Commerce/Arts)"
    ],
    examPattern: {
      mode: "Online (Computer-based)",
      duration: "2 hours",
      subjects: ["English", "Current Affairs", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"],
      totalMarks: "150 marks (150 questions)"
    },
    importantDates: {
      registration: "December - January",
      examDate: "May (usually second Sunday)",
      results: "June"
    },
    officialWebsite: "https://consortiumofnlus.ac.in"
  },
  "LSAT India": {
    name: "LSAT India",
    fullName: "Law School Admission Test - India",
    description: "LSAT India is designed for admission to law programs and measures skills that are essential for success in law school.",
    eligibility: [
      "Minimum 50% in 12th",
      "Any stream acceptable",
      "No age limit"
    ],
    examPattern: {
      mode: "Online",
      duration: "2 hours 20 minutes",
      subjects: ["Analytical Reasoning", "Logical Reasoning", "Reading Comprehension"],
      totalMarks: "60-100 questions (varies)"
    },
    importantDates: {
      registration: "Year-round registration",
      examDate: "Multiple dates available",
      results: "Within 2-3 weeks"
    },
    officialWebsite: "https://www.lsac.org"
  }
};

interface ExamDetailsModalProps {
  examName: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ExamDetailsModal({ examName, isOpen, onClose }: ExamDetailsModalProps) {
  console.log("Modal props:", { examName, isOpen });
  console.log("Available exam keys:", Object.keys(examData));

  // Optional: Fetch exam from database (currently only has basic info)
  const { data: dbExam } = useQuery({
    queryKey: ['exam-details', examName],
    queryFn: () => fetchExamByName(examName || ''),
    enabled: !!examName && isOpen,
  });

  // Use hardcoded detailed data (database doesn't have detailed exam info yet)
  if (!examName || !examData[examName]) {
    console.log("No exam data found for:", examName);
    console.log("Checking exact match for:", examName, "->", !!examData[examName]);

    // If we have basic DB data but no detailed data, show a minimal view
    if (dbExam?.data) {
      return (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                {dbExam.data.name}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {dbExam.data.description && dbExam.data.description.length > 0 && (
                <div>
                  {dbExam.data.description.map((desc, idx) => (
                    <p key={idx} className="text-muted-foreground">{desc}</p>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                Detailed exam information is not yet available. Please check the official website for more details.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  }

  const exam = examData[examName];

  // Merge database description if available
  if (dbExam?.data?.description && dbExam.data.description.length > 0) {
    exam.description = dbExam.data.description.join(' ');
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            {exam.name} - {exam.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="text-muted-foreground">
            {exam.description}
          </div>

          {/* Eligibility */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Eligibility Criteria</h3>
            </div>
            <ul className="space-y-2">
              {exam.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Pattern */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Exam Pattern</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Mode:</span>
                  <Badge variant="secondary">{exam.examPattern.mode}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span className="text-sm">{exam.examPattern.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total Marks:</span>
                  <span className="text-sm font-semibold">{exam.examPattern.totalMarks}</span>
                </div>
              </div>
              <div>
                <span className="font-medium">Subjects:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exam.examPattern.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Important Dates</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Clock className="h-4 w-4 mx-auto mb-2 text-primary" />
                <div className="font-medium text-sm">Registration</div>
                <div className="text-xs text-muted-foreground">{exam.importantDates.registration}</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <BookOpen className="h-4 w-4 mx-auto mb-2 text-primary" />
                <div className="font-medium text-sm">Exam Date</div>
                <div className="text-xs text-muted-foreground">{exam.importantDates.examDate}</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <FileText className="h-4 w-4 mx-auto mb-2 text-primary" />
                <div className="font-medium text-sm">Results</div>
                <div className="text-xs text-muted-foreground">{exam.importantDates.results}</div>
              </div>
            </div>
          </div>

          {/* Official Website */}
          <div className="flex justify-center">
            <Button asChild>
              <a 
                href={exam.officialWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Visit Official Website
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}