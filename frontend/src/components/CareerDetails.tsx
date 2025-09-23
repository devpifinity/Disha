import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bookmark, DollarSign, Users, TrendingUp, GraduationCap, FileText, Star, BookOpen, Target, Book } from "lucide-react";
import { useState } from "react";
import { ExamDetailsModal } from "./ExamDetailsModal";

const careerData = {
  "civil-engineer": {
    title: "Civil Engineer",
    category: "STEM",
    overview: "Civil engineers design, build, and maintain the infrastructure that shapes our world. From bridges and roads to water systems and skyscrapers, you'll create solutions that improve people's daily lives and contribute to society's development.",
    keyHighlights: [
      "Shape the physical world around us",
      "Work on projects that last generations", 
      "High job security and growth potential",
      "Combine creativity with technical expertise"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM)",
      essentialSubjects: ["Physics", "Chemistry", "Mathematics"],
      optionalSubjects: ["Computer Science", "Engineering Drawing"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on strong foundation in Math and Science. Develop spatial reasoning through geometry.",
        "11th-12th": "Choose PCM (Physics, Chemistry, Math). Maintain 75%+ for JEE eligibility."
      }
    },
    jobRoles: [
      "Structural Engineer",
      "Transportation Engineer", 
      "Environmental Engineer",
      "Construction Manager",
      "Urban Planner",
      "Water Resources Engineer"
    ],
    skills: [
      "Mathematical Analysis",
      "Problem-Solving",
      "Project Management",
      "Technical Drawing & CAD",
      "Communication Skills",
      "Attention to Detail"
    ],
    salary: {
      starting: "₹3.5-6 Lakhs",
      experienced: "₹8-15 Lakhs",
      senior: "₹15+ Lakhs"
    },
    industryDemand: "High demand due to India's infrastructure development projects. Smart cities, metro expansions, and sustainable construction create excellent opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Mathematics",
      "Clear JEE Main & JEE Advanced for admission",
      "Pursue B.Tech in Civil Engineering (4 years)",
      "Optional: M.Tech for specialization (2 years)"
    ],
    entranceExams: [
      "JEE Main & Advanced",
      "State CET exams",
      "KCET",
      "BITSAT",
      "VITEEE",
      "University-specific exams"
    ],
    relatedCareers: [
      "Architect",
      "Construction Manager",
      "Urban Planner",
      "Environmental Consultant",
      "Quantity Surveyor"
    ]
  },
  "psychologist": {
    title: "Psychologist",
    category: "Helping",
    overview: "Psychologists study human behavior and mental processes to help people overcome challenges, improve their well-being, and reach their potential. You'll make a meaningful impact by supporting individuals, families, and communities.",
    keyHighlights: [
      "Make a real difference in people's lives",
      "Growing field with increasing awareness",
      "Diverse specialization opportunities",
      "Flexible career paths available"
    ],
    subjectsAndStream: {
      recommendedStream: "Arts/Humanities (with Psychology)",
      essentialSubjects: ["Psychology", "English"],
      optionalSubjects: ["Sociology", "Philosophy", "Biology", "Statistics"],
      gradeWiseAdvice: {
        "9th-10th": "Develop strong communication and observation skills. Read about human behavior.",
        "11th-12th": "Choose Arts with Psychology. Biology and Statistics are also beneficial."
      }
    },
    jobRoles: [
      "Clinical Psychologist",
      "Counseling Psychologist",
      "School Psychologist",
      "Research Psychologist",
      "Industrial Psychologist",
      "Forensic Psychologist"
    ],
    skills: [
      "Active Listening",
      "Empathy & Compassion",
      "Analytical Thinking",
      "Communication Skills",
      "Research Methods",
      "Ethical Decision Making"
    ],
    salary: {
      starting: "₹2.5-5 Lakhs",
      experienced: "₹5-10 Lakhs",
      senior: "₹10+ Lakhs"
    },
    industryDemand: "Growing demand as mental health awareness increases. Corporate wellness, educational institutions, and healthcare sectors actively seek psychologists.",
    educationPathway: [
      "Complete 12th in any stream (preferably with Psychology)",
      "Pursue BA/BSc in Psychology (3 years)",
      "Complete MA/MSc in Psychology (2 years)",
      "Optional: PhD for research or specialized practice"
    ],
    entranceExams: [
      "CUET for central universities",
      "State university entrance exams",
      "DU JAT (for Delhi University)",
      "BHU UET",
      "College-specific entrance tests"
    ],
    relatedCareers: [
      "Social Worker",
      "Counselor",
      "Therapist",
      "Life Coach",
      "Human Resources Specialist"
    ]
  },
  "data-scientist": {
    title: "Data Scientist",
    category: "STEM",
    overview: "Data scientists extract insights from complex data to solve business problems and drive decision-making. You'll work with cutting-edge technology to uncover patterns, predict trends, and create data-driven solutions that impact millions of users.",
    keyHighlights: [
      "One of the fastest-growing careers globally",
      "High earning potential and job security",
      "Work across diverse industries",
      "Combine math, programming, and business impact"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM) or Commerce with Math",
      essentialSubjects: ["Mathematics", "Statistics", "Computer Science"],
      optionalSubjects: ["Physics", "Economics", "Business Studies"],
      gradeWiseAdvice: {
        "9th-10th": "Build strong mathematical foundation. Start learning basic programming concepts.",
        "11th-12th": "Choose PCM or Commerce with Math. Focus on Statistics and Computer Science."
      }
    },
    jobRoles: [
      "Data Analyst",
      "Machine Learning Engineer",
      "Business Intelligence Analyst",
      "Research Scientist",
      "AI/ML Consultant",
      "Product Data Scientist"
    ],
    skills: [
      "Programming (Python, R, SQL)",
      "Statistical Analysis",
      "Machine Learning",
      "Data Visualization",
      "Critical Thinking",
      "Business Acumen"
    ],
    salary: {
      starting: "₹6-12 Lakhs",
      experienced: "₹15-25 Lakhs",
      senior: "₹25+ Lakhs"
    },
    industryDemand: "Extremely high demand across all sectors. Every company needs data scientists to make sense of their data and gain competitive advantages in the digital economy.",
    educationPathway: [
      "Complete 12th with Mathematics/Statistics",
      "Pursue B.Tech/BSc in Computer Science, Statistics, or Math",
      "Learn programming languages (Python, R, SQL)",
      "Build portfolio projects and gain experience"
    ],
    entranceExams: [
      "JEE Main for Engineering colleges",
      "Various university entrance exams",
      "Direct admission based on 12th marks",
      "Online certification programs",
      "Bootcamp programs"
    ],
    relatedCareers: [
      "Software Engineer",
      "Business Analyst",
      "Statistician",
      "AI Engineer",
      "Product Manager"
    ]
  },
  "graphic-designer": {
    title: "Graphic Designer",
    category: "Creative",
    overview: "Graphic designers create visual content that communicates messages, tells stories, and solves problems. You'll work with typography, imagery, and color to create designs for digital media, print, branding, and marketing materials.",
    keyHighlights: [
      "Express creativity in your daily work",
      "Work across diverse industries",
      "Strong freelance opportunities",
      "Digital revolution expanding demand"
    ],
    subjectsAndStream: {
      recommendedStream: "Arts/Commerce",
      essentialSubjects: ["Art", "Computer Science"],
      optionalSubjects: ["Psychology", "Business Studies", "English"],
      gradeWiseAdvice: {
        "9th-10th": "Develop drawing skills and basic computer literacy. Explore digital art tools.",
        "11th-12th": "Choose Arts or Commerce. Focus on building a portfolio of creative work."
      }
    },
    jobRoles: [
      "Brand Designer",
      "UI/UX Designer",
      "Print Designer",
      "Web Designer",
      "Packaging Designer",
      "Marketing Designer"
    ],
    skills: [
      "Adobe Creative Suite",
      "Typography",
      "Color Theory",
      "Creative Problem Solving",
      "Client Communication",
      "Time Management"
    ],
    salary: {
      starting: "₹2.5-4 Lakhs",
      experienced: "₹5-8 Lakhs",
      senior: "₹8+ Lakhs"
    },
    industryDemand: "High demand in digital marketing, e-commerce, and media companies. Growing opportunities in startups and creative agencies across Bangalore.",
    educationPathway: [
      "Complete 12th in any stream",
      "Pursue BFA/B.Des in Graphic Design (3-4 years)",
      "Learn industry-standard software (Adobe Creative Suite)",
      "Build a strong portfolio"
    ],
    entranceExams: [
      "UCEED (for IITs)",
      "NIFT Entrance Exam",
      "NID Entrance",
      "CEED (for M.Des)",
      "College-specific design tests"
    ],
    relatedCareers: [
      "UI/UX Designer",
      "Web Developer",
      "Art Director",
      "Brand Manager",
      "Digital Marketer"
    ]
  },
  "marketing-specialist": {
    title: "Marketing Specialist",
    category: "Business",
    overview: "Marketing specialists develop and execute strategies to promote products, services, and brands. You'll analyze market trends, understand consumer behavior, and create campaigns that drive business growth and build brand awareness.",
    keyHighlights: [
      "Dynamic and ever-changing field",
      "High growth potential in digital era",
      "Creative and analytical work combined",
      "Strong networking opportunities"
    ],
    subjectsAndStream: {
      recommendedStream: "Commerce/Arts",
      essentialSubjects: ["Business Studies", "Economics", "English"],
      optionalSubjects: ["Psychology", "Computer Science", "Mathematics"],
      gradeWiseAdvice: {
        "9th-10th": "Develop communication skills and understand basic business concepts.",
        "11th-12th": "Choose Commerce with Business Studies. Focus on Economics and English."
      }
    },
    jobRoles: [
      "Digital Marketing Manager",
      "Brand Manager",
      "Social Media Manager",
      "Marketing Analyst",
      "Content Marketing Specialist",
      "SEO/SEM Specialist"
    ],
    skills: [
      "Digital Marketing",
      "Data Analysis",
      "Content Creation",
      "Social Media Management",
      "Communication Skills",
      "Strategic Thinking"
    ],
    salary: {
      starting: "₹3-5 Lakhs",
      experienced: "₹6-12 Lakhs",
      senior: "₹12+ Lakhs"
    },
    industryDemand: "Extremely high demand as businesses focus on digital transformation. Bangalore's startup ecosystem offers numerous opportunities for marketing professionals.",
    educationPathway: [
      "Complete 12th with Commerce/Arts",
      "Pursue BBA/BCom in Marketing (3 years)",
      "Gain certifications in digital marketing",
      "Optional: MBA in Marketing (2 years)"
    ],
    entranceExams: [
      "CUET for central universities",
      "State CET exams",
      "CAT/MAT for MBA",
      "College-specific entrance tests",
      "Digital marketing certifications"
    ],
    relatedCareers: [
      "Sales Manager",
      "Public Relations Specialist",
      "Business Analyst",
      "Product Manager",
      "Advertising Executive"
    ]
  },
  "mechanical-engineer": {
    title: "Mechanical Engineer",
    category: "STEM",
    overview: "Mechanical engineers design, build, and maintain machines, engines, and mechanical systems. You'll work on everything from automotive components to manufacturing equipment, applying principles of physics and materials science to solve real-world problems.",
    keyHighlights: [
      "Versatile engineering discipline",
      "Strong job market across industries",
      "Hands-on problem solving",
      "Foundation for many specializations"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM)",
      essentialSubjects: ["Physics", "Chemistry", "Mathematics"],
      optionalSubjects: ["Computer Science", "Engineering Drawing"],
      gradeWiseAdvice: {
        "9th-10th": "Build strong foundation in Physics and Mathematics. Understand basic mechanics.",
        "11th-12th": "Choose PCM stream. Maintain 75%+ for JEE eligibility."
      }
    },
    jobRoles: [
      "Design Engineer",
      "Manufacturing Engineer",
      "Automotive Engineer",
      "HVAC Engineer",
      "Quality Control Engineer",
      "Production Manager"
    ],
    skills: [
      "CAD Software (AutoCAD, SolidWorks)",
      "Problem Solving",
      "Analytical Thinking",
      "Project Management",
      "Manufacturing Processes",
      "Material Science Knowledge"
    ],
    salary: {
      starting: "₹3-5 Lakhs",
      experienced: "₹6-12 Lakhs",
      senior: "₹12+ Lakhs"
    },
    industryDemand: "Strong demand in automotive, aerospace, and manufacturing sectors. Bangalore's industrial base provides excellent opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Mathematics",
      "Clear JEE Main for engineering admission",
      "Pursue B.Tech in Mechanical Engineering (4 years)",
      "Optional: M.Tech for specialization"
    ],
    entranceExams: [
      "JEE Main & Advanced",
      "State CET exams",
      "BITSAT",
      "VITEEE",
      "University-specific exams"
    ],
    relatedCareers: [
      "Automotive Engineer",
      "Aerospace Engineer",
      "Manufacturing Manager",
      "Product Designer",
      "Industrial Engineer"
    ]
  },
  "teacher": {
    title: "Teacher",
    category: "Helping",
    overview: "Teachers educate and inspire students across various subjects and age groups. You'll plan lessons, assess student progress, and play a crucial role in shaping the next generation's knowledge, skills, and character development.",
    keyHighlights: [
      "Make a lasting impact on students' lives",
      "Job security and stable career",
      "Opportunities for continuous learning",
      "Respected profession in society"
    ],
    subjectsAndStream: {
      recommendedStream: "Any stream based on subject preference",
      essentialSubjects: ["Subject of specialization", "Psychology"],
      optionalSubjects: ["Education", "Computer Science", "Communication"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on your favorite subjects. Develop communication and leadership skills.",
        "11th-12th": "Choose stream based on what you want to teach. Maintain good academic record."
      }
    },
    jobRoles: [
      "Primary School Teacher",
      "Secondary School Teacher",
      "Subject Specialist",
      "Special Education Teacher",
      "Curriculum Developer",
      "Educational Coordinator"
    ],
    skills: [
      "Communication Skills",
      "Patience and Empathy",
      "Classroom Management",
      "Subject Matter Expertise",
      "Technology Integration",
      "Assessment and Evaluation"
    ],
    salary: {
      starting: "₹2.5-4 Lakhs",
      experienced: "₹4-8 Lakhs",
      senior: "₹8+ Lakhs"
    },
    industryDemand: "Consistent demand across government and private schools. Growing opportunities in educational technology and online learning platforms.",
    educationPathway: [
      "Complete 12th in relevant subject area",
      "Complete graduation in subject specialization",
      "Pursue B.Ed (Bachelor of Education) - 2 years",
      "Clear TET (Teacher Eligibility Test)"
    ],
    entranceExams: [
      "TET (Teacher Eligibility Test)",
      "B.Ed entrance exams",
      "CTET (Central TET)",
      "State TET exams",
      "University-specific entrance tests"
    ],
    relatedCareers: [
      "Educational Counselor",
      "School Administrator",
      "Curriculum Designer",
      "Educational Content Writer",
      "Training and Development Specialist"
    ]
  },
  "software-developer": {
    title: "Software Developer",
    category: "STEM",
    overview: "Software developers design, build, and maintain software applications and systems. You'll write code, solve technical problems, and create digital solutions that power websites, mobile apps, and enterprise systems.",
    keyHighlights: [
      "High demand and excellent salary prospects",
      "Remote work opportunities",
      "Continuous learning and innovation",
      "Gateway to technology leadership roles"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM) or Commerce with Math",
      essentialSubjects: ["Mathematics", "Computer Science"],
      optionalSubjects: ["Physics", "Statistics", "English"],
      gradeWiseAdvice: {
        "9th-10th": "Start learning basic programming. Focus on logical thinking and mathematics.",
        "11th-12th": "Choose PCM or Commerce with Computer Science. Practice coding regularly."
      }
    },
    jobRoles: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
      "Mobile App Developer",
      "DevOps Engineer",
      "Software Architect"
    ],
    skills: [
      "Programming Languages",
      "Problem Solving",
      "Software Design",
      "Database Management",
      "Version Control (Git)",
      "Team Collaboration"
    ],
    salary: {
      starting: "₹4-8 Lakhs",
      experienced: "₹8-15 Lakhs",
      senior: "₹15+ Lakhs"
    },
    industryDemand: "Extremely high demand across all industries. Bangalore being the IT capital of India offers countless opportunities.",
    educationPathway: [
      "Complete 12th with Mathematics",
      "Pursue B.Tech/BCA in Computer Science (3-4 years)",
      "Optional: Master's degree for specialization"
    ],
    entranceExams: [
      "JEE Main for B.Tech",
      "KCET",
      "Various university entrance exams",
      "Direct admission based on 12th marks",
      "Coding bootcamp assessments",
      "Online certification programs"
    ],
    relatedCareers: [
      "Data Scientist",
      "Product Manager",
      "Cybersecurity Specialist",
      "AI/ML Engineer",
      "Technical Architect"
    ]
  },
  "doctor": {
    title: "Doctor",
    category: "Helping",
    overview: "Doctors diagnose, treat, and prevent diseases to improve patients' health and well-being. You'll work directly with patients, make life-saving decisions, and contribute to medical research and healthcare advancement.",
    keyHighlights: [
      "Save lives and improve health outcomes",
      "Highly respected profession",
      "Excellent earning potential",
      "Opportunities for specialization"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCB)",
      essentialSubjects: ["Physics", "Chemistry", "Biology"],
      optionalSubjects: ["Mathematics", "English"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on Biology and Chemistry. Develop strong study habits and dedication.",
        "11th-12th": "Choose PCB stream. Maintain 90%+ for NEET qualification."
      }
    },
    jobRoles: [
      "General Physician",
      "Specialist Doctor",
      "Surgeon",
      "Emergency Medicine Doctor",
      "Pediatrician",
      "Medical Researcher"
    ],
    skills: [
      "Medical Knowledge",
      "Diagnostic Skills",
      "Communication with Patients",
      "Empathy and Compassion",
      "Decision Making",
      "Continuous Learning"
    ],
    salary: {
      starting: "₹6-10 Lakhs",
      experienced: "₹10-20 Lakhs",
      senior: "₹20+ Lakhs"
    },
    industryDemand: "High demand across all healthcare sectors. Growing healthcare infrastructure in Bangalore provides excellent opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Biology",
      "Clear NEET examination",
      "Pursue MBBS (5.5 years including internship)",
      "Optional: MD/MS for specialization (3 years)"
    ],
    entranceExams: [
      "NEET (National Eligibility Test)",
      "AIIMS entrance (now merged with NEET)",
      "State medical entrance exams",
      "NEET PG for specialization",
      "Various fellowship entrance exams"
    ],
    relatedCareers: [
      "Nurse",
      "Pharmacist",
      "Medical Researcher",
      "Healthcare Administrator",
      "Public Health Specialist"
    ]
  },
  "architect": {
    title: "Architect",
    category: "STEM",
    overview: "Architects design buildings and spaces that are functional, safe, and aesthetically pleasing. You'll combine creativity with technical knowledge to create structures that meet client needs while considering environmental and social factors.",
    keyHighlights: [
      "Blend creativity with technical expertise",
      "Leave lasting impact on built environment",
      "Work on diverse project types",
      "Growing sustainable design opportunities"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM) or Arts with Math",
      essentialSubjects: ["Mathematics", "Physics"],
      optionalSubjects: ["Art", "Computer Science", "Environmental Science"],
      gradeWiseAdvice: {
        "9th-10th": "Develop spatial reasoning and drawing skills. Understand basic geometry.",
        "11th-12th": "Choose PCM or Arts with Mathematics. Build a portfolio for design entrance exams."
      }
    },
    jobRoles: [
      "Design Architect",
      "Project Architect",
      "Landscape Architect",
      "Interior Architect",
      "Urban Planner",
      "Architectural Consultant"
    ],
    skills: [
      "Architectural Design",
      "CAD Software (AutoCAD, Revit)",
      "3D Modeling",
      "Project Management",
      "Building Codes Knowledge",
      "Creative Problem Solving"
    ],
    salary: {
      starting: "₹3-5 Lakhs",
      experienced: "₹6-12 Lakhs",
      senior: "₹12+ Lakhs"
    },
    industryDemand: "Strong demand due to urbanization and infrastructure development. Bangalore's growing real estate sector offers numerous opportunities.",
    educationPathway: [
      "Complete 12th with Mathematics",
      "Clear NATA (National Aptitude Test in Architecture)",
      "Pursue B.Arch (Bachelor of Architecture) - 5 years",
      "Register with Council of Architecture"
    ],
    entranceExams: [
      "NATA (National Aptitude Test)",
      "JEE Main Paper 2 (B.Arch)",
      "State architecture entrance exams",
      "College-specific design tests",
      "Portfolio-based admissions"
    ],
    relatedCareers: [
      "Interior Designer",
      "Urban Planner",
      "Civil Engineer",
      "Landscape Designer",
      "Construction Manager"
    ]
  },
  "lawyer": {
    title: "Lawyer",
    category: "Business",
    overview: "Lawyers provide legal advice, represent clients in court, and help navigate complex legal systems. You'll research laws, draft legal documents, and advocate for clients' rights in various legal matters.",
    keyHighlights: [
      "Fight for justice and clients' rights",
      "Intellectual and challenging work",
      "High earning potential",
      "Prestigious career with social impact"
    ],
    subjectsAndStream: {
      recommendedStream: "Arts/Commerce",
      essentialSubjects: ["English", "Political Science"],
      optionalSubjects: ["History", "Economics", "Psychology"],
      gradeWiseAdvice: {
        "9th-10th": "Develop strong reading, writing, and debating skills. Follow current affairs.",
        "11th-12th": "Choose Arts or Commerce. Focus on English and analytical subjects."
      }
    },
    jobRoles: [
      "Corporate Lawyer",
      "Criminal Lawyer",
      "Civil Rights Lawyer",
      "Legal Advisor",
      "Public Prosecutor",
      "Legal Consultant"
    ],
    skills: [
      "Legal Research",
      "Analytical Thinking",
      "Oral and Written Communication",
      "Negotiation Skills",
      "Client Relations",
      "Attention to Detail"
    ],
    salary: {
      starting: "₹3-6 Lakhs",
      experienced: "₹8-15 Lakhs",
      senior: "₹15+ Lakhs"
    },
    industryDemand: "Growing demand in corporate sector, especially in IT capital Bangalore. Increasing litigation and compliance requirements create opportunities.",
    educationPathway: [
      "Complete 12th in any stream",
      "Clear CLAT or other law entrance exams",
      "Pursue LLB (3 years) or BA LLB (5 years)",
      "Register with Bar Council"
    ],
    entranceExams: [
      "CLAT (Common Law Admission Test)",
      "LSAT India",
      "State law entrance exams",
      "University-specific law tests",
      "All India Law Entrance Test"
    ],
    relatedCareers: [
      "Judge",
      "Legal Advisor",
      "Compliance Officer",
      "Legal Journalist",
      "Paralegal"
    ]
  },
  "entrepreneur": {
    title: "Entrepreneur",
    category: "Business",
    overview: "Entrepreneurs start and manage their own businesses, identifying opportunities and taking calculated risks to create value. You'll innovate, lead teams, and build ventures that can transform industries and create employment.",
    keyHighlights: [
      "Be your own boss and build something from scratch",
      "Unlimited earning potential",
      "Create jobs and contribute to economy",
      "Personal and professional growth opportunities"
    ],
    subjectsAndStream: {
      recommendedStream: "Commerce/Arts (any stream can work)",
      essentialSubjects: ["Business Studies", "Economics"],
      optionalSubjects: ["Mathematics", "Computer Science", "Psychology"],
      gradeWiseAdvice: {
        "9th-10th": "Develop leadership and communication skills. Start small projects or ventures.",
        "11th-12th": "Choose Commerce or any stream you're passionate about. Focus on business fundamentals."
      }
    },
    jobRoles: [
      "Startup Founder",
      "Business Owner",
      "Innovation Manager",
      "Venture Capitalist",
      "Business Consultant",
      "Social Entrepreneur"
    ],
    skills: [
      "Leadership and Vision",
      "Risk Management",
      "Business Strategy",
      "Financial Management",
      "Networking",
      "Adaptability and Resilience"
    ],
    salary: {
      starting: "Variable (₹2-10 Lakhs)",
      experienced: "₹5-25 Lakhs",
      senior: "₹25+ Lakhs (unlimited potential)"
    },
    industryDemand: "Bangalore's startup ecosystem provides excellent opportunities. Government initiatives and funding support make it easier to start businesses.",
    educationPathway: [
      "Complete 12th in any stream",
      "Pursue BBA/BCom or any field of interest",
      "Gain business knowledge through courses and experience",
      "Start small ventures during college",
      "Consider MBA for advanced business skills (optional)"
    ],
    entranceExams: [
      "CUET for business programs",
      "CAT/MAT for MBA",
      "State CET exams",
      "Direct admission programs",
      "Entrepreneurship bootcamps"
    ],
    relatedCareers: [
      "Business Analyst",
      "Product Manager",
      "Investment Banker",
      "Management Consultant",
      "Venture Capitalist"
    ]
  },
  "police-officer": {
    title: "Police Officer",
    category: "Public Service",
    overview: "Police officers serve and protect communities by maintaining law and order, preventing crime, and ensuring public safety. You'll work directly with citizens to create safer neighborhoods while upholding justice and constitutional rights.",
    keyHighlights: [
      "Serve and protect your community",
      "Strong job security with government benefits",
      "Opportunity for rapid career advancement",
      "Make a tangible difference in society"
    ],
    subjectsAndStream: {
      recommendedStream: "Any stream (Arts/Science/Commerce)",
      essentialSubjects: ["English", "General Studies"],
      optionalSubjects: ["Physical Education", "Law", "Psychology", "Computer Science"],
      gradeWiseAdvice: {
        "9th-10th": "Build strong general knowledge and maintain physical fitness. Develop leadership qualities.",
        "11th-12th": "Any stream acceptable. Focus on current affairs and maintain good health for physical tests."
      }
    },
    jobRoles: [
      "Beat Constable",
      "Sub-Inspector", 
      "Assistant Commissioner",
      "Superintendent of Police",
      "Deputy Commissioner",
      "Commissioner of Police"
    ],
    skills: [
      "Physical Fitness",
      "Communication Skills",
      "Problem-Solving",
      "Leadership",
      "Crisis Management",
      "Legal Knowledge"
    ],
    salary: {
      starting: "₹2.5-4 Lakhs",
      experienced: "₹5-10 Lakhs",
      senior: "₹12+ Lakhs"
    },
    industryDemand: "Consistent demand for police personnel across states. Modernization of police forces and new specialized units create opportunities.",
    educationPathway: [
      "Complete 12th in any stream",
      "Graduate degree for higher posts (any discipline)",
      "Clear state police recruitment exams",
      "Physical and medical fitness tests",
      "Police training academy course"
    ],
    entranceExams: [
      "State Police Constable Exams",
      "State Police SI Exams", 
      "UPSC Civil Services (for IPS)",
      "SSC CPO",
      "Railway Protection Force"
    ],
    relatedCareers: [
      "IPS Officer",
      "Security Manager",
      "Crime Reporter",
      "Legal Advisor",
      "Investigation Officer"
    ]
  },
  "army-officer": {
    title: "Army Officer",
    category: "Public Service",
    overview: "Army officers lead and serve in the Indian Army, protecting national borders, maintaining internal security, and participating in peacekeeping missions. You'll develop exceptional leadership skills while serving your nation with honor and pride.",
    keyHighlights: [
      "Serve the nation with honor and pride",
      "Excellent leadership development opportunities",
      "Adventurous and challenging career",
      "Strong camaraderie and lifelong bonds"
    ],
    subjectsAndStream: {
      recommendedStream: "Any stream (Science/Arts/Commerce)",
      essentialSubjects: ["English", "Mathematics", "General Knowledge"],
      optionalSubjects: ["Physical Education", "History", "Geography", "Computer Science"],
      gradeWiseAdvice: {
        "9th-10th": "Build strong general knowledge and maintain excellent physical fitness. Develop leadership qualities through sports and activities.",
        "11th-12th": "Any stream acceptable. Focus on current affairs, mathematics, and English. Maintain physical fitness for SSB."
      }
    },
    jobRoles: [
      "Lieutenant", 
      "Captain",
      "Major",
      "Lieutenant Colonel",
      "Colonel",
      "Brigadier"
    ],
    skills: [
      "Leadership",
      "Physical Fitness",
      "Decision Making",
      "Team Management",
      "Strategic Thinking",
      "Adaptability"
    ],
    salary: {
      starting: "₹6-8 Lakhs",
      experienced: "₹12-18 Lakhs",
      senior: "₹20+ Lakhs"
    },
    industryDemand: "Continuous recruitment for officers. Modernization of armed forces and new technologies create specialized opportunities.",
    educationPathway: [
      "Complete 12th in any stream",
      "Appear for NDA exam (after 12th) or CDS exam (after graduation)",
      "Clear SSB (Services Selection Board) interview",
      "Training at Indian Military Academy (IMA) or Officers Training Academy (OTA)",
      "Commission as Lieutenant"
    ],
    entranceExams: [
      "NDA (National Defence Academy)",
      "CDS (Combined Defence Services)",
      "AFCAT (for technical entries)",
      "TGC (Technical Graduate Course)",
      "UES (University Entry Scheme)"
    ],
    relatedCareers: [
      "Navy Officer",
      "Air Force Officer", 
      "Security Consultant",
      "Defense Analyst",
      "Military Historian"
    ]
  },
  "navy-officer": {
    title: "Navy Officer",
    category: "Public Service", 
    overview: "Navy officers serve in the Indian Navy, protecting maritime borders, conducting naval operations, and ensuring security of sea lanes. You'll work with advanced naval technology while safeguarding India's maritime interests.",
    keyHighlights: [
      "Protect India's maritime borders",
      "Work with cutting-edge naval technology",
      "Travel to different countries and ports",
      "Elite service with prestige and honor"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM) preferred, but any stream accepted",
      essentialSubjects: ["Mathematics", "Physics", "English"],
      optionalSubjects: ["Chemistry", "Computer Science", "Physical Education"],
      gradeWiseAdvice: {
        "9th-10th": "Strong foundation in Math and Science. Develop swimming skills and physical fitness.",
        "11th-12th": "PCM preferred for technical branches. Focus on mathematics and physics for naval operations."
      }
    },
    jobRoles: [
      "Sub-Lieutenant",
      "Lieutenant", 
      "Lieutenant Commander",
      "Commander",
      "Captain",
      "Commodore"
    ],
    skills: [
      "Navigation",
      "Technical Aptitude",
      "Leadership",
      "Physical Fitness",
      "Problem-Solving",
      "Communication"
    ],
    salary: {
      starting: "₹6-8 Lakhs",
      experienced: "₹12-18 Lakhs", 
      senior: "₹20+ Lakhs"
    },
    industryDemand: "Growing importance of maritime security. Blue water navy expansion and submarine fleet modernization create opportunities.",
    educationPathway: [
      "Complete 12th with Math and Physics (for technical branches)",
      "Appear for NDA or CDS examination",
      "Clear SSB interview and medical examination",
      "Training at Indian Naval Academy, Ezhimala",
      "Commission as Sub-Lieutenant"
    ],
    entranceExams: [
      "NDA (National Defence Academy)",
      "CDS (Combined Defence Services)",
      "Indian Naval Academy Course",
      "Graduate Special Entry",
      "Short Service Commission"
    ],
    relatedCareers: [
      "Army Officer",
      "Air Force Officer",
      "Maritime Lawyer",
      "Ship Captain",
      "Marine Engineer"
    ]
  },
  "ias-officer": {
    title: "IAS Officer",
    category: "Public Service",
    overview: "IAS officers are the backbone of Indian administrative services, implementing government policies, managing districts, and serving citizens. You'll have the power to create meaningful change in society while working at the highest levels of government.",
    keyHighlights: [
      "Direct impact on policy implementation",
      "Prestigious position with high respect",
      "Opportunity to serve diverse communities",
      "Fast-track career progression"
    ],
    subjectsAndStream: {
      recommendedStream: "Any stream (Arts/Science/Commerce)",
      essentialSubjects: ["English", "General Studies", "History"],
      optionalSubjects: ["Political Science", "Economics", "Geography", "Public Administration"],
      gradeWiseAdvice: {
        "9th-10th": "Build strong general knowledge and reading habits. Develop analytical thinking and writing skills.",
        "11th-12th": "Any stream acceptable. Focus on current affairs, history, and develop critical thinking abilities."
      }
    },
    jobRoles: [
      "Assistant Collector",
      "Sub-Divisional Magistrate",
      "District Collector",
      "Commissioner",
      "Principal Secretary",
      "Chief Secretary"
    ],
    skills: [
      "Administrative Skills",
      "Public Speaking",
      "Decision Making",
      "Policy Analysis",
      "Leadership",
      "Problem-Solving"
    ],
    salary: {
      starting: "₹8-12 Lakhs",
      experienced: "₹15-25 Lakhs",
      senior: "₹25+ Lakhs"
    },
    industryDemand: "Continuous need for administrative officers. Digital governance and policy implementation require skilled civil servants.",
    educationPathway: [
      "Complete graduation in any discipline",
      "Prepare for UPSC Civil Services Examination",
      "Clear Preliminary, Mains, and Interview stages",
      "Training at Lal Bahadur Shastri National Academy",
      "Posted as Assistant Collector/SDM"
    ],
    entranceExams: [
      "UPSC Civil Services Examination",
      "State Public Service Commission exams",
      "Combined Civil Services exams",
      "Staff Selection Commission exams",
      "Railway Recruitment Board exams"
    ],
    relatedCareers: [
      "IPS Officer",
      "Policy Analyst",
      "Development Officer",
      "Municipal Commissioner",
      "Government Advisor"
    ]
  }
};

