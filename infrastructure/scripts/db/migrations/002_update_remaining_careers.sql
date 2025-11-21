-- ================================================================
-- MIGRATION: Update Remaining Careers with Extended Data
-- Version: 002
-- Date: 2025-01-16
-- Description: Updates careers 4-15 with complete field data
--              Run this AFTER 001_add_career_extended_fields.sql
--              and seed_data.sql have been executed
-- ================================================================

-- NOTE: This script uses UPDATE statements to add data to existing careers
-- Run this only after the careers have been created by seed_data.sql

-- ================================================================
-- CAREER 4: MECHANICAL ENGINEER
-- ================================================================
UPDATE public.career_path SET
  slug = 'mechanical-engineer',
  category = 'STEM',
  snapshot = 'Design machines, engines, and mechanical systems that power industries. Perfect for students who love physics, problem-solving, and hands-on work.',
  salary_starting = '₹3-5 Lakhs',
  salary_experienced = '₹6-12 Lakhs',
  salary_senior = '₹12+ Lakhs',
  industry_demand = 'Strong demand in automotive, aerospace, and manufacturing sectors. Bangalore''s industrial base provides excellent opportunities.',
  recommended_stream = 'Science (PCM)',
  student_path_example = 'Suresh took PCM in 11–12, cleared JEE Main, completed B.Tech in Mechanical Engineering, and now works in automotive design at a leading car manufacturer.',
  education_pathway = '["Complete 12th with Physics, Chemistry, Mathematics", "Clear JEE Main for engineering admission", "Pursue B.Tech in Mechanical Engineering (4 years)", "Optional: M.Tech for specialization"]'::jsonb,
  entrance_exams_list = '["JEE Main & Advanced", "State CET exams", "BITSAT", "VITEEE", "University-specific exams"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Build strong foundation in Physics and Mathematics. Understand basic mechanics.", "11th-12th": "Choose PCM stream. Maintain 75%+ for JEE eligibility."}'::jsonb,
  essential_subjects = '["Physics", "Chemistry", "Mathematics"]'::jsonb,
  optional_subjects = '["Computer Science", "Engineering Drawing"]'::jsonb
WHERE name = 'Mechanical Engineer';

-- ================================================================
-- CAREER 5: ARCHITECT
-- ================================================================
UPDATE public.career_path SET
  slug = 'architect',
  category = 'STEM',
  snapshot = 'Design beautiful, functional buildings that shape communities. Perfect for creative students with technical aptitude and spatial thinking.',
  salary_starting = '₹3-5 Lakhs',
  salary_experienced = '₹6-12 Lakhs',
  salary_senior = '₹12+ Lakhs',
  industry_demand = 'Strong demand due to urbanization and infrastructure development. Bangalore''s growing real estate sector offers numerous opportunities.',
  recommended_stream = 'Science (PCM) or Arts with Math',
  student_path_example = 'Rohan chose PCM in 11–12, cleared NATA exam, completed B.Arch in 5 years, and now designs sustainable residential projects.',
  education_pathway = '["Complete 12th with Mathematics", "Clear NATA (National Aptitude Test in Architecture)", "Pursue B.Arch (Bachelor of Architecture) - 5 years", "Register with Council of Architecture"]'::jsonb,
  entrance_exams_list = '["NATA (National Aptitude Test)", "JEE Main Paper 2 (B.Arch)", "State architecture entrance exams", "College-specific design tests", "Portfolio-based admissions"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Develop spatial reasoning and drawing skills. Understand basic geometry.", "11th-12th": "Choose PCM or Arts with Mathematics. Build a portfolio for design entrance exams."}'::jsonb,
  essential_subjects = '["Mathematics", "Physics"]'::jsonb,
  optional_subjects = '["Art", "Computer Science", "Environmental Science"]'::jsonb
WHERE name = 'Architect';

-- ================================================================
-- CAREER 6: DOCTOR
-- ================================================================
UPDATE public.career_path SET
  slug = 'doctor',
  category = 'Helping',
  snapshot = 'Diagnose, treat, and save lives as a medical professional. Ideal for dedicated students with strong science skills and compassion for others.',
  salary_starting = '₹6-10 Lakhs',
  salary_experienced = '₹10-20 Lakhs',
  salary_senior = '₹20+ Lakhs',
  industry_demand = 'High demand across all healthcare sectors. Growing healthcare infrastructure in Bangalore provides excellent opportunities.',
  recommended_stream = 'Science (PCB)',
  student_path_example = 'Meera took PCB in 11–12, scored 650+ in NEET, completed MBBS in 5.5 years, and now works as a pediatrician at a children''s hospital.',
  education_pathway = '["Complete 12th with Physics, Chemistry, Biology", "Clear NEET examination", "Pursue MBBS (5.5 years including internship)", "Optional: MD/MS for specialization (3 years)"]'::jsonb,
  entrance_exams_list = '["NEET (National Eligibility Test)", "AIIMS entrance (now merged with NEET)", "State medical entrance exams", "NEET PG for specialization", "Various fellowship entrance exams"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Focus on Biology and Chemistry. Develop strong study habits and dedication.", "11th-12th": "Choose PCB stream. Maintain 90%+ for NEET qualification."}'::jsonb,
  essential_subjects = '["Physics", "Chemistry", "Biology"]'::jsonb,
  optional_subjects = '["Mathematics", "English"]'::jsonb
WHERE name = 'Doctor';

-- ================================================================
-- CAREER 7: NURSE
-- ================================================================
UPDATE public.career_path SET
  slug = 'nurse',
  category = 'Helping',
  snapshot = 'Provide compassionate patient care and support healthcare teams. Perfect for caring students with strong science background and empathy.',
  salary_starting = '₹2.5-4 Lakhs',
  salary_experienced = '₹4-7 Lakhs',
  salary_senior = '₹7+ Lakhs',
  industry_demand = 'Very high demand in healthcare sector. Aging population and expanding healthcare services create excellent job opportunities.',
  recommended_stream = 'Science (PCB)',
  student_path_example = 'Lakshmi took PCB in 11–12, pursued B.Sc Nursing, completed her internship, and now works as an ICU nurse at a multi-specialty hospital.',
  education_pathway = '["Complete 12th with Physics, Chemistry, Biology", "Pursue B.Sc Nursing (4 years) or GNM (3.5 years)", "Complete internship and registration", "Optional: M.Sc Nursing for specialization"]'::jsonb,
  entrance_exams_list = '["NEET (for some colleges)", "State nursing entrance exams", "AIIMS Nursing Entrance", "JIPMER Nursing", "College-specific entrance tests"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Focus on Biology and Chemistry. Develop compassion and communication skills.", "11th-12th": "Choose PCB (Physics, Chemistry, Biology). Maintain 50%+ for nursing college eligibility."}'::jsonb,
  essential_subjects = '["Biology", "Chemistry", "Physics"]'::jsonb,
  optional_subjects = '["Psychology", "English", "Computer Science"]'::jsonb
WHERE name = 'Nurse';

-- ================================================================
-- CAREER 8: PHYSIOTHERAPIST
-- ================================================================
UPDATE public.career_path SET
  slug = 'physiotherapist',
  category = 'Helping',
  snapshot = 'Help patients recover mobility and live pain-free. Perfect for students with empathy, physical awareness, and interest in rehabilitation.',
  salary_starting = '₹2.5-4 Lakhs',
  salary_experienced = '₹4-8 Lakhs',
  salary_senior = '₹8+ Lakhs',
  industry_demand = 'Growing demand due to aging population and sports injuries. Rehabilitation centers and wellness clinics offer opportunities.',
  recommended_stream = 'Science (PCB)',
  student_path_example = 'Deepak took PCB in 11–12, pursued BPT (Bachelor of Physiotherapy), completed internship, and now works as a sports physiotherapist with a cricket team.',
  education_pathway = '["Complete 12th with Physics, Chemistry, Biology", "Pursue BPT (Bachelor of Physiotherapy) - 4.5 years", "Complete 6-month internship", "Optional: MPT for specialization"]'::jsonb,
  entrance_exams_list = '["NEET (for some colleges)", "State physiotherapy entrance exams", "AIIMS physiotherapy entrance", "College-specific entrance tests", "State CET exams"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Focus on Biology and develop physical fitness. Learn about human anatomy.", "11th-12th": "Choose PCB stream. Physical education as additional subject is beneficial."}'::jsonb,
  essential_subjects = '["Biology", "Chemistry", "Physics"]'::jsonb,
  optional_subjects = '["Physical Education", "Psychology"]'::jsonb
