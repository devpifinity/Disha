import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bookmark, DollarSign, Users, TrendingUp, GraduationCap, FileText, Star, BookOpen, Target, Book } from "lucide-react";
import { useState } from "react";
import { ExamDetailsModal } from "./ExamDetailsModal";
import { useQuery } from "@tanstack/react-query";
import { fetchCareerWithDetails } from "@/lib/careerQueries";

// ============================================================================
// ALL CAREER DATA IS NOW FETCHED FROM DATABASE
// No hardcoded data needed - everything comes from Supabase!
// ============================================================================

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

  // Fetch ALL career data from database
  const { data: careerData, isLoading, error } = useQuery({
    queryKey: ['career-details', careerSlug],
    queryFn: async () => {
      if (!careerSlug) return null;
      const result = await fetchCareerWithDetails(careerSlug);
      return result.data;
    },
    enabled: !!careerSlug
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading career details...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !careerData?.career) {
    const careerTitle = careerSlug
      ?.split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ") || "Career";

    return (
      <div className="min-h-screen bg-gradient-hero-bg">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6 flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Card className="max-w-2xl mx-auto text-center p-12">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{careerTitle}</h1>
              <Badge variant="secondary" className="text-sm px-4 py-1.5">Coming Soon</Badge>
              <p className="text-muted-foreground text-lg mt-4">
                We're working on adding detailed information about {careerTitle}.
                Check back soon for complete career guidance!
              </p>
              <div className="flex gap-3 justify-center mt-8">
                <Link to="/career-search">
                  <Button className="bg-gradient-primary">Explore Other Careers</Button>
                </Link>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { career, skills, jobOpportunities, relatedCareers } = careerData;

  // Parse highlights (pipe-separated string to array)
  const keyHighlights = career.highlights?.split('|').map(h => h.trim()).filter(Boolean) || [];

  // Separate skills by category
  const technicalSkills = skills
    .filter(s => s.skill?.category === 'technical')
    .map(s => s.skill?.description || s.skill?.name || '')
    .filter(Boolean);

  const softSkills = skills
    .filter(s => s.skill?.category === 'soft')
    .map(s => s.skill?.description || s.skill?.name || '')
    .filter(Boolean);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gradient-hero-bg">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 h-9"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            <Button
              variant={isBookmarked ? "default" : "outline"}
              onClick={handleBookmark}
              className="flex items-center gap-2 h-9"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save Career'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {career.name}
          </h1>

          {/* Career Snapshot */}
          {career.snapshot && (
            <p className="text-sm font-medium text-accent max-w-3xl mx-auto mb-4">
              {career.snapshot}
            </p>
          )}

          <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-5">
            {career.description}
          </p>

          {/* Key Highlights - Compact Grid */}
          {keyHighlights.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2.5 max-w-4xl mx-auto">
              {keyHighlights.map((highlight, index) => (
                <div key={index} className="bg-card rounded-lg p-2.5 border">
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mb-1.5 mx-auto">
                    <Star className="w-3 h-3 text-primary" />
                  </div>
                  <p className="text-xs font-medium text-foreground">{highlight}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side by side Subjects & Stream and Education Path */}
        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          {/* Subjects & Stream for High School Students */}
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Book className="w-5 h-5 text-accent" />
                Subjects & Stream (Grade 9-12)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2.5">
                <div className="p-2.5 bg-accent/10 border border-accent/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                    <span className="font-semibold text-accent text-sm">Recommended Stream</span>
                  </div>
                  <p className="text-accent font-medium text-sm">{career.recommended_stream}</p>
                </div>

                {career.essential_subjects && career.essential_subjects.length > 0 && (
                  <div>
                    <p className="font-semibold text-foreground mb-2 text-xs">Essential Subjects:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.essential_subjects.map((subject, index) => (
                        <Badge key={index} className="bg-primary/10 text-primary text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Student Path Example */}
                {career.student_path_example && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-accent text-sm">Student Path Example</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {career.student_path_example}
                    </p>
                  </div>
                )}

                {/* Grade-wise Advice */}
                {career.grade_wise_advice && (
                  <div className="pt-3 border-t">
                    <div className="space-y-2">
                      {career.grade_wise_advice['9th-10th'] && (
                        <div>
                          <p className="font-semibold text-foreground text-xs mb-1">Grade 9-10:</p>
                          <p className="text-xs text-muted-foreground">{career.grade_wise_advice['9th-10th']}</p>
                        </div>
                      )}
                      {career.grade_wise_advice['11th-12th'] && (
                        <div>
                          <p className="font-semibold text-foreground text-xs mb-1">Grade 11-12:</p>
                          <p className="text-xs text-muted-foreground">{career.grade_wise_advice['11th-12th']}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education & Exams Combined */}
          <Card className="border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="w-5 h-5 text-primary" />
                Education Path
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {career.education_pathway && career.education_pathway.length > 0 && (
                <div className="space-y-1.5">
                  {career.education_pathway.map((step, index) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary flex-shrink-0 text-xs mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              )}

              {career.entrance_exams_list && career.entrance_exams_list.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-accent text-sm">Key Entrance Exams</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {career.entrance_exams_list.map((exam, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-accent/10 hover:text-accent transition-colors"
                        onClick={() => handleExamClick(exam)}
                      >
                        {exam}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills Required */}
        {(technicalSkills.length > 0 || softSkills.length > 0) && (
          <Card className="border bg-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="w-5 h-5 text-primary" />
                Skills Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Soft Skills - Left Column */}
                {softSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-sm">Soft Skills</h3>
                    <div className="space-y-2">
                      {softSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-accent/10 rounded text-xs">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-foreground">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Skills - Right Column */}
                {technicalSkills.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 text-sm">Technical Skills</h3>
                    <div className="space-y-2">
                      {technicalSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-primary/10 rounded text-xs">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-foreground">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Career Opportunities */}
        {jobOpportunities.length > 0 && (
          <Card className="border bg-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-primary" />
                Career Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {jobOpportunities.map((job, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-xs">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="font-medium text-foreground">{job.job_title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Information */}
        {(career.salary_starting || career.salary_experienced || career.salary_senior) && (
          <Card className="border bg-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-primary" />
                Salary Ranges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {career.salary_starting && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Starting</p>
                    <p className="text-sm font-bold text-foreground">{career.salary_starting}</p>
                  </div>
                )}
                {career.salary_experienced && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Experienced</p>
                    <p className="text-sm font-bold text-foreground">{career.salary_experienced}</p>
                  </div>
                )}
                {career.salary_senior && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Senior Level</p>
                    <p className="text-sm font-bold text-foreground">{career.salary_senior}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Future Outlook */}
        {career.industry_demand && (
          <Card className="border bg-card mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
                Future Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {career.industry_demand}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-3 mb-6">
          <Link to={`/career/${careerSlug}/colleges-scholarships`}>
            <Button className="w-full bg-gradient-primary hover:shadow-md transition-all h-10 text-sm font-semibold">
              Find Colleges & Scholarships
            </Button>
          </Link>
          <Button variant="outline" className="w-full border-2 h-10 text-sm font-semibold">
            Explore Related Careers
          </Button>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-card rounded-lg border p-3">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/quiz">
              <Button variant="outline" className="flex items-center gap-2 h-9 text-xs">
                <BookOpen className="w-3.5 h-3.5" />
                Take Career Quiz
              </Button>
            </Link>
            <Link to="/career-search">
              <Button variant="outline" className="flex items-center gap-2 h-9 text-xs">
                <Target className="w-3.5 h-3.5" />
                Explore More Careers
              </Button>
            </Link>
            <Link to="/">
              <Button className="bg-gradient-primary h-9 text-xs">
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

export default CareerDetails;
