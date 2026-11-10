// Flexible Course Learning Structure

export const createCourseStructure = (courseId) => ({
  courseId,

  coreClasses: {
    title: "Core Classes",
    chapters: [],
  },

  mentorship: {
    title: "Mentorship",
    classes: [],
  },

  exams: {
    title: "Course Exams",
    items: [],
  },
});

// Chapter structure
export const createChapter = () => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  order: 1,
  classes: [],
  notes: [],
  published: false,
});

// Class structure
export const createClass = () => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  videoUrl: "",
  order: 1,
  published: false,
});

// Note structure
export const createNote = () => ({
  id: crypto.randomUUID(),
  title: "",
  pdfUrl: "",
  order: 1,
  published: false,
});

// Mentorship class structure
export const createMentorshipClass = () => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  contentType: "video",
  videoUrl: "",
  pdfUrl: "",
  textContent: "",
  order: 1,
  published: false,
});

// Exam structure
export const createCourseExam = () => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  examUrl: "",
  order: 1,
  published: false,
});