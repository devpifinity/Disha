import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  ArrowLeft, 
  Calendar, 
  Trash2, 
  BookmarkCheck,
  GraduationCap,
  MapPin,
  IndianRupee,
  FileText,
  Heart
} from "lucide-react";
import { getUserProfile, deleteQuizResult, unsaveCollege } from "@/lib/userProfileStorage";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Helper function to convert career name to slug
const careerNameToSlug = (careerName: string): string => {
  const title = careerName.split(" – ")[0].trim();
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[/&]/g, "-")
    .replace(/--+/g, "-");
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState(getUserProfile());

  const handleDeleteQuizResult = (id: string) => {
    deleteQuizResult(id);
    setProfile(getUserProfile());
    toast({
      title: "Quiz result deleted",
      description: "Your quiz result has been removed from your profile.",
    });
  };

  const handleUnsaveCollege = (collegeName: string, career: string) => {
    unsaveCollege(collegeName, career);
    setProfile(getUserProfile());
    toast({
      title: "College removed",
      description: "The college has been removed from your saved list.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Your career journey dashboard</p>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="quiz-results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz-results" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Quiz Results ({profile.quizResults.length})
            </TabsTrigger>
            <TabsTrigger value="saved-colleges" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Saved Colleges ({profile.savedColleges.length})
            </TabsTrigger>
          </TabsList>

          {/* Quiz Results Tab */}
          <TabsContent value="quiz-results" className="space-y-4">
            {profile.quizResults.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No quiz results yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Take the career pathways quiz to discover your career cluster
                  </p>
                  <Button onClick={() => navigate("/quiz")}>
                    Take Quiz
                  </Button>
                </CardContent>
              </Card>
            ) : (
              profile.quizResults.map((result) => (
                <Card key={result.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{result.cluster}</CardTitle>
                        <p className="text-sm text-muted-foreground">{result.clusterDescription}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteQuizResult(result.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(result.date)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Recommended Careers
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.careers.map((career, idx) => {
                        const slug = careerNameToSlug(career);
                        const careerTitle = career.split(" – ")[0];
                        
                        return (
                          <Link key={idx} to={`/career/${slug}`}>
                            <Badge 
                              variant="secondary" 
                              className="cursor-pointer hover:bg-secondary/80 transition-colors"
                            >
                              {careerTitle}
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Saved Colleges Tab */}
          <TabsContent value="saved-colleges" className="space-y-4">
            {profile.savedColleges.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookmarkCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved colleges yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore colleges and save your favorites for easy access
                  </p>
                  <Button onClick={() => navigate("/career-search")}>
                    Explore Careers
                  </Button>
                </CardContent>
              </Card>
            ) : (
              profile.savedColleges.map((college) => (
                <Card key={college.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{college.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {college.location}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUnsaveCollege(college.name, college.career)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-3">
                      <Badge variant="outline">{college.type}</Badge>
                      <div className="flex items-center gap-1 text-sm">
                        <IndianRupee className="w-3 h-3" />
                        {college.fees}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3" />
                      Saved on {formatDate(college.savedDate)}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <Link to={`/career/${college.career}/colleges-scholarships`}>
                        View Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
