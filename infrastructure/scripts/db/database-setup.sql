-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create cluster table
create table public.career_cluster (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create stream table
create table public.stream (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create subject table
create table public.subject(
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create skill table
create table public.skill(
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- Create entrance_exam table
create table public.entrance_exam(
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an enum type for the “type” column
CREATE TYPE public.type_of_college AS ENUM ('govt', 'private');

CREATE DOMAIN public.url AS TEXT
CHECK (
  VALUE ~* '^https?://([a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5})(:[0-9]{1,5})?(/.*)?$'
);

CREATE DOMAIN public.phone AS VARCHAR(25)
CHECK (
  VALUE ~ '^\+\d{1,15}$'
);

CREATE EXTENSION citext;

CREATE DOMAIN public.email_address AS citext
CHECK (
    VALUE ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
);
-- Create colleges table
--TODO scholarshipDetails should it be a different table
create table public.college (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text[] not null,
  location text not null,
  address text not null,
  website public.url not null,
  email public.email_address NOT NULL,
  phone public.phone not null,
  scholarshipDetails text[] not null,
  rating numeric(2,1) not null,
  type public.type_of_college not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


CREATE TABLE public.career_path (
    id uuid default gen_random_uuid() primary key,
    name TEXT NOT NULL,
	description TEXT ,
	highlights TEXT,
	type TEXT,
	career_stream_id uuid NOT NULL,
	career_cluster_id uuid NOT NULL,
	created_at timestamp with time zone default timezone('utc'::text, now()) not null,
	FOREIGN KEY (career_stream_id)    REFERENCES public.stream(id),
	FOREIGN KEY (career_cluster_id)    REFERENCES public.career_cluster(id)	
);



-- Create courses table
create table public.course (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text[] not null,
  duration text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create an enum type for the “answer” column
CREATE TYPE public.answer_type AS ENUM ('yes', 'no');

-- Table for CareerPath Subjects
CREATE TABLE public.careerpath_subjects(
    id uuid default gen_random_uuid() primary key,
    careerpath_id uuid NOT NULL,
    subject_id    uuid NOT NULL,
	is_mandatory answer_type NOT NULL,
    FOREIGN KEY (careerpath_id) REFERENCES public.career_path(id),
    FOREIGN KEY (subject_id)    REFERENCES public.subject(id)
);

ALTER TABLE public.careerpath_subjects
ADD CONSTRAINT careerpath_subject_unique
UNIQUE (careerpath_id, subject_id);

-- Table for CareerPath Tags
CREATE TABLE public.careerpath_tags(
    id uuid default gen_random_uuid() primary key,
    careerpath_id uuid NOT NULL,
    tag    TEXT NOT NULL,
    FOREIGN KEY (careerpath_id) REFERENCES public.career_path(id)
);

-- Table for CareerPath Skills
CREATE TABLE public.careerpath_skills(
    id uuid default gen_random_uuid() primary key,
    careerpath_id uuid NOT NULL,
    skill_id    uuid NOT NULL,
    FOREIGN KEY (careerpath_id) REFERENCES public.career_path(id),
    FOREIGN KEY (skill_id)    REFERENCES public.skill(id)
);


-- Table for CareerJobOpportunities
CREATE TABLE public.career_job_opportunity(
    id uuid default gen_random_uuid() primary key,
    careerpath_id uuid NOT NULL,
    job_title TEXT NOT NULL,
    FOREIGN KEY (careerpath_id) REFERENCES public.career_path(id)
);

-- Table for CourseSkills
CREATE TABLE public.course_skills(
    id uuid default gen_random_uuid() primary key,
    course_id uuid NOT NULL,
    skill_id uuid NOT NULL,
    FOREIGN KEY (course_id) REFERENCES public.course(id),
	FOREIGN KEY (skill_id) REFERENCES public.skill(id)
);

-- Table for college_course_jobs
CREATE TABLE public.college_course_jobs(
    id uuid default gen_random_uuid() primary key,
    job_id uuid NOT NULL,
    college_id uuid NOT NULL,
	course_id uuid NOT NULL,
    FOREIGN KEY (job_id) REFERENCES public.career_job_opportunity(id),
	FOREIGN KEY (college_id) REFERENCES public.college(id),
	FOREIGN KEY (course_id) REFERENCES public.course(id)
);

-- Table for CourseEntranceExams
CREATE TABLE public.course_entrance_exams(
    id uuid default gen_random_uuid() primary key,
    course_id uuid NOT NULL,
    entranceexam_id uuid NOT NULL,
    FOREIGN KEY (entranceexam_id) REFERENCES public.entrance_exam(id),
	FOREIGN KEY (course_id) REFERENCES public.course(id)
);

