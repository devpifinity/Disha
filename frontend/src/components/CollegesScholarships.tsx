
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Users,
  Star,
  ExternalLink,
  GraduationCap,
  DollarSign,
  Calendar,
  Award,
  Building,
  Phone,
  Mail,
  IndianRupee,
  Heart,
  Info,
  Sparkles,
  HandHeart
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { fetchCollegesWithCoursesForCareer, fetchUniqueEntranceExamsForCareer } from "@/lib/collegeQueries";
import { fetchCareerBySlug } from "@/lib/careerQueries";

// Entrance exam data for select colleges (demo phase - limited scope)
const collegeEntranceExams = {
  "civil-engineer": {
    "Indian Institute of Science (IISc)": {
      requiredExams: ["JEE Advanced", "GATE", "IISc Entrance Test"],
    },
    "National Institute of Technology (NIT) Karnataka": {
      requiredExams: ["JEE Main", "KCET", "GATE"],
    },
    "University Visvesvaraya College of Engineering": {
      requiredExams: ["KCET", "COMEDK", "JEE Main"],
    }
  },
  "psychologist": {
    "Bangalore University": {
      requiredExams: ["CUET", "Karnataka PGCET", "University Entrance Test"],
    },
    "Karnataka State Open University": {
      requiredExams: ["Open University Entrance Test", "Merit-based Admission"],
    },
    "University of Mysore": {
      requiredExams: ["CUET", "Mysore University Entrance Test", "Merit-based Selection"],
    },
    "Christ University": {
      requiredExams: ["Christ University Entrance Test", "CUET", "Merit-based Selection"],
    },
    "Jain University": {
      requiredExams: ["Jain Entrance Test", "CUET", "12th Merit"],
    },
    "Mount Carmel College": {
      requiredExams: ["College Entrance Test", "CUET", "Merit-based Admission"],
    },
    "St. Joseph's College": {
      requiredExams: ["SJC Entrance Test", "CUET", "Merit-based Selection"],
    },
    "Presidency College": {
      requiredExams: ["College Entrance Test", "CUET", "Merit-based Admission"],
    }
  },
  "data-scientist": {
    "Indian Institute of Science (IISc)": {
      requiredExams: ["GATE", "JAM", "IISc Entrance Test"],
    },
    "Indian Statistical Institute (ISI)": {
      requiredExams: ["ISI Admission Test", "GATE", "JAM"],
    },
    "Bangalore University (Computer Science)": {
      requiredExams: ["CUET", "Karnataka PGCET", "University Entrance Test"],
    }
  },
  "teacher": {
    "Regional Institute of Education (RIE)": {
      requiredExams: ["RIE CEE", "CUET", "B.Ed Entrance Test"],
    },
    "Karnataka State Rural Development University": {
      requiredExams: ["KSRDU Entrance Test", "State CET", "Merit-based Admission"],
    },
    "Bangalore University (Education)": {
      requiredExams: ["CUET", "Karnataka B.Ed CET", "University Entrance Test"],
    }
  },
  "graphic-designer": {
    "College of Fine Arts, Bangalore University": {
      requiredExams: ["CUET", "Karnataka Arts CET", "University Entrance Test"],
    },
    "Government College of Arts and Crafts": {
      requiredExams: ["State Arts Entrance", "CUET", "Portfolio Assessment"],
    },
    "Karnataka State Open University (Design)": {
      requiredExams: ["KSOU Design Test", "Merit-based Admission", "Portfolio Review"],
    }
  },
  "marketing-specialist": {
    "Bangalore University (Commerce)": {
      requiredExams: ["CUET", "Karnataka DCET", "University Entrance Test"],
    },
    "Government First Grade College (Commerce)": {
      requiredExams: ["Karnataka DCET", "State CET", "Merit-based Admission"],
    },
    "Central College (Bangalore University)": {
      requiredExams: ["CUET", "Karnataka DCET", "College Entrance Test"],
    }
  },
  "mechanical-engineer": {
    "University Visvesvaraya College of Engineering": {
      requiredExams: ["KCET", "COMEDK", "JEE Main"],
    },
    "BMS College of Engineering": {
      requiredExams: ["KCET", "COMEDK", "Management Quota"],
    },
    "Government Engineering College, Ramanagara": {
      requiredExams: ["KCET", "JEE Main", "State CET"],
    }
  },
  "software-developer": {
    "University Visvesvaraya College of Engineering (CSE)": {
      requiredExams: ["KCET", "COMEDK", "JEE Main"],
    },
    "Bangalore University (Computer Science)": {
      requiredExams: ["CUET", "Karnataka DCET", "University Entrance Test"],
    },
    "Sir M. Visvesvaraya Institute of Technology": {
      requiredExams: ["KCET", "COMEDK", "Management Quota"],
    }
  },
  "doctor": {
    "Bangalore Medical College and Research Institute": {
      requiredExams: ["NEET UG", "Karnataka NEET", "AIIMS MBBS"],
    },
    "Mysore Medical College and Research Institute": {
      requiredExams: ["NEET UG", "Karnataka NEET", "State Quota"],
    },
    "Government Medical College, Bellary": {
      requiredExams: ["NEET UG", "Karnataka NEET", "Government Quota"],
    }
  },
  "architect": {
    "School of Architecture, UVCE": {
      requiredExams: ["NATA", "JEE Main Paper 2", "KCET"],
    },
    "Bangalore University (Architecture)": {
      requiredExams: ["NATA", "Karnataka Architecture CET", "University Entrance Test"],
    },
    "Government Architecture College": {
      requiredExams: ["NATA", "State Architecture CET", "Merit-based Admission"],
    }
  },
  "lawyer": {
    "Government Law College": {
      requiredExams: ["CLAT", "Karnataka PGCET Law", "KSLAT"],
    },
    "Bangalore University (Law)": {
      requiredExams: ["CUET", "Karnataka Law CET", "University Entrance Test"],
    },
    "Karnataka State Law University": {
      requiredExams: ["CLAT", "Karnataka Law CET", "KSLAT"],
    }
  },
  "entrepreneur": {
    "Bangalore University (BBA - Entrepreneurship)": {
      requiredExams: ["CUET", "Karnataka DCET", "University Entrance Test"],
    },
    "Government First Grade College (Business)": {
      requiredExams: ["Karnataka DCET", "State CET", "Merit-based Admission"],
    },
    "Karnataka State Open University (Management)": {
      requiredExams: ["KSOU Entrance Test", "Merit-based Admission", "Distance Learning Assessment"],
    }
  },
  "banking-professional": {
    "Government First Grade College (Commerce)": {
      requiredExams: ["Karnataka DCET", "CUET", "Merit-based Admission"],
    },
    "Bangalore University (Commerce & Management)": {
      requiredExams: ["CUET", "Karnataka CET", "University Entrance Test"],
    },
    "Karnataka State Open University (Banking & Finance)": {
      requiredExams: ["KSOU Entrance Test", "Merit-based Admission", "Distance Learning Assessment"],
    }
  },
  "accountant": {
    "Government College of Commerce": {
      requiredExams: ["Karnataka DCET", "CUET", "CA Foundation", "Merit-based Selection"],
    },
    "Bangalore University (B.Com - Accounting)": {
      requiredExams: ["CUET", "Karnataka CET", "University Entrance Test"],
    },
    "Government First Grade College (Accounting & Finance)": {
      requiredExams: ["Karnataka DCET", "State CET", "Merit-based Admission"],
    }
  }
};

