
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Target, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase";
import { generateSlug } from "@/lib/careerQueries";

// Type for database career with joined cluster
type DbCareer = {
  id: number;
  name: string;
  career_cluster_id: number;
  career_cluster: {
    id: number;
    name: string;
  }[] | null;
};

const CareerSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch careers from database with career cluster information
  const { data: dbCareers, error: dbError, isLoading } = useQuery<DbCareer[]>({
    queryKey: ['all-careers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_path')
        .select(`
          id,
          name,
          career_cluster_id,
          career_cluster:career_cluster_id (
            id,
            name
          )
        `);

      if (error) {
        console.error('Error fetching careers from database:', error);
        throw error;
      }
      return data as DbCareer[];
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  // Hardcoded fallback career options with their slugs (Lovable's UI data)
  const fallbackCareers = [
    { name: "Civil Engineer", slug: "civil-engineer", category: "STEM", emoji: "🏗️" },
    { name: "Psychologist", slug: "psychologist", category: "Helping", emoji: "🧠" },
    { name: "Data Scientist", slug: "data-scientist", category: "STEM", emoji: "📊" },
    { name: "Graphic Designer", slug: "graphic-designer", category: "Creative", emoji: "🎨" },
    { name: "Marketing Specialist", slug: "marketing-specialist", category: "Business", emoji: "📈" },
    { name: "Mechanical Engineer", slug: "mechanical-engineer", category: "STEM", emoji: "⚙️" },
    { name: "Teacher", slug: "teacher", category: "Helping", emoji: "👩‍🏫" },
    { name: "Software Developer", slug: "software-developer", category: "STEM", emoji: "💻" },
    { name: "Doctor", slug: "doctor", category: "Helping", emoji: "👩‍⚕️" },
    { name: "Architect", slug: "architect", category: "STEM", emoji: "🏛️" },
    { name: "Lawyer", slug: "lawyer", category: "Business", emoji: "⚖️" },
    { name: "Entrepreneur", slug: "entrepreneur", category: "Business", emoji: "🚀" },
    { name: "Army Officer", slug: "army-officer", category: "Public Service", emoji: "🪖" },
    { name: "Navy Officer", slug: "navy-officer", category: "Public Service", emoji: "⚓" },
    { name: "Police Officer", slug: "police-officer", category: "Public Service", emoji: "👮‍♂️" },
    { name: "IAS Officer", slug: "ias-officer", category: "Public Service", emoji: "🏛️" },
    { name: "Nurse", slug: "nurse", category: "Helping", emoji: "👩‍⚕️" },
    { name: "Paramedical Technician", slug: "paramedical-technician", category: "Helping", emoji: "🚑" },
    { name: "Agricultural Engineer", slug: "agricultural-engineer", category: "STEM", emoji: "🌾" },
    { name: "Biotechnologist", slug: "biotechnologist", category: "STEM", emoji: "🧬" },
    { name: "Physiotherapist", slug: "physiotherapist", category: "Helping", emoji: "🏥" },
    { name: "Nutritionist", slug: "nutritionist", category: "Helping", emoji: "🥗" },
    { name: "Banking Professional", slug: "banking-professional", category: "Business", emoji: "🏦" },
    { name: "Accountant", slug: "accountant", category: "Business", emoji: "📊" }
  ];

  // Emoji mapping for career categories
  const categoryEmojiMap: Record<string, string> = {
    "Civil Engineer": "🏗️",
    "Psychologist": "🧠",
    "Data Scientist": "📊",
    "Graphic Designer": "🎨",
    "Marketing Specialist": "📈",
    "Mechanical Engineer": "⚙️",
    "Teacher": "👩‍🏫",
    "Software Developer": "💻",
    "Doctor": "👩‍⚕️",
    "Architect": "🏛️",
    "Lawyer": "⚖️",
    "Entrepreneur": "🚀",
    "Army Officer": "🪖",
    "Navy Officer": "⚓",
    "Police Officer": "👮‍♂️",
    "IAS Officer": "🏛️",
    "Nurse": "👩‍⚕️",
    "Paramedical Technician": "🚑",
    "Agricultural Engineer": "🌾",
    "Biotechnologist": "🧬",
    "Physiotherapist": "🏥",
    "Nutritionist": "🥗",
    "Banking Professional": "🏦",
    "Accountant": "📊"
  };

  // Use useEffect to warn when falling back to hardcoded data
  useEffect(() => {
    if (!isLoading && (!dbCareers || dbCareers.length === 0)) {
      console.warn(
        '⚠️ WARNING: Database does not have career data. Using fallback hardcoded careers.',
        '\nReason:',
        dbError ? `Database error: ${dbError.message}` : 'No careers found in database',
        '\nTo fix: Ensure career_path table is populated with data.'
      );
    } else if (!isLoading && dbCareers && dbCareers.length > 0) {
      console.log(`✅ Successfully loaded ${dbCareers.length} careers from database`);
    }
  }, [dbCareers, dbError, isLoading]);

  // Merge database careers with fallback, preferring DB data
  const popularCareers = dbCareers && dbCareers.length > 0
    ? dbCareers.map(career => {
        // Get category name from the joined career_cluster data (Supabase returns array for joins)
        const clusterName = career.career_cluster?.[0]?.name || '';
        const category = clusterName || 'STEM'; // Default to STEM if no cluster

        return {
          name: career.name,
          slug: generateSlug(career.name),
          category: category,
          emoji: categoryEmojiMap[career.name] || "💼"
        };
      })
    : fallbackCareers;

  // Filter careers based on search term
  const filteredCareers = popularCareers.filter(career =>
    career.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCareerSelect = (slug: string) => {
    navigate(`/career/${slug}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "STEM": "bg-accent/10 text-accent",
      "Creative": "bg-primary/10 text-primary",
      "Helping": "bg-secondary/10 text-secondary",
      "Business": "bg-accent/10 text-accent",
      "Skilled Trades": "bg-primary/10 text-primary",
      "Public Service": "bg-secondary/10 text-secondary"
    };
    return colors[category as keyof typeof colors] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-gradient-hero-bg py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2 h-9">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
              <Target className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            Find Your Career
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Search for a specific career or browse popular options below
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-6 border bg-card/90 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="w-5 h-5 text-primary" />
              Search for a Career
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Type a career name (e.g., Doctor, Engineer, Artist)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-base"
              />
            </div>
            {searchTerm && filteredCareers.length === 0 && (
              <div className="mt-3 p-3 bg-muted rounded-lg border">
                <p className="text-sm text-muted-foreground">
                  No careers found matching "{searchTerm}". Try browsing popular careers below.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Careers Section */}
        <Card className="border bg-card/90 backdrop-blur-sm mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              {searchTerm ? `Search Results (${filteredCareers.length})` : "Popular Career Options"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredCareers.map((career, index) => (
                <div
                  key={index}
                  onClick={() => handleCareerSelect(career.slug)}
                  className="p-3 border rounded-lg hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer group bg-card"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{career.emoji}</div>
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {career.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {filteredCareers.length === 0 && !searchTerm && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">Loading career options...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-muted/50 border">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-2 text-base">
                💡 Can't find what you're looking for?
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Try our interest quiz to discover new possibilities or search using different keywords
              </p>
              <Link to="/quiz">
                <Button variant="outline" className="border-2 h-9">
                  Take Interest Quiz Instead
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CareerSearch;
