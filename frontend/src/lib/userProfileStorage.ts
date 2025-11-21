export interface QuizResult {
  id: string;
  date: string;
  cluster: string;
  clusterDescription: string;
  careers: string[];
  answers: string[];
}

export interface SavedCollege {
  id: string;
  name: string;
  location: string;
  type: string;
  fees: string;
  career: string;
  savedDate: string;
}

export interface UserProfile {
  quizResults: QuizResult[];
  savedColleges: SavedCollege[];
}

const STORAGE_KEY = 'disha_user_profile';

export const getUserProfile = (): UserProfile => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return { quizResults: [], savedColleges: [] };
};

export const saveQuizResult = (result: Omit<QuizResult, 'id' | 'date'>) => {
  const profile = getUserProfile();
  const newResult: QuizResult = {
    ...result,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  };
  profile.quizResults.unshift(newResult);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return newResult;
};

export const saveCollege = (college: Omit<SavedCollege, 'id' | 'savedDate'>) => {
  const profile = getUserProfile();
  const newCollege: SavedCollege = {
    ...college,
    id: Date.now().toString(),
    savedDate: new Date().toISOString(),
  };
  profile.savedColleges.unshift(newCollege);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  return newCollege;
};

export const unsaveCollege = (collegeName: string, career: string) => {
  const profile = getUserProfile();
  profile.savedColleges = profile.savedColleges.filter(
    (c) => !(c.name === collegeName && c.career === career)
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const isCollegeSaved = (collegeName: string, career: string): boolean => {
  const profile = getUserProfile();
  return profile.savedColleges.some(
    (c) => c.name === collegeName && c.career === career
  );
};

export const deleteQuizResult = (id: string) => {
  const profile = getUserProfile();
  profile.quizResults = profile.quizResults.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};