const CareerDetails = () => {
  const { careerSlug } = useParams<{ careerSlug: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const handleExamClick = (examName: string) => {
    console.log("Exam clicked:", examName);
    setSelectedExam(examName);
    setIsExamModalOpen(true);
  };

  const career = careerData[careerSlug as keyof typeof careerData];

  if (!career) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">Career Not Found</h2>
            <p className="text-gray-600 mb-6">The career you're looking for doesn't exist or has been moved.</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
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
              Back
            </Button>
            <Button
              variant={isBookmarked ? "default" : "outline"}
              onClick={handleBookmark}
              className="flex items-center gap-2"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save Career'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {career.title}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
            {career.overview}
          </p>
          
          {/* Key Highlights - Compact Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {career.keyHighlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                  <Star className="w-3 h-3 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-800">{highlight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Careers Section */}
        <Card className="shadow-lg bg-white mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Related Careers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {career.relatedCareers.map((relatedCareer, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-gray-100 transition-colors text-sm px-3 py-1"
                >
                  {relatedCareer}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Side by side Subjects & Stream and Education Path */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Subjects & Stream for High School Students */}
          <Card className="shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Book className="w-5 h-5 text-emerald-600" />
                Subjects & Stream (Grade 9-12)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                    <span className="font-semibold text-emerald-800">Recommended Stream</span>
                  </div>
                  <p className="text-emerald-700 font-medium">{career.subjectsAndStream.recommendedStream}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2 text-sm">Essential Subjects:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.subjectsAndStream.essentialSubjects.map((subject, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-700 text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-800 mb-2 text-sm">Optional but Helpful:</p>
                    <div className="flex flex-wrap gap-1">
                      {career.subjectsAndStream.optionalSubjects.map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="font-semibold text-yellow-800 text-xs">Grade 9-10 Advice:</p>
                    <p className="text-yellow-700 text-xs">{career.subjectsAndStream.gradeWiseAdvice["9th-10th"]}</p>
                  </div>
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded">
                    <p className="font-semibold text-orange-800 text-xs">Grade 11-12 Advice:</p>
                    <p className="text-orange-700 text-xs">{career.subjectsAndStream.gradeWiseAdvice["11th-12th"]}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education & Exams Combined */}
          <Card className="shadow-lg bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Education Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {career.educationPathway.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600 flex-shrink-0 text-xs mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 text-sm">{step}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-orange-600">Key Entrance Exams</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {career.entranceExams.map((exam, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                      onClick={() => handleExamClick(exam)}
                    >
                      {exam}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills & Earning Potential */}
        <Card className="shadow-lg bg-white mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-5 h-5 text-purple-600" />
              Skills Required & Salary Range
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Skills Required</h3>
              <div className="grid grid-cols-2 gap-2">
                {career.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-gray-800">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">Salary Range</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-50 p-2 rounded border border-green-200 text-center">
                  <p className="text-xs text-green-600 font-medium">Starting</p>
                  <p className="text-sm font-bold text-green-700">{career.salary.starting}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded border border-blue-200 text-center">
                  <p className="text-xs text-blue-600 font-medium">Mid-Level</p>
                  <p className="text-sm font-bold text-blue-700">{career.salary.experienced}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded border border-purple-200 text-center">
                  <p className="text-xs text-purple-600 font-medium">Senior</p>
                  <p className="text-sm font-bold text-purple-700">{career.salary.senior}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Career Opportunities */}
        <Card className="shadow-lg bg-white mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Users className="w-5 h-5 text-blue-600" />
              Career Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {career.jobRoles.map((role, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span className="font-medium text-gray-800">{role}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600">Market Demand</span>
              </div>
              <p className="text-gray-700 text-sm">{career.industryDemand}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-4 mb-8">
          <Link to={`/career/${careerSlug}/colleges-scholarships`}>
            <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-sm font-semibold">
              Find Colleges & Scholarships
            </Button>
          </Link>
          <Button variant="outline" className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white py-4 text-sm font-semibold">
            Explore Related Careers
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/quiz">
              <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm">
                <BookOpen className="w-4 h-4" />
                Take Career Quiz
              </Button>
            </Link>
            <Link to="/career-search">
              <Button variant="outline" className="flex items-center gap-2 px-4 py-2 text-sm">
                <Target className="w-4 h-4" />
                Explore More Careers
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 text-sm">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <ExamDetailsModal 
        examName={selectedExam}
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
      />
    </div>
  );
};

// Add career data for new careers
const newCareerData = {
  "nurse": {
    title: "Nurse",
    category: "Helping",
    overview: "Nurses provide direct patient care, educate patients and families about health conditions, and assist healthcare teams in delivering quality medical services. You'll work in hospitals, clinics, or community settings, making a difference in people's health and well-being.",
    keyHighlights: [
      "High job security and constant demand",
      "Meaningful work helping patients heal",
      "Diverse specialization opportunities",
      "Growing field with good career prospects"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCB)",
      essentialSubjects: ["Biology", "Chemistry", "Physics"],
      optionalSubjects: ["Psychology", "English", "Computer Science"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on Biology and Chemistry. Develop compassion and communication skills.",
        "11th-12th": "Choose PCB (Physics, Chemistry, Biology). Maintain 50%+ for nursing college eligibility."
      }
    },
    jobRoles: [
      "Staff Nurse",
      "ICU Nurse",
      "Pediatric Nurse",
      "Community Health Nurse",
      "Nursing Supervisor",
      "Nurse Educator"
    ],
    skills: [
      "Patient Care",
      "Medical Knowledge",
      "Communication Skills",
      "Empathy and Compassion",
      "Critical Thinking",
      "Time Management"
    ],
    salary: {
      starting: "₹2.5-4 Lakhs",
      experienced: "₹4-7 Lakhs",
      senior: "₹7+ Lakhs"
    },
    industryDemand: "Very high demand in healthcare sector. Aging population and expanding healthcare services create excellent job opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Biology",
      "Pursue B.Sc Nursing (4 years) or GNM (3.5 years)",
      "Complete internship and registration",
      "Optional: M.Sc Nursing for specialization"
    ],
    entranceExams: [
      "NEET (for some colleges)",
      "State nursing entrance exams",
      "AIIMS Nursing Entrance",
      "JIPMER Nursing",
      "College-specific entrance tests"
    ],
    relatedCareers: [
      "Midwife",
      "Healthcare Administrator",
      "Public Health Officer",
      "Medical Social Worker",
      "Health Educator"
    ]
  },
  "paramedical-technician": {
    title: "Paramedical Technician",
    category: "Helping",
    overview: "Paramedical technicians provide essential support services in healthcare, including medical testing, emergency care, and diagnostic procedures. You'll work alongside doctors and nurses, operating medical equipment and ensuring quality patient care.",
    keyHighlights: [
      "Quick entry into healthcare field",
      "Hands-on technical work",
      "Growing demand in medical field",
      "Multiple specialization options"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCB) or PCM",
      essentialSubjects: ["Biology", "Chemistry", "Physics"],
      optionalSubjects: ["Mathematics", "Computer Science"],
      gradeWiseAdvice: {
        "9th-10th": "Build foundation in science subjects. Develop technical aptitude.",
        "11th-12th": "Choose PCB for medical technology or PCM for engineering-based fields."
      }
    },
    jobRoles: [
      "Medical Laboratory Technician",
      "Radiology Technician",
      "Emergency Medical Technician",
      "Dialysis Technician",
      "Operation Theater Technician",
      "Physiotherapy Assistant"
    ],
    skills: [
      "Technical Equipment Operation",
      "Laboratory Procedures",
      "Patient Interaction",
      "Attention to Detail",
      "Emergency Response",
      "Medical Knowledge"
    ],
    salary: {
      starting: "₹2-3.5 Lakhs",
      experienced: "₹3.5-6 Lakhs",
      senior: "₹6+ Lakhs"
    },
    industryDemand: "High demand in hospitals, diagnostic centers, and emergency services. Growing healthcare infrastructure creates new opportunities.",
    educationPathway: [
      "Complete 12th with Science subjects",
      "Pursue Diploma in Medical Laboratory Technology (2-3 years)",
      "Complete practical training and certification",
      "Optional: B.Sc in Medical Technology for advancement"
    ],
    entranceExams: [
      "State polytechnic entrance exams",
      "NEET (for some programs)",
      "College-specific entrance tests",
      "Direct admission based on 12th marks",
      "Professional certification exams"
    ],
    relatedCareers: [
      "Medical Equipment Technician",
      "Healthcare Quality Analyst",
      "Medical Researcher",
      "Clinical Research Associate",
      "Biomedical Engineer"
    ]
  },
  "agricultural-engineer": {
    title: "Agricultural Engineer",
    category: "STEM",
    overview: "Agricultural engineers apply engineering principles to improve farming practices, develop agricultural machinery, and create sustainable food production systems. You'll work on innovative solutions for food security, irrigation, and farm mechanization.",
    keyHighlights: [
      "Contribute to food security solutions",
      "Work with cutting-edge farm technology",
      "Growing importance in sustainable agriculture",
      "Combine engineering with environmental science"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCM)",
      essentialSubjects: ["Physics", "Chemistry", "Mathematics"],
      optionalSubjects: ["Biology", "Computer Science", "Agriculture"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on mathematics and physics. Learn about agriculture and environmental issues.",
        "11th-12th": "Choose PCM stream. Biology as additional subject is beneficial."
      }
    },
    jobRoles: [
      "Farm Equipment Engineer",
      "Irrigation Engineer",
      "Food Processing Engineer",
      "Agricultural Research Scientist",
      "Sustainable Agriculture Consultant",
      "Agricultural Technology Developer"
    ],
    skills: [
      "Engineering Design",
      "Agricultural Knowledge",
      "Problem Solving",
      "Environmental Science",
      "Technology Innovation",
      "Project Management"
    ],
    salary: {
      starting: "₹3-5 Lakhs",
      experienced: "₹6-10 Lakhs",
      senior: "₹10+ Lakhs"
    },
    industryDemand: "Growing demand due to focus on agricultural modernization and food security. Government initiatives and agtech startups create opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Mathematics",
      "Clear JEE Main or agriculture entrance exams",
      "Pursue B.Tech in Agricultural Engineering (4 years)",
      "Optional: M.Tech for specialization"
    ],
    entranceExams: [
      "JEE Main",
      "ICAR AIEEA",
      "State agriculture entrance exams",
      "University-specific exams",
      "State CET exams"
    ],
    relatedCareers: [
      "Environmental Engineer",
      "Food Scientist",
      "Agricultural Economist",
      "Rural Development Officer",
      "Precision Agriculture Specialist"
    ]
  },
  "biotechnologist": {
    title: "Biotechnologist",
    category: "STEM",
    overview: "Biotechnologists use living organisms and biological systems to develop products and solutions for healthcare, agriculture, and industry. You'll work on cutting-edge research in genetics, medicine, and environmental applications.",
    keyHighlights: [
      "Work at the forefront of scientific innovation",
      "Contribute to medical breakthroughs",
      "High growth potential field",
      "Research and industry opportunities"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCB)",
      essentialSubjects: ["Biology", "Chemistry", "Physics"],
      optionalSubjects: ["Mathematics", "Computer Science"],
      gradeWiseAdvice: {
        "9th-10th": "Excel in Biology and Chemistry. Develop scientific reasoning.",
        "11th-12th": "Choose PCB stream. Mathematics is helpful for biostatistics."
      }
    },
    jobRoles: [
      "Research Scientist",
      "Quality Control Analyst",
      "Bioprocess Engineer",
      "Clinical Research Associate",
      "Pharmaceutical Researcher",
      "Genetic Counselor"
    ],
    skills: [
      "Laboratory Techniques",
      "Research Methodology",
      "Data Analysis",
      "Scientific Writing",
      "Critical Thinking",
      "Technology Applications"
    ],
    salary: {
      starting: "₹3-6 Lakhs",
      experienced: "₹6-12 Lakhs",
      senior: "₹12+ Lakhs"
    },
    industryDemand: "High demand in pharmaceutical, healthcare, and agricultural sectors. Biotechnology industry expansion creates excellent opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Biology",
      "Pursue B.Tech/B.Sc in Biotechnology (3-4 years)",
      "Optional: M.Sc/M.Tech for specialization",
      "Consider PhD for research career"
    ],
    entranceExams: [
      "JEE Main (for B.Tech)",
      "NEET (for some programs)",
      "State CET exams",
      "University-specific entrance tests",
      "GATE (for M.Tech)"
    ],
    relatedCareers: [
      "Biochemist",
      "Microbiologist",
      "Bioinformatics Specialist",
      "Medical Laboratory Scientist",
      "Environmental Scientist"
    ]
  },
  "physiotherapist": {
    title: "Physiotherapist",
    category: "Helping",
    overview: "Physiotherapists help patients recover from injuries, manage chronic conditions, and improve physical function through exercise, manual therapy, and rehabilitation techniques. You'll work closely with patients to restore their mobility and quality of life.",
    keyHighlights: [
      "Direct patient interaction and impact",
      "Growing demand in healthcare",
      "Flexible work settings available",
      "Rewarding rehabilitation work"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCB)",
      essentialSubjects: ["Biology", "Chemistry", "Physics"],
      optionalSubjects: ["Physical Education", "Psychology"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on Biology and develop physical fitness. Learn about human anatomy.",
        "11th-12th": "Choose PCB stream. Physical education as additional subject is beneficial."
      }
    },
    jobRoles: [
      "Clinical Physiotherapist",
      "Sports Physiotherapist",
      "Pediatric Physiotherapist",
      "Neurological Physiotherapist",
      "Orthopedic Physiotherapist",
      "Community Health Physiotherapist"
    ],
    skills: [
      "Manual Therapy Techniques",
      "Exercise Prescription",
      "Patient Assessment",
      "Communication Skills",
      "Empathy and Patience",
      "Physical Fitness"
    ],
    salary: {
      starting: "₹2.5-4 Lakhs",
      experienced: "₹4-8 Lakhs",
      senior: "₹8+ Lakhs"
    },
    industryDemand: "Growing demand due to aging population and sports injuries. Rehabilitation centers and wellness clinics offer opportunities.",
    educationPathway: [
      "Complete 12th with Physics, Chemistry, Biology",
      "Pursue BPT (Bachelor of Physiotherapy) - 4.5 years",
      "Complete 6-month internship",
      "Optional: MPT for specialization"
    ],
    entranceExams: [
      "NEET (for some colleges)",
      "State physiotherapy entrance exams",
      "AIIMS physiotherapy entrance",
      "College-specific entrance tests",
      "State CET exams"
    ],
    relatedCareers: [
      "Occupational Therapist",
      "Sports Medicine Specialist",
      "Rehabilitation Counselor",
      "Exercise Physiologist",
      "Wellness Coach"
    ]
  },
  "nutritionist": {
    title: "Nutritionist",
    category: "Helping",
    overview: "Nutritionists help people improve their health through proper diet and nutrition planning. You'll assess nutritional needs, develop meal plans, and educate clients about healthy eating habits to prevent disease and promote wellness.",
    keyHighlights: [
      "Growing health awareness creates demand",
      "Help people achieve wellness goals",
      "Flexible career options available",
      "Combine science with practical application"
    ],
    subjectsAndStream: {
      recommendedStream: "Science (PCB) or Home Science",
      essentialSubjects: ["Biology", "Chemistry", "Home Science"],
      optionalSubjects: ["Psychology", "Physical Education"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on Biology and Chemistry. Learn about food science and health.",
        "11th-12th": "Choose PCB or Home Science stream based on available options."
      }
    },
    jobRoles: [
      "Clinical Nutritionist",
      "Sports Nutritionist",
      "Community Nutritionist",
      "Food Service Manager",
      "Nutrition Consultant",
      "Wellness Coach"
    ],
    skills: [
      "Nutrition Science Knowledge",
      "Diet Planning",
      "Client Counseling",
      "Communication Skills",
      "Research Skills",
      "Health Assessment"
    ],
    salary: {
      starting: "₹2-4 Lakhs",
      experienced: "₹4-7 Lakhs",
      senior: "₹7+ Lakhs"
    },
    industryDemand: "Growing demand in healthcare, fitness, and wellness industries. Lifestyle diseases increase need for nutrition experts.",
    educationPathway: [
      "Complete 12th with Science/Home Science",
      "Pursue B.Sc in Nutrition & Dietetics (3 years)",
      "Get certification from nutrition boards",
      "Optional: M.Sc for advanced practice"
    ],
    entranceExams: [
      "State university entrance exams",
      "College-specific entrance tests",
      "Home Science entrance exams",
      "Direct admission based on 12th marks",
      "Professional certification exams"
    ],
    relatedCareers: [
      "Dietitian",
      "Food Scientist",
      "Public Health Officer",
      "Wellness Coordinator",
      "Health Education Specialist"
    ]
  }
};

