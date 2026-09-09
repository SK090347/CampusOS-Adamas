/** Heuristic readiness score — explicitly non-official. */

export type CareerInputs = {
  hasResume: boolean;
  projectsCount: number;
  clubsJoined: number;
  internships: number;
  courseworkDone: number;
};

export function careerReadiness(input: CareerInputs) {
  let score = 20;
  if (input.hasResume) score += 15;
  score += Math.min(25, input.projectsCount * 5);
  score += Math.min(15, input.clubsJoined * 5);
  score += Math.min(15, input.internships * 8);
  score += Math.min(10, input.courseworkDone * 2);
  score = Math.max(0, Math.min(100, score));

  let band = "Building foundations";
  if (score >= 75) band = "Interview-ready trajectory";
  else if (score >= 55) band = "Strengthening profile";
  else if (score >= 35) band = "Early exploration";

  return {
    score,
    band,
    disclaimer:
      "Non-official heuristic for reflection only — not a university assessment, placement guarantee, or graded evaluation.",
    suggestions: [
      !input.hasResume ? "Draft a one-page resume and review with Career Services." : null,
      input.projectsCount < 2 ? "Ship 1–2 portfolio projects (e.g. via Cy-Coder’s or Robotics club)." : null,
      input.internships < 1 ? "Talk to Career Services about internship timelines." : null,
      input.clubsJoined < 1 ? "Join a club aligned with your interests (try Find your club)." : null,
    ].filter(Boolean) as string[],
  };
}
