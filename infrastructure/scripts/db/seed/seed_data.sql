-- ================================================================
-- DISHA CAREER DISCOVERY PLATFORM - SEED DATA
-- ================================================================
-- This script populates the database with comprehensive career data
-- including subjects, skills, careers, and their relationships
-- ================================================================

-- ================================================================
-- PART 0: CLEAR EXISTING DATA (For Re-seeding)
-- ================================================================
-- Delete in correct order to respect foreign key constraints
-- NOTE: Deleting data for all tables that this script populates
-- Using DO blocks to handle tables that may not exist

DO $$ BEGIN
  -- Delete deprecated junction tables (if they exist)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'st_college_course_jobs') THEN
    DELETE FROM public.st_college_course_jobs;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'college_course_jobs') THEN
    DELETE FROM public.college_course_jobs;
  END IF;

  -- Delete other junction tables (if they exist)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'course_skills') THEN
    DELETE FROM public.course_skills;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'course_entrance_exams') THEN
    DELETE FROM public.course_entrance_exams;
  END IF;

  -- Delete career junction/relationship tables
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'careerpath_tags') THEN
    DELETE FROM public.careerpath_tags;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'career_options') THEN
    DELETE FROM public.career_options; -- Renamed from career_job_opportunity
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'careerpath_skills') THEN
    DELETE FROM public.careerpath_skills;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'careerpath_subjects') THEN
    DELETE FROM public.careerpath_subjects;
  END IF;

  -- Delete new junction tables (from migration 003)
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'careerpath_courses') THEN
    DELETE FROM public.careerpath_courses;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'college_courses') THEN
    DELETE FROM public.college_courses;
  END IF;

  -- Delete course and college data
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'course') THEN
    DELETE FROM public.course;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'college') THEN
    DELETE FROM public.college;
  END IF;

  -- Delete main career data tables
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'career_path') THEN
    DELETE FROM public.career_path;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'entrance_exam') THEN
    DELETE FROM public.entrance_exam;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'skill') THEN
    DELETE FROM public.skill;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'subject') THEN
    DELETE FROM public.subject;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'stream') THEN
    DELETE FROM public.stream;
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'career_cluster') THEN
    DELETE FROM public.career_cluster;
  END IF;
END $$;

-- Reset sequences if needed (optional, for consistent IDs)
-- Note: UUIDs are used, so sequence reset is not needed


-- ================================================================
-- PART 1: CAREER CLUSTERS (Career Categories/Industries)
-- ================================================================
INSERT INTO public.career_cluster (name) VALUES
('Agriculture, Food & Natural Resources'),
('Architecture & Construction'),
('Arts, Audio/Video Technology & Communications'),
('Business Management & Administration'),
('Education & Training'),
('Finance'),
('Government & Public Administration'),
('Health Science'),
('Hospitality & Tourism'),
('Human Services'),
('Information Technology'),
('Law, Public Safety, Corrections & Security'),
('Manufacturing'),
('Marketing, Sales & Service'),
('Science, Technology, Engineering & Mathematics (STEM)'),
('Transportation, Distribution & Logistics');


-- ================================================================
-- PART 2: EDUCATION STREAMS
-- ================================================================
INSERT INTO public.stream (name) VALUES
('Science / STEM'),
('Commerce / Business'),
('Arts / Humanities');


-- ================================================================
-- PART 3: SUBJECTS (Academic Subjects for High School)
-- ================================================================
INSERT INTO public.subject (name) VALUES
('Physics'),
('Chemistry'),
('Biology'),
('Mathematics'),
('Computer Science'),
('Statistics'),
('English'),
('Psychology'),
('Sociology'),
('Economics'),
('Business Studies'),
('Accountancy'),
('History'),
('Geography'),
('Political Science'),
('Art'),
('Physical Education'),
('Engineering Drawing'),
('Home Science'),
('Philosophy');


-- ================================================================
-- PART 4: SKILLS (Professional Skills with Categories)
-- ================================================================
INSERT INTO public.skill (name, category, description) VALUES
-- Technical Skills
('Mathematical Analysis', 'technical', 'Calculating structural loads, stress analysis, and solving complex mathematical problems in engineering and science'),
('Problem-Solving', 'soft', 'Finding innovative solutions to complex challenges using analytical and creative approaches'),
('Project Management', 'soft', 'Coordinating teams, timelines, resources, and deliverables to complete projects successfully'),
('Technical Drawing & CAD', 'technical', 'Creating detailed blueprints and designs using AutoCAD, SolidWorks, and other CAD software'),
('Communication Skills', 'soft', 'Presenting ideas clearly, writing effectively, and explaining complex concepts to diverse audiences'),
('Attention to Detail', 'soft', 'Ensuring precision in measurements, specifications, and quality control processes'),
('Programming (Python, R, SQL)', 'technical', 'Writing code to analyze data, build applications, and automate processes using modern programming languages'),
('Statistical Analysis', 'technical', 'Finding patterns in complex datasets using statistical methods and data science techniques'),
('Machine Learning', 'technical', 'Building predictive models and AI systems using machine learning algorithms and frameworks'),
('Data Visualization', 'technical', 'Creating charts, dashboards, and visual representations of data using tools like Tableau, PowerBI'),
('Critical Thinking', 'soft', 'Asking the right questions, evaluating information objectively, and making sound judgments'),
('Business Acumen', 'soft', 'Understanding how insights drive business decisions, market dynamics, and organizational strategy'),
('Active Listening', 'soft', 'Understanding patients and clients deeply through attentive and empathetic listening'),
('Empathy & Compassion', 'soft', 'Connecting with clients emotionally and providing support during difficult situations'),
('Analytical Thinking', 'soft', 'Examining cases and problems from multiple angles, interpreting behavior and mental processes'),
('Research Methods', 'technical', 'Conducting psychological studies, experiments, and systematic investigations'),
('Creative Problem Solving', 'soft', 'Finding visual and innovative solutions to communication and design challenges'),
('Adobe Creative Suite', 'technical', 'Mastering Photoshop, Illustrator, InDesign for professional design work'),
('Typography', 'technical', 'Choosing and arranging fonts effectively for visual communication and readability'),
('Color Theory', 'technical', 'Creating harmonious color palettes and understanding color psychology in design'),
('Digital Marketing', 'technical', 'Managing online campaigns, SEO, SEM, and digital advertising strategies'),
('Social Media Management', 'technical', 'Handling brand pages, creating content calendars, and engaging online communities'),
('Content Creation', 'soft', 'Writing catchy content, designing visuals, and producing engaging marketing materials'),
('Strategic Thinking', 'soft', 'Planning long-term growth, market positioning, and competitive strategy'),
('Leadership', 'soft', 'Inspiring teams toward common goals, commanding respect, and managing personnel effectively'),
('Patient Care', 'technical', 'Administering medications, treatments, and providing compassionate medical support'),
('Medical Knowledge', 'technical', 'Understanding diseases, treatments, anatomy, and medical procedures'),
('Laboratory Techniques', 'technical', 'Conducting genetic and cellular experiments, medical tests, and research procedures'),
('Decision Making', 'soft', 'Making critical choices under pressure, especially in high-stakes situations'),
('Team Management', 'soft', 'Building cohesive teams, collaborating with diverse groups, and delegating effectively'),
('Physical Fitness', 'technical', 'Maintaining strength, endurance, and peak physical condition for demanding roles'),
('Adaptability', 'soft', 'Adjusting to changing circumstances, learning new technologies, and responding to challenges'),
('Risk Management', 'soft', 'Making calculated business decisions and identifying potential risks'),
('Financial Analysis', 'technical', 'Evaluating loan applications, investments, and financial performance metrics'),
('Customer Service', 'soft', 'Helping clients with needs, resolving issues, and building positive relationships'),
('Time Management', 'soft', 'Handling multiple patients or tasks efficiently and meeting project deadlines');


-- ================================================================
-- PART 5: ENTRANCE EXAMS (Enhanced with Additional Details)
-- ================================================================
INSERT INTO public.entrance_exam (name, description, eligibility, exam_pattern, difficulty_level, exam_dates, official_website) VALUES
(
  'JEE Main & Advanced',
  'National level engineering entrance examination. Conducted by NTA (National Testing Agency). JEE Main for NITs, IIITs, and other engineering colleges. JEE Advanced for IITs - one of India''s toughest engineering exams.',
  '12th pass or appearing with Physics, Chemistry, Mathematics. Minimum 75% aggregate (65% for SC/ST). Age limit: Born on or after Oct 1, 2000 (5 year relaxation for SC/ST).',
  'JEE Main: 90 questions (30 each - Physics, Chemistry, Math), 3 hours, 300 marks. JEE Advanced: 2 papers (3 hours each), multiple question types including MCQ, numerical, matching.',
  'Very Hard',
  'JEE Main: January & April sessions. JEE Advanced: May/June (for JEE Main qualifiers only)',
  'https://jeemain.nta.nic.in'
),
(
  'NEET UG',
  'National Eligibility cum Entrance Test. For MBBS, BDS, and other medical courses. Single entrance test for all medical colleges in India. Conducted by NTA.',
  '12th pass or appearing with Physics, Chemistry, Biology. Minimum 50% aggregate (40% for SC/ST/OBC). Minimum age: 17 years. Upper age limit: 25 years (relaxed for reserved categories).',
  '180 questions (45 each - Physics, Chemistry, Biology), 3 hours, 720 marks. Single paper, pen and paper based exam.',
  'Very Hard',
  'Typically held in May every year. Registration starts in December/January.',
  'https://neet.nta.nic.in'
),
(
  'CAT',
  'Common Admission Test for MBA programs. Conducted by IIMs (Indian Institutes of Management). Tests quantitative ability, verbal ability, and logical reasoning. Required for admission to top B-schools.',
  'Bachelor''s degree in any discipline with minimum 50% aggregate (45% for SC/ST/PWD). Final year students can also apply. No age limit.',
  '3 sections: Verbal Ability & Reading Comprehension (24 questions), Data Interpretation & Logical Reasoning (20 questions), Quantitative Ability (22 questions). Total 66 questions, 120 minutes.',
  'Hard',
  'Held in November/December. Registration typically opens in August.',
  'https://iimcat.ac.in'
),
(
  'CLAT',
  'Common Law Admission Test. For 5-year integrated LLB and 3-year LLB programs. Tests legal reasoning, logical reasoning, and general knowledge. For admission to National Law Universities.',
  'For UG: 12th pass or appearing with 45% aggregate (40% for SC/ST). For PG: LLB degree with 50% marks (45% for SC/ST). No age limit.',
  'UG: 150 questions - English, Current Affairs, Legal Reasoning, Logical Reasoning, Quantitative Techniques. 2 hours, 150 marks. PG: Similar pattern focused on law subjects.',
  'Hard',
  'Usually held in May. Registration opens in January/February.',
  'https://consortiumofnlus.ac.in'
),
(
  'NATA',
  'National Aptitude Test in Architecture. For B.Arch admission to architecture colleges. Tests drawing skills, observation, and mathematical ability. Required by Council of Architecture.',
  '12th pass or appearing with Mathematics as mandatory subject. Minimum 50% aggregate in PCM or PCB (45% for reserved categories).',
  'Part A: 125 questions (Aptitude, Mathematics, Drawing) - 3 hours, 125 marks. Part B: Drawing test - 30 minutes, 75 marks. Total 200 marks.',
  'Medium',
  'Two tests per year: April and July. Multiple attempts allowed.',
  'https://nata.in'
),
(
  'UCEED',
  'Undergraduate Common Entrance Examination for Design. For B.Des admission to IITs. Tests visualization, observation, and design thinking. Conducted by IIT Bombay.',
  '12th pass or appearing in any stream. No specific subject requirements. Top 10% in respective boards are preferred.',
  'Part A: Numerical Answer Type, MCQ - 2 hours. Part B: Drawing test - 1 hour. Total 300 marks covering visualization, observation, design thinking.',
  'Hard',
  'Held in January. Registration opens in October/November.',
  'https://uceed.iitb.ac.in'
),
(
  'GATE',
  'Graduate Aptitude Test in Engineering. For M.Tech admission and PSU recruitment. Tests comprehensive understanding of engineering subjects. Valid for 3 years.',
  'Bachelor''s degree in Engineering/Technology/Architecture or currently in final year. For some papers: Master''s degree in relevant science subjects.',
  '65 questions (MCQ, MSQ, NAT) covering General Aptitude (15%) and subject-specific questions (85%). 3 hours, 100 marks. 27 different subject papers.',
  'Hard',
  'Held in February. Registration opens in September/October.',
  'https://gate.iisc.ac.in'
),
(
  'State CET exams',
  'State-level Common Entrance Tests. For engineering, medical, and other professional courses. Conducted by state governments (KCET, MHT-CET, etc.). Alternative to national level exams.',
  'Varies by state. Generally 12th pass or appearing in relevant stream. Domicile requirements may apply. Some states accept JEE/NEET scores.',
  'Varies by state. Typically covers Physics, Chemistry, Math/Biology. Duration: 2-3 hours. Some states use OMR, others are computer-based.',
  'Medium',
  'Usually held in April-May. Each state has different dates. Check respective state CET websites.',
  'Varies by state (e.g., https://kea.kar.nic.in for Karnataka)'
);


