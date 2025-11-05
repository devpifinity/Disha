import { useState , useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Target, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase";
import type { CareerPath, College, Course, Exam } from "@/integrations/supabase";
import { useQuery } from '@tanstack/react-query';

const CareerSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
 const [careerPathData, setCareerPathData] = useState([]);


  

    const fetchCareerData = useQuery({
    queryKey: ['career-path'],
    queryFn: async () => {
      const { data, error } = await supabase

     .from("career_path")
  .select(`
    id,
    name,
    career_job_opportunity (
      job_title,
      college_course_jobs (
          college(name),
          course(name)
        )
      )
    )
  `);



      if (error) throw error;
      setCareerPathData(data)
    },
  });
  


  // Popular career options with their slugs
  const popularCareers = [
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

  // Filter careers based on search term
  const filteredCareers = careerPathData.filter(career =>
    career.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCareerSelect = (slug: string) => {
    navigate(`/career/${slug}`);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "STEM": "bg-blue-100 text-blue-700",
      "Creative": "bg-purple-100 text-purple-700",
      "Helping": "bg-green-100 text-green-700",
      "Business": "bg-orange-100 text-orange-700",
      "Skilled Trades": "bg-yellow-100 text-yellow-700",
      "Public Service": "bg-red-100 text-red-700"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center shadow-xl">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Find Your Career
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for a specific career or browse popular options to explore detailed information about your career of interest.
          </p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="w-5 h-5 text-green-600" />
              Search for a Career
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Type a career name (e.g., Doctor, Engineer, Artist)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg border-2 border-green-200 focus:border-green-500"
              />
            </div>
            {searchTerm && filteredCareers.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  No careers found matching "{searchTerm}". Try browsing popular careers below or try a different search term.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Careers Section */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              {searchTerm ? `Search Results (${filteredCareers.length})` : "Popular Career Options"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredCareers.map((career, index) => (
                <div
                  key={index}
                  onClick={() => handleCareerSelect(career.slug)}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-green-300 transition-all duration-300 cursor-pointer group bg-white"
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{career.emoji}</div>
                    <h3 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                      {career.name} Jobs {career.career_job_opportunity.length}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {filteredCareers.length === 0 && !searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading career options...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-100 to-teal-100 border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                💡 Can't find what you're looking for?
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                If you don't see your career of interest, try our interest quiz to discover new possibilities, 
                or search using different keywords. We're constantly adding new careers to our database.
              </p>
              <Link to="/quiz">
                <Button variant="outline" className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white">
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
