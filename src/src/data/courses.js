
export const courses = [
  {
    id: "mcq-mission-27",
    slug: "mcq-mission-27",

    title: "SSC 27 MCQ Booster",
    subtitle: "MCQ Mission 27 — SSC Physics MCQ Mastery Course",

    subject: "Physics",
    exam: "SSC 2027",

    status: "running",
    accessType: "free",

    description:
      "Complete SSC Physics preparation with video classes, lecture slides, practice sheets and exams.",

    duration: "Coming Soon",
    target: "SSC 27",
    rating: null,

    logo: "",
    banner: "",

    order: 1,

    categories: [
      "Video Classes",
      "Lecture Slides",
      "Practice Sheets",
      "Exams"
    ]
  },

  {
    id: "grammar-boss-28",
    slug: "grammar-boss-28",

    title: "SSC 28 Grammar Boss",
    subtitle: "English Grammar Course",

    subject: "English",
    exam: "SSC 2028",

    status: "coming-soon",
    accessType: "free",

    description:
      "Build a strong foundation in English grammar for SSC 2028.",

    duration: "Coming Soon",
    target: "SSC 28",
    rating: null,

    logo: "",
    banner: "",

    order: 2,

    categories: []
  },

  {
    id: "physics-28",
    slug: "physics-28",

    title: "SSC 28 Physics",
    subtitle: "Basic to Advance",

    subject: "Physics",
    exam: "SSC 2028",

    status: "coming-soon",
    accessType: "free",

    description:
      "Learn Physics from basic concepts to advanced SSC preparation.",

    duration: "Coming Soon",
    target: "SSC 28",
    rating: null,

    logo: "",
    banner: "",

    order: 3,

    categories: []
  }
];

export const getCourseBySlug = (slug) => {
  return courses.find((course) => course.slug === slug);
};