-- ================================================================
-- PART 6: CAREERS WITH COMPLETE DATA
-- ================================================================

DO $$
DECLARE
  -- Stream IDs
  science_stream_id uuid;
  commerce_stream_id uuid;
  arts_stream_id uuid;

  -- Cluster IDs
  stem_cluster_id uuid;
  health_cluster_id uuid;
  business_cluster_id uuid;
  arts_cluster_id uuid;
  human_services_cluster_id uuid;
  it_cluster_id uuid;

  -- Career IDs (to use in relationships)
  civil_engineer_id uuid;
  software_developer_id uuid;
  data_scientist_id uuid;
  mechanical_engineer_id uuid;
  architect_id uuid;
  doctor_id uuid;
  nurse_id uuid;
  physiotherapist_id uuid;
  marketing_specialist_id uuid;
  accountant_id uuid;
  lawyer_id uuid;
  graphic_designer_id uuid;
  psychologist_id uuid;
  teacher_id uuid;
  entrepreneur_id uuid;

  -- Subject IDs
  physics_id uuid;
  chemistry_id uuid;
  biology_id uuid;
  mathematics_id uuid;
  computer_science_id uuid;
  english_id uuid;
  psychology_id uuid;
  economics_id uuid;
  business_studies_id uuid;
  accountancy_id uuid;
  art_id uuid;
  statistics_id uuid;
  engineering_drawing_id uuid;
  political_science_id uuid;

  -- Skill IDs
  math_analysis_id uuid;
  problem_solving_id uuid;
  project_mgmt_id uuid;
  technical_drawing_id uuid;
  communication_id uuid;
  attention_detail_id uuid;
  programming_id uuid;
  statistical_analysis_id uuid;
  machine_learning_id uuid;
  data_viz_id uuid;
  critical_thinking_id uuid;
  business_acumen_id uuid;
  active_listening_id uuid;
  empathy_id uuid;
  analytical_thinking_id uuid;
  research_methods_id uuid;
  creative_problem_solving_id uuid;
  adobe_suite_id uuid;
  typography_id uuid;
  color_theory_id uuid;
  digital_marketing_id uuid;
  social_media_id uuid;
  content_creation_id uuid;
  strategic_thinking_id uuid;
  leadership_id uuid;
  patient_care_id uuid;
  medical_knowledge_id uuid;
  decision_making_id uuid;
  team_mgmt_id uuid;
  adaptability_id uuid;
  financial_analysis_id uuid;

