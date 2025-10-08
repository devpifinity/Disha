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


INSERT INTO public.stream (name) VALUES
('Science / STEM'),
('Commerce / Business'),
('Arts / Humanities');



do $$
declare
  science_stream_uid uuid;
  it_cluster_uid uuid;
begin
  select id into science_stream_uid from public.stream where name = 'Science / STEM';
  select id into it_cluster_uid from public.career_cluster where name = 'Information Technology';


INSERT INTO public.career_path (name, description,highlights,type, career_stream_id, career_cluster_id)
VALUES ('Network Systems', ARRAY['The Network Systems pathway focuses on the design, implementation, and management of linked computer systems, networks, and related software.', 'Professionals ensure that data flows securely and efficiently across organizations, supporting communication, cloud systems, and cybersecurity.'],
 ARRAY['Designing and maintaining computer networks (LAN, WAN, cloud, wireless)
Configuring routers, switches, firewalls, and servers
', 'Ensuring network security and protecting against cyber threats
Troubleshooting network connectivity issues
', 'Supporting enterprise IT infrastructure (datacenters, cloud, virtualization)
High demand in almost every industry (finance, healthcare, government, tech companies)'], 'SCITECH'
, science_stream_uid, it_cluster_uid);

INSERT INTO public.career_path (name, description,highlights,type, career_stream_id, career_cluster_id)
VALUES('Systems Engineer', ARRAY['blah'], ARRAY['blah'],  'SCITECH'
, science_stream_uid, it_cluster_uid);
INSERT INTO public.career_path (name, description,highlights,type, career_stream_id, career_cluster_id)
VALUES('Cloud Engineer', ARRAY['blah'], ARRAY['blah'],  'SCITECH'
, science_stream_uid, it_cluster_uid);
INSERT INTO public.career_path (name, description,highlights,type, career_stream_id, career_cluster_id)
VALUES('Cybersecurity Analyst', ARRAY['blah'], ARRAY['blah'],  'SCITECH'
, science_stream_uid, it_cluster_uid);
INSERT INTO public.career_path (name, description,highlights,type, career_stream_id, career_cluster_id)
VALUES('Infrastructure Architect', ARRAY['blah'], ARRAY['blah'],  'SCITECH'
, science_stream_uid, it_cluster_uid);
INSERT INTO public.career_path (name, description,highlights,type, career_stream_id, career_cluster_id)
VALUES('IT Security Specialist', ARRAY['blah'], ARRAY['blah'],  'SCITECH'
, science_stream_uid, it_cluster_uid);

end $$;
