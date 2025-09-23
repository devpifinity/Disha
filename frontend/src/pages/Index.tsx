
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Compass, Target, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero-bg relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4 drop-shadow-sm">
            Welcome to Disha
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your journey to discovering the perfect career starts here. Let's explore your future together!
          </p>
        </div>

        {/* Main Options */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground">
            How would you like to get started?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Explore Option */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Compass className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    I'm confused and need help!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Take this quick quiz to find careers that could be a good match for you.
                  </p>
                </div>
                <Link to="/quiz">
                  <Button className="w-full font-medium py-3 rounded-lg bg-gradient-primary hover:shadow-lg transition-all duration-300">
                    Start Interest Quiz
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Direct Search Option */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-secondary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-3">
                    I know what I'm looking for
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Search for specific careers, explore educational paths, or dive into detailed career information.
                  </p>
                </div>
                <Link to="/career-search">
                  <Button 
                    variant="outline" 
                    className="w-full font-medium py-3 rounded-lg border-2 hover:shadow-lg transition-all duration-300"
                  >
                    Browse Careers
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-8 text-foreground">
            What makes Disha special?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Comprehensive Guidance</h4>
              <p className="text-muted-foreground text-sm">Get detailed information about career paths, education requirements, and growth opportunities.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Personalized Recommendations</h4>
              <p className="text-muted-foreground text-sm">Our smart quiz analyzes your interests to suggest careers that truly fit your personality.</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Expert Insights</h4>
              <p className="text-muted-foreground text-sm">Learn from industry professionals and get real-world perspectives on different career paths.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