BEGIN
  -- ================================================================
  -- GET REFERENCE IDs
  -- ================================================================

  -- Get Stream IDs
  SELECT id INTO science_stream_id FROM public.stream WHERE name = 'Science / STEM';
  SELECT id INTO commerce_stream_id FROM public.stream WHERE name = 'Commerce / Business';
  SELECT id INTO arts_stream_id FROM public.stream WHERE name = 'Arts / Humanities';

  -- Get Cluster IDs
  SELECT id INTO stem_cluster_id FROM public.career_cluster WHERE name = 'Science, Technology, Engineering & Mathematics (STEM)';
  SELECT id INTO health_cluster_id FROM public.career_cluster WHERE name = 'Health Science';
  SELECT id INTO business_cluster_id FROM public.career_cluster WHERE name = 'Business Management & Administration';
  SELECT id INTO arts_cluster_id FROM public.career_cluster WHERE name = 'Arts, Audio/Video Technology & Communications';
  SELECT id INTO human_services_cluster_id FROM public.career_cluster WHERE name = 'Human Services';
  SELECT id INTO it_cluster_id FROM public.career_cluster WHERE name = 'Information Technology';

  -- Get Subject IDs
  SELECT id INTO physics_id FROM public.subject WHERE name = 'Physics';
  SELECT id INTO chemistry_id FROM public.subject WHERE name = 'Chemistry';
  SELECT id INTO biology_id FROM public.subject WHERE name = 'Biology';
  SELECT id INTO mathematics_id FROM public.subject WHERE name = 'Mathematics';
  SELECT id INTO computer_science_id FROM public.subject WHERE name = 'Computer Science';
  SELECT id INTO english_id FROM public.subject WHERE name = 'English';
  SELECT id INTO psychology_id FROM public.subject WHERE name = 'Psychology';
  SELECT id INTO economics_id FROM public.subject WHERE name = 'Economics';
  SELECT id INTO business_studies_id FROM public.subject WHERE name = 'Business Studies';
  SELECT id INTO accountancy_id FROM public.subject WHERE name = 'Accountancy';
  SELECT id INTO art_id FROM public.subject WHERE name = 'Art';
  SELECT id INTO statistics_id FROM public.subject WHERE name = 'Statistics';
  SELECT id INTO engineering_drawing_id FROM public.subject WHERE name = 'Engineering Drawing';
  SELECT id INTO political_science_id FROM public.subject WHERE name = 'Political Science';

  -- Get Skill IDs
  SELECT id INTO math_analysis_id FROM public.skill WHERE name = 'Mathematical Analysis';
  SELECT id INTO problem_solving_id FROM public.skill WHERE name = 'Problem-Solving';
  SELECT id INTO project_mgmt_id FROM public.skill WHERE name = 'Project Management';
  SELECT id INTO technical_drawing_id FROM public.skill WHERE name = 'Technical Drawing & CAD';
  SELECT id INTO communication_id FROM public.skill WHERE name = 'Communication Skills';
  SELECT id INTO attention_detail_id FROM public.skill WHERE name = 'Attention to Detail';
  SELECT id INTO programming_id FROM public.skill WHERE name = 'Programming (Python, R, SQL)';
  SELECT id INTO statistical_analysis_id FROM public.skill WHERE name = 'Statistical Analysis';
  SELECT id INTO machine_learning_id FROM public.skill WHERE name = 'Machine Learning';
  SELECT id INTO data_viz_id FROM public.skill WHERE name = 'Data Visualization';
  SELECT id INTO critical_thinking_id FROM public.skill WHERE name = 'Critical Thinking';
  SELECT id INTO business_acumen_id FROM public.skill WHERE name = 'Business Acumen';
  SELECT id INTO active_listening_id FROM public.skill WHERE name = 'Active Listening';
  SELECT id INTO empathy_id FROM public.skill WHERE name = 'Empathy & Compassion';
  SELECT id INTO analytical_thinking_id FROM public.skill WHERE name = 'Analytical Thinking';
  SELECT id INTO research_methods_id FROM public.skill WHERE name = 'Research Methods';
  SELECT id INTO creative_problem_solving_id FROM public.skill WHERE name = 'Creative Problem Solving';
  SELECT id INTO adobe_suite_id FROM public.skill WHERE name = 'Adobe Creative Suite';
  SELECT id INTO typography_id FROM public.skill WHERE name = 'Typography';
  SELECT id INTO color_theory_id FROM public.skill WHERE name = 'Color Theory';
  SELECT id INTO digital_marketing_id FROM public.skill WHERE name = 'Digital Marketing';
  SELECT id INTO social_media_id FROM public.skill WHERE name = 'Social Media Management';
  SELECT id INTO content_creation_id FROM public.skill WHERE name = 'Content Creation';
  SELECT id INTO strategic_thinking_id FROM public.skill WHERE name = 'Strategic Thinking';
  SELECT id INTO leadership_id FROM public.skill WHERE name = 'Leadership';
  SELECT id INTO patient_care_id FROM public.skill WHERE name = 'Patient Care';
  SELECT id INTO medical_knowledge_id FROM public.skill WHERE name = 'Medical Knowledge';
  SELECT id INTO decision_making_id FROM public.skill WHERE name = 'Decision Making';
  SELECT id INTO team_mgmt_id FROM public.skill WHERE name = 'Team Management';
  SELECT id INTO adaptability_id FROM public.skill WHERE name = 'Adaptability';
  SELECT id INTO financial_analysis_id FROM public.skill WHERE name = 'Financial Analysis';


  -- ================================================================
  -- CAREER 1: CIVIL ENGINEER
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Civil Engineer',
    'Civil engineers design, build, and maintain the infrastructure that shapes our world. From bridges and roads to water systems and skyscrapers, you''ll create solutions that improve people''s daily lives and contribute to society''s development.',
    'Shape the physical world around us | Work on projects that last generations | High job security and growth potential | Combine creativity with technical expertise',
    'SCITECH',
    science_stream_id,
    stem_cluster_id,
    -- New fields:
    'civil-engineer',
    'STEM',
    'Design and build infrastructure that shapes modern society. Perfect for students who enjoy math, physics, and creating lasting impact.',
    '₹3.5-6 Lakhs',
    '₹8-15 Lakhs',
    '₹15+ Lakhs',
    'High demand due to India''s infrastructure development projects. Smart cities, metro expansions, and sustainable construction create excellent opportunities.',
    'Science (PCM)',
    'Arjun chose PCM in 11–12, cracked JEE Main, completed B.Tech in Civil Engineering from NIT, and now works on metro rail projects in Bangalore.',
    '["Complete 12th with Physics, Chemistry, Mathematics", "Clear JEE Main & JEE Advanced for admission", "Pursue B.Tech in Civil Engineering (4 years)", "Optional: M.Tech for specialization (2 years)"]'::jsonb,
    '["JEE Main & Advanced", "State CET exams", "KCET", "BITSAT", "VITEEE", "University-specific exams"]'::jsonb,
    '{"9th-10th": "Focus on strong foundation in Math and Science. Develop spatial reasoning through geometry.", "11th-12th": "Choose PCM (Physics, Chemistry, Math). Maintain 75%+ for JEE eligibility."}'::jsonb,
    '["Physics", "Chemistry", "Mathematics"]'::jsonb,
    '["Computer Science", "Engineering Drawing"]'::jsonb
  ) RETURNING id INTO civil_engineer_id;

  -- Civil Engineer: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (civil_engineer_id, physics_id, 'yes'),
    (civil_engineer_id, chemistry_id, 'yes'),
    (civil_engineer_id, mathematics_id, 'yes'),
    (civil_engineer_id, computer_science_id, 'no'),
    (civil_engineer_id, engineering_drawing_id, 'no');

  -- Civil Engineer: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (civil_engineer_id, math_analysis_id),
    (civil_engineer_id, problem_solving_id),
    (civil_engineer_id, project_mgmt_id),
    (civil_engineer_id, technical_drawing_id),
    (civil_engineer_id, communication_id),
    (civil_engineer_id, attention_detail_id);

  -- Civil Engineer: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (civil_engineer_id, 'STEM'),
    (civil_engineer_id, 'Engineering'),
    (civil_engineer_id, 'Infrastructure'),
    (civil_engineer_id, 'Construction');

  -- Civil Engineer: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (civil_engineer_id, 'Structural Engineer'),
    (civil_engineer_id, 'Transportation Engineer'),
    (civil_engineer_id, 'Environmental Engineer'),
    (civil_engineer_id, 'Construction Manager'),
    (civil_engineer_id, 'Urban Planner'),
    (civil_engineer_id, 'Water Resources Engineer');


  -- ================================================================
  -- CAREER 2: SOFTWARE DEVELOPER
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Software Developer',
    'Software developers design, build, and maintain software applications and systems. You''ll write code, solve technical problems, and create digital solutions that power websites, mobile apps, and enterprise systems.',
    'High demand and excellent salary prospects | Remote work opportunities | Continuous learning and innovation | Gateway to technology leadership roles',
    'SCITECH',
    science_stream_id,
    it_cluster_id,
    -- New fields:
    'software-developer',
    'STEM',
    'Build apps and software that millions use daily. Perfect for logical thinkers who enjoy coding, problem-solving, and creating digital solutions.',
    '₹4-8 Lakhs',
    '₹8-15 Lakhs',
    '₹15+ Lakhs',
    'Extremely high demand across all industries. Bangalore being the IT capital of India offers countless opportunities.',
    'Science (PCM) or Commerce with Math',
    'Rahul took PCM with Computer Science, pursued B.Tech in CSE, learned web development through projects, and now works as a full-stack developer at a tech company.',
    '["Complete 12th with Mathematics", "Pursue B.Tech/BCA in Computer Science (3-4 years)", "Optional: Master''s degree for specialization"]'::jsonb,
    '["JEE Main for B.Tech", "KCET", "Various university entrance exams", "Direct admission based on 12th marks", "Coding bootcamp assessments", "Online certification programs"]'::jsonb,
    '{"9th-10th": "Start learning basic programming. Focus on logical thinking and mathematics.", "11th-12th": "Choose PCM or Commerce with Computer Science. Practice coding regularly."}'::jsonb,
    '["Mathematics", "Computer Science"]'::jsonb,
    '["Physics", "Statistics", "English"]'::jsonb
  ) RETURNING id INTO software_developer_id;

  -- Software Developer: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (software_developer_id, mathematics_id, 'yes'),
    (software_developer_id, computer_science_id, 'yes'),
    (software_developer_id, physics_id, 'no'),
    (software_developer_id, statistics_id, 'no'),
    (software_developer_id, english_id, 'no');

  -- Software Developer: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (software_developer_id, programming_id),
    (software_developer_id, problem_solving_id),
    (software_developer_id, critical_thinking_id),
    (software_developer_id, communication_id),
    (software_developer_id, team_mgmt_id),
    (software_developer_id, adaptability_id);

  -- Software Developer: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (software_developer_id, 'STEM'),
    (software_developer_id, 'Technology'),
    (software_developer_id, 'Programming'),
    (software_developer_id, 'IT'),
    (software_developer_id, 'Software Engineering');

  -- Software Developer: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (software_developer_id, 'Full Stack Developer'),
    (software_developer_id, 'Frontend Developer'),
    (software_developer_id, 'Backend Developer'),
    (software_developer_id, 'Mobile App Developer'),
    (software_developer_id, 'DevOps Engineer'),
    (software_developer_id, 'Software Architect');


  -- ================================================================
  -- CAREER 3: DATA SCIENTIST
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Data Scientist',
    'Data scientists extract insights from complex data to solve business problems and drive decision-making. You''ll work with cutting-edge technology to uncover patterns, predict trends, and create data-driven solutions that impact millions of users.',
    'One of the fastest-growing careers globally | High earning potential and job security | Work across diverse industries | Combine math, programming, and business impact',
    'SCITECH',
    science_stream_id,
    it_cluster_id,
    -- New fields:
    'data-scientist',
    'STEM',
    'Turn data into insights that drive business decisions. Perfect for students who love math, coding, and solving complex problems.',
    '₹6-12 Lakhs',
    '₹15-25 Lakhs',
    '₹25+ Lakhs',
    'Extremely high demand across all sectors. Every company needs data scientists to make sense of their data and gain competitive advantages in the digital economy.',
    'Science (PCM) or Commerce with Math',
    'Karthik took PCM with Computer Science, pursued B.Tech in CSE, learned Python and machine learning through online courses, and now works as a data scientist at a fintech startup.',
    '["Complete 12th with Mathematics/Statistics", "Pursue B.Tech/BSc in Computer Science, Statistics, or Math", "Learn programming languages (Python, R, SQL)", "Build portfolio projects and gain experience"]'::jsonb,
    '["JEE Main for Engineering colleges", "Various university entrance exams", "Direct admission based on 12th marks", "Online certification programs", "Bootcamp programs"]'::jsonb,
    '{"9th-10th": "Build strong mathematical foundation. Start learning basic programming concepts.", "11th-12th": "Choose PCM or Commerce with Math. Focus on Statistics and Computer Science."}'::jsonb,
    '["Mathematics", "Statistics", "Computer Science"]'::jsonb,
    '["Physics", "Economics", "Business Studies"]'::jsonb
  ) RETURNING id INTO data_scientist_id;

  -- Data Scientist: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (data_scientist_id, mathematics_id, 'yes'),
    (data_scientist_id, statistics_id, 'yes'),
    (data_scientist_id, computer_science_id, 'yes'),
    (data_scientist_id, physics_id, 'no'),
    (data_scientist_id, economics_id, 'no');

  -- Data Scientist: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (data_scientist_id, programming_id),
    (data_scientist_id, statistical_analysis_id),
    (data_scientist_id, machine_learning_id),
    (data_scientist_id, data_viz_id),
    (data_scientist_id, critical_thinking_id),
    (data_scientist_id, business_acumen_id);

  -- Data Scientist: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (data_scientist_id, 'STEM'),
    (data_scientist_id, 'Technology'),
    (data_scientist_id, 'Analytics'),
    (data_scientist_id, 'AI/ML'),
    (data_scientist_id, 'Big Data');

  -- Data Scientist: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (data_scientist_id, 'Data Analyst'),
    (data_scientist_id, 'Machine Learning Engineer'),
    (data_scientist_id, 'Business Intelligence Analyst'),
    (data_scientist_id, 'Research Scientist'),
    (data_scientist_id, 'AI/ML Consultant'),
    (data_scientist_id, 'Product Data Scientist');


  -- ================================================================
  -- CAREER 4: MECHANICAL ENGINEER
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Mechanical Engineer',
    'Mechanical engineers design, build, and maintain machines, engines, and mechanical systems. You''ll work on everything from automotive components to manufacturing equipment, applying principles of physics and materials science to solve real-world problems.',
    'Versatile engineering discipline | Strong job market across industries | Hands-on problem solving | Foundation for many specializations',
    'SCITECH',
    science_stream_id,
    stem_cluster_id,
    -- Extended fields:
    'mechanical-engineer',
    'STEM',
    'Design machines, engines, and mechanical systems that power industries. Perfect for students who love physics, problem-solving, and hands-on work.',
    '₹3-5 Lakhs',
    '₹6-12 Lakhs',
    '₹12+ Lakhs',
    'Strong demand in automotive, aerospace, and manufacturing sectors. Bangalore''s industrial base provides excellent opportunities.',
    'Science (PCM)',
    'Suresh took PCM in 11–12, cleared JEE Main, completed B.Tech in Mechanical Engineering, and now works in automotive design at a leading car manufacturer.',
    '["Complete 12th with Physics, Chemistry, Mathematics", "Clear JEE Main for engineering admission", "Pursue B.Tech in Mechanical Engineering (4 years)", "Optional: M.Tech for specialization"]'::jsonb,
    '["JEE Main & Advanced", "State CET exams", "BITSAT", "VITEEE", "University-specific exams"]'::jsonb,
    '{"9th-10th": "Build strong foundation in Physics and Mathematics. Understand basic mechanics.", "11th-12th": "Choose PCM stream. Maintain 75%+ for JEE eligibility."}'::jsonb,
    '["Physics", "Chemistry", "Mathematics"]'::jsonb,
    '["Computer Science", "Engineering Drawing"]'::jsonb
  ) RETURNING id INTO mechanical_engineer_id;

  -- Mechanical Engineer: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (mechanical_engineer_id, physics_id, 'yes'),
    (mechanical_engineer_id, chemistry_id, 'yes'),
    (mechanical_engineer_id, mathematics_id, 'yes'),
    (mechanical_engineer_id, computer_science_id, 'no'),
    (mechanical_engineer_id, engineering_drawing_id, 'no');

  -- Mechanical Engineer: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (mechanical_engineer_id, technical_drawing_id),
    (mechanical_engineer_id, problem_solving_id),
    (mechanical_engineer_id, analytical_thinking_id),
    (mechanical_engineer_id, project_mgmt_id),
    (mechanical_engineer_id, attention_detail_id);

  -- Mechanical Engineer: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (mechanical_engineer_id, 'STEM'),
    (mechanical_engineer_id, 'Engineering'),
    (mechanical_engineer_id, 'Manufacturing'),
    (mechanical_engineer_id, 'Automotive');

  -- Mechanical Engineer: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (mechanical_engineer_id, 'Design Engineer'),
    (mechanical_engineer_id, 'Manufacturing Engineer'),
    (mechanical_engineer_id, 'Automotive Engineer'),
    (mechanical_engineer_id, 'HVAC Engineer'),
    (mechanical_engineer_id, 'Quality Control Engineer'),
    (mechanical_engineer_id, 'Production Manager');


  -- ================================================================
  -- CAREER 5: ARCHITECT
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Architect',
    'Architects design buildings and spaces that are functional, safe, and aesthetically pleasing. You''ll combine creativity with technical knowledge to create structures that meet client needs while considering environmental and social factors.',
    'Blend creativity with technical expertise | Leave lasting impact on built environment | Work on diverse project types | Growing sustainable design opportunities',
    'SCITECH',
    science_stream_id,
    stem_cluster_id,
    -- Extended fields:
    'architect',
    'STEM',
    'Design beautiful, functional buildings that shape communities. Perfect for creative students with technical aptitude and spatial thinking.',
    '₹3-5 Lakhs',
    '₹6-12 Lakhs',
    '₹12+ Lakhs',
    'Strong demand due to urbanization and infrastructure development. Bangalore''s growing real estate sector offers numerous opportunities.',
    'Science (PCM) or Arts with Math',
    'Rohan chose PCM in 11–12, cleared NATA exam, completed B.Arch in 5 years, and now designs sustainable residential projects.',
    '["Complete 12th with Mathematics", "Clear NATA (National Aptitude Test in Architecture)", "Pursue B.Arch (Bachelor of Architecture) - 5 years", "Register with Council of Architecture"]'::jsonb,
    '["NATA (National Aptitude Test)", "JEE Main Paper 2 (B.Arch)", "State architecture entrance exams", "College-specific design tests", "Portfolio-based admissions"]'::jsonb,
    '{"9th-10th": "Develop spatial reasoning and drawing skills. Understand basic geometry.", "11th-12th": "Choose PCM or Arts with Mathematics. Build a portfolio for design entrance exams."}'::jsonb,
    '["Mathematics", "Physics"]'::jsonb,
    '["Art", "Computer Science", "Environmental Science"]'::jsonb
  ) RETURNING id INTO architect_id;

  -- Architect: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (architect_id, mathematics_id, 'yes'),
    (architect_id, physics_id, 'yes'),
    (architect_id, art_id, 'no'),
    (architect_id, computer_science_id, 'no'),
    (architect_id, engineering_drawing_id, 'no');

  -- Architect: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (architect_id, technical_drawing_id),
    (architect_id, creative_problem_solving_id),
    (architect_id, project_mgmt_id),
    (architect_id, communication_id),
    (architect_id, attention_detail_id);

  -- Architect: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (architect_id, 'STEM'),
    (architect_id, 'Design'),
    (architect_id, 'Architecture'),
    (architect_id, 'Construction');

  -- Architect: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (architect_id, 'Design Architect'),
    (architect_id, 'Project Architect'),
    (architect_id, 'Landscape Architect'),
    (architect_id, 'Interior Architect'),
    (architect_id, 'Urban Planner'),
    (architect_id, 'Architectural Consultant');


  -- ================================================================
  -- CAREER 6: DOCTOR
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Doctor',
    'Doctors diagnose, treat, and prevent diseases to improve patients'' health and well-being. You''ll work directly with patients, make life-saving decisions, and contribute to medical research and healthcare advancement.',
    'Save lives and improve health outcomes | Highly respected profession | Excellent earning potential | Opportunities for specialization',
    'MEDIC',
    science_stream_id,
    health_cluster_id,
    -- Extended fields:
    'doctor',
    'Helping',
    'Diagnose, treat, and save lives as a medical professional. Ideal for dedicated students with strong science skills and compassion for others.',
    '₹6-10 Lakhs',
    '₹10-20 Lakhs',
    '₹20+ Lakhs',
    'High demand across all healthcare sectors. Growing healthcare infrastructure in Bangalore provides excellent opportunities.',
    'Science (PCB)',
    'Meera took PCB in 11–12, scored 650+ in NEET, completed MBBS in 5.5 years, and now works as a pediatrician at a children''s hospital.',
    '["Complete 12th with Physics, Chemistry, Biology", "Clear NEET examination", "Pursue MBBS (5.5 years including internship)", "Optional: MD/MS for specialization (3 years)"]'::jsonb,
    '["NEET (National Eligibility Test)", "AIIMS entrance (now merged with NEET)", "State medical entrance exams", "NEET PG for specialization", "Various fellowship entrance exams"]'::jsonb,
    '{"9th-10th": "Focus on Biology and Chemistry. Develop strong study habits and dedication.", "11th-12th": "Choose PCB stream. Maintain 90%+ for NEET qualification."}'::jsonb,
    '["Physics", "Chemistry", "Biology"]'::jsonb,
    '["Mathematics", "English"]'::jsonb
  ) RETURNING id INTO doctor_id;

  -- Doctor: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (doctor_id, physics_id, 'yes'),
    (doctor_id, chemistry_id, 'yes'),
    (doctor_id, biology_id, 'yes'),
    (doctor_id, mathematics_id, 'no'),
    (doctor_id, english_id, 'no');

  -- Doctor: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (doctor_id, medical_knowledge_id),
    (doctor_id, decision_making_id),
    (doctor_id, communication_id),
    (doctor_id, empathy_id),
    (doctor_id, patient_care_id),
    (doctor_id, critical_thinking_id);

  -- Doctor: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (doctor_id, 'Healthcare'),
    (doctor_id, 'Medical'),
    (doctor_id, 'MBBS'),
    (doctor_id, 'Lifesaving');

  -- Doctor: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (doctor_id, 'General Physician'),
    (doctor_id, 'Specialist Doctor'),
    (doctor_id, 'Surgeon'),
    (doctor_id, 'Emergency Medicine Doctor'),
    (doctor_id, 'Pediatrician'),
    (doctor_id, 'Medical Researcher');


  -- ================================================================
  -- CAREER 7: NURSE
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Nurse',
    'Nurses provide direct patient care, educate patients and families about health conditions, and assist healthcare teams. You''ll work in hospitals, clinics, or community settings, making a difference in people''s health and well-being.',
    'High job security and constant demand | Meaningful work helping patients heal | Diverse specialization opportunities | Growing field with good career prospects',
    'MEDIC',
    science_stream_id,
    health_cluster_id,
    -- Extended fields:
    'nurse',
    'Helping',
    'Provide compassionate patient care and support healthcare teams. Perfect for caring students with strong science background and empathy.',
    '₹2.5-4 Lakhs',
    '₹4-7 Lakhs',
    '₹7+ Lakhs',
    'Very high demand in healthcare sector. Aging population and expanding healthcare services create excellent job opportunities.',
    'Science (PCB)',
    'Lakshmi took PCB in 11–12, pursued B.Sc Nursing, completed her internship, and now works as an ICU nurse at a multi-specialty hospital.',
    '["Complete 12th with Physics, Chemistry, Biology", "Pursue B.Sc Nursing (4 years) or GNM (3.5 years)", "Complete internship and registration", "Optional: M.Sc Nursing for specialization"]'::jsonb,
    '["NEET (for some colleges)", "State nursing entrance exams", "AIIMS Nursing Entrance", "JIPMER Nursing", "College-specific entrance tests"]'::jsonb,
    '{"9th-10th": "Focus on Biology and Chemistry. Develop compassion and communication skills.", "11th-12th": "Choose PCB (Physics, Chemistry, Biology). Maintain 50%+ for nursing college eligibility."}'::jsonb,
    '["Biology", "Chemistry", "Physics"]'::jsonb,
    '["Psychology", "English", "Computer Science"]'::jsonb
  ) RETURNING id INTO nurse_id;

  -- Nurse: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (nurse_id, biology_id, 'yes'),
    (nurse_id, chemistry_id, 'yes'),
    (nurse_id, physics_id, 'yes'),
    (nurse_id, psychology_id, 'no'),
    (nurse_id, english_id, 'no');

  -- Nurse: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (nurse_id, patient_care_id),
    (nurse_id, medical_knowledge_id),
    (nurse_id, communication_id),
    (nurse_id, empathy_id),
    (nurse_id, critical_thinking_id),
    (nurse_id, attention_detail_id);

  -- Nurse: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (nurse_id, 'Healthcare'),
    (nurse_id, 'Medical'),
    (nurse_id, 'Patient Care'),
    (nurse_id, 'Nursing');

  -- Nurse: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (nurse_id, 'Staff Nurse'),
    (nurse_id, 'ICU Nurse'),
    (nurse_id, 'Pediatric Nurse'),
    (nurse_id, 'Community Health Nurse'),
    (nurse_id, 'Nursing Supervisor'),
    (nurse_id, 'Nurse Educator');


  -- ================================================================
  -- CAREER 8: PHYSIOTHERAPIST
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Physiotherapist',
    'Physiotherapists help patients recover from injuries, manage chronic conditions, and improve physical function. You''ll use exercise, manual therapy, and rehabilitation techniques to restore mobility and quality of life.',
    'Direct patient interaction and impact | Growing demand in healthcare | Flexible work settings available | Rewarding rehabilitation work',
    'MEDIC',
    science_stream_id,
    health_cluster_id,
    -- Extended fields:
    'physiotherapist',
    'Helping',
    'Help patients recover mobility and live pain-free. Perfect for students with empathy, physical awareness, and interest in rehabilitation.',
    '₹2.5-4 Lakhs',
    '₹4-8 Lakhs',
    '₹8+ Lakhs',
    'Growing demand due to aging population and sports injuries. Rehabilitation centers and wellness clinics offer opportunities.',
    'Science (PCB)',
    'Deepak took PCB in 11–12, pursued BPT (Bachelor of Physiotherapy), completed internship, and now works as a sports physiotherapist with a cricket team.',
    '["Complete 12th with Physics, Chemistry, Biology", "Pursue BPT (Bachelor of Physiotherapy) - 4.5 years", "Complete 6-month internship", "Optional: MPT for specialization"]'::jsonb,
    '["NEET (for some colleges)", "State physiotherapy entrance exams", "AIIMS physiotherapy entrance", "College-specific entrance tests", "State CET exams"]'::jsonb,
    '{"9th-10th": "Focus on Biology and develop physical fitness. Learn about human anatomy.", "11th-12th": "Choose PCB stream. Physical education as additional subject is beneficial."}'::jsonb,
    '["Biology", "Chemistry", "Physics"]'::jsonb,
    '["Physical Education", "Psychology"]'::jsonb
  ) RETURNING id INTO physiotherapist_id;

  -- Physiotherapist: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (physiotherapist_id, biology_id, 'yes'),
    (physiotherapist_id, chemistry_id, 'yes'),
    (physiotherapist_id, physics_id, 'yes'),
    (physiotherapist_id, psychology_id, 'no');

  -- Physiotherapist: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (physiotherapist_id, patient_care_id),
    (physiotherapist_id, communication_id),
    (physiotherapist_id, empathy_id),
    (physiotherapist_id, attention_detail_id),
    (physiotherapist_id, problem_solving_id);

  -- Physiotherapist: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (physiotherapist_id, 'Healthcare'),
    (physiotherapist_id, 'Rehabilitation'),
    (physiotherapist_id, 'Physical Therapy'),
    (physiotherapist_id, 'Sports Medicine');

  -- Physiotherapist: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (physiotherapist_id, 'Clinical Physiotherapist'),
    (physiotherapist_id, 'Sports Physiotherapist'),
    (physiotherapist_id, 'Pediatric Physiotherapist'),
    (physiotherapist_id, 'Neurological Physiotherapist'),
    (physiotherapist_id, 'Orthopedic Physiotherapist');


  -- ================================================================
  -- CAREER 9: MARKETING SPECIALIST
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Marketing Specialist',
    'Marketing specialists develop and execute strategies to promote products, services, and brands. You''ll analyze market trends, understand consumer behavior, and create campaigns that drive business growth and build brand awareness.',
    'Dynamic and ever-changing field | High growth potential in digital era | Creative and analytical work combined | Strong networking opportunities',
    'BUSINESS',
    commerce_stream_id,
    business_cluster_id,
    -- Extended fields:
    'marketing-specialist',
    'Business',
    'Combine creativity with business strategy to help brands grow. Ideal for students who enjoy communication, analysis, and innovation.',
    '₹3-5 Lakhs',
    '₹6-12 Lakhs',
    '₹12+ Lakhs',
    'Marketing professionals are in high demand as every business goes digital. The global digital marketing industry is expected to grow over 10% annually, creating new roles for skilled professionals.',
    'Commerce / Arts',
    'Riya took Commerce in 11–12, completed BBA in Marketing, learned Google Ads through an online course, and now manages social media for a startup.',
    '["Complete 12th with Commerce or Arts stream", "Pursue BBA or BCom in Marketing (3 years)", "Gain certifications in Digital Marketing", "Optional: MBA in Marketing (2 years)"]'::jsonb,
    '["CUET for central universities", "State CET exams", "CAT/MAT for MBA", "College-specific entrance tests", "Digital marketing certifications"]'::jsonb,
    '{"9th-10th": "Develop communication skills and understand basic business concepts.", "11th-12th": "Choose Commerce with Business Studies. Focus on Economics and English."}'::jsonb,
    '["Business Studies", "Economics", "English"]'::jsonb,
    '["Psychology", "Computer Science", "Mathematics"]'::jsonb
  ) RETURNING id INTO marketing_specialist_id;

  -- Marketing Specialist: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (marketing_specialist_id, business_studies_id, 'yes'),
    (marketing_specialist_id, economics_id, 'yes'),
    (marketing_specialist_id, english_id, 'yes'),
    (marketing_specialist_id, psychology_id, 'no'),
    (marketing_specialist_id, computer_science_id, 'no');

  -- Marketing Specialist: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (marketing_specialist_id, digital_marketing_id),
    (marketing_specialist_id, analytical_thinking_id),
    (marketing_specialist_id, content_creation_id),
    (marketing_specialist_id, social_media_id),
    (marketing_specialist_id, communication_id),
    (marketing_specialist_id, strategic_thinking_id);

  -- Marketing Specialist: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (marketing_specialist_id, 'Business'),
    (marketing_specialist_id, 'Marketing'),
    (marketing_specialist_id, 'Digital Marketing'),
    (marketing_specialist_id, 'Branding');

  -- Marketing Specialist: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (marketing_specialist_id, 'Digital Marketing Manager'),
    (marketing_specialist_id, 'Brand Manager'),
    (marketing_specialist_id, 'Social Media Manager'),
    (marketing_specialist_id, 'Marketing Analyst'),
    (marketing_specialist_id, 'Content Marketing Specialist'),
    (marketing_specialist_id, 'SEO/SEM Specialist');


  -- ================================================================
  -- CAREER 10: ACCOUNTANT
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Accountant',
    'Accountants maintain financial records, ensure compliance with regulations, and provide financial insights to businesses. You''ll be essential in helping organizations make informed financial decisions and maintain transparency.',
    'High demand across all industries | Clear career progression path | Option to start own practice | Recession-proof profession',
    'BUSINESS',
    commerce_stream_id,
    business_cluster_id,
    -- Extended fields:
    'accountant',
    'Business',
    'Manage financial records and ensure business compliance. Great for detail-oriented students with strong mathematical and analytical skills.',
    '₹2.5-4 Lakhs',
    '₹5-10 Lakhs',
    '₹12+ Lakhs',
    'Consistent demand across all sectors. Growing need for compliance and financial transparency creates stable opportunities.',
    'Commerce',
    'Neha took Commerce with Accountancy in 11–12, pursued BCom, cleared CA Foundation, and now works as an audit associate at a Big 4 firm.',
    '["Complete 12th with Commerce (Accountancy)", "Pursue B.Com in Accounting/Finance", "Optional: Professional courses (CA, CMA, CS)", "Gain practical experience through internships"]'::jsonb,
    '["CA Foundation (for Chartered Accountancy)", "CMA Foundation (Cost Management)", "CS Foundation (Company Secretary)", "University entrance exams"]'::jsonb,
    '{"9th-10th": "Build strong foundation in Mathematics. Develop attention to detail and organization skills.", "11th-12th": "Choose Commerce stream with Accountancy as main subject. Maintain good grades for professional courses."}'::jsonb,
    '["Accountancy", "Mathematics", "Economics"]'::jsonb,
    '["Business Studies", "Computer Science", "Statistics"]'::jsonb
  ) RETURNING id INTO accountant_id;

  -- Accountant: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (accountant_id, accountancy_id, 'yes'),
    (accountant_id, mathematics_id, 'yes'),
    (accountant_id, economics_id, 'yes'),
    (accountant_id, business_studies_id, 'no'),
    (accountant_id, statistics_id, 'no');

  -- Accountant: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (accountant_id, financial_analysis_id),
    (accountant_id, attention_detail_id),
    (accountant_id, analytical_thinking_id),
    (accountant_id, communication_id),
    (accountant_id, problem_solving_id);

  -- Accountant: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (accountant_id, 'Business'),
    (accountant_id, 'Finance'),
    (accountant_id, 'Accounting'),
    (accountant_id, 'Commerce');

  -- Accountant: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (accountant_id, 'Staff Accountant'),
    (accountant_id, 'Senior Accountant'),
    (accountant_id, 'Tax Consultant'),
    (accountant_id, 'Audit Associate'),
    (accountant_id, 'Financial Controller'),
    (accountant_id, 'Chief Financial Officer');


  -- ================================================================
  -- CAREER 11: LAWYER
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Lawyer',
    'Lawyers provide legal advice, represent clients in court, and help navigate complex legal systems. You''ll research laws, draft legal documents, and advocate for clients'' rights in various legal matters.',
    'Fight for justice and clients'' rights | Intellectual and challenging work | High earning potential | Prestigious career with social impact',
    'BUSINESS',
    arts_stream_id,
    business_cluster_id,
    -- Extended fields:
    'lawyer',
    'Business',
    'Fight for justice and represent clients in legal matters. Great for students with strong analytical, communication, and debate skills.',
    '₹3-6 Lakhs',
    '₹8-15 Lakhs',
    '₹15+ Lakhs',
    'Growing demand in corporate sector, especially in IT capital Bangalore. Increasing litigation and compliance requirements create opportunities.',
    'Arts/Commerce',
    'Aditya took Arts in 11–12, cleared CLAT, completed BA LLB in 5 years, and now practices corporate law at a leading firm.',
    '["Complete 12th in any stream", "Clear CLAT or other law entrance exams", "Pursue LLB (3 years) or BA LLB (5 years)", "Register with Bar Council"]'::jsonb,
    '["CLAT (Common Law Admission Test)", "LSAT India", "State law entrance exams", "University-specific law tests", "All India Law Entrance Test"]'::jsonb,
    '{"9th-10th": "Develop strong reading, writing, and debating skills. Follow current affairs.", "11th-12th": "Choose Arts or Commerce. Focus on English and analytical subjects."}'::jsonb,
    '["English", "Political Science"]'::jsonb,
    '["History", "Economics", "Psychology"]'::jsonb
  ) RETURNING id INTO lawyer_id;

  -- Lawyer: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (lawyer_id, english_id, 'yes'),
    (lawyer_id, political_science_id, 'yes'),
    (lawyer_id, economics_id, 'no'),
    (lawyer_id, psychology_id, 'no');

  -- Lawyer: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (lawyer_id, analytical_thinking_id),
    (lawyer_id, communication_id),
    (lawyer_id, research_methods_id),
    (lawyer_id, critical_thinking_id),
    (lawyer_id, attention_detail_id);

  -- Lawyer: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (lawyer_id, 'Law'),
    (lawyer_id, 'Legal'),
    (lawyer_id, 'Justice'),
    (lawyer_id, 'Advocacy');

  -- Lawyer: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (lawyer_id, 'Corporate Lawyer'),
    (lawyer_id, 'Criminal Lawyer'),
    (lawyer_id, 'Civil Rights Lawyer'),
    (lawyer_id, 'Legal Advisor'),
    (lawyer_id, 'Public Prosecutor'),
    (lawyer_id, 'Legal Consultant');


  -- ================================================================
  -- CAREER 12: GRAPHIC DESIGNER
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Graphic Designer',
    'Graphic designers create visual content that communicates messages, tells stories, and solves problems. You''ll work with typography, imagery, and color to create designs for digital media, print, branding, and marketing materials.',
    'Express creativity in your daily work | Work across diverse industries | Strong freelance opportunities | Digital revolution expanding demand',
    'CREATIVE',
    arts_stream_id,
    arts_cluster_id,
    -- Extended fields:
    'graphic-designer',
    'Creative',
    'Design visual content for brands, media, and marketing. Perfect for artistic students who love combining creativity with technology.',
    '₹2.5-4 Lakhs',
    '₹4-8 Lakhs',
    '₹8+ Lakhs',
    'High demand in digital marketing, advertising, and tech startups. Bangalore''s thriving startup ecosystem offers excellent opportunities.',
    'Any stream with Art background',
    'Priya took Arts with Computer Science in 11–12, completed B.Des in Graphic Design from NID, and now works as a senior designer at a top ad agency.',
    '["Complete 12th with Art/Design subjects", "Pursue B.Des/BFA in Graphic Design (4 years)", "Build portfolio and intern at design studios", "Optional: Specialization in UX/UI or Animation"]'::jsonb,
    '["NID DAT (National Institute of Design)", "NIFT entrance exam", "UCEED (IIT design entrance)", "CEED for M.Des", "College-specific portfolio reviews"]'::jsonb,
    '{"9th-10th": "Develop drawing and digital art skills. Learn basic design software like Canva or Adobe tools.", "11th-12th": "Take Art/Fine Arts. Build a portfolio. Learn Adobe Creative Suite basics."}'::jsonb,
    '["Art/Fine Arts", "Computer Science"]'::jsonb,
    '["English", "Business Studies", "Psychology"]'::jsonb
  ) RETURNING id INTO graphic_designer_id;

  -- Graphic Designer: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (graphic_designer_id, art_id, 'yes'),
    (graphic_designer_id, computer_science_id, 'yes'),
    (graphic_designer_id, psychology_id, 'no'),
    (graphic_designer_id, business_studies_id, 'no'),
    (graphic_designer_id, english_id, 'no');

  -- Graphic Designer: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (graphic_designer_id, adobe_suite_id),
    (graphic_designer_id, typography_id),
    (graphic_designer_id, color_theory_id),
    (graphic_designer_id, creative_problem_solving_id),
    (graphic_designer_id, communication_id);

  -- Graphic Designer: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (graphic_designer_id, 'Creative'),
    (graphic_designer_id, 'Design'),
    (graphic_designer_id, 'Arts'),
    (graphic_designer_id, 'Visual Communication');

  -- Graphic Designer: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (graphic_designer_id, 'Brand Designer'),
    (graphic_designer_id, 'UI/UX Designer'),
    (graphic_designer_id, 'Print Designer'),
    (graphic_designer_id, 'Web Designer'),
    (graphic_designer_id, 'Packaging Designer'),
    (graphic_designer_id, 'Marketing Designer');


  -- ================================================================
  -- CAREER 13: PSYCHOLOGIST
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Psychologist',
    'Psychologists study human behavior and mental processes to help people overcome challenges, improve their well-being, and reach their potential. You''ll make a meaningful impact by supporting individuals, families, and communities.',
    'Make a real difference in people''s lives | Growing field with increasing awareness | Diverse specialization opportunities | Flexible career paths available',
    'SOCIAL',
    arts_stream_id,
    human_services_cluster_id,
    -- Extended fields:
    'psychologist',
    'Helping',
    'Help people improve mental health and well-being. Ideal for empathetic students interested in understanding human behavior and making a difference.',
    '₹3-5 Lakhs',
    '₹5-10 Lakhs',
    '₹10+ Lakhs',
    'Growing demand due to increased mental health awareness. Corporate counseling, schools, and hospitals all need psychologists.',
    'Arts (with Psychology)',
    'Ananya took Arts with Psychology in 11–12, completed BA Psychology and M.Phil, and now works as a clinical psychologist at a wellness center.',
    '["Complete 12th with Psychology", "Pursue BA Psychology (3 years)", "Complete MA in Psychology (2 years)", "Obtain M.Phil/Ph.D for clinical practice (2-3 years)", "Register with RCI (Rehabilitation Council of India)"]'::jsonb,
    '["University entrance exams", "DU JAT (Delhi University)", "BHU UET (Banaras Hindu University)", "CUET for central universities", "State university entrance tests"]'::jsonb,
    '{"9th-10th": "Develop interest in human behavior and mental health. Read books on psychology. Build empathy and listening skills.", "11th-12th": "Take Arts with Psychology as main subject. Maintain good grades for university admissions."}'::jsonb,
    '["Psychology", "English"]'::jsonb,
    '["Biology", "Sociology", "Statistics"]'::jsonb
  ) RETURNING id INTO psychologist_id;

  -- Psychologist: Subjects
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (psychologist_id, psychology_id, 'yes'),
    (psychologist_id, english_id, 'yes'),
    (psychologist_id, biology_id, 'no'),
    (psychologist_id, statistics_id, 'no');

  -- Psychologist: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (psychologist_id, active_listening_id),
    (psychologist_id, empathy_id),
    (psychologist_id, analytical_thinking_id),
    (psychologist_id, communication_id),
    (psychologist_id, research_methods_id);

  -- Psychologist: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (psychologist_id, 'Healthcare'),
    (psychologist_id, 'Mental Health'),
    (psychologist_id, 'Counseling'),
    (psychologist_id, 'Social Science');

  -- Psychologist: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (psychologist_id, 'Clinical Psychologist'),
    (psychologist_id, 'Counseling Psychologist'),
    (psychologist_id, 'School Psychologist'),
    (psychologist_id, 'Research Psychologist'),
    (psychologist_id, 'Industrial Psychologist'),
    (psychologist_id, 'Forensic Psychologist');


  -- ================================================================
  -- CAREER 14: TEACHER
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Teacher',
    'Teachers educate and inspire students across various subjects and age groups. You''ll plan lessons, assess student progress, and play a crucial role in shaping the next generation''s knowledge, skills, and character development.',
    'Make a lasting impact on students'' lives | Job security and stable career | Opportunities for continuous learning | Respected profession in society',
    'SOCIAL',
    arts_stream_id,
    human_services_cluster_id,
    -- Extended fields:
    'teacher',
    'Public Service',
    'Shape future generations by teaching and mentoring students. Perfect for patient, communicative individuals passionate about education and child development.',
    '₹3-5 Lakhs',
    '₹5-8 Lakhs',
    '₹8+ Lakhs',
    'Consistent demand in schools and educational institutions. Government teaching positions offer excellent job security and benefits.',
    'Any stream (Arts, Science, Commerce)',
    'Kavya completed 12th in Science, pursued B.Ed after graduation, cleared CTET exam, and now teaches mathematics at a CBSE school.',
    '["Complete 12th in any stream", "Pursue graduation (BA/BSc/BCom) in subject of interest (3 years)", "Complete B.Ed (Bachelor of Education) - 2 years", "Clear CTET/State TET for teaching certification", "Optional: M.Ed for career advancement"]'::jsonb,
    '["CTET (Central Teacher Eligibility Test)", "State TETs", "B.Ed entrance exams", "NTPC for KVS/NVS", "DSSSB for Delhi government schools"]'::jsonb,
    '{"9th-10th": "Develop communication and presentation skills. Excel in your favorite subjects. Consider student leadership roles.", "11th-12th": "Choose stream based on subject you want to teach. Maintain good academic record for graduation admissions."}'::jsonb,
    '["English", "Subject specialization (Math/Science/Social Studies)"]'::jsonb,
    '["Psychology", "Education Theory", "Computer Science"]'::jsonb
  ) RETURNING id INTO teacher_id;

  -- Teacher: Subjects (any stream works for teaching)
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (teacher_id, english_id, 'yes'),
    (teacher_id, psychology_id, 'no'),
    (teacher_id, computer_science_id, 'no');

  -- Teacher: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (teacher_id, communication_id),
    (teacher_id, empathy_id),
    (teacher_id, leadership_id),
    (teacher_id, adaptability_id),
    (teacher_id, problem_solving_id);

  -- Teacher: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (teacher_id, 'Education'),
    (teacher_id, 'Teaching'),
    (teacher_id, 'Social Impact'),
    (teacher_id, 'Student Development');

  -- Teacher: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (teacher_id, 'Primary School Teacher'),
    (teacher_id, 'Secondary School Teacher'),
    (teacher_id, 'Subject Specialist'),
    (teacher_id, 'Special Education Teacher'),
    (teacher_id, 'Curriculum Developer'),
    (teacher_id, 'Educational Coordinator');


  -- ================================================================
  -- CAREER 15: ENTREPRENEUR
  -- ================================================================
  INSERT INTO public.career_path (
    name, description, highlights, type, career_stream_id, career_cluster_id,
    slug, category, snapshot,
    salary_starting, salary_experienced, salary_senior,
    industry_demand, recommended_stream, student_path_example,
    education_pathway, entrance_exams_list, grade_wise_advice,
    essential_subjects, optional_subjects
  )
  VALUES (
    'Entrepreneur',
    'Entrepreneurs start and manage their own businesses, identifying opportunities and taking calculated risks to create value. You''ll innovate, lead teams, and build ventures that can transform industries and create employment.',
    'Be your own boss and build from scratch | Unlimited earning potential | Create jobs and contribute to economy | Personal and professional growth opportunities',
    'BUSINESS',
    commerce_stream_id,
    business_cluster_id,
    -- Extended fields:
    'entrepreneur',
    'Business',
    'Start and grow your own business ventures. Ideal for risk-takers with innovative ideas, leadership skills, and business acumen.',
    '₹0-5 Lakhs (Variable)',
    '₹5-15 Lakhs',
    '₹15+ Lakhs (Unlimited potential)',
    'Bangalore startup ecosystem thriving with incubators, investors, and support systems. Government schemes encourage entrepreneurship.',
    'Commerce/Any stream with Business Studies',
    'Arjun studied Commerce in 11–12, completed BBA and MBA, worked in a startup for 2 years, then founded his own e-commerce platform which raised seed funding.',
    '["Complete 12th (any stream, Commerce preferred)", "Pursue BBA/B.Tech/Any degree (3-4 years)", "Optional: MBA for business skills (2 years)", "Gain industry experience (1-3 years)", "Start venture or join startup incubator"]'::jsonb,
    '["CAT for MBA programs", "University entrance exams", "Incubator selection programs", "No specific entrance exam required", "Focus on building skills and network"]'::jsonb,
    '{"9th-10th": "Develop problem-solving and leadership skills. Read business books. Start small projects like school events or online sales.", "11th-12th": "Take Commerce with Business Studies. Learn about business models. Consider internships or part-time work to understand business operations."}'::jsonb,
    '["Business Studies", "Economics"]'::jsonb,
    '["Mathematics", "Computer Science", "Psychology", "Communication"]'::jsonb
  ) RETURNING id INTO entrepreneur_id;

  -- Entrepreneur: Subjects (any stream can work)
  INSERT INTO public.careerpath_subjects (careerpath_id, subject_id, is_mandatory) VALUES
    (entrepreneur_id, business_studies_id, 'yes'),
    (entrepreneur_id, economics_id, 'yes'),
    (entrepreneur_id, mathematics_id, 'no'),
    (entrepreneur_id, computer_science_id, 'no'),
    (entrepreneur_id, psychology_id, 'no');

  -- Entrepreneur: Skills
  INSERT INTO public.careerpath_skills (careerpath_id, skill_id) VALUES
    (entrepreneur_id, leadership_id),
    (entrepreneur_id, strategic_thinking_id),
    (entrepreneur_id, business_acumen_id),
    (entrepreneur_id, financial_analysis_id),
    (entrepreneur_id, adaptability_id),
    (entrepreneur_id, communication_id);

  -- Entrepreneur: Tags
  INSERT INTO public.careerpath_tags (careerpath_id, tag) VALUES
    (entrepreneur_id, 'Business'),
    (entrepreneur_id, 'Startup'),
    (entrepreneur_id, 'Innovation'),
    (entrepreneur_id, 'Leadership');

  -- Entrepreneur: Job Opportunities
  INSERT INTO public.career_options (careerpath_id, job_title) VALUES
    (entrepreneur_id, 'Startup Founder'),
    (entrepreneur_id, 'Business Owner'),
    (entrepreneur_id, 'Innovation Manager'),
    (entrepreneur_id, 'Venture Capitalist'),
    (entrepreneur_id, 'Business Consultant'),
    (entrepreneur_id, 'Social Entrepreneur');