// Government colleges data focused on affordability for underserved students
const governmentCollegesData = {
  "civil-engineer": [
    {
      name: "Indian Institute of Science (IISc)",
      location: "Bangalore",
      type: "Government",
      rating: 4.8,
      fees: "₹25,000/year",
      originalFees: "₹2.5 Lakhs total",
      duration: "4 Years",
      seats: "120",
      financialAid: ["Free for EWS", "SC/ST Scholarships", "Merit Scholarships"],
      highlights: ["Top Research Institute", "100% Placement", "Fee Waiver Available"],
      contact: { phone: "+91-80-2293-2001", email: "admissions@iisc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "National Institute of Technology (NIT) Karnataka",
      location: "Surathkal, Karnataka",
      type: "Government",
      rating: 4.6,
      fees: "₹62,000/year",
      originalFees: "₹2.5 Lakhs total",
      duration: "4 Years", 
      seats: "180",
      financialAid: ["Scholarships Available", "Fee Remission for EWS", "Bank Loans Available"],
      highlights: ["NIT Status", "Government Institution", "Industry Connections"],
      contact: { phone: "+91-824-247-3050", email: "registrar@nitk.edu.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "University Visvesvaraya College of Engineering",
      location: "Bangalore",
      type: "Government",
      rating: 4.4,
      fees: "₹8,000/year",
      originalFees: "₹32,000 total",
      duration: "4 Years",
      seats: "150",
      financialAid: ["Free for EWS", "Karnataka State Scholarships", "Minority Scholarships"],
      highlights: ["Extremely Affordable", "Government College", "Strong Alumni Network"],
      contact: { phone: "+91-80-2296-1152", email: "principal@uvce.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "PES University",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹1,25,000/year",
      originalFees: "₹5 Lakhs total",
      duration: "4 Years",
      seats: "150",
      financialAid: ["Merit Scholarships", "Need-based Aid", "Education Loans"],
      highlights: ["Top Engineering College", "Research Focus", "Industry Connect"],
      contact: { phone: "+91-80-2718-1000", email: "admissions@pes.edu" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 50% fee waiver for students with family income below ₹6 lakhs"
    },
    {
      name: "RV College of Engineering",
      location: "Bangalore",
      type: "Private",
      rating: 4.4,
      fees: "₹98,000/year",
      originalFees: "₹3.92 Lakhs total",
      duration: "4 Years",
      seats: "180",
      financialAid: ["Merit Scholarships", "Financial Assistance", "Work-Study Programs"],
      highlights: ["Autonomous College", "100% Placement", "Research Opportunities"],
      contact: { phone: "+91-80-6712-2222", email: "principal@rvce.edu.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Financial aid program covering 40-60% fees for deserving students"
    },
    {
      name: "MS Ramaiah Institute of Technology",
      location: "Bangalore",
      type: "Private",
      rating: 4.3,
      fees: "₹1,15,000/year",
      originalFees: "₹4.6 Lakhs total",
      duration: "4 Years",
      seats: "200",
      financialAid: ["Scholarships Available", "Bank Loan Assistance", "Fee Concessions"],
      highlights: ["MSRIT Brand", "Industry Connect", "Research Programs"],
      contact: { phone: "+91-80-2360-2424", email: "principal@msrit.edu" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Merit-based scholarships for top performers and rural students"
    }
  ],
  "psychologist": [
    {
      name: "Bangalore University",
      location: "Bangalore",
      type: "Government",
      rating: 4.3,
      fees: "₹3,000/year",
      originalFees: "₹9,000 total",
      duration: "3 Years",
      seats: "60",
      financialAid: ["Free for EWS", "SC/ST Fee Waiver", "Post-Matric Scholarships"],
      highlights: ["Very Low Fees", "Government University", "Clinical Training"],
      contact: { phone: "+91-80-2296-1444", email: "registrar@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Karnataka State Open University",
      location: "Mysore",
      type: "Government",
      rating: 4.1,
      fees: "₹5,000/year",
      originalFees: "₹15,000 total",
      duration: "3 Years",
      seats: "80",
      financialAid: ["Distance Learning", "Flexible Payment", "Scholarship Schemes"],
      highlights: ["Distance Education", "Working Student Friendly", "Government Recognition"],
      contact: { phone: "+91-821-2515-823", email: "info@ksou.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "University of Mysore",
      location: "Mysore",
      type: "Government",
      rating: 4.5,
      fees: "₹4,500/year",
      originalFees: "₹13,500 total",
      duration: "3 Years",
      seats: "50",
      financialAid: ["Free for EWS", "Merit Scholarships", "Research Opportunities"],
      highlights: ["Oldest University", "Research Focus", "Government Institution"],
      contact: { phone: "+91-821-241-9661", email: "registrar@uni-mysore.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with clear financial aid indicators
    {
      name: "Christ University",
      location: "Bangalore",
      type: "Private",
      rating: 4.6,
      fees: "₹85,000/year",
      originalFees: "₹2.55 Lakhs total",
      duration: "3 Years",
      seats: "120",
      financialAid: ["Need-based Scholarships", "Merit Scholarships", "Work-Study Programs"],
      highlights: ["Autonomous University", "Research Programs", "Industry Connect"],
      contact: { phone: "+91-80-4012-9292", email: "admissions@christuniversity.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 75% fee waiver for students with family income below ₹5 lakhs"
    },
    {
      name: "Jain University",
      location: "Bangalore",
      type: "Private",
      rating: 4.4,
      fees: "₹65,000/year",
      originalFees: "₹1.95 Lakhs total",
      duration: "3 Years",
      seats: "100",
      financialAid: ["Financial Aid Available", "Merit-based Discounts", "Education Loans"],
      highlights: ["Private University", "Modern Facilities", "Placement Support"],
      contact: { phone: "+91-80-4343-0000", email: "info@jainuniversity.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "50% scholarship for students from rural areas and EWS category"
    },
    {
      name: "Mount Carmel College",
      location: "Bangalore",
      type: "Private",
      rating: 4.3,
      fees: "₹45,000/year",
      originalFees: "₹1.35 Lakhs total",
      duration: "3 Years",
      seats: "80",
      financialAid: ["Scholarships Available", "Financial Assistance", "Fee Concessions"],
      highlights: ["Women's College", "Quality Education", "Strong Alumni"],
      contact: { phone: "+91-80-2228-6853", email: "principal@mccblr.edu.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Financial assistance for first-generation learners and economically disadvantaged students"
    },
    {
      name: "St. Joseph's College",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹55,000/year",
      originalFees: "₹1.65 Lakhs total",
      duration: "3 Years",
      seats: "90",
      financialAid: ["Need-based Aid", "Academic Scholarships", "Community Service Scholarships"],
      highlights: ["Autonomous College", "Research Focus", "Social Impact"],
      contact: { phone: "+91-80-2221-5791", email: "principal@sjc.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Comprehensive financial aid program covering 60-80% fees for deserving students"
    },
    {
      name: "Presidency College",
      location: "Bangalore",
      type: "Private",
      rating: 4.2,
      fees: "₹75,000/year",
      originalFees: "₹2.25 Lakhs total",
      duration: "3 Years",
      seats: "70",
      financialAid: ["Limited Scholarships", "Bank Loan Assistance"],
      highlights: ["Private College", "Industry Connect", "Modern Campus"],
      contact: { phone: "+91-80-2287-1002", email: "info@presidencycollege.ac.in" },
      hasUnderservedScholarships: false
    }
  ],
  "data-scientist": [
    {
      name: "Indian Institute of Science (IISc)",
      location: "Bangalore",
      type: "Government",
      rating: 4.9,
      fees: "₹25,000/year",
      originalFees: "₹1 Lakh total",
      duration: "2 Years (M.Tech)",
      seats: "100",
      financialAid: ["Free for EWS", "Research Assistantship", "GATE Scholarship"],
      highlights: ["Top AI/ML Research", "Stipend Available", "100% Placement"],
      contact: { phone: "+91-80-2293-2001", email: "admissions@iisc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Indian Statistical Institute (ISI)",
      location: "Bangalore",
      type: "Government",
      rating: 4.7,
      fees: "₹15,000/year",
      originalFees: "₹60,000 total",
      duration: "4 Years",
      seats: "120",
      financialAid: ["Scholarships Available", "Merit Awards", "Fee Concessions"],
      highlights: ["Statistics Specialization", "Research Institute", "Government Funded"],
      contact: { phone: "+91-80-2848-3000", email: "dean@isibang.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Bangalore University (Computer Science)",
      location: "Bangalore",
      type: "Government",
      rating: 4.2,
      fees: "₹8,000/year",
      originalFees: "₹32,000 total",
      duration: "4 Years",
      seats: "200",
      financialAid: ["Free for EWS", "State Scholarships", "Bank Loan Assistance"],
      highlights: ["Very Affordable", "Government University", "Industry Connect"],
      contact: { phone: "+91-80-2296-1444", email: "registrar@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "PES University",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹1,50,000/year",
      originalFees: "₹6 Lakhs total",
      duration: "4 Years",
      seats: "120",
      financialAid: ["Merit Scholarships", "Research Assistantships", "Industry Sponsorships"],
      highlights: ["Data Science Specialization", "Industry Connect", "Research Programs"],
      contact: { phone: "+91-80-2718-1000", email: "admissions@pes.edu" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 60% fee waiver for exceptional students from economically weak backgrounds"
    },
    {
      name: "Christ University",
      location: "Bangalore",
      type: "Private",
      rating: 4.4,
      fees: "₹1,25,000/year",
      originalFees: "₹5 Lakhs total",
      duration: "4 Years",
      seats: "100",
      financialAid: ["Need-based Scholarships", "Merit Awards", "Work-Study Programs"],
      highlights: ["Data Science Programs", "Research Focus", "Industry Partners"],
      contact: { phone: "+91-80-4012-9292", email: "admissions@christuniversity.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Comprehensive financial aid covering 50-75% fees for deserving candidates"
    }
  ],
  "teacher": [
    {
      name: "Regional Institute of Education (RIE)",
      location: "Mysore",
      type: "Government",
      rating: 4.6,
      fees: "₹2,000/year",
      originalFees: "₹8,000 total",
      duration: "4 Years (B.Ed)",
      seats: "100",
      financialAid: ["Free for EWS", "Teaching Scholarships", "Hostel Facilities"],
      highlights: ["NCERT Affiliated", "Teacher Training", "Government Jobs Guaranteed"],
      contact: { phone: "+91-821-251-5252", email: "director@riemysore.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Karnataka State Rural Development University",
      location: "Gadag",
      type: "Government",
      rating: 4.3,
      fees: "₹3,500/year",
      originalFees: "₹14,000 total",
      duration: "4 Years",
      seats: "80",
      financialAid: ["Rural Scholarships", "SC/ST Benefits", "Free Hostel for Girls"],
      highlights: ["Rural Focus", "Government University", "Teaching Opportunities"],
      contact: { phone: "+91-8372-263-123", email: "registrar@ksrdu.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Bangalore University (Education)",
      location: "Bangalore",
      type: "Government",
      rating: 4.4,
      fees: "₹5,000/year",
      originalFees: "₹20,000 total",
      duration: "4 Years",
      seats: "120",
      financialAid: ["Free for EWS", "Merit Scholarships", "Education Loans"],
      highlights: ["Teacher Training", "Government Recognition", "Placement Support"],
      contact: { phone: "+91-80-2296-1444", email: "education@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "Christ University (Education)",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹75,000/year",
      originalFees: "₹3 Lakhs total",
      duration: "4 Years (B.Ed)",
      seats: "80",
      financialAid: ["Need-based Scholarships", "Merit Awards", "Teacher Training Grants"],
      highlights: ["Modern Teacher Training", "Industry Connect", "Research Programs"],
      contact: { phone: "+91-80-4012-9292", email: "education@christuniversity.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 60% fee waiver for rural students and EWS category"
    },
    {
      name: "Jain University (Education)",
      location: "Bangalore",
      type: "Private",
      rating: 4.3,
      fees: "₹55,000/year",
      originalFees: "₹2.2 Lakhs total",
      duration: "4 Years (B.Ed)",
      seats: "60",
      financialAid: ["Financial Aid Available", "Merit-based Discounts", "Education Loans"],
      highlights: ["Teacher Training Programs", "Placement Support", "Modern Facilities"],
      contact: { phone: "+91-80-4343-0000", email: "education@jainuniversity.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "40% scholarship for students from rural areas and first-generation learners"
    }
  ],
  "graphic-designer": [
    {
      name: "College of Fine Arts, Bangalore University",
      location: "Bangalore",
      type: "Government",
      rating: 4.2,
      fees: "₹4,000/year",
      originalFees: "₹16,000 total",
      duration: "4 Years (BFA)",
      seats: "80",
      financialAid: ["Free for EWS", "SC/ST Scholarships", "Merit Scholarships"],
      highlights: ["Government Arts College", "Industry Connect", "Affordable Fees"],
      contact: { phone: "+91-80-2296-1444", email: "finearts@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Government College of Arts and Crafts",
      location: "Bangalore",
      type: "Government",
      rating: 4.0,
      fees: "₹3,500/year",
      originalFees: "₹14,000 total",
      duration: "4 Years",
      seats: "60",
      financialAid: ["Free for EWS", "State Scholarships", "Financial Aid"],
      highlights: ["Historic Arts Institution", "Traditional & Digital Art", "Low Fees"],
      contact: { phone: "+91-80-2286-4429", email: "info@gcac.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Karnataka State Open University (Design)",
      location: "Mysore (Distance Learning)",
      type: "Government",
      rating: 4.1,
      fees: "₹6,000/year",
      originalFees: "₹24,000 total",
      duration: "4 Years",
      seats: "100",
      financialAid: ["Distance Learning", "Flexible Fees", "Working Student Support"],
      highlights: ["Distance Education", "Flexible Schedule", "Government Recognition"],
      contact: { phone: "+91-821-2515-823", email: "design@ksou.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "Srishti Manipal Institute of Art, Design and Technology",
      location: "Bangalore",
      type: "Private",
      rating: 4.6,
      fees: "₹2,25,000/year",
      originalFees: "₹9 Lakhs total",
      duration: "4 Years (BDes)",
      seats: "150",
      financialAid: ["Merit Scholarships", "Need-based Aid", "Creative Grants"],
      highlights: ["Top Design School", "Industry Connect", "Creative Programs"],
      contact: { phone: "+91-80-2843-3161", email: "admissions@srishti.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 50% scholarship for students from economically disadvantaged backgrounds"
    },
    {
      name: "Jain University (Design)",
      location: "Bangalore",
      type: "Private",
      rating: 4.3,
      fees: "₹1,75,000/year",
      originalFees: "₹7 Lakhs total",
      duration: "4 Years (BDes)",
      seats: "100",
      financialAid: ["Financial Aid Available", "Merit-based Discounts", "Portfolio Scholarships"],
      highlights: ["Design Programs", "Modern Facilities", "Industry Exposure"],
      contact: { phone: "+91-80-4343-0000", email: "design@jainuniversity.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "40% fee reduction for rural students and creative excellence scholarships"
    }
  ],
  "marketing-specialist": [
    {
      name: "Bangalore University (Commerce)",
      location: "Bangalore", 
      type: "Government",
      rating: 4.3,
      fees: "₹3,500/year",
      originalFees: "₹10,500 total",
      duration: "3 Years (BCom)",
      seats: "200",
      financialAid: ["Free for EWS", "Merit Scholarships", "SC/ST Benefits"],
      highlights: ["Government University", "Business Focus", "Very Affordable"],
      contact: { phone: "+91-80-2296-1444", email: "commerce@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Government First Grade College (Commerce)",
      location: "Bangalore",
      type: "Government", 
      rating: 4.1,
      fees: "₹2,500/year",
      originalFees: "₹7,500 total",
      duration: "3 Years",
      seats: "150",
      financialAid: ["Free for EWS", "State Scholarships", "Fee Waiver"],
      highlights: ["Very Low Fees", "Government College", "Business Studies"],
      contact: { phone: "+91-80-2287-5533", email: "principal@gfgc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Central College (Bangalore University)",
      location: "Bangalore",
      type: "Government",
      rating: 4.4,
      fees: "₹4,000/year",
      originalFees: "₹12,000 total",
      duration: "3 Years",
      seats: "180",
      financialAid: ["Free for EWS", "Merit Awards", "Financial Support"],
      highlights: ["Premier College", "Government Institution", "Industry Links"],
      contact: { phone: "+91-80-2296-1362", email: "principal@centralcollege.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "Christ University (Commerce & Management)",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹1,25,000/year",
      originalFees: "₹3.75 Lakhs total",
      duration: "3 Years (BBA/BCom)",
      seats: "200",
      financialAid: ["Need-based Scholarships", "Merit Awards", "Marketing Internship Programs"],
      highlights: ["Business Programs", "Industry Connect", "Marketing Specialization"],
      contact: { phone: "+91-80-4012-9292", email: "commerce@christuniversity.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 75% fee waiver for students from economically disadvantaged backgrounds"
    },
    {
      name: "Jain University (Business & Commerce)",
      location: "Bangalore",
      type: "Private",
      rating: 4.3,
      fees: "₹95,000/year",
      originalFees: "₹2.85 Lakhs total",
      duration: "3 Years (BBA/BCom)",
      seats: "150",
      financialAid: ["Financial Aid Available", "Merit-based Discounts", "Industry Scholarships"],
      highlights: ["Marketing Programs", "Modern Facilities", "Industry Exposure"],
      contact: { phone: "+91-80-4343-0000", email: "commerce@jainuniversity.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "50% scholarship for rural students and merit-based fee reduction"
    }
  ],
  "mechanical-engineer": [
    {
      name: "University Visvesvaraya College of Engineering",
      location: "Bangalore",
      type: "Government",
      rating: 4.5,
      fees: "₹8,000/year",
      originalFees: "₹32,000 total",
      duration: "4 Years",
      seats: "120",
      financialAid: ["Free for EWS", "Karnataka State Scholarships", "Merit Scholarships"],
      highlights: ["Premier Engineering College", "Government Institution", "Industry Connect"],
      contact: { phone: "+91-80-2296-1152", email: "mechanical@uvce.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "BMS College of Engineering",
      location: "Bangalore",
      type: "Aided Private",
      rating: 4.3,
      fees: "₹25,000/year",
      originalFees: "₹1 Lakh total",
      duration: "4 Years",
      seats: "180",
      financialAid: ["Scholarships Available", "Fee Concessions", "Bank Loans"],
      highlights: ["Autonomous College", "Strong Placement", "Industry Tie-ups"],
      contact: { phone: "+91-80-2662-7901", email: "principal@bmsce.ac.in" },
      hasUnderservedScholarships: false
    },
    {
      name: "Government Engineering College",
      location: "Ramanagar (Near Bangalore)",
      type: "Government",
      rating: 4.0,
      fees: "₹12,000/year",
      originalFees: "₹48,000 total",
      duration: "4 Years",
      seats: "60",
      financialAid: ["Free for EWS", "State Scholarships", "Rural Scholarships"],
      highlights: ["Government Engineering College", "Rural Focus", "Affordable"],
      contact: { phone: "+91-80-2772-4567", email: "principal@gecrmnagar.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "PES University (Mechanical)",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹1,25,000/year",
      originalFees: "₹5 Lakhs total",
      duration: "4 Years",
      seats: "150",
      financialAid: ["Merit Scholarships", "Need-based Aid", "Industry Sponsorships"],
      highlights: ["Top Engineering College", "Research Focus", "Industry Connect"],
      contact: { phone: "+91-80-2718-1000", email: "mechanical@pes.edu" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 50% fee waiver for students with family income below ₹6 lakhs"
    },
    {
      name: "RV College of Engineering (Mechanical)",
      location: "Bangalore",
      type: "Private",
      rating: 4.4,
      fees: "₹98,000/year",
      originalFees: "₹3.92 Lakhs total",
      duration: "4 Years",
      seats: "180",
      financialAid: ["Merit Scholarships", "Financial Assistance", "Work-Study Programs"],
      highlights: ["Autonomous College", "100% Placement", "Research Opportunities"],
      contact: { phone: "+91-80-6712-2222", email: "mechanical@rvce.edu.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Financial aid program covering 40-60% fees for deserving students"
    }
  ],
  "software-developer": [
    {
      name: "University Visvesvaraya College of Engineering (CSE)",
      location: "Bangalore",
      type: "Government",
      rating: 4.6,
      fees: "₹8,000/year",
      originalFees: "₹32,000 total",
      duration: "4 Years",
      seats: "180",
      financialAid: ["Free for EWS", "Karnataka Scholarships", "Merit Awards"],
      highlights: ["Premier CS Program", "Government College", "Tech Industry Links"],
      contact: { phone: "+91-80-2296-1152", email: "cse@uvce.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Bangalore University (Computer Science)",
      location: "Bangalore", 
      type: "Government",
      rating: 4.2,
      fees: "₹8,000/year",
      originalFees: "₹32,000 total",
      duration: "4 Years",
      seats: "200",
      financialAid: ["Free for EWS", "State Scholarships", "Financial Aid"],
      highlights: ["Government University", "IT Focus", "Industry Connect"],
      contact: { phone: "+91-80-2296-1444", email: "cs@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Sir M. Visvesvaraya Institute of Technology",
      location: "Bangalore",
      type: "Government",
      rating: 4.4,
      fees: "₹15,000/year",
      originalFees: "₹60,000 total",
      duration: "4 Years",
      seats: "120",
      financialAid: ["Merit Scholarships", "Fee Concessions", "Government Support"],
      highlights: ["Autonomous College", "Strong Placement", "Government Institution"],
      contact: { phone: "+91-80-2670-2735", email: "principal@sirmvit.edu" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "PES University (Computer Science)",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹1,50,000/year",
      originalFees: "₹6 Lakhs total",
      duration: "4 Years",
      seats: "200",
      financialAid: ["Merit Scholarships", "Tech Scholarships", "Industry Sponsorships"],
      highlights: ["Top CS Program", "Industry Connect", "Research Focus"],
      contact: { phone: "+91-80-2718-1000", email: "cse@pes.edu" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 60% fee waiver for exceptional students from economically weak backgrounds"
    },
    {
      name: "RV College of Engineering (CSE)",
      location: "Bangalore",
      type: "Private",
      rating: 4.4,
      fees: "₹1,25,000/year",
      originalFees: "₹5 Lakhs total",
      duration: "4 Years",
      seats: "180",
      financialAid: ["Merit Scholarships", "Financial Assistance", "Tech Programs"],
      highlights: ["Autonomous College", "100% Placement", "Software Focus"],
      contact: { phone: "+91-80-6712-2222", email: "cse@rvce.edu.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Financial aid program covering 40-60% fees for deserving students"
    }
  ],
  "doctor": [
    {
      name: "Bangalore Medical College and Research Institute",
      location: "Bangalore",
      type: "Government",
      rating: 4.7,
      fees: "₹8,500/year",
      originalFees: "₹47,000 total",
      duration: "5.5 Years (MBBS)",
      seats: "250",
      financialAid: ["Free for EWS", "SC/ST Scholarships", "Merit Scholarships"],
      highlights: ["Premier Medical College", "Government Institution", "Teaching Hospital"],
      contact: { phone: "+91-80-2670-4900", email: "principal@bmcri.edu" },
      hasUnderservedScholarships: true
    },
    {
      name: "Kempegowda Institute of Medical Sciences",
      location: "Bangalore",
      type: "Government",
      rating: 4.5,
      fees: "₹12,000/year",
      originalFees: "₹66,000 total",
      duration: "5.5 Years",
      seats: "150",
      financialAid: ["Government Scholarships", "Fee Waiver", "Financial Support"],
      highlights: ["Government Medical College", "Hospital Attached", "Clinical Training"],
      contact: { phone: "+91-80-2849-4000", email: "principal@kims.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Mysore Medical College & Research Institute",
      location: "Mysore",
      type: "Government",
      rating: 4.4,
      fees: "₹7,500/year",
      originalFees: "₹41,000 total",
      duration: "5.5 Years", 
      seats: "200",
      financialAid: ["Free for EWS", "State Medical Scholarships", "Merit Awards"],
      highlights: ["Historic Medical College", "Government Institution", "Research Focus"],
      contact: { phone: "+91-821-242-1221", email: "principal@mmcri.ac.in" },
      hasUnderservedScholarships: true
    }
  ],
  "architect": [
    {
      name: "School of Architecture, UVCE",
      location: "Bangalore",
      type: "Government",
      rating: 4.3,
      fees: "₹12,000/year",
      originalFees: "₹60,000 total",
      duration: "5 Years (B.Arch)",
      seats: "40",
      financialAid: ["Free for EWS", "State Scholarships", "Design Scholarships"],
      highlights: ["Government Architecture School", "Industry Connect", "Design Focus"],
      contact: { phone: "+91-80-2296-1152", email: "architecture@uvce.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "BMS School of Architecture",
      location: "Bangalore",
      type: "Aided Private",
      rating: 4.1,
      fees: "₹35,000/year",
      originalFees: "₹1.75 Lakhs total",
      duration: "5 Years",
      seats: "80",
      financialAid: ["Merit Scholarships", "Fee Concessions", "Educational Loans"],
      highlights: ["Autonomous College", "Modern Facilities", "Placement Support"],
      contact: { phone: "+91-80-2662-7901", email: "architecture@bmsce.ac.in" },
      hasUnderservedScholarships: false
    },
    {
      name: "Government Architecture College",
      location: "Bangalore",
      type: "Government",
      rating: 4.0,
      fees: "₹8,000/year",
      originalFees: "₹40,000 total",
      duration: "5 Years",
      seats: "60",
      financialAid: ["Free for EWS", "Government Scholarships", "Design Awards"],
      highlights: ["Government Institution", "Low Fees", "Architecture Focus"],
      contact: { phone: "+91-80-2286-4321", email: "principal@gac.ac.in" },
      hasUnderservedScholarships: true
    }
  ],
  "lawyer": [
    {
      name: "Government Law College",
      location: "Bangalore",
      type: "Government",
      rating: 4.4,
      fees: "₹3,000/year",
      originalFees: "₹15,000 total",
      duration: "5 Years (BA LLB)",
      seats: "120",
      financialAid: ["Free for EWS", "SC/ST Scholarships", "Merit Awards"],
      highlights: ["Premier Law College", "Government Institution", "Bar Council Approved"],
      contact: { phone: "+91-80-2221-5566", email: "principal@glc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Bangalore University Law College",
      location: "Bangalore",
      type: "Government",
      rating: 4.2,
      fees: "₹4,500/year",
      originalFees: "₹22,500 total",
      duration: "5 Years",
      seats: "180",
      financialAid: ["Free for EWS", "State Scholarships", "Legal Aid Support"],
      highlights: ["University Law College", "Government Institution", "Moot Court"],
      contact: { phone: "+91-80-2296-1444", email: "law@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Karnataka State Law University",
      location: "Hubli (Distance Learning in Bangalore)",
      type: "Government",
      rating: 4.1,
      fees: "₹8,000/year",
      originalFees: "₹40,000 total",
      duration: "5 Years",
      seats: "150",
      financialAid: ["Distance Learning", "Fee Concessions", "State Support"],
      highlights: ["State Law University", "Flexible Learning", "Government Recognition"],
      contact: { phone: "+91-836-263-5500", email: "registrar@kslu.ac.in" },
      hasUnderservedScholarships: true
    },
    // Private colleges with financial aid
    {
      name: "Christ University (Business)",
      location: "Bangalore",
      type: "Private",
      rating: 4.5,
      fees: "₹1,25,000/year",
      originalFees: "₹3.75 Lakhs total",
      duration: "3 Years (BBA)",
      seats: "150",
      financialAid: ["Need-based Scholarships", "Entrepreneurship Grants", "Startup Support"],
      highlights: ["Business Programs", "Startup Incubation", "Industry Connect"],
      contact: { phone: "+91-80-4012-9292", email: "business@christuniversity.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "Up to 75% fee waiver for innovative business ideas and economically disadvantaged students"
    },
    {
      name: "Jain University (Entrepreneurship)",
      location: "Bangalore",
      type: "Private",
      rating: 4.3,
      fees: "₹95,000/year",
      originalFees: "₹2.85 Lakhs total",
      duration: "3 Years (BBA)",
      seats: "120",
      financialAid: ["Financial Aid Available", "Innovation Scholarships", "Mentorship Programs"],
      highlights: ["Entrepreneurship Focus", "Modern Facilities", "Industry Exposure"],
      contact: { phone: "+91-80-4343-0000", email: "entrepreneurship@jainuniversity.ac.in" },
      hasUnderservedScholarships: true,
      scholarshipDetails: "50% scholarship for rural students and merit-based entrepreneurship grants"
    }
  ],
  "entrepreneur": [
    {
      name: "Bangalore University (BBA - Entrepreneurship)",
      location: "Bangalore",
      type: "Government",
      rating: 4.2,
      fees: "₹4,000/year",
      originalFees: "₹12,000 total",
      duration: "3 Years",
      seats: "100",
      financialAid: ["Free for EWS", "Merit Scholarships", "Startup Support"],
      highlights: ["Government University", "Business Focus", "Entrepreneurship Programs"],
      contact: { phone: "+91-80-2296-1444", email: "bba@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Government College of Commerce",
      location: "Bangalore",
      type: "Government",
      rating: 4.0,
      fees: "₹3,000/year",
      originalFees: "₹9,000 total",
      duration: "3 Years",
      seats: "120",
      financialAid: ["Free for EWS", "State Scholarships", "Business Scholarships"],
      highlights: ["Commerce Specialization", "Government College", "Business Training"],
      contact: { phone: "+91-80-2287-6644", email: "principal@gcc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Karnataka State Open University (Management)",
      location: "Mysore (Online/Distance)",
      type: "Government",
      rating: 4.1,
      fees: "₹7,000/year",
      originalFees: "₹21,000 total",
      duration: "3 Years",
      seats: "200",
      financialAid: ["Distance Learning", "Flexible Payment", "Working Professional Support"],
      highlights: ["Distance Education", "Management Focus", "Entrepreneurship Track"],
      contact: { phone: "+91-821-2515-823", email: "management@ksou.ac.in" },
      hasUnderservedScholarships: true
    }
  ],
  "banking-professional": [
    {
      name: "Government First Grade College (Commerce)",
      location: "Bangalore",
      type: "Government",
      rating: 4.3,
      fees: "₹2,500/year",
      originalFees: "₹7,500 total",
      duration: "3 Years (B.Com)",
      seats: "150",
      financialAid: ["Free for EWS", "Banking Scholarships", "Merit Awards"],
      highlights: ["Commerce Specialization", "Banking Focus", "Government College"],
      contact: { phone: "+91-80-2287-5567", email: "principal@gfgc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Bangalore University (Commerce & Management)",
      location: "Bangalore",
      type: "Government",
      rating: 4.4,
      fees: "₹3,000/year",
      originalFees: "₹9,000 total",
      duration: "3 Years",
      seats: "200",
      financialAid: ["Free for EWS", "State Scholarships", "Banking Exam Support"],
      highlights: ["Government University", "Banking Preparation", "Industry Connect"],
      contact: { phone: "+91-80-2296-1444", email: "commerce@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Karnataka State Open University (Banking & Finance)",
      location: "Mysore (Distance Learning)",
      type: "Government",
      rating: 4.2,
      fees: "₹5,000/year",
      originalFees: "₹15,000 total",
      duration: "3 Years",
      seats: "250",
      financialAid: ["Distance Learning", "Working Professional Support", "Flexible Payment"],
      highlights: ["Banking Specialization", "Distance Education", "Government Recognition"],
      contact: { phone: "+91-821-2515-823", email: "banking@ksou.ac.in" },
      hasUnderservedScholarships: true
    }
  ],
  "accountant": [
    {
      name: "Government College of Commerce",
      location: "Bangalore",
      type: "Government",
      rating: 4.5,
      fees: "₹2,000/year",
      originalFees: "₹6,000 total",
      duration: "3 Years (B.Com)",
      seats: "180",
      financialAid: ["Free for EWS", "Accounting Scholarships", "CA Foundation Support"],
      highlights: ["Commerce Focus", "Accounting Specialization", "Government College"],
      contact: { phone: "+91-80-2287-6644", email: "principal@gcc.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Bangalore University (B.Com - Accounting)",
      location: "Bangalore",
      type: "Government",
      rating: 4.3,
      fees: "₹2,800/year",
      originalFees: "₹8,400 total",
      duration: "3 Years",
      seats: "220",
      financialAid: ["Free for EWS", "Merit Scholarships", "Professional Course Support"],
      highlights: ["Government University", "Accounting Focus", "Professional Training"],
      contact: { phone: "+91-80-2296-1444", email: "accounting@bangaloreuniversity.ac.in" },
      hasUnderservedScholarships: true
    },
    {
      name: "Government First Grade College (Accounting & Finance)",
      location: "Bangalore",
      type: "Government",
      rating: 4.1,
      fees: "₹2,200/year",
      originalFees: "₹6,600 total",
      duration: "3 Years",
      seats: "160",
      financialAid: ["Free for EWS", "CA/CMA Support", "State Scholarships"],
      highlights: ["Accounting Specialization", "Professional Course Preparation", "Government Support"],
      contact: { phone: "+91-80-2287-7788", email: "accounting@gfgcblr.ac.in" },
      hasUnderservedScholarships: true
    }
  ]
};

// Focused scholarship data for underserved students
const affordableScholarshipsData = [
  {
    name: "National Scholarship Portal - SC/ST Pre-Matric",
    provider: "Ministry of Education",
    amount: "₹1,000-3,000/month",
    eligibility: "SC/ST students, Class 9-12",
    deadline: "October 31, 2024",
    type: "Government",
    description: "Complete financial support for SC/ST students including tuition, books, and living expenses",
    link: "https://scholarships.gov.in",
    highlight: "100% Fee Coverage"
  },
  {
    name: "National Scholarship Portal - OBC Post-Matric",
    provider: "Ministry of Education", 
    amount: "₹2,000-5,000/month + Full Fees",
    eligibility: "OBC students, Family income < ₹8 Lakhs",
    deadline: "December 15, 2024",
    type: "Government",
    description: "Covers full tuition fees plus monthly stipend for OBC students in higher education",
    link: "https://scholarships.gov.in",
    highlight: "Living Allowance Included"
  },
  {
    name: "Karnataka State EWS Scholarship",
    provider: "Karnataka Government",
    amount: "Full Fee Waiver + ₹2,000/month",
    eligibility: "EWS Certificate holders, All categories",
    deadline: "Throughout the year",
    type: "Government",
    description: "Complete fee waiver for Economically Weaker Section students in Karnataka",
    link: "https://ssp.postmatric.karnataka.gov.in",
    highlight: "No Fee Required"
  },
  {
    name: "Central Sector Scholarship Scheme",
    provider: "Ministry of Education",
    amount: "₹20,000/year",
    eligibility: "Top 2% in Class 12, Family income < ₹8 Lakhs",
    deadline: "November 30, 2024",
    type: "Government", 
    description: "Merit-cum-means scholarship for students from low-income families",
    link: "https://scholarships.gov.in",
    highlight: "Merit Based"
  },
  {
    name: "Minority Community Scholarship",
    provider: "Ministry of Minority Affairs",
    amount: "₹3,800-8,000/month",
    eligibility: "Muslim, Christian, Sikh, Buddhist, Jain, Parsi students",
    deadline: "January 31, 2025",
    type: "Government",
    description: "Educational support for students from minority communities",
    link: "https://scholarships.gov.in",
    highlight: "Community Support"
  }
];

const CollegesScholarships = () => {
  const { careerSlug } = useParams<{ careerSlug: string }>();
  const navigate = useNavigate();

  // Fetch career from database to get career ID
  const { data: careerData } = useQuery({
    queryKey: ['career-for-colleges', careerSlug],
    queryFn: () => fetchCareerBySlug(careerSlug || ''),
    enabled: !!careerSlug,
  });

  const careerPathId = careerData?.data?.id;

  // Fetch colleges from database
  const { data: dbCollegesData, isLoading: collegesLoading } = useQuery({
    queryKey: ['colleges-for-career', careerPathId],
    queryFn: () => fetchCollegesWithCoursesForCareer(careerPathId || ''),
    enabled: !!careerPathId,
  });

  // Fetch entrance exams from database
  const { data: dbExamsData, isLoading: examsLoading } = useQuery({
    queryKey: ['exams-for-career', careerPathId],
    queryFn: () => fetchUniqueEntranceExamsForCareer(careerPathId || ''),
    enabled: !!careerPathId,
  });

  // Get hardcoded data as fallback
  const hardcodedColleges = governmentCollegesData[careerSlug as keyof typeof governmentCollegesData] || [];

  // Transform database colleges to match UI format
  const dbColleges = dbCollegesData?.data?.map(item => ({
    name: item.college.name,
    location: item.college.location,
    type: item.college.type === 'govt' ? 'Government' : 'Private',
    rating: item.college.rating,
    fees: 'Contact for details', // Not in DB
    originalFees: 'Contact for details', // Not in DB
    duration: item.courses[0]?.duration || 'Varies',
    seats: 'Contact for details', // Not in DB
    financialAid: item.college.scholarshipDetails || [],
    highlights: item.college.description?.slice(0, 3) || [],
    contact: {
      phone: item.college.phone,
      email: item.college.email
    },
    hasUnderservedScholarships: item.college.scholarshipDetails && item.college.scholarshipDetails.length > 0,
    scholarshipDetails: item.college.scholarshipDetails?.join('; ')
  })) || [];

  // Use database colleges if available, otherwise fallback to hardcoded
  const colleges = dbColleges.length > 0 ? dbColleges : hardcodedColleges;

  const careerTitles = {
    "civil-engineer": "Civil Engineering",
    "psychologist": "Psychology",
    "data-scientist": "Data Science & Analytics",
    "teacher": "Education & Teaching",
    "graphic-designer": "Graphic Design",
    "marketing-specialist": "Marketing & Business",
    "mechanical-engineer": "Mechanical Engineering",
    "software-developer": "Software Development",
    "doctor": "Medicine & Healthcare",
    "architect": "Architecture & Design",
    "lawyer": "Law & Legal Studies",
    "entrepreneur": "Entrepreneurship & Business"
  };

  const currentCareerTitle = careerTitles[careerSlug as keyof typeof careerTitles] || "Your Career";

  // Helper function to render financial aid badges with tooltips
  const renderFinancialAidBadge = (aid: string, idx: number) => {
    console.log('Rendering financial aid badge:', aid, 'Index:', idx);
    const tooltips: { [key: string]: string } = {
      "Free for EWS": "EWS stands for Economically Weaker Section. If your family income is below ₹8 lakh per year, you may be eligible for full fee waivers under this scholarship.",
      "Fee Remission for EWS": "EWS stands for Economically Weaker Section. If your family income is below ₹8 lakh per year, you may be eligible for full fee waivers under this scholarship.",
      "SC/ST Scholarships": "SC/ST stands for Scheduled Castes/Scheduled Tribes. These are government scholarships providing financial support for students from these communities.",
      "SC/ST Fee Waiver": "SC/ST stands for Scheduled Castes/Scheduled Tribes. This provides complete fee waiver for students from these communities.",
      "SC/ST Benefits": "SC/ST stands for Scheduled Castes/Scheduled Tribes. Special benefits and financial support for students from these communities.",
      "Post-Matric Scholarships": "Post-Matric means after completing 10th grade. These scholarships support students from 11th grade onwards through higher education.",
      "GATE Scholarship": "GATE (Graduate Aptitude Test in Engineering) scholarship provides financial support for M.Tech/PhD students who qualify through this national exam."
    };

    const tooltip = tooltips[aid];
    console.log('Tooltip for', aid, ':', tooltip ? 'Found' : 'Not found');

    if (tooltip) {
      return (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 cursor-help flex items-center gap-1">
              {aid}
              <Info className="w-3 h-3" />
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs z-[9999] bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
            <p className="text-sm font-medium">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-700">
        {aid}
      </Badge>
    );
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Career Details
            </Button>
            <div className="text-sm text-gray-600">
              Affordable Education Guide
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Affordable Education Guide
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
            Government colleges and scholarships for {currentCareerTitle}
          </p>
          <p className="text-sm text-green-700 font-medium">
            🎯 Focused on first-generation learners and underserved students
          </p>
        </div>

        {/* Tabs for Colleges and Financial Aid */}
        <Tabs defaultValue="colleges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="colleges" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Government Colleges
            </TabsTrigger>
            <TabsTrigger value="scholarships" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Financial Aid & Scholarships
            </TabsTrigger>
          </TabsList>

          {/* Government Colleges Tab */}
          <TabsContent value="colleges" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Government & Private Colleges for {currentCareerTitle}
              </h2>
              <p className="text-gray-600 mb-4">
                Affordable options from government institutions and private colleges with financial aid
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map((college, index) => (
                <Card key={index} className={`shadow-lg hover:shadow-xl transition-shadow border-l-4 ${
                  college.type === 'Government' ? 'border-l-green-500' : 'border-l-blue-500'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          college.type === 'Government' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}>
                          {college.type}
                        </Badge>
                        {/* Scholarship Available Indicator */}
                        {college.hasUnderservedScholarships && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className="bg-orange-100 text-orange-800 border-orange-300 flex items-center gap-1 cursor-help">
                                <HandHeart className="w-3 h-3" />
                                Scholarships Available
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs z-[9999] bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
                              <p className="text-sm font-medium">
                                {(college as any).scholarshipDetails || "Financial aid and scholarships available for underserved students"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{college.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{college.name}</CardTitle>
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{college.location}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Cost Information */}
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <IndianRupee className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-blue-800">Annual Fees: {college.fees}</span>
                      </div>
                      <p className="text-xs text-blue-600">Total Course: {college.originalFees}</p>
                    </div>

                    {/* Financial Aid Tags */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Financial Support Available</p>
                      <div className="flex flex-wrap gap-1">
                        {college.financialAid.map((aid, idx) => renderFinancialAidBadge(aid, idx))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Duration</p>
                        <p className="font-semibold">{college.duration}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Seats</p>
                        <p className="font-semibold">{college.seats}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Entrance Exams</p>
                      <div className="space-y-1">
                        {collegeEntranceExams[careerSlug as keyof typeof collegeEntranceExams]?.[college.name]?.requiredExams?.map((exam, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{exam}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-3 h-3" />
                        <span>{college.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{college.contact.email}</span>
                      </div>
                    </div>


                     <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View More Colleges Button */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg" className="px-8 py-3">
                <Building className="w-4 h-4 mr-2" />
                View More Government Colleges
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Discover additional affordable options in your state
              </p>
            </div>
          </TabsContent>

          {/* Financial Aid & Scholarships Tab */}
          <TabsContent value="scholarships" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Scholarships & Financial Aid
              </h2>
              <p className="text-gray-600 mb-4">
                Government schemes designed to support your education journey
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-blue-800 text-sm">
                  📚 <strong>Apply Early:</strong> Most scholarships have limited seats. 
                  Apply as soon as applications open to secure your financial support.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {affordableScholarshipsData.map((scholarship, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                        {scholarship.provider}
                      </Badge>
                      <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">
                        {scholarship.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{scholarship.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm">{scholarship.description}</p>
                    
                    {/* Financial Benefit Highlight */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800 text-lg">{scholarship.amount}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Eligibility</p>
                          <p className="text-gray-600">{scholarship.eligibility}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Application Deadline</p>
                          <p className="text-red-600 font-medium">{scholarship.deadline}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                💡 Need Help with Applications?
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Free Counseling</h4>
                  <p className="text-sm text-gray-600">Get guidance on choosing the right scholarship</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Document Help</h4>
                  <p className="text-sm text-gray-600">Assistance with required documents and forms</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Application Support</h4>
                  <p className="text-sm text-gray-600">Step-by-step application process guidance</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-12">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={`/career/${careerSlug}`}>
              <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
                <GraduationCap className="w-4 h-4" />
                Back to Career Details
              </Button>
            </Link>
            <Link to="/career-search">
              <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
                <Building className="w-4 h-4" />
                Explore More Careers
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
};

export default CollegesScholarships;
