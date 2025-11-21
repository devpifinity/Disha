
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Laptop, Stethoscope, DollarSign, GraduationCap, Palette, Wrench, Sparkles } from "lucide-react";

const quizQuestions = [
  {
    id: 1,
    question: "What do you like doing most?",
    options: [
      { id: "a", text: "Playing on computer or mobile phone", icon: Laptop },
      { id: "b", text: "Taking care of sick people or animals", icon: Stethoscope },
      { id: "c", text: "Counting money or helping in shops", icon: DollarSign },
      { id: "d", text: "Teaching friends or helping them solve problems", icon: GraduationCap },
      { id: "e", text: "Drawing, singing, or making videos", icon: Palette },
      { id: "f", text: "Fixing broken things or building something", icon: Wrench }
    ]
  },
  {
    id: 2,
    question: "What are you really good at?",
    options: [
      { id: "a", text: "Using computers and solving puzzles", icon: Laptop },
      { id: "b", text: "Helping others feel better", icon: Stethoscope },
      { id: "c", text: "Organizing things and planning", icon: DollarSign },
      { id: "d", text: "Talking to people and making friends", icon: GraduationCap },
      { id: "e", text: "Creating beautiful or fun things", icon: Palette },
      { id: "f", text: "Working with hands and tools", icon: Wrench }
    ]
  },
  {
    id: 3,
    question: "Which subject do you enjoy most in school?",
    weighted: true,
    options: [
      { id: "a", text: "Maths, Physics, Computer", icon: Laptop },
      { id: "b", text: "Biology or Environmental Science", icon: Stethoscope },
      { id: "c", text: "Business Studies, Accounts, Economics", icon: DollarSign },
      { id: "d", text: "Languages, History, Civics", icon: GraduationCap },
      { id: "e", text: "Art, Music, Media", icon: Palette },
      { id: "f", text: "Vocational, Electrical, Mechanical, Sports", icon: Wrench }
    ]
  },
  {
    id: 4,
    question: "Where would you like to work?",
    options: [
      { id: "a", text: "Office with computers", icon: Laptop },
      { id: "b", text: "Hospital or clinic", icon: Stethoscope },
      { id: "c", text: "Bank or business office", icon: DollarSign },
      { id: "d", text: "School or government office", icon: GraduationCap },
      { id: "e", text: "TV studio or art gallery", icon: Palette },
      { id: "f", text: "Factory or construction site", icon: Wrench }
    ]
  },
  {
    id: 5,
    question: "What makes you feel proud?",
    options: [
      { id: "a", text: "Solving difficult problems", icon: Laptop },
      { id: "b", text: "Helping sick people get better", icon: Stethoscope },
      { id: "c", text: "Earning and saving money", icon: DollarSign },
      { id: "d", text: "Teaching something to others", icon: GraduationCap },
      { id: "e", text: "Making something beautiful", icon: Palette },
      { id: "f", text: "Building something useful", icon: Wrench }
    ]
  },
  {
    id: 6,
    question: "Which activity sounds most interesting?",
    options: [
      { id: "a", text: "Creating websites or apps", icon: Laptop },
      { id: "b", text: "Taking care of plants and animals", icon: Stethoscope },
      { id: "c", text: "Running a small business", icon: DollarSign },
      { id: "d", text: "Organizing community events", icon: GraduationCap },
      { id: "e", text: "Making drawings or music", icon: Palette },
      { id: "f", text: "Repairing motorcycles or electronics", icon: Wrench }
    ]
  },
  {
    id: 7,
    question: "What do people usually ask you to help with?",
    options: [
      { id: "a", text: "Computer or phone problems", icon: Laptop },
      { id: "b", text: "When they are hurt or sick", icon: Stethoscope },
      { id: "c", text: "Money decisions or planning", icon: DollarSign },
      { id: "d", text: "Personal problems or fights", icon: GraduationCap },
      { id: "e", text: "Making things look nice", icon: Palette },
      { id: "f", text: "Fixing or building something", icon: Wrench }
    ]
  },
  {
    id: 8,
    question: "Which type of video or show do you enjoy most?",
    options: [
      { id: "a", text: "Science and technology shows", icon: Laptop },
      { id: "b", text: "Animal and nature shows", icon: Stethoscope },
      { id: "c", text: "Business and success stories", icon: DollarSign },
      { id: "d", text: "News and social programs", icon: GraduationCap },
      { id: "e", text: "Music and entertainment shows", icon: Palette },
      { id: "f", text: "Building and repair shows", icon: Wrench }
    ]
  },
  {
    id: 9,
    question: "What is most important in your future job?",
    options: [
      { id: "a", text: "Working with latest technology", icon: Laptop },
      { id: "b", text: "Helping people live better lives", icon: Stethoscope },
      { id: "c", text: "Earning good money", icon: DollarSign },
      { id: "d", text: "Making society better", icon: GraduationCap },
      { id: "e", text: "Being creative and famous", icon: Palette },
      { id: "f", text: "Making real things people use", icon: Wrench }
    ]
  },
  {
    id: 10,
    question: "Which skill do you want to learn more?",
    weighted: true,
    options: [
      { id: "a", text: "Computer programming", icon: Laptop },
      { id: "b", text: "Medical or health skills", icon: Stethoscope },
      { id: "c", text: "Business and money management", icon: DollarSign },
      { id: "d", text: "Communication and leadership", icon: GraduationCap },
      { id: "e", text: "Art, music, or design", icon: Palette },
      { id: "f", text: "Technical and mechanical skills", icon: Wrench }
    ]
  }
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const navigate = useNavigate();

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Auto-advance after a brief delay
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = optionId;
      setAnswers(newAnswers);

      if (currentQuestion === quizQuestions.length - 1) {
        // Quiz completed, calculate results and navigate
        const finalAnswers = [...newAnswers];
        const results = calculateResults(finalAnswers);
        navigate("/quiz-results", { state: { results, answers: finalAnswers } });
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(answers[currentQuestion + 1] || "");
      }
    }, 500);
  };

  const handleNext = () => {
    if (selectedOption) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedOption;
      setAnswers(newAnswers);

      if (currentQuestion === quizQuestions.length - 1) {
        // Quiz completed, calculate results and navigate
        const finalAnswers = [...newAnswers];
        const results = calculateResults(finalAnswers);
        navigate("/quiz-results", { state: { results, answers: finalAnswers } });
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(answers[currentQuestion + 1] || "");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || "");
    }
  };

  const calculateResults = (finalAnswers: string[]) => {
    // Calculate weighted scores
    const scores = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    
    finalAnswers.forEach((answer, index) => {
      if (answer in scores) {
        // Q3 (index 2) and Q10 (index 9) are weighted 1.5x
        const weight = (index === 2 || index === 9) ? 1.5 : 1;
        scores[answer as keyof typeof scores] += weight;
      }
    });

    // Q9 adjustment: if answer is 'd' (Making society better) and D or F are in top 3
    if (finalAnswers[8] === 'd') {
      const sortedEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      const top3Letters = sortedEntries.slice(0, 3).map(([letter]) => letter);
      if (top3Letters.includes('d')) {
        scores.d += 0.2;
      }
    }

    // Find max score and determine primary/secondary
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const maxScore = sortedScores[0][1];
    const primaryLetter = sortedScores[0][0] as keyof typeof scores;
    
    // Check for secondary (>=80% of top score)
    const secondaryThreshold = maxScore * 0.8;
    const secondaryLetters = sortedScores
      .slice(1)
      .filter(([_, score]) => score >= secondaryThreshold)
      .map(([letter]) => letter);
    
    // Check for Mixed/Multi-Talented (3+ within 1 point of top)
    const mixedThreshold = maxScore - 1;
    const closeScores = sortedScores.filter(([_, score]) => score >= mixedThreshold);
    const isMixed = closeScores.length >= 3;

    const careerGroups = {
      a: {
        letter: "A",
        name: "Problem Solver & Tech Innovator",
        description: "You love solving complex problems and working with technology.",
        style: "You enjoy understanding how things work and creating innovative solutions.",
        careers: [
          "Software Engineer – Create mobile apps and websites",
          "Data Scientist – Analyze data to help companies make decisions",
          "Web Developer – Build websites and digital tools",
          "Cybersecurity Specialist – Protect computers from hackers",
          "Computer Programmer – Write code for software",
          "AI Engineer – Build intelligent systems",
          "Research Analyst – Explore scientific and technical data",
          "IT Support Engineer – Help users fix technical problems"
        ]
      },
      b: {
        letter: "B",
        name: "Helper & Life Sciences Explorer",
        description: "You are caring and curious about living things.",
        style: "You want to make the world healthier and safer for people, animals, and the environment.",
        careers: [
          "Doctor – Treat patients and save lives",
          "Nurse – Care for people in hospitals",
          "Pharmacist – Prepare and distribute medicines",
          "Physiotherapist – Help patients recover from injuries",
          "Veterinarian – Care for animals",
          "Environmental Scientist – Protect nature and solve pollution problems",
          "Paramedic – Provide emergency healthcare",
          "Agricultural Scientist – Improve crops and farming"
        ]
      },
      c: {
        letter: "C",
        name: "Business Leader & Strategic Thinker",
        description: "You have strong organizational skills and business sense.",
        style: "You understand how to manage resources, make strategic decisions, and create successful ventures.",
        careers: [
          "Business Manager – Lead teams and run companies",
          "Financial Advisor – Help people invest and save money wisely",
          "Chartered Accountant – Handle company finances and taxes",
          "Investment Banker – Help companies raise money and grow",
          "Marketing Manager – Promote products and increase sales",
          "Sales Director – Lead sales teams and meet targets",
          "Entrepreneur – Start and run your own business",
          "Store Owner – Manage retail shops and customer service",
          "Project Manager – Plan and execute important business projects",
          "Human Resources Manager – Hire and manage company employees",
          "Business Analyst – Study how businesses can work better",
          "Management Consultant – Advise companies on improvement"
        ]
      },
      d: {
        letter: "D",
        name: "People Person & Community Builder",
        description: "You love helping others and making society better.",
        style: "You are a strong communicator who can inspire positive change in people and communities.",
        careers: [
          "Teacher – Educate and guide students",
          "Social Worker – Support families and communities",
          "Civil Servant – Work for public welfare",
          "Lawyer – Represent people and uphold justice",
          "Counselor – Help others with guidance and empathy",
          "Police Officer – Protect people and ensure safety",
          "Psychologist – Support mental health and wellbeing",
          "Government Officer – Manage public programs",
          "NGO Program Manager – Lead social initiatives"
        ]
      },
      e: {
        letter: "E",
        name: "Creative Innovator & Artist",
        description: "You are imaginative and expressive.",
        style: "You love bringing ideas to life through art, media, or design.",
        careers: [
          "Graphic Designer – Create visuals and digital content",
          "Writer/Journalist – Tell stories that inform or inspire",
          "Musician – Compose and perform music",
          "Film Director – Create movies and short films",
          "Photographer – Capture moments and tell stories visually",
          "Architect – Design beautiful spaces",
          "Fashion Designer – Create clothing and style trends",
          "Animator/Video Editor – Bring stories to life on screen",
          "Content Creator – Build online audiences",
          "Advertising Creative – Design marketing campaigns"
        ]
      },
      f: {
        letter: "F",
        name: "Builder & Technical Craftsperson",
        description: "You enjoy working with your hands and seeing tangible results.",
        style: "You have strong technical and practical skills.",
        careers: [
          "Civil Engineer – Design and build infrastructure",
          "Electrician – Install and repair electrical systems",
          "Mechanic – Repair and maintain machines",
          "Carpenter – Build furniture and structures",
          "Plumber – Manage water and drainage systems",
          "Welder – Join and shape metal parts",
          "Construction Manager – Supervise building projects",
          "Manufacturing Technician – Operate and maintain factory equipment",
          "Pilot/Driver – Operate vehicles safely and efficiently",
          "Chef – Create food with creativity and precision"
        ]
      }
    };

    // Handle Mixed/Multi-Talented case
    if (isMixed) {
      return {
        letter: "Mixed",
        name: "Mixed / Multi-Talented",
        description: "You have diverse interests and can excel in multiple areas.",
        style: "Explore interdisciplinary careers that combine creativity, logic, and leadership.",
        careers: [
          "Product Designer – Combine creativity and technology",
          "EdTech Manager – Blend education and technology",
          "Project Manager – Coordinate people and processes",
          "Entrepreneur – Use your diverse skills to build new ventures",
          "Consultant – Work across different industries and problems"
        ],
        primary: null,
        secondary: null,
        isMixed: true
      };
    }

    // Handle combination if there's a secondary
    if (secondaryLetters.length > 0) {
      const secondaryLetter = secondaryLetters[0] as keyof typeof careerGroups;
      const combination = `${primaryLetter.toUpperCase()} + ${secondaryLetter.toUpperCase()}`;
      
      const combinationCareers: { [key: string]: string[] } = {
        "A + E": ["UI/UX Designer", "Game Developer", "Creative Technologist"],
        "E + A": ["Product Designer", "UX Engineer"],
        "A + C": ["Tech Entrepreneur", "Business Analyst", "Product Manager"],
        "C + A": ["Tech Entrepreneur", "Business Analyst", "Product Manager"],
        "B + D": ["Public Health Educator", "NGO Program Officer"],
        "D + B": ["Public Health Educator", "NGO Program Officer"],
        "B + F": ["Biomedical Technician", "Field Veterinarian"],
        "F + B": ["Biomedical Technician", "Field Veterinarian"],
        "C + D": ["School Operations Manager", "EdTech Product Manager", "NGO Program Manager"],
        "D + C": ["School Operations Manager", "EdTech Product Manager", "NGO Program Manager"],
        "D + F": ["Defence or Disaster Management Officer", "Police Engineer"],
        "F + D": ["Defence or Disaster Management Officer", "Police Engineer"],
        "E + C": ["Brand Manager", "Creative Entrepreneur"],
        "C + E": ["Brand Manager", "Creative Entrepreneur"]
      };

      const blendedCareers = combinationCareers[combination] || [];

      return {
        ...careerGroups[primaryLetter],
        primary: careerGroups[primaryLetter],
        secondary: careerGroups[secondaryLetter],
        blendedCareers,
        isMixed: false
      };
    }

    // Single primary result
    return {
      ...careerGroups[primaryLetter],
      primary: null,
      secondary: null,
      isMixed: false
    };
  };

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-hero-bg py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
            Find Your Dream Career
          </h1>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl mx-auto">
            Answer 10 simple questions to discover your perfect job.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-6 border bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-lg md:text-xl font-semibold text-foreground mb-6 text-center">
              {currentQ.question}
            </h2>

            <div className="space-y-2.5">
              {currentQ.options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full p-3.5 text-left rounded-lg border transition-all duration-200 hover:shadow-md group ${
                      selectedOption === option.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                          selectedOption === option.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }`}>
                          {option.id.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2.5 flex-1">
                        <div className="opacity-70 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="text-sm font-medium text-foreground leading-relaxed">
                          {option.text}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 h-9"
            >
              Go to Home
            </Button>
            
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2 h-9"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          </div>

          <div className="text-muted-foreground text-xs">
            {selectedOption ? "Moving to next..." : "Select an answer"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