END $$;


-- ================================================================
-- PART 7: COLLEGES (Educational Institutions)
-- ================================================================

INSERT INTO public.college (name, description, address, city, state, zip_code, website, email, phone, scholarshipDetails, rating, type) VALUES
(
  'Indian Institute of Technology Delhi',
  'Premier engineering institution established in 1961. Known for cutting-edge research and innovation. Consistently ranked among top engineering colleges in India. Strong industry connections and placement record.',
  'Hauz Khas',
  'New Delhi',
  'Delhi',
  '110016',
  'https://home.iitd.ac.in',
  'info@iitd.ac.in',
  '+911126591999',
  'Merit-based scholarships for top performers. Need-based financial aid available. SC/ST/OBC fee waivers. Research assistantships for postgraduate students.',
  4.8,
  'govt'
),
(
  'National Institute of Technology Karnataka',
  'Autonomous engineering institute under Ministry of Education. Strong focus on research and development. Excellent infrastructure and faculty. Active industry collaboration programs.',
  'NIT Campus, Srinivasnagar, Surathkal',
  'Mangalore',
  'Karnataka',
  '575025',
  'https://www.nitk.ac.in',
  'info@nitk.edu.in',
  '+918242474000',
  'Merit scholarships for top rankers. Fee concession for economically weaker sections. Special scholarships for girl students. Alumni endowment scholarships.',
  4.6,
  'govt'
),
(
  'All India Institute of Medical Sciences Delhi',
  'Apex medical institution of India. World-class medical education and research. Premier healthcare facility. Produces top medical professionals.',
  'Ansari Nagar',
  'New Delhi',
  'Delhi',
  '110029',
  'https://www.aiims.edu',
  'deanacad@aiims.ac.in',
  '+911126588500',
  'Full tuition fee waiver for MBBS students. Stipend for postgraduate students. Research grants available. Merit-based scholarships.',
  4.9,
  'govt'
),
(
  'Indian Institute of Management Bangalore',
  'Premier business school in India. Known for rigorous MBA program. Strong alumni network globally. Excellent corporate partnerships.',
  'Bannerghatta Road',
  'Bangalore',
  'Karnataka',
  '560076',
  'https://www.iimb.ac.in',
  'admissions@iimb.ac.in',
  '+918026993000',
  'Need-based financial aid up to 100% tuition. Education loans facilitated. Merit scholarships for top performers. Diversity scholarships available.',
  4.7,
  'govt'
),
(
  'National Law School of India University',
  'India''s first national law school. Autonomous law university. Excellent moot court facilities. Strong emphasis on practical training.',
  'Nagarbhavi',
  'Bangalore',
  'Karnataka',
  '560242',
  'https://www.nls.ac.in',
  'registrar@nls.ac.in',
  '+918023160532',
  'Fee waivers for economically disadvantaged. Merit scholarships for academic excellence. Special assistance for students from rural areas. Book grants and laptop assistance.',
  4.7,
  'govt'
),
(
  'National Institute of Design Ahmedabad',
  'Premier design institution in India. Focus on industrial and communication design. State-of-the-art design studios. Strong industry linkages.',
  'Paldi',
  'Ahmedabad',
  'Gujarat',
  '380007',
  'https://www.nid.edu',
  'info@nid.edu',
  '+917926629692',
  'Fee concession for SC/ST/OBC students. Need-based financial assistance. Merit scholarships. Material cost support for projects.',
  4.5,
  'govt'
),
(
  'Manipal Academy of Higher Education',
  'Leading private university in India. Multi-disciplinary educational institution. International collaborations and exchanges. Modern campus facilities.',
  'Madhav Nagar',
  'Manipal',
  'Karnataka',
  '576104',
  'https://www.manipal.edu',
  'info@manipal.edu',
  '+918202922101',
  'Merit-based scholarships up to 100% tuition. Need-based financial aid. Sports and cultural scholarships. Alumni endowment scholarships.',
  4.4,
  'private'
),
(
  'Christ University Bangalore',
  'Prestigious deemed university. Wide range of undergraduate and postgraduate programs. Focus on holistic education. Strong placement support.',
  'Hosur Road',
  'Bangalore',
  'Karnataka',
  '560029',
  'https://christuniversity.in',
  'mail@christuniversity.in',
  '+918040129100',
  'Merit scholarships for academic excellence. Sports and cultural talent scholarships. Need-based financial assistance. Fee concessions for economically weaker sections.',
  4.3,
  'private'
);


-- ================================================================
-- PART 8: COURSES (Educational Programs)
-- ================================================================

DO $$
DECLARE
  -- Entrance Exam IDs
  jee_exam_id uuid;
  neet_exam_id uuid;
  cat_exam_id uuid;
  clat_exam_id uuid;
  nata_exam_id uuid;
  uceed_exam_id uuid;

  -- Skill IDs (already fetched in previous block, re-fetch for this block)
  programming_id uuid;
  math_analysis_id uuid;
  medical_knowledge_id uuid;
  business_acumen_id uuid;
  analytical_thinking_id uuid;
  communication_id uuid;

  -- Course IDs
  btech_cs_id uuid;
  btech_civil_id uuid;
  mbbs_id uuid;
  mba_id uuid;
  llb_id uuid;
  bdes_id uuid;

BEGIN
  -- Get Entrance Exam IDs
  SELECT id INTO jee_exam_id FROM public.entrance_exam WHERE name = 'JEE Main & Advanced';
  SELECT id INTO neet_exam_id FROM public.entrance_exam WHERE name = 'NEET UG';
  SELECT id INTO cat_exam_id FROM public.entrance_exam WHERE name = 'CAT';
  SELECT id INTO clat_exam_id FROM public.entrance_exam WHERE name = 'CLAT';
  SELECT id INTO nata_exam_id FROM public.entrance_exam WHERE name = 'NATA';
  SELECT id INTO uceed_exam_id FROM public.entrance_exam WHERE name = 'UCEED';

  -- Get Skill IDs
  SELECT id INTO programming_id FROM public.skill WHERE name = 'Programming (Python, R, SQL)';
  SELECT id INTO math_analysis_id FROM public.skill WHERE name = 'Mathematical Analysis';
  SELECT id INTO medical_knowledge_id FROM public.skill WHERE name = 'Medical Knowledge';
  SELECT id INTO business_acumen_id FROM public.skill WHERE name = 'Business Acumen';
  SELECT id INTO analytical_thinking_id FROM public.skill WHERE name = 'Analytical Thinking';
  SELECT id INTO communication_id FROM public.skill WHERE name = 'Communication Skills';


  -- ================================================================
  -- COURSE 1: B.Tech Computer Science
  -- ================================================================
  INSERT INTO public.course (name, description, duration) VALUES (
    'B.Tech Computer Science & Engineering',
    'Four-year undergraduate program in computer science. Covers programming, algorithms, data structures, AI/ML. Includes industry internships and projects. Prepares students for software engineering careers.',
    '4 years'
  ) RETURNING id INTO btech_cs_id;

  -- Link to entrance exam
  INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
    (btech_cs_id, jee_exam_id);

  -- Link to skills
  INSERT INTO public.course_skills (course_id, skill_id) VALUES
    (btech_cs_id, programming_id),
    (btech_cs_id, analytical_thinking_id),
    (btech_cs_id, math_analysis_id);


  -- ================================================================
  -- COURSE 2: B.Tech Civil Engineering
  -- ================================================================
  INSERT INTO public.course (name, description, duration) VALUES (
    'B.Tech Civil Engineering',
    'Four-year undergraduate program in civil engineering. Covers structural design, construction management, surveying. Hands-on training in labs and site visits. Prepares for infrastructure development careers.',
    '4 years'
  ) RETURNING id INTO btech_civil_id;

  INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
    (btech_civil_id, jee_exam_id);

  INSERT INTO public.course_skills (course_id, skill_id) VALUES
    (btech_civil_id, math_analysis_id),
    (btech_civil_id, analytical_thinking_id);


  -- ================================================================
  -- COURSE 3: MBBS
  -- ================================================================
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Medicine, Bachelor of Surgery (MBBS)',
    'Five and a half years including one year internship. Comprehensive medical education program. Clinical training in hospitals. Foundation for medical practice and specialization.',
    '5.5 years'
  ) RETURNING id INTO mbbs_id;

  INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
    (mbbs_id, neet_exam_id);

  INSERT INTO public.course_skills (course_id, skill_id) VALUES
    (mbbs_id, medical_knowledge_id),
    (mbbs_id, analytical_thinking_id),
    (mbbs_id, communication_id);


  -- ================================================================
  -- COURSE 4: MBA
  -- ================================================================
  INSERT INTO public.course (name, description, duration) VALUES (
    'Master of Business Administration (MBA)',
    'Two-year postgraduate program in business management. Specializations in Finance, Marketing, Operations, HR. Case-study based learning methodology. Industry internships and live projects.',
    '2 years'
  ) RETURNING id INTO mba_id;

  INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
    (mba_id, cat_exam_id);

  INSERT INTO public.course_skills (course_id, skill_id) VALUES
    (mba_id, business_acumen_id),
    (mba_id, analytical_thinking_id),
    (mba_id, communication_id);


  -- ================================================================
  -- COURSE 5: LLB (5-year integrated)
  -- ================================================================
  INSERT INTO public.course (name, description, duration) VALUES (
    'B.A. LL.B (Hons.) - Integrated Law Program',
    'Five-year integrated undergraduate law program. Combines arts/humanities with legal education. Moot courts and internships with law firms. Prepares for legal practice and judiciary.',
    '5 years'
  ) RETURNING id INTO llb_id;

  INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
    (llb_id, clat_exam_id);

  INSERT INTO public.course_skills (course_id, skill_id) VALUES
    (llb_id, analytical_thinking_id),
    (llb_id, communication_id);


  -- ================================================================
  -- COURSE 6: B.Des (Design)
  -- ================================================================
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Design (B.Des)',
    'Four-year undergraduate design program. Specializations in Product, Communication, Fashion Design. Studio-based learning with industry projects. Focus on creativity and problem-solving.',
    '4 years'
  ) RETURNING id INTO bdes_id;

  INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
    (bdes_id, uceed_exam_id),
    (bdes_id, nata_exam_id);

  INSERT INTO public.course_skills (course_id, skill_id) VALUES
    (bdes_id, analytical_thinking_id),
    (bdes_id, communication_id);

