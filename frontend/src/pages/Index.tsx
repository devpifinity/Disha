
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Compass, Target, Users, User } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10 max-w-7xl">
        {/* Profile Button */}
        <div className="flex justify-end mb-6">
          <Link to="/profile">
            <Button variant="outline" className="gap-2 h-9">
              <User className="w-4 h-4" />
              My Profile
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-3">
            Welcome to Disha
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Your journey to discovering the perfect career starts here
          </p>
        </div>

        {/* Main Options */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 text-foreground">
            How would you like to get started?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Explore Option */}
            <Card className="group hover:shadow-lg transition-all duration-200 border bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-14 h-14 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                    <Compass className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    I'm confused and need help!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Take a quick quiz to find careers that match your interests
                  </p>
                </div>
                <Link to="/quiz">
                  <Button className="w-full font-medium rounded-lg bg-gradient-primary hover:shadow-md transition-all duration-200">
                    Start Interest Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Direct Search Option */}
            <Card className="group hover:shadow-lg transition-all duration-200 border bg-card/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <div className="w-14 h-14 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
                    <Target className="w-7 h-7 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    I know what I'm looking for
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Search for specific careers and explore educational paths
                  </p>
                </div>
                <Link to="/career-search">
                  <Button 
                    variant="outline" 
                    className="w-full font-medium rounded-lg border-2 hover:shadow-md transition-all duration-200"
                  >
                    Browse Careers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl md:text-2xl font-semibold text-center mb-6 text-foreground">
            What makes Disha special?
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-5 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
              <div className="w-11 h-11 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Comprehensive Guidance</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">Detailed information about career paths, education requirements, and growth opportunities</p>
            </div>
            <div className="text-center p-5 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
              <div className="w-11 h-11 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-3">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Personalized Recommendations</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">Smart quiz that analyzes your interests and suggests careers that fit your personality</p>
            </div>
            <div className="text-center p-5 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200">
              <div className="w-11 h-11 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2 text-sm">Expert Insights</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">Real-world perspectives from industry professionals on different career paths</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
