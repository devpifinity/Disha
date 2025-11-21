import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ArrowRight, Sparkles, Trophy, User } from "lucide-react";
import { saveQuizResult } from "@/lib/userProfileStorage";
import { useEffect, useState } from "react";

// Helper function to convert career name to slug
const careerNameToSlug = (careerName: string): string => {
  // Extract the career title before " – " if it exists
  const title = careerName.split(" – ")[0].trim();
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[/&]/g, "-")
    .replace(/--+/g, "-");
};

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, answers } = location.state || {};
  const [isSaved, setIsSaved] = useState(false);

  // Save quiz result to profile on mount
  useEffect(() => {
    if (results && answers && !isSaved) {
      saveQuizResult({
        cluster: results.name,
        clusterDescription: results.description,
        careers: results.careers,
        answers: answers,
      });
      setIsSaved(true);
    }
  }, [results, answers, isSaved]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4">No results found</h2>
            <p className="text-muted-foreground mb-6">Please take the quiz first to see your results.</p>
            <Link to="/quiz">
              <Button>Take Quiz</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-3">
            Your Career Path Results
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Based on your responses, here's your career direction!
          </p>
        </div>

        {/* Main Result Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="text-center pb-3">
            <div className="inline-block mb-3">
              <Badge variant="secondary" className="text-sm px-4 py-1.5">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Your Career Type
              </Badge>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-2">
              {results.name}
            </CardTitle>
            <p className="text-base text-foreground font-medium mb-1">
              {results.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {results.style}
            </p>
          </CardHeader>

          <CardContent className="pt-2">
            {/* Perfect Careers List */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-center">
                Probable Careers For You
              </h3>
              <div className="bg-muted/30 rounded-lg p-4">
                <ul className="space-y-2">
                  {results.careers.map((career: string, index: number) => {
                    const careerTitle = career.split(" – ")[0];
                    const careerDescription = career.includes(" – ") ? career.split(" – ")[1] : "";
                    const slug = careerNameToSlug(career);
                    
                    return (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-2 mt-0.5">•</span>
                        <span className="text-sm">
                          <Link 
                            to={`/career/${slug}`}
                            className="font-semibold text-primary hover:underline"
                          >
                            {careerTitle}
                          </Link>
                          {careerDescription && (
                            <span className="text-muted-foreground"> – {careerDescription}</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Combination/Blended Careers if applicable */}
            {results.blendedCareers && results.blendedCareers.length > 0 && (
              <div className="mb-6 p-4 bg-secondary/10 rounded-lg">
                <h3 className="font-semibold text-base mb-2">
                  Blended Career Opportunities
                </h3>
                <ul className="space-y-1.5">
                  {results.blendedCareers.map((career: string, index: number) => {
                    const slug = careerNameToSlug(career);
                    
                    return (
                      <li key={index} className="flex items-start">
                        <span className="text-secondary mr-2">•</span>
                        <Link 
                          to={`/career/${slug}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          {career}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 h-10"
            onClick={() => window.location.href = "/quiz"}
          >
            <RotateCcw className="w-4 h-4" />
            Restart Quiz
          </Button>

          <Link to="/career-search">
            <Button className="h-10 flex items-center gap-2 w-full sm:w-auto">
              Explore All Careers
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="flex items-center gap-2 h-10"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4" />
            View My Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