END $$;


-- ================================================================
-- PART 9: CAREERPATH_COURSES (Career → Course Mappings)
-- ================================================================
-- NOTE: Run this AFTER migration 003_restructure_relationships.sql

DO $$
DECLARE
  -- Career IDs
  civil_engineer_id uuid;
  software_developer_id uuid;
  data_scientist_id uuid;
  mechanical_engineer_id uuid;
  architect_id uuid;
  doctor_id uuid;
  nurse_id uuid;
  physiotherapist_id uuid;
  marketing_specialist_id uuid;
  accountant_id uuid;
  lawyer_id uuid;
  graphic_designer_id uuid;
  psychologist_id uuid;
  teacher_id uuid;
  entrepreneur_id uuid;

  -- Course IDs
  btech_cs_id uuid;
  btech_civil_id uuid;
  mbbs_id uuid;
  mba_id uuid;
  llb_id uuid;
  bdes_id uuid;

  -- Additional course IDs (to be created)
  btech_mech_id uuid;
  barch_id uuid;
  bsc_nursing_id uuid;
  bpt_id uuid;
  bba_id uuid;
  bcom_id uuid;
  ba_psychology_id uuid;
  bed_id uuid;

BEGIN
  -- Get existing career IDs
  SELECT id INTO civil_engineer_id FROM public.career_path WHERE slug = 'civil-engineer';
  SELECT id INTO software_developer_id FROM public.career_path WHERE slug = 'software-developer';
  SELECT id INTO data_scientist_id FROM public.career_path WHERE slug = 'data-scientist';
  SELECT id INTO mechanical_engineer_id FROM public.career_path WHERE slug = 'mechanical-engineer';
  SELECT id INTO architect_id FROM public.career_path WHERE slug = 'architect';
  SELECT id INTO doctor_id FROM public.career_path WHERE slug = 'doctor';
  SELECT id INTO nurse_id FROM public.career_path WHERE slug = 'nurse';
  SELECT id INTO physiotherapist_id FROM public.career_path WHERE slug = 'physiotherapist';
  SELECT id INTO marketing_specialist_id FROM public.career_path WHERE slug = 'marketing-specialist';
  SELECT id INTO accountant_id FROM public.career_path WHERE slug = 'accountant';
  SELECT id INTO lawyer_id FROM public.career_path WHERE slug = 'lawyer';
  SELECT id INTO graphic_designer_id FROM public.career_path WHERE slug = 'graphic-designer';
  SELECT id INTO psychologist_id FROM public.career_path WHERE slug = 'psychologist';
  SELECT id INTO teacher_id FROM public.career_path WHERE slug = 'teacher';
  SELECT id INTO entrepreneur_id FROM public.career_path WHERE slug = 'entrepreneur';

  -- Get existing course IDs
  SELECT id INTO btech_cs_id FROM public.course WHERE name = 'B.Tech Computer Science & Engineering';
  SELECT id INTO btech_civil_id FROM public.course WHERE name = 'B.Tech Civil Engineering';
  SELECT id INTO mbbs_id FROM public.course WHERE name = 'Bachelor of Medicine, Bachelor of Surgery (MBBS)';
  SELECT id INTO mba_id FROM public.course WHERE name = 'Master of Business Administration (MBA)';
  SELECT id INTO llb_id FROM public.course WHERE name = 'B.A. LL.B (Hons.) - Integrated Law Program';
  SELECT id INTO bdes_id FROM public.course WHERE name = 'Bachelor of Design (B.Des)';

  -- ================================================================
  -- Create additional courses needed for career mappings
  -- ================================================================

  -- B.Tech Mechanical Engineering
  INSERT INTO public.course (name, description, duration) VALUES (
    'B.Tech Mechanical Engineering',
    'Four-year undergraduate program in mechanical engineering. Covers thermodynamics, manufacturing, machine design. Hands-on training in workshops and labs. Prepares for manufacturing and automotive careers.',
    '4 years'
  ) RETURNING id INTO btech_mech_id;

  -- B.Arch (Architecture)
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Architecture (B.Arch)',
    'Five-year undergraduate program in architecture. Covers design principles, construction technology, urban planning. Studio-based learning with industry projects. Required for architecture practice.',
    '5 years'
  ) RETURNING id INTO barch_id;

  -- B.Sc Nursing
  INSERT INTO public.course (name, description, duration) VALUES (
    'B.Sc Nursing',
    'Four-year undergraduate nursing program. Covers patient care, medical procedures, community health. Clinical rotations in hospitals. Prepares for nursing careers in healthcare.',
    '4 years'
  ) RETURNING id INTO bsc_nursing_id;

  -- BPT (Physiotherapy)
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Physiotherapy (BPT)',
    'Four and a half year program including internship. Covers rehabilitation, musculoskeletal therapy, sports medicine. Clinical training in hospitals and rehabilitation centers.',
    '4.5 years'
  ) RETURNING id INTO bpt_id;

  -- BBA
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Business Administration (BBA)',
    'Three-year undergraduate program in business management. Covers marketing, finance, operations, HR. Industry internships and case studies. Foundation for management careers.',
    '3 years'
  ) RETURNING id INTO bba_id;

  -- B.Com
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Commerce (B.Com)',
    'Three-year undergraduate program in commerce. Covers accounting, taxation, business law. Foundation for CA, CMA, CS professional courses. Prepares for finance and accounting careers.',
    '3 years'
  ) RETURNING id INTO bcom_id;

  -- BA Psychology
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Arts in Psychology (BA Psychology)',
    'Three-year undergraduate program in psychology. Covers developmental, clinical, social psychology. Research methodology and counseling basics. Foundation for psychology careers.',
    '3 years'
  ) RETURNING id INTO ba_psychology_id;

  -- B.Ed
  INSERT INTO public.course (name, description, duration) VALUES (
    'Bachelor of Education (B.Ed)',
    'Two-year postgraduate program in education. Covers pedagogy, curriculum design, educational psychology. Teaching practice in schools. Required for teaching positions.',
    '2 years'
  ) RETURNING id INTO bed_id;

  -- ================================================================
  -- Link entrance exams to new courses
  -- ================================================================

  -- Get entrance exam IDs
  DECLARE
    jee_exam_id uuid;
    neet_exam_id uuid;
    nata_exam_id uuid;
    cat_exam_id uuid;
    state_cet_id uuid;
  BEGIN
    SELECT id INTO jee_exam_id FROM public.entrance_exam WHERE name = 'JEE Main & Advanced';
    SELECT id INTO neet_exam_id FROM public.entrance_exam WHERE name = 'NEET UG';
    SELECT id INTO nata_exam_id FROM public.entrance_exam WHERE name = 'NATA';
    SELECT id INTO cat_exam_id FROM public.entrance_exam WHERE name = 'CAT';
    SELECT id INTO state_cet_id FROM public.entrance_exam WHERE name = 'State CET exams';

    -- Link exams to new courses
    INSERT INTO public.course_entrance_exams (course_id, entranceexam_id) VALUES
      (btech_mech_id, jee_exam_id),
      (barch_id, nata_exam_id),
      (bsc_nursing_id, neet_exam_id),
      (bpt_id, neet_exam_id),
      (bba_id, state_cet_id),
      (bcom_id, state_cet_id),
      (ba_psychology_id, state_cet_id),
      (bed_id, state_cet_id);
  END;

  -- ================================================================
  -- Insert careerpath_courses mappings
  -- ================================================================

  -- Civil Engineer courses
  IF civil_engineer_id IS NOT NULL AND btech_civil_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (civil_engineer_id, btech_civil_id, true, 'Primary undergraduate degree for civil engineering');
  END IF;

  -- Software Developer courses
  IF software_developer_id IS NOT NULL AND btech_cs_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (software_developer_id, btech_cs_id, true, 'Primary degree for software development careers');
  END IF;

  -- Data Scientist courses
  IF data_scientist_id IS NOT NULL AND btech_cs_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (data_scientist_id, btech_cs_id, true, 'Strong foundation for data science careers');
  END IF;

  -- Mechanical Engineer courses
  IF mechanical_engineer_id IS NOT NULL AND btech_mech_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (mechanical_engineer_id, btech_mech_id, true, 'Primary undergraduate degree for mechanical engineering');
  END IF;

  -- Architect courses
  IF architect_id IS NOT NULL AND barch_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (architect_id, barch_id, true, 'Required degree for architecture practice');
  END IF;

  -- Doctor courses
  IF doctor_id IS NOT NULL AND mbbs_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (doctor_id, mbbs_id, true, 'Primary medical degree required for doctors');
  END IF;

  -- Nurse courses
  IF nurse_id IS NOT NULL AND bsc_nursing_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (nurse_id, bsc_nursing_id, true, 'Primary nursing degree');
  END IF;

  -- Physiotherapist courses
  IF physiotherapist_id IS NOT NULL AND bpt_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (physiotherapist_id, bpt_id, true, 'Required degree for physiotherapy practice');
  END IF;

  -- Marketing Specialist courses
  IF marketing_specialist_id IS NOT NULL AND bba_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (marketing_specialist_id, bba_id, true, 'Foundation for marketing careers');
  END IF;
  IF marketing_specialist_id IS NOT NULL AND mba_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (marketing_specialist_id, mba_id, false, 'Advanced degree for senior marketing roles');
  END IF;

  -- Accountant courses
  IF accountant_id IS NOT NULL AND bcom_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (accountant_id, bcom_id, true, 'Primary degree for accounting careers');
  END IF;

  -- Lawyer courses
  IF lawyer_id IS NOT NULL AND llb_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (lawyer_id, llb_id, true, 'Integrated law program for legal careers');
  END IF;

  -- Graphic Designer courses
  IF graphic_designer_id IS NOT NULL AND bdes_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (graphic_designer_id, bdes_id, true, 'Primary design degree');
  END IF;

  -- Psychologist courses
  IF psychologist_id IS NOT NULL AND ba_psychology_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (psychologist_id, ba_psychology_id, true, 'Foundation for psychology careers');
  END IF;

  -- Teacher courses
  IF teacher_id IS NOT NULL AND bed_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (teacher_id, bed_id, true, 'Required for teaching positions');
  END IF;

  -- Entrepreneur courses
  IF entrepreneur_id IS NOT NULL AND bba_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (entrepreneur_id, bba_id, true, 'Business foundation for entrepreneurs');
  END IF;
  IF entrepreneur_id IS NOT NULL AND mba_id IS NOT NULL THEN
    INSERT INTO public.careerpath_courses (careerpath_id, course_id, is_primary, notes) VALUES
      (entrepreneur_id, mba_id, false, 'Advanced business education');
  END IF;

