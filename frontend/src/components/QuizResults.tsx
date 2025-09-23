
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RotateCcw, ArrowRight, Sparkles, Trophy, Target, BarChart3, BookOpen, TrendingUp } from "lucide-react";

const QuizResults = () => {
  const location = useLocation();
  const { results, answers } = location.state || {};

  // Calculate all scores for visualization
  const calculateAllScores = () => {
    const counts = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    if (answers) {
      answers.forEach((answer: string) => {
        if (answer in counts) {
          counts[answer as keyof typeof counts]++;
        }
      });
    }
    return counts;
  };

  const scores = calculateAllScores();

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">No results found</h2>
            <p className="text-muted-foreground mb-6">Please take the quiz first to see your results.</p>
            <Link to="/quiz">
              <Button>
                Take Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getClusterColor = (clusterName: string) => {
    const colors = {
      "Technology & Engineering": "from-blue-500 to-cyan-500",
      "Health & Science": "from-green-500 to-emerald-500", 
      "Business & Finance": "from-orange-500 to-yellow-500",
      "Social & Education": "from-purple-500 to-pink-500",
      "Creative & Media": "from-pink-500 to-rose-500",
      "Skilled Trades & Technical Work": "from-amber-500 to-orange-500"
    };
    return colors[clusterName as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getClusterIcon = (clusterName: string) => {
    switch (clusterName) {
      case "Technology & Engineering": return "💻";
      case "Health & Science": return "🩺";
      case "Business & Finance": return "💼";
      case "Social & Education": return "📚";
      case "Creative & Media": return "🎨";
      case "Skilled Trades & Technical Work": return "🔧";
      default: return "⭐";
    }
  };

  // Map careers to career detail slugs - only for careers that have dedicated pages
  const getCareerSlug = (career: string) => {
    const slugMap: { [key: string]: string } = {
      // Technology & Engineering
      "Software Developer": "software-developer",
      "Data Analyst": "data-scientist",
      "Engineer": "civil-engineer",
      "IT Support": null,
      "Computer Hardware Specialist": null,
      
      // Health & Science  
      "Nurse": "nurse",
      "Lab Technician": "paramedical-technician",
      "Pharmacist": null,
      "Paramedic": "paramedical-technician",
      "Agriculture Scientist": "agricultural-engineer",
      "Environmental Specialist": null,
      
      // Business & Finance
      "Accountant": "accountant", 
      "Banker": "banking-professional",
      "Sales Executive": null,
      "Entrepreneur": null,
      "Store Manager": null,
      
      // Social & Education
      "Teacher": "teacher",
      "Social Worker": null,
      "Lawyer": null,
      "Government Officer": null,
      "Community Leader": null,
      
      // Creative & Media
      "Graphic Designer": "graphic-designer",
      "Animator": null,
      "Journalist": null,
      "Musician": null,
      "Film/Video Creator": null,
      "Writer": null,
      
      // Skilled Trades & Technical Work
      "Electrician": null,
      "Mechanic": null,
      "Plumber": null,
      "Carpenter": null,
      "Welder": null,
      "Driver": null,
      "Chef": null
    };
    return slugMap[career];
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Celebration Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-xl">
              <Trophy className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-4">
            🎉 Quiz Complete!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, we've identified your career cluster. Here's what we discovered about you!
          </p>
          {results.topChoices && (
            <div className="mt-4 p-4 bg-accent/20 rounded-lg max-w-md mx-auto">
              <p className="text-sm font-medium text-muted-foreground">
                🎯 You had a tie! You match well with: {results.topChoices.join(" & ")}
              </p>
            </div>
          )}
        </div>

        {/* Main Result Card */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
          <div className={`h-2 bg-gradient-to-r ${getClusterColor(results.name)}`}></div>
          <CardHeader className="text-center pb-4">
            <div className="text-6xl mb-4">{getClusterIcon(results.name)}</div>
            <CardTitle className="text-3xl font-bold mb-2">
              Your Career Cluster: {results.name}
            </CardTitle>
            <p className="text-lg text-muted-foreground font-medium mb-2">
              {results.description}
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              {results.style}
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Perfect Match for You!
              </Badge>
            </div>

            {/* Detailed Career Information */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-primary" />
                      Top Career Opportunities
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {results.careers.slice(0, 6).map((career: string, index: number) => {
                        const careerSlug = getCareerSlug(career);
                        const CareerCard = ({ children }: { children: React.ReactNode }) => (
                          <div className={`bg-muted/50 rounded-lg p-4 transition-colors group ${
                            careerSlug ? "hover:bg-muted cursor-pointer" : "opacity-60"
                          }`}>
                            <div className="text-center">
                              <div className="text-2xl mb-2">
                                {index === 0 ? "💡" : index === 1 ? "🚀" : index === 2 ? "⭐" : index === 3 ? "🎯" : index === 4 ? "🌟" : "✨"}
                              </div>
                              <h4 className={`font-medium transition-colors ${
                                careerSlug ? "group-hover:text-primary" : ""
                              }`}>
                                {career}
                              </h4>
                              {!careerSlug && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Coming soon — We're adding details for this career!
                                </p>
                              )}
                            </div>
                          </div>
                        );

                        return careerSlug ? (
                          <Link key={index} to={`/career/${careerSlug}`}>
                            <CareerCard>{null}</CareerCard>
                          </Link>
                        ) : (
                          <CareerCard key={index}>{null}</CareerCard>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="next-steps" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-primary" />
                      What to Do Next
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <h4 className="font-medium mb-2">🎯 Start Exploring!</h4>
                        <p className="text-sm text-muted-foreground">
                          Speak to people in these careers or try related projects to get hands-on experience.
                        </p>
                      </div>
                      <div className="p-4 bg-secondary/10 rounded-lg">
                        <h4 className="font-medium mb-2">📚 Learn More</h4>
                        <p className="text-sm text-muted-foreground">
                          Click on any career above to explore detailed information, educational requirements, and salary expectations.
                        </p>
                      </div>
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <h4 className="font-medium mb-2">🔄 Keep Growing</h4>
                        <p className="text-sm text-muted-foreground">
                          Interests can grow and change. Revisit this quiz yearly to check how your strengths evolve.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 px-6 py-3"
            onClick={() => window.location.href = "/quiz"}
          >
            <RotateCcw className="w-4 h-4" />
            Retake Quiz
          </Button>
          
          <Link to="/career-search">
            <Button className="px-6 py-3 flex items-center gap-2">
              Explore All Careers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