WHERE name = 'Physiotherapist';

-- ================================================================
-- CAREER 9: MARKETING SPECIALIST
-- ================================================================
UPDATE public.career_path SET
  slug = 'marketing-specialist',
  category = 'Business',
  snapshot = 'Combine creativity with business strategy to help brands grow. Ideal for students who enjoy communication, analysis, and innovation.',
  salary_starting = '₹3-5 Lakhs',
  salary_experienced = '₹6-12 Lakhs',
  salary_senior = '₹12+ Lakhs',
  industry_demand = 'Marketing professionals are in high demand as every business goes digital. The global digital marketing industry is expected to grow over 10% annually, creating new roles for skilled professionals.',
  recommended_stream = 'Commerce / Arts',
  student_path_example = 'Riya took Commerce in 11–12, completed BBA in Marketing, learned Google Ads through an online course, and now manages social media for a startup.',
  education_pathway = '["Complete 12th with Commerce or Arts stream", "Pursue BBA or BCom in Marketing (3 years)", "Gain certifications in Digital Marketing", "Optional: MBA in Marketing (2 years)"]'::jsonb,
  entrance_exams_list = '["CUET for central universities", "State CET exams", "CAT/MAT for MBA", "College-specific entrance tests", "Digital marketing certifications"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Develop communication skills and understand basic business concepts.", "11th-12th": "Choose Commerce with Business Studies. Focus on Economics and English."}'::jsonb,
  essential_subjects = '["Business Studies", "Economics", "English"]'::jsonb,
  optional_subjects = '["Psychology", "Computer Science", "Mathematics"]'::jsonb
WHERE name = 'Marketing Specialist';

-- ================================================================
-- CAREER 10: ACCOUNTANT
-- ================================================================
UPDATE public.career_path SET
  slug = 'accountant',
  category = 'Business',
  snapshot = 'Manage financial records and ensure business compliance. Great for detail-oriented students with strong mathematical and analytical skills.',
  salary_starting = '₹2.5-4 Lakhs',
  salary_experienced = '₹5-10 Lakhs',
  salary_senior = '₹12+ Lakhs',
  industry_demand = 'Consistent demand across all sectors. Growing need for compliance and financial transparency creates stable opportunities.',
  recommended_stream = 'Commerce',
  student_path_example = 'Neha took Commerce with Accountancy in 11–12, pursued BCom, cleared CA Foundation, and now works as an audit associate at a Big 4 firm.',
  education_pathway = '["Complete 12th with Commerce (Accountancy)", "Pursue B.Com in Accounting/Finance", "Optional: Professional courses (CA, CMA, CS)", "Gain practical experience through internships"]'::jsonb,
  entrance_exams_list = '["CA Foundation (for Chartered Accountancy)", "CMA Foundation (Cost Management)", "CS Foundation (Company Secretary)", "University entrance exams"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Build strong foundation in Mathematics. Develop attention to detail and organization skills.", "11th-12th": "Choose Commerce stream with Accountancy as main subject. Maintain good grades for professional courses."}'::jsonb,
  essential_subjects = '["Accountancy", "Mathematics", "Economics"]'::jsonb,
  optional_subjects = '["Business Studies", "Computer Science", "Statistics"]'::jsonb
WHERE name = 'Accountant';

-- ================================================================
-- CAREER 11: LAWYER
-- ================================================================
UPDATE public.career_path SET
  slug = 'lawyer',
  category = 'Business',
  snapshot = 'Fight for justice and represent clients in legal matters. Great for students with strong analytical, communication, and debate skills.',
  salary_starting = '₹3-6 Lakhs',
  salary_experienced = '₹8-15 Lakhs',
  salary_senior = '₹15+ Lakhs',
  industry_demand = 'Growing demand in corporate sector, especially in IT capital Bangalore. Increasing litigation and compliance requirements create opportunities.',
  recommended_stream = 'Arts/Commerce',
  student_path_example = 'Aditya took Arts in 11–12, cleared CLAT, completed BA LLB in 5 years, and now practices corporate law at a leading firm.',
  education_pathway = '["Complete 12th in any stream", "Clear CLAT or other law entrance exams", "Pursue LLB (3 years) or BA LLB (5 years)", "Register with Bar Council"]'::jsonb,
  entrance_exams_list = '["CLAT (Common Law Admission Test)", "LSAT India", "State law entrance exams", "University-specific law tests", "All India Law Entrance Test"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Develop strong reading, writing, and debating skills. Follow current affairs.", "11th-12th": "Choose Arts or Commerce. Focus on English and analytical subjects."}'::jsonb,
  essential_subjects = '["English", "Political Science"]'::jsonb,
  optional_subjects = '["History", "Economics", "Psychology"]'::jsonb
WHERE name = 'Lawyer';

-- ================================================================
-- CAREER 12: GRAPHIC DESIGNER
-- ================================================================
UPDATE public.career_path SET
  slug = 'graphic-designer',
  category = 'Creative',
  snapshot = 'Create stunning visuals that tell stories and communicate ideas. Great for students with artistic flair and digital creativity.',
  salary_starting = '₹2.5-4 Lakhs',
  salary_experienced = '₹5-8 Lakhs',
  salary_senior = '₹8+ Lakhs',
  industry_demand = 'High demand in digital marketing, e-commerce, and media companies. Growing opportunities in startups and creative agencies across Bangalore.',
  recommended_stream = 'Arts/Commerce',
  student_path_example = 'Sneha took Arts in 11–12, pursued BFA in Graphic Design, learned Adobe Creative Suite, and now designs brand identities for e-commerce companies.',
  education_pathway = '["Complete 12th in any stream", "Pursue BFA/B.Des in Graphic Design (3-4 years)", "Learn industry-standard software (Adobe Creative Suite)", "Build a strong portfolio"]'::jsonb,
  entrance_exams_list = '["UCEED (for IITs)", "NIFT Entrance Exam", "NID Entrance", "CEED (for M.Des)", "College-specific design tests"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Develop drawing skills and basic computer literacy. Explore digital art tools.", "11th-12th": "Choose Arts or Commerce. Focus on building a portfolio of creative work."}'::jsonb,
  essential_subjects = '["Art", "Computer Science"]'::jsonb,
  optional_subjects = '["Psychology", "Business Studies", "English"]'::jsonb
WHERE name = 'Graphic Designer';

-- ================================================================
-- CAREER 13: PSYCHOLOGIST
-- ================================================================
UPDATE public.career_path SET
  slug = 'psychologist',
  category = 'Helping',
  snapshot = 'Help people overcome challenges and improve mental well-being. Ideal for students with empathy, listening skills, and interest in human behavior.',
  salary_starting = '₹2.5-5 Lakhs',
  salary_experienced = '₹5-10 Lakhs',
  salary_senior = '₹10+ Lakhs',
  industry_demand = 'Growing demand as mental health awareness increases. Corporate wellness, educational institutions, and healthcare sectors actively seek psychologists.',
  recommended_stream = 'Arts/Humanities (with Psychology)',
  student_path_example = 'Priya took Arts with Psychology in 11–12, completed BA Psychology, then MA in Clinical Psychology, and now counsels students at a wellness center.',
  education_pathway = '["Complete 12th in any stream (preferably with Psychology)", "Pursue BA/BSc in Psychology (3 years)", "Complete MA/MSc in Psychology (2 years)", "Optional: PhD for research or specialized practice"]'::jsonb,
  entrance_exams_list = '["CUET for central universities", "State university entrance exams", "DU JAT (for Delhi University)", "BHU UET", "College-specific entrance tests"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Develop strong communication and observation skills. Read about human behavior.", "11th-12th": "Choose Arts with Psychology. Biology and Statistics are also beneficial."}'::jsonb,
  essential_subjects = '["Psychology", "English"]'::jsonb,
  optional_subjects = '["Sociology", "Philosophy", "Biology", "Statistics"]'::jsonb
WHERE name = 'Psychologist';

-- ================================================================
-- CAREER 14: TEACHER
-- ================================================================
UPDATE public.career_path SET
  slug = 'teacher',
  category = 'Helping',
  snapshot = 'Educate and inspire the next generation. Ideal for patient students who love their subject and enjoy helping others learn and grow.',
  salary_starting = '₹2.5-4 Lakhs',
  salary_experienced = '₹4-8 Lakhs',
  salary_senior = '₹8+ Lakhs',
  industry_demand = 'Consistent demand across government and private schools. Growing opportunities in educational technology and online learning platforms.',
  recommended_stream = 'Any stream based on subject preference',
  student_path_example = 'Divya took Arts in 11–12, completed BA in English, pursued B.Ed, cleared CTET, and now teaches English at a private school.',
  education_pathway = '["Complete 12th in relevant subject area", "Complete graduation in subject specialization", "Pursue B.Ed (Bachelor of Education) - 2 years", "Clear TET (Teacher Eligibility Test)"]'::jsonb,
  entrance_exams_list = '["TET (Teacher Eligibility Test)", "B.Ed entrance exams", "CTET (Central TET)", "State TET exams", "University-specific entrance tests"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Focus on your favorite subjects. Develop communication and leadership skills.", "11th-12th": "Choose stream based on what you want to teach. Maintain good academic record."}'::jsonb,
  essential_subjects = '["Subject of specialization", "Psychology"]'::jsonb,
  optional_subjects = '["Education", "Computer Science", "Communication"]'::jsonb
WHERE name = 'Teacher';

-- ================================================================
-- CAREER 15: ENTREPRENEUR
-- ================================================================
UPDATE public.career_path SET
  slug = 'entrepreneur',
  category = 'Business',
  snapshot = 'Build your own business and create innovative solutions. Perfect for risk-takers with leadership skills and a vision to change the world.',
  salary_starting = 'Variable (₹2-10 Lakhs)',
  salary_experienced = '₹5-25 Lakhs',
  salary_senior = '₹25+ Lakhs (unlimited potential)',
  industry_demand = 'Bangalore''s startup ecosystem provides excellent opportunities. Government initiatives and funding support make it easier to start businesses.',
  recommended_stream = 'Commerce/Arts (any stream can work)',
  student_path_example = 'Vikram took Commerce in 11–12, pursued BBA, started an e-commerce platform during college, raised seed funding, and now runs a successful startup.',
  education_pathway = '["Complete 12th in any stream", "Pursue BBA/BCom or any field of interest", "Gain business knowledge through courses and experience", "Start small ventures during college", "Consider MBA for advanced business skills (optional)"]'::jsonb,
  entrance_exams_list = '["CUET for business programs", "CAT/MAT for MBA", "State CET exams", "Direct admission programs", "Entrepreneurship bootcamps"]'::jsonb,
  grade_wise_advice = '{"9th-10th": "Develop leadership and communication skills. Start small projects or ventures.", "11th-12th": "Choose Commerce or any stream you are passionate about. Focus on business fundamentals."}'::jsonb,
  essential_subjects = '["Business Studies", "Economics"]'::jsonb,
  optional_subjects = '["Mathematics", "Computer Science", "Psychology"]'::jsonb
WHERE name = 'Entrepreneur';

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Verify all careers have been updated
SELECT
  name,
  CASE
    WHEN slug IS NOT NULL THEN '✓' ELSE '✗'
  END as has_slug,
  CASE
    WHEN category IS NOT NULL THEN '✓' ELSE '✗'
  END as has_category,
  CASE
    WHEN salary_starting IS NOT NULL THEN '✓' ELSE '✗'
  END as has_salary,
  CASE
    WHEN education_pathway IS NOT NULL THEN '✓' ELSE '✗'
  END as has_pathway
FROM public.career_path
ORDER BY name;

-- Count careers with complete data
SELECT
  COUNT(*) as total_careers,
  COUNT(slug) as with_slug,
  COUNT(category) as with_category,
  COUNT(salary_starting) as with_salary,
  COUNT(education_pathway) as with_pathway
FROM public.career_path;