END $$;


-- ================================================================
-- PART 10: COLLEGE_COURSES (College → Course Mappings)
-- ================================================================

DO $$
DECLARE
  -- College IDs
  iit_delhi_id uuid;
  nitk_id uuid;
  aiims_id uuid;
  iimb_id uuid;
  nlsiu_id uuid;
  nid_id uuid;
  manipal_id uuid;
  christ_id uuid;

  -- Course IDs
  btech_cs_id uuid;
  btech_civil_id uuid;
  btech_mech_id uuid;
  mbbs_id uuid;
  mba_id uuid;
  llb_id uuid;
  bdes_id uuid;
  barch_id uuid;
  bsc_nursing_id uuid;
  bba_id uuid;
  bcom_id uuid;
  ba_psychology_id uuid;

BEGIN
  -- Get college IDs
  SELECT id INTO iit_delhi_id FROM public.college WHERE name = 'Indian Institute of Technology Delhi';
  SELECT id INTO nitk_id FROM public.college WHERE name = 'National Institute of Technology Karnataka';
  SELECT id INTO aiims_id FROM public.college WHERE name = 'All India Institute of Medical Sciences Delhi';
  SELECT id INTO iimb_id FROM public.college WHERE name = 'Indian Institute of Management Bangalore';
  SELECT id INTO nlsiu_id FROM public.college WHERE name = 'National Law School of India University';
  SELECT id INTO nid_id FROM public.college WHERE name = 'National Institute of Design Ahmedabad';
  SELECT id INTO manipal_id FROM public.college WHERE name = 'Manipal Academy of Higher Education';
  SELECT id INTO christ_id FROM public.college WHERE name = 'Christ University Bangalore';

  -- Get course IDs
  SELECT id INTO btech_cs_id FROM public.course WHERE name = 'B.Tech Computer Science & Engineering';
  SELECT id INTO btech_civil_id FROM public.course WHERE name = 'B.Tech Civil Engineering';
  SELECT id INTO btech_mech_id FROM public.course WHERE name = 'B.Tech Mechanical Engineering';
  SELECT id INTO mbbs_id FROM public.course WHERE name = 'Bachelor of Medicine, Bachelor of Surgery (MBBS)';
  SELECT id INTO mba_id FROM public.course WHERE name = 'Master of Business Administration (MBA)';
  SELECT id INTO llb_id FROM public.course WHERE name = 'B.A. LL.B (Hons.) - Integrated Law Program';
  SELECT id INTO bdes_id FROM public.course WHERE name = 'Bachelor of Design (B.Des)';
  SELECT id INTO barch_id FROM public.course WHERE name = 'Bachelor of Architecture (B.Arch)';
  SELECT id INTO bsc_nursing_id FROM public.course WHERE name = 'B.Sc Nursing';
  SELECT id INTO bba_id FROM public.course WHERE name = 'Bachelor of Business Administration (BBA)';
  SELECT id INTO bcom_id FROM public.course WHERE name = 'Bachelor of Commerce (B.Com)';
  SELECT id INTO ba_psychology_id FROM public.course WHERE name = 'Bachelor of Arts in Psychology (BA Psychology)';

  -- ================================================================
  -- IIT Delhi courses
  -- ================================================================
  IF iit_delhi_id IS NOT NULL THEN
    IF btech_cs_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (iit_delhi_id, btech_cs_id, '₹2.2 Lakhs/year', '₹8.8 Lakhs total', '85', 'JEE Advanced rank-based counseling through JoSAA');
    END IF;
    IF btech_civil_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (iit_delhi_id, btech_civil_id, '₹2.2 Lakhs/year', '₹8.8 Lakhs total', '70', 'JEE Advanced rank-based counseling through JoSAA');
    END IF;
    IF btech_mech_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (iit_delhi_id, btech_mech_id, '₹2.2 Lakhs/year', '₹8.8 Lakhs total', '75', 'JEE Advanced rank-based counseling through JoSAA');
    END IF;
  END IF;

  -- ================================================================
  -- NIT Karnataka courses
  -- ================================================================
  IF nitk_id IS NOT NULL THEN
    IF btech_cs_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (nitk_id, btech_cs_id, '₹1.5 Lakhs/year', '₹6 Lakhs total', '180', 'JEE Main rank-based counseling through JoSAA/CSAB');
    END IF;
    IF btech_civil_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (nitk_id, btech_civil_id, '₹1.5 Lakhs/year', '₹6 Lakhs total', '120', 'JEE Main rank-based counseling through JoSAA/CSAB');
    END IF;
    IF btech_mech_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (nitk_id, btech_mech_id, '₹1.5 Lakhs/year', '₹6 Lakhs total', '140', 'JEE Main rank-based counseling through JoSAA/CSAB');
    END IF;
    IF barch_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (nitk_id, barch_id, '₹1.5 Lakhs/year', '₹7.5 Lakhs total', '40', 'JEE Main Paper 2 + NATA score based admission');
    END IF;
  END IF;

  -- ================================================================
  -- AIIMS Delhi courses
  -- ================================================================
  IF aiims_id IS NOT NULL AND mbbs_id IS NOT NULL THEN
    INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
      (aiims_id, mbbs_id, '₹1,628/year', '₹8,968 total', '100', 'NEET UG All India Rank based counseling through MCC');
  END IF;
  IF aiims_id IS NOT NULL AND bsc_nursing_id IS NOT NULL THEN
    INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
      (aiims_id, bsc_nursing_id, '₹1,000/year', '₹4,000 total', '60', 'AIIMS Nursing Entrance Exam');
  END IF;

  -- ================================================================
  -- IIM Bangalore courses
  -- ================================================================
  IF iimb_id IS NOT NULL AND mba_id IS NOT NULL THEN
    INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
      (iimb_id, mba_id, '₹12 Lakhs/year', '₹24 Lakhs total', '450', 'CAT score + WAT + Personal Interview');
  END IF;

  -- ================================================================
  -- NLSIU courses
  -- ================================================================
  IF nlsiu_id IS NOT NULL AND llb_id IS NOT NULL THEN
    INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
      (nlsiu_id, llb_id, '₹2.5 Lakhs/year', '₹12.5 Lakhs total', '120', 'CLAT rank-based admission');
  END IF;

  -- ================================================================
  -- NID Ahmedabad courses
  -- ================================================================
  IF nid_id IS NOT NULL AND bdes_id IS NOT NULL THEN
    INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
      (nid_id, bdes_id, '₹3.5 Lakhs/year', '₹14 Lakhs total', '100', 'NID DAT Prelims + Mains + Studio Test + Interview');
  END IF;

  -- ================================================================
  -- Manipal University courses
  -- ================================================================
  IF manipal_id IS NOT NULL THEN
    IF btech_cs_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (manipal_id, btech_cs_id, '₹4.5 Lakhs/year', '₹18 Lakhs total', '300', 'MET (Manipal Entrance Test) based admission');
    END IF;
    IF mbbs_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (manipal_id, mbbs_id, '₹10 Lakhs/year', '₹55 Lakhs total', '250', 'NEET UG score + Manipal counseling');
    END IF;
    IF bba_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (manipal_id, bba_id, '₹3.5 Lakhs/year', '₹10.5 Lakhs total', '200', 'MUOET based admission');
    END IF;
  END IF;

  -- ================================================================
  -- Christ University courses
  -- ================================================================
  IF christ_id IS NOT NULL THEN
    IF bba_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (christ_id, bba_id, '₹2.8 Lakhs/year', '₹8.4 Lakhs total', '300', 'Christ University Entrance Test + Interview');
    END IF;
    IF bcom_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (christ_id, bcom_id, '₹1.5 Lakhs/year', '₹4.5 Lakhs total', '400', 'Christ University Entrance Test + Interview');
    END IF;
    IF ba_psychology_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (christ_id, ba_psychology_id, '₹1.8 Lakhs/year', '₹5.4 Lakhs total', '120', 'Christ University Entrance Test + Interview');
    END IF;
    IF llb_id IS NOT NULL THEN
      INSERT INTO public.college_courses (college_id, course_id, annual_fees, total_fees, seats, admission_process) VALUES
        (christ_id, llb_id, '₹2.5 Lakhs/year', '₹12.5 Lakhs total', '100', 'CLAT score or Christ Law Entrance + Interview');
    END IF;
  END IF;

END $$;


-- ================================================================
-- DATA POPULATION COMPLETE
-- ================================================================
-- Summary:
-- - 16 Career Clusters
-- - 3 Education Streams
-- - 20 Academic Subjects
-- - 36 Professional Skills
-- - 8 Entrance Exams
-- - 15 Comprehensive Careers with full relationship data
-- - 8 Top Colleges (Mix of govt and private)
-- - 14 Courses with entrance exam and skill linkages
-- - Career to Course mappings (careerpath_courses)
-- - College to Course mappings (college_courses)
-- ================================================================