// Additional career data
const additionalCareerData = {
  "banking-professional": {
    title: "Banking Professional",
    category: "Business",
    overview: "Banking professionals manage financial services, help customers with their financial needs, and contribute to economic growth. You'll work in various roles from customer service to investment banking, playing a crucial role in the financial ecosystem.",
    keyHighlights: [
      "Stable career with good growth opportunities",
      "Direct impact on people's financial well-being",
      "Wide range of specializations available",
      "Strong job security in established sector"
    ],
    subjectsAndStream: {
      recommendedStream: "Commerce/Arts/Science",
      essentialSubjects: ["Mathematics", "Economics", "Accountancy"],
      optionalSubjects: ["Business Studies", "Computer Science", "English"],
      gradeWiseAdvice: {
        "9th-10th": "Focus on Mathematics and develop analytical thinking. Learn basic computer skills.",
        "11th-12th": "Choose Commerce stream. Mathematics and Economics are crucial for banking entrance exams."
      }
    },
    jobRoles: [
      "Bank Manager",
      "Loan Officer",
      "Investment Banker",
      "Credit Analyst",
      "Risk Management Specialist",
      "Financial Advisor"
    ],
    skills: [
      "Financial Analysis",
      "Customer Service",
      "Risk Assessment",
      "Communication Skills",
      "Mathematical Skills",
      "Computer Proficiency"
    ],
    salary: {
      starting: "₹3-5 Lakhs",
      experienced: "₹6-12 Lakhs",
      senior: "₹15+ Lakhs"
    },
    industryDemand: "Strong demand due to expanding financial services sector. Digital banking and fintech growth create new opportunities.",
    educationPathway: [
      "Complete 12th (any stream, preferably Commerce)",
      "Pursue graduation in any field",
      "Clear banking entrance exams (IBPS, SBI, etc.)",
      "Optional: MBA in Finance for higher positions"
    ],
    entranceExams: [
      "IBPS PO/Clerk",
      "SBI PO/Clerk",
      "RBI Grade B",
      "NABARD Grade A/B",
      "State Bank exams"
    ],
    relatedCareers: [
      "Accountant",
      "Financial Analyst",
      "Insurance Agent",
      "Investment Advisor",
      "Chartered Accountant"
    ]
  },
  "accountant": {
    title: "Accountant",
    category: "Business",
    overview: "Accountants maintain financial records, ensure compliance with regulations, and provide financial insights to businesses. You'll be essential in helping organizations make informed financial decisions and maintain transparency.",
    keyHighlights: [
      "High demand across all industries",
      "Clear career progression path",
      "Option to start own practice",
      "Recession-proof profession"
    ],
    subjectsAndStream: {
      recommendedStream: "Commerce",
      essentialSubjects: ["Accountancy", "Mathematics", "Economics"],
      optionalSubjects: ["Business Studies", "Computer Science", "Statistics"],
      gradeWiseAdvice: {
        "9th-10th": "Build strong foundation in Mathematics. Develop attention to detail and organization skills.",
        "11th-12th": "Choose Commerce stream with Accountancy as main subject. Maintain good grades for professional courses."
      }
    },
    jobRoles: [
      "Staff Accountant",
      "Senior Accountant",
      "Tax Consultant",
      "Audit Associate",
      "Financial Controller",
      "Chief Financial Officer"
    ],
    skills: [
      "Financial Reporting",
      "Tax Preparation",
      "Auditing",
      "Software Proficiency (Tally, SAP)",
      "Attention to Detail",
      "Analytical Thinking"
    ],
    salary: {
      starting: "₹2.5-4 Lakhs",
      experienced: "₹5-10 Lakhs",
      senior: "₹12+ Lakhs"
    },
    industryDemand: "Consistent demand across all sectors. Growing need for compliance and financial transparency creates stable opportunities.",
    educationPathway: [
      "Complete 12th with Commerce (Accountancy)",
      "Pursue B.Com in Accounting/Finance",
      "Optional: Professional courses (CA, CMA, CS)",
      "Gain practical experience through internships"
    ],
    entranceExams: [
      "CA Foundation (for Chartered Accountancy)",
      "CMA Foundation (Cost Management)",
      "CS Foundation (Company Secretary)",
      "University entrance exams"
    ],
    relatedCareers: [
      "Chartered Accountant",
      "Tax Advisor",
      "Financial Analyst",
      "Banking Professional",
      "Audit Manager"
    ]
  }
};

// Merge new career data with existing career data
Object.assign(careerData, newCareerData, additionalCareerData);

export default CareerDetails;
