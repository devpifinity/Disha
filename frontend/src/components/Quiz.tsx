
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Laptop, Stethoscope, DollarSign, GraduationCap, Palette, Wrench, Sparkles } from "lucide-react";

const quizQuestions = [
  {
    id: 1,
    question: "In school, which subject do you find the easiest or most interesting?",
    options: [
      { id: "a", text: "Maths, computers, or problem-solving", icon: Laptop },
      { id: "b", text: "Biology, environment, or health science", icon: Stethoscope },
      { id: "c", text: "Business studies, accounts, or economics", icon: DollarSign },
      { id: "d", text: "Hindi, English, Social Science", icon: GraduationCap },
      { id: "e", text: "Drawing, music, or arts", icon: Palette },
      { id: "f", text: "Workshop/practical, repairing, or using tools", icon: Wrench }
    ]
  },
  {
    id: 2,
    question: "When your friends need help, what do they usually ask you for?",
    options: [
      { id: "a", text: "Fixing a phone or solving a tricky puzzle", icon: Laptop },
      { id: "b", text: "Health tips or science project help", icon: Stethoscope },
      { id: "c", text: "Money-saving ideas or event budgeting", icon: DollarSign },
      { id: "d", text: "Explaining something clearly or giving advice", icon: GraduationCap },
      { id: "e", text: "Creative help — art, design, or videos", icon: Palette },
      { id: "f", text: "Repairing a cycle, chair, or gadget", icon: Wrench }
    ]
  },
  {
    id: 3,
    question: "Which activity excites you the most?",
    options: [
      { id: "a", text: "Coding, problem-solving, or building an app", icon: Laptop },
      { id: "b", text: "Caring for people/animals or doing science experiments", icon: Stethoscope },
      { id: "c", text: "Selling things, tracking expenses, or planning a business", icon: DollarSign },
      { id: "d", text: "Teaching, mentoring, or leading a community program", icon: GraduationCap },
      { id: "e", text: "Designing posters, making videos, or performing on stage", icon: Palette },
      { id: "f", text: "Building, repairing, or making things with your hands", icon: Wrench }
    ]
  },
  {
    id: 4,
    question: "Which workplace feels closest to your dream job?",
    options: [
      { id: "a", text: "Technology lab or computer office", icon: Laptop },
      { id: "b", text: "Hospital, clinic, or research lab", icon: Stethoscope },
      { id: "c", text: "Bank, corporate office, or your own shop", icon: DollarSign },
      { id: "d", text: "School, NGO, or government office", icon: GraduationCap },
      { id: "e", text: "Design studio, music room, or art workshop", icon: Palette },
      { id: "f", text: "Factory, farm, garage, or outdoors", icon: Wrench }
    ]
  },
  {
    id: 5,
    question: "What is most important for you in your future career?",
    options: [
      { id: "a", text: "Solving new and challenging problems", icon: Laptop },
      { id: "b", text: "Helping people stay healthy and safe", icon: Stethoscope },
      { id: "c", text: "Earning money and becoming independent", icon: DollarSign },
      { id: "d", text: "Guiding or improving my community", icon: GraduationCap },
      { id: "e", text: "Expressing my creative ideas", icon: Palette },
      { id: "f", text: "Making real things with my own skills", icon: Wrench }
    ]
  },
  {
    id: 6,
    question: "Which skill do you feel you are strongest in?",
    options: [
      { id: "a", text: "Logical thinking and math", icon: Laptop },
      { id: "b", text: "Carefulness and attention to detail", icon: Stethoscope },
      { id: "c", text: "Planning and organizing work or money", icon: DollarSign },
      { id: "d", text: "Understanding and motivating people", icon: GraduationCap },
      { id: "e", text: "Drawing, acting, or storytelling", icon: Palette },
      { id: "f", text: "Using tools or fixing things", icon: Wrench }
    ]
  },
  {
    id: 7,
    question: "Which path after school sounds most interesting to you?",
    options: [
      { id: "a", text: "Science, computers, or engineering", icon: Laptop },
      { id: "b", text: "Nursing, farming, or healthcare", icon: Stethoscope },
      { id: "c", text: "Business, finance, or entrepreneurship", icon: DollarSign },
      { id: "d", text: "Teaching, law, or government services", icon: GraduationCap },
      { id: "e", text: "Arts, design, or media production", icon: Palette },
      { id: "f", text: "Technical trades like electrician, mechanic, or chef", icon: Wrench }
    ]
  },
  {
    id: 8,
    question: "How do you prefer to learn new things?",
    options: [
      { id: "a", text: "Using computers or online videos", icon: Laptop },
      { id: "b", text: "Hands-on experiments in real life", icon: Stethoscope },
      { id: "c", text: "By running a project or managing resources", icon: DollarSign },
      { id: "d", text: "By discussing and working in a group", icon: GraduationCap },
      { id: "e", text: "By creating or designing something", icon: Palette },
      { id: "f", text: "By watching and copying skilled workers", icon: Wrench }
    ]
  },
  {
    id: 9,
    question: "In your family or village, what are you known for?",
    options: [
      { id: "a", text: "Helping with technology problems", icon: Laptop },
      { id: "b", text: "Caring for people or animals", icon: Stethoscope },
      { id: "c", text: "Managing money or business tasks", icon: DollarSign },
      { id: "d", text: "Solving problems between people", icon: GraduationCap },
      { id: "e", text: "Creative talent — drawing, music, or dance", icon: Palette },
      { id: "f", text: "Repairing or making useful things", icon: Wrench }
    ]
  },
  {
    id: 10,
    question: "What do you dream of creating in the future?",
    options: [
      { id: "a", text: "A useful app, machine, or tech invention", icon: Laptop },
      { id: "b", text: "A healthier and safer community", icon: Stethoscope },
      { id: "c", text: "A successful business or shop", icon: DollarSign },
      { id: "d", text: "A fair and supportive society", icon: GraduationCap },
      { id: "e", text: "Creative work that inspires people", icon: Palette },
      { id: "f", text: "A well-built product or service made by you", icon: Wrench }
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
    const counts = { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 };
    finalAnswers.forEach(answer => {
      if (answer in counts) {
        counts[answer as keyof typeof counts]++;
      }
    });

    const maxCount = Math.max(...Object.values(counts));
    const topChoices = Object.keys(counts).filter(key => counts[key as keyof typeof counts] === maxCount);
    const topChoice = topChoices[0] as keyof typeof counts; // If tie, pick first

    const careerClusters = {
      a: {
        name: "Technology & Engineering",
        description: "Building the future with technology",
        style: "You enjoy solving complex problems, working with technology, and creating innovative solutions",
        careers: ["Software Developer", "Data Analyst", "Engineer", "IT Support", "Computer Hardware Specialist"],
        icon: "💻"
      },
      b: {
        name: "Health & Science",
        description: "Caring for people and discovering new knowledge",
        style: "You enjoy helping others stay healthy, conducting research, and understanding how the world works",
        careers: ["Nurse", "Lab Technician", "Pharmacist", "Paramedic", "Agriculture Scientist", "Environmental Specialist"],
        icon: "🩺"
      },
      c: {
        name: "Business & Finance",
        description: "Managing resources and building enterprises",
        style: "You enjoy working with money, planning business strategies, and creating economic opportunities",
        careers: ["Accountant", "Banker", "Sales Executive", "Entrepreneur", "Store Manager"],
        icon: "💼"
      },
      d: {
        name: "Social & Education",
        description: "Guiding others and building communities",
        style: "You enjoy teaching, helping people, and making your community a better place",
        careers: ["Teacher", "Social Worker", "Lawyer", "Government Officer", "Community Leader"],
        icon: "📚"
      },
      e: {
        name: "Creative & Media",
        description: "Expressing ideas and inspiring others",
        style: "You enjoy creating beautiful things, telling stories, and expressing your imagination",
        careers: ["Graphic Designer", "Animator", "Journalist", "Musician", "Film/Video Creator", "Writer"],
        icon: "🎨"
      },
      f: {
        name: "Skilled Trades & Technical Work",
        description: "Building and fixing with your hands",
        style: "You enjoy working with tools, creating practical solutions, and building things that people need",
        careers: ["Electrician", "Mechanic", "Plumber", "Carpenter", "Welder", "Driver", "Chef"],
        icon: "🔧"
      }
    };

    return {
      ...careerClusters[topChoice],
      topChoices: topChoices.length > 1 ? topChoices.map(choice => careerClusters[choice as keyof typeof careerClusters].name) : null
    };
  };

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent mb-4">
            🎯 Disha Career Pathways Quiz
          </h1>
          <p className="text-muted-foreground mb-2 max-w-2xl mx-auto">
            <strong>This is not a test.</strong> There are no right or wrong answers.
          </p>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Answer honestly — choose the option that feels most like you.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-8 text-center">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-200 hover:shadow-md group ${
                      selectedOption === option.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          selectedOption === option.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }`}>
                          {option.id.toUpperCase()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="text-lg opacity-70 group-hover:scale-110 transition-transform">
                          <IconComponent className="w-5 h-5" />
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
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              Go to Home
            </Button>
            
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
          </div>

          <div className="text-muted-foreground text-sm">
            {selectedOption ? "Moving to next question..." : "Select an answer to continue"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
