import CourseLearningPage from "./data/CourseLearningPage.jsx";

import { Link, Routes, Route, useParams, useLocation } from "react-router-dom";

import { useRef, useState, useEffect } from "react";

import { db, auth, storage } from "./firebase";

import {

  ref,

  uploadBytes,

  getDownloadURL,

  deleteObject

} from "firebase/storage";



import {

  collection,

  addDoc,

  serverTimestamp,

  doc,

  getDoc,

  getDocs,

  updateDoc,

    setDoc,

  deleteDoc,

  query,
  orderBy,
  where

} from "firebase/firestore";



import { onAuthStateChanged, signOut } from "firebase/auth";


import "./App.css";

import AdminLogin from "./AdminLogin";

function Navbar() {

  return (

    <header className="navbar">

<Link className="brand" to="/">

  <span className="brand-icon">∿</span>

  <span className="brand-name">NOTEPULSE <b>SCIENCE</b></span>

</Link>



      <nav>

        <Link to="/">Home</Link>

        <a href="/#courses">Courses</a>

        <Link to="/free-pdf.html">Free PDF</Link>

        <a href="https://youtube.com/@notepulsescience" target="_blank" rel="noreferrer">Demo Class</a>

        <a href="/#teacher">Teacher</a>

        <a href="/#contact">Contact</a>

      </nav>



      <a className="nav-button" href="/#courses">Explore Courses ↗</a>

    </header>

  );

}



function HomePage() {

  const carouselRef = useRef(null);



  const [contactForm, setContactForm] = useState({

    name: "",

    email: "",

    subject: "",

    message: ""

  });



  const [formStatus, setFormStatus] = useState("");

  const [isSending, setIsSending] = useState(false);

const [firestoreCourses, setFirestoreCourses] = useState([]);

const [isLoadingCourses, setIsLoadingCourses] = useState(true);

const [courseLoadError, setCourseLoadError] = useState("");



useEffect(() => {

  const loadPublicCourses = async () => {

    try {

      const q = query(

        collection(db, "courses"),

        orderBy("order", "asc")

      );



      const snapshot = await getDocs(q);



      setFirestoreCourses(

        snapshot.docs.map((item) => ({

          ...item.data(),

          firestoreId: item.id

        }))

      );

    } catch (error) {

      console.error("Homepage course loading error:", error);

      setCourseLoadError("Courses load করা যায়নি।");

    } finally {

      setIsLoadingCourses(false);

    }

  };



  loadPublicCourses();

}, []);



// Homepage courses must come only from Firestore.
// Deleted courses must never reappear from the old local static catalogue.
const homepageCourses = [...firestoreCourses].sort(
  (a, b) => (a.order ?? 9999) - (b.order ?? 9999)
);

  return (

    <div className="website">

      <Navbar />



      <main>

        <section className="hero">

          <div className="hero-content">

            <span className="eyebrow">✦ YOUR LEARNING JOURNEY STARTS HERE</span>

            <h1>Learn Smarter.<br /><span>Achieve Better.</span></h1>

            <p>

              SSC প্রস্তুতির প্রতিটি ধাপে তোমার নির্ভরযোগ্য learning partner।

              বুঝে শেখো, নিয়মিত practice করো, আত্মবিশ্বাসের সাথে এগিয়ে যাও।

            </p>

            <div className="hero-actions">

              <a className="primary-button" href="#courses">Explore Free Courses ↗</a>

              <a className="secondary-button" href="https://youtube.com/@notepulsescience" target="_blank" rel="noreferrer">▶ Watch Demo</a>

            </div>

            <div className="hero-note">✦ Understand More. Score Better.</div>

          </div>



       <div className="hero-content">

  <p className="hero-eyebrow">
    YOUR SSC PREPARATION
  </p>

  <div className="hero-symbol">
    ∑
  </div>

  <h1 className="hero-title">
    Think. Learn.
    <br />
    Practice. Succeed.
  </h1>

  <p className="hero-description">
    Make every learning moment count.
  </p>

  <div className="hero-initial">
    N
  </div>

  <a href="#courses" className="hero-button">
    ✦ Discover Your Next Course →
  </a>

</div>  

        </section>



        <section className="learning-strip">

          <div>

            <span className="eyebrow">LEARN WITH NOTEPULSE</span>

            <h2>Learning becomes easier when concepts become clear.</h2>

            <p>ভিডিও ক্লাস, প্রয়োজনীয় resources এবং chapter-wise practice—সব এক জায়গায়।</p>

          </div>

          <a className="primary-button" href="https://youtube.com/@notepulsescience" target="_blank" rel="noreferrer">

            Visit YouTube Channel ↗

          </a>

        </section>



        <section className="notice-section">

          <div className="section-heading">

            <div>

              <span className="eyebrow">LATEST UPDATES</span>

              <h2>Notice Board</h2>

            </div>

            <span className="live-label">● UPDATES</span>

          </div>

          <div className="notice-card">

            <span className="notice-icon">✦</span>

            <div>

              <b>Welcome to NotePulse Science</b>

              <p>আমাদের learning platform-এ তোমাকে স্বাগতম। নতুন updates পেতে সাথে থাকো।</p>

            </div>

            <span className="notice-date">LATEST</span>

          </div>

        </section>





<section className="courses-section" id="courses">

  <div className="section-heading">

    <div>

      <span className="eyebrow">LEARN. PRACTICE. GROW.</span>

      <h2>Explore Our Courses</h2>

      <p>তোমার লক্ষ্য অনুযায়ী সঠিক course বেছে নাও।</p>

    </div>



    <div className="carousel-controls">

      <button

        type="button"

        aria-label="Previous courses"

        onClick={() =>

          carouselRef.current?.scrollBy({

            left: -340,

            behavior: "smooth"

          })

        }

      >

        ←

      </button>



      <button

        type="button"

        aria-label="Next courses"

        onClick={() =>

          carouselRef.current?.scrollBy({

            left: 340,

            behavior: "smooth"

          })

        }

      >

        →

      </button>

    </div>

  </div>



  {isLoadingCourses ? (
    <div className="homepage-course-state">
      <span className="course-loading-spinner" />
      <strong>Preparing your courses...</strong>
      <p>তোমার জন্য Course লোড হচ্ছে। একটু অপেক্ষা করো।</p>
    </div>
  ) : courseLoadError ? (
    <div className="homepage-course-state course-load-error">
      <strong>Courses load করা যায়নি</strong>
      <p>{courseLoadError} পেজটি Refresh করে আবার চেষ্টা করো।</p>
    </div>
  ) : homepageCourses.length === 0 ? (
    <div className="homepage-course-state">
      <span className="empty-course-icon">∑</span>
      <strong>নতুন Course খুব শীঘ্রই আসছে</strong>
      <p>আমাদের পরবর্তী learning journey-এর জন্য সাথে থাকো।</p>
    </div>
  ) : (
  <div className="course-carousel" ref={carouselRef}>

{homepageCourses.map((course) => (

       <article className="course-card" key={course.firestoreId || course.id}>

          <div className="course-art">

            <span>{(course.subject || "COURSE").toUpperCase()}</span>



            <div className="course-art-symbol">

              {course.subject === "Physics" ? "∑" : "Aa"}

            </div>



            <span className="art-brand">NP / SCIENCE</span>

          </div>



          <div className="course-info">

            <div className="course-meta">

              <span>{(course.subject || "COURSE").toUpperCase()}</span>

              <span className={course.status === "running" ? "running" : "coming"}>

                {course.status === "running" ? "RUNNING" : "COMING SOON"}

              </span>

            </div>



            <h3>{course.title || "Untitled Course"}</h3>

            <p>{course.description || "Explore this course and start learning with NotePulse Science."}</p>



            <div className="course-bottom">

              <b>

                {course.status === "running"

                  ? course.accessType === "free" ? "100% FREE" : "PAID COURSE"

                  : "COMING SOON"}

              </b>



              <Link

                to={`/courses/${course.slug}`}

                aria-label={`Explore ${course.title}`}

              >

                ↗

              </Link>

            </div>

          </div>

        </article>

      ))}

  </div>
  )}

</section>



        <section className="teacher-section" id="teacher">

          <div className="teacher-placeholder">NP</div>

          <div>

            <span className="eyebrow">MEET YOUR TEACHER</span>

            <h2>Learn with clarity.<br /><span>Grow with confidence.</span></h2>

            <p>NotePulse Science-এর লক্ষ্য হলো কঠিন বিষয়গুলো সহজভাবে বোঝানো এবং শিক্ষার্থীদের কার্যকর প্রস্তুতিতে সাহায্য করা।</p>

            <a className="text-link" href="#contact">Get in touch ↗</a>

          </div>

        </section>





<section className="contact-section" id="contact">

  <div className="section-heading">

    <div>

      <span className="eyebrow">LET'S CONNECT</span>

      <h2>Stay Connected</h2>

      <p>কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করো।</p>

    </div>

  </div>



  <div className="contact-layout">

    <div className="contact-info">

      <h3>Connect with us</h3>

      <p>আমাদের Social Media-তে যুক্ত থাকো এবং NotePulse Science-এর সাথে শেখার যাত্রা চালিয়ে যাও।</p>



      <div className="social-links">

        <a href="https://www.facebook.com/profile.php?id=61595088283435" target="_blank" rel="noreferrer">Facebook ↗</a>

        <a href="https://t.me/notepulsescience" target="_blank" rel="noreferrer">Telegram ↗</a>

        <a href="https://chat.whatsapp.com/KWgaXP4IGtA83W76CRPT3w" target="_blank" rel="noreferrer">WhatsApp ↗</a>

        <a href="https://youtube.com/@notepulsescience" target="_blank" rel="noreferrer">YouTube ↗</a>

      </div>

    </div>





<form

  className="contact-form"

  onSubmit={async (event) => {

    event.preventDefault();



    if (isSending) return;



    setIsSending(true);

    setFormStatus("");



    try {

      await addDoc(collection(db, "contactMessages"), {

        name: contactForm.name.trim(),

        email: contactForm.email.trim(),

        subject: contactForm.subject.trim(),

        message: contactForm.message.trim(),

        createdAt: serverTimestamp()

      });



      setContactForm({

        name: "",

        email: "",

        subject: "",

        message: ""

      });



      setFormStatus("আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!");

    } catch (error) {

      console.error("Contact form error:", error);

      setFormStatus("দুঃখিত! বার্তা পাঠানো যায়নি। আবার চেষ্টা করুন।");

    } finally {

      setIsSending(false);

    }

  }}

>



      <h3>Send us a Message</h3>



      <label>Student Name</label>

      <input

        type="text"

        placeholder="তোমার নাম"

        value={contactForm.name}

        onChange={(event) => setContactForm({...contactForm, name: event.target.value})}

        required

      />



      <label>Email Address</label>

      <input

        type="email"

        placeholder="তোমার Email"

        value={contactForm.email}

        onChange={(event) => setContactForm({...contactForm, email: event.target.value})}

        required

      />



      <label>Subject</label>

      <input

        type="text"

        placeholder="Message-এর বিষয়"

        value={contactForm.subject}

        onChange={(event) => setContactForm({...contactForm, subject: event.target.value})}

        required

      />



      <label>Message</label>

      <textarea

        placeholder="তোমার Message লিখো..."

        rows="5"

        value={contactForm.message}

        onChange={(event) => setContactForm({...contactForm, message: event.target.value})}

        required

      />



<button

  type="submit"

  className="primary-button"

  disabled={isSending}

>

  {isSending ? "Sending..." : "Send Message ↗"}

</button>



      {formStatus && <p className="form-status">{formStatus}</p>}

    </form>

  </div>

</section>



      </main>



      <footer className="footer">

        <Link className="brand footer-brand" to="/">

       <span className="brand-icon">∿</span>

<span className="brand-name">NOTEPULSE <b>SCIENCE</b></span>

        </Link>

        <p>Understand More. Score Better.</p>

        <div className="footer-bottom">

          <span>© 2026 NotePulse Science. All rights reserved.</span>

          <Link to="/">Home ↑</Link>

        </div>

      </footer>

    </div>

  );

}





function CourseDetailsPage() {

  const { slug } = useParams();



  const [course, setCourse] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [courseError, setCourseError] = useState("");

const [courseContent, setCourseContent] = useState(null);



  useEffect(() => {

    let cancelled = false;



    const loadCourse = async () => {

      setIsLoading(true);

      setCourse(null);

      setCourseError("");



      try {

const courseQuery = query(
  collection(db, "courses"),
  where("slug", "==", slug)
);

const snapshot = await getDocs(courseQuery);

const matchedDoc = snapshot.docs[0] || null;


        if (!cancelled) {

          setCourse(

            matchedDoc

              ? { ...matchedDoc.data(), firestoreId: matchedDoc.id }

              : null

          );

        }

      } catch (error) {

        console.error("Course details loading error:", error);



        if (!cancelled) {

          setCourseError("Course load করা যায়নি। আবার চেষ্টা করুন।");

        }

      } finally {

        if (!cancelled) {

          setIsLoading(false);

        }

      }

    };



    loadCourse();



    return () => {

      cancelled = true;

    };

  }, [slug]);



 useEffect(() => {

  if (!course) {

    setCourseContent(null);

    return;

  }



  let cancelled = false;



  const loadCourseContent = async () => {

    try {

      const courseId = course.firestoreId || course.id;

      const contentRef = doc(db, "courseContents", courseId);

      const contentSnapshot = await getDoc(contentRef);



      if (!cancelled) {

        setCourseContent(

          contentSnapshot.exists() ? contentSnapshot.data() : null

        );

      }

    } catch (error) {

      console.error("Course content loading error:", error);



      if (!cancelled) {

        setCourseContent(null);

      }

    }

  };



  loadCourseContent();



  return () => {

    cancelled = true;

  };

}, [course]);



  if (isLoading) {

    return (

      <div className="website">

        <Navbar />

        <main className="course-detail-state">

          <div className="course-state-card">

            <div className="course-loading-spinner"></div>

            <h2>Preparing Your Course</h2>

            <p>তোমার Course-এর তথ্য লোড হচ্ছে। একটু অপেক্ষা করো।</p>

          </div>

        </main>

      </div>

    );

  }



  if (!course) {

    return (

      <div className="website">

        <Navbar />

        <main className="course-detail-state">

          <div className="course-state-card">

            <span className="course-state-icon">!</span>

            <h1>{courseError ? "Something Went Wrong" : "Course Not Found"}</h1>

            <p>{courseError || "এই Course-টি পাওয়া যায়নি।"}</p>

            <Link className="primary-button" to="/">

              Back to Home

            </Link>

          </div>

        </main>

      </div>

    );

  }



  const isRunning = course.status === "running";

  const isFree = course.accessType === "free";



  return (

    <div className="website course-details-page">

      <Navbar />



      <main className="course-details-main">

<CourseLearningPage course={course} courseContent={courseContent} />

      </main>

      <footer className="footer">

        <Link className="brand footer-brand" to="/">

          <span className="brand-icon">N</span>

          <span className="brand-name">NOTEPULSE <b>SCIENCE</b></span>

        </Link>



        <p>Understand More. Score Better.</p>



        <div className="footer-bottom">

          <span>© 2026 NotePulse Science. All rights reserved.</span>

          <Link to="/">Home ↑</Link>

        </div>

      </footer>

    </div>

  );

}





function AdminDashboardContent({ onLogout, isLoggingOut }) {

  const [courseList, setCourseList] = useState([]);

  const [selectedContentCourseId, setSelectedContentCourseId] = useState("");

  const [adminCourseContent, setAdminCourseContent] = useState({

  coreClasses: { title: "Core Classes", chapters: [] },

  mentorship: { title: "Mentorship", classes: [] },

  exams: { title: "Course Exams", items: [] }

});



const [isLoadingContent, setIsLoadingContent] = useState(false);

const [newChapterTitle, setNewChapterTitle] = useState("");

const [selectedChapterId, setSelectedChapterId] = useState("");

const [newClassTitle, setNewClassTitle] = useState("");

const [newClassVideoUrl, setNewClassVideoUrl] = useState("");

const [showNoteForm, setShowNoteForm] = useState(false);

const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteType, setNewNoteType] = useState("classSlides");

const [selectedNoteFile, setSelectedNoteFile] = useState(null);

const [googleDrivePdfUrl, setGoogleDrivePdfUrl] = useState("");

useEffect(() => {

  if (!selectedContentCourseId) {

    return;

  }



  const loadAdminCourseContent = async () => {

    setIsLoadingContent(true);



    try {

      const contentRef = doc(

        db,

        "courseContents",

        selectedContentCourseId

      );



      const snapshot = await getDoc(contentRef);



      if (snapshot.exists()) {

        setAdminCourseContent(snapshot.data());

      } else {

        setAdminCourseContent({

          coreClasses: { title: "Core Classes", chapters: [] },

          mentorship: { title: "Mentorship", classes: [] },

          exams: { title: "Course Exams", items: [] }

        });

      }

    } catch (error) {

      console.error("Admin content loading error:", error);

    } finally {

      setIsLoadingContent(false);

    }

  };



  loadAdminCourseContent();

}, [selectedContentCourseId]);

const handleSaveCourseContent = async () => {

  if (!selectedContentCourseId) {

    alert("আগে একটি Course Select করো।");

    return;

  }



  try {

    await setDoc(

      doc(db, "courseContents", selectedContentCourseId),

      {

        ...adminCourseContent,

        updatedAt: serverTimestamp()

      },

      { merge: true }

    );



    alert("Course Content Successfully Saved!");

  } catch (error) {

    console.error("Course content saving error:", error);

    alert("Content Save করা যায়নি। আবার চেষ্টা করো।");

  }

};

const handleUploadNote = async () => {

  if (!selectedChapterId) {

    alert("আগে একটি Chapter Select করো।");

    return;

  }



  if (!newNoteTitle.trim()) {

    alert("Note Title দিতে হবে।");

    return;

  }



  if (!googleDrivePdfUrl.trim()) {

    alert("Google Drive PDF Link দিতে হবে।");

    return;

  }



  const fileIdMatch =
    googleDrivePdfUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    googleDrivePdfUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);



  if (!fileIdMatch) {

    alert("একটি valid Google Drive PDF Link দাও।");

    return;

  }



  const fileId = fileIdMatch[1];



  const newNote = {

    id: crypto.randomUUID(),

    title: newNoteTitle.trim(),

    type: newNoteType,

    pdfUrl: `https://drive.google.com/file/d/${fileId}/preview`,

    downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,

    storageProvider: "googleDrive",

    published: false

  };



  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: prev.coreClasses.chapters.map((chapter) =>

        chapter.id === selectedChapterId

          ? {

              ...chapter,

              notes: [...(chapter.notes || []), newNote]

            }

          : chapter

      )

    }

  }));



  setNewNoteTitle("");
  setNewNoteType("classSlides");
  setGoogleDrivePdfUrl("");
  setShowNoteForm(false);



  alert("Google Drive PDF Link Added! এখন Save Course Content চাপো।");

};



const handleAddChapter = () => {

  if (!newChapterTitle.trim()) {

    alert("Chapter Title দিতে হবে।");

    return;

  }



  const newChapter = {

    id: crypto.randomUUID(),

    title: newChapterTitle.trim(),

    classes: [],

    notes: [],

    published: false

  };



  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: [...prev.coreClasses.chapters, newChapter]

    }

  }));



  setNewChapterTitle("");

};

const handleAddClass = () => {

  if (!selectedChapterId) {

    alert("আগে একটি Chapter Select করো।");

    return;

  }



  if (!newClassTitle.trim() || !newClassVideoUrl.trim()) {

    alert("Class Title এবং Video URL দিতে হবে।");

    return;

  }



  const newClass = {

    id: crypto.randomUUID(),

    title: newClassTitle.trim(),

    videoUrl: newClassVideoUrl.trim(),

    order: 1,

    published: false

  };



  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: prev.coreClasses.chapters.map((chapter) =>

        chapter.id === selectedChapterId

          ? {

              ...chapter,

              classes: [...(chapter.classes || []), newClass]

            }

          : chapter

      )

    }

  }));



  setNewClassTitle("");

  setNewClassVideoUrl("");

};

const handleToggleClassPublish = (chapterId, classId) => {

  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: prev.coreClasses.chapters.map((chapter) =>

        chapter.id === chapterId

          ? {

              ...chapter,

              classes: (chapter.classes || []).map((classItem) =>

                classItem.id === classId

                  ? {

                      ...classItem,

                      published: !classItem.published

                    }

                  : classItem

              )

            }

          : chapter

      )

    }

  }));

};

const handleToggleChapterPublish = (chapterId) => {

  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: prev.coreClasses.chapters.map((chapter) =>

        chapter.id === chapterId

          ? { ...chapter, published: !chapter.published }

          : chapter

      )

    }

  }));

};

const handleToggleNotePublish = (chapterId, noteId) => {

  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: prev.coreClasses.chapters.map((chapter) =>

        chapter.id === chapterId

          ? {

              ...chapter,

              notes: (chapter.notes || []).map((note) =>

                note.id === noteId

                  ? {

                      ...note,

                      published: !note.published

                    }

                  : note

              )

            }

          : chapter

      )

    }

  }));

};

const handleDeleteChapter = (chapterId) => {

  const confirmed = window.confirm(

    "Are you sure you want to delete this chapter?"

  );



  if (!confirmed) return;



  setAdminCourseContent((prev) => ({

    ...prev,

    coreClasses: {

      ...prev.coreClasses,

      chapters: prev.coreClasses.chapters.filter(

        (chapter) => chapter.id !== chapterId

      )

    }

  }));

};

  const [showCourseForm, setShowCourseForm] = useState(false);

  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  const [courseError, setCourseError] = useState("");

  const [isSavingCourse, setIsSavingCourse] = useState(false);

const [editingCourseId, setEditingCourseId] = useState(null);

const [courseForm, setCourseForm] = useState({

  title: "",

  subtitle: "",

  subject: "",

  exam: "",

  description: "",

  status: "coming-soon",

  accessType: "free"

});

  useEffect(() => {

    const loadCourses = async () => {

      try {

        const q = query(

          collection(db, "courses"),

          orderBy("order", "asc")

        );



        const snapshot = await getDocs(q);



        setCourseList(

          snapshot.docs.map((item) => ({

            ...item.data(),

            firestoreId: item.id

          }))

        );

      } catch (err) {

        console.error("Course loading error:", err);

        setCourseError("Courses load করা যায়নি।");

      } finally {

        setIsLoadingCourses(false);

      }

    };



    loadCourses();

  }, []);

const handleCourseInputChange = (e) => {

  const { name, value } = e.target;



  setCourseForm((prev) => ({

    ...prev,

    [name]: value

  }));

};

const handleEditCourse = (course) => {

  setEditingCourseId(course.firestoreId);



  setCourseForm({

    title: course.title || "",

    subtitle: course.subtitle || "",

    subject: course.subject || "",

    exam: course.exam || "",

    description: course.description || "",

    status: course.status || "coming-soon",

    accessType: course.accessType || "free"

  });



  setShowCourseForm(true);

  setCourseError("");

};



const handleDeleteCourse = async (courseId) => {

  const confirmed = window.confirm(

    "Are you sure you want to delete this course?"

  );



  if (!confirmed) return;



  try {

    await deleteDoc(doc(db, "courseContents", courseId));

    await deleteDoc(doc(db, "courses", courseId));



    setCourseList((prev) =>

      prev.filter((course) => course.firestoreId !== courseId)

    );



    if (selectedContentCourseId === courseId) {

      setSelectedContentCourseId("");

    }



    alert("Course deleted successfully!");

  } catch (error) {

    console.error("Course deletion error:", error);

    alert("Course delete করা যায়নি। আবার চেষ্টা করো।");

  }

};

const handleSaveCourse = async () => {

  if (!courseForm.title.trim()) {

    setCourseError("Course Title দিতে হবে।");

    return;

  }



  setIsSavingCourse(true);

  setCourseError("");



  try {

    const courseData = {

      ...courseForm,

      title: courseForm.title.trim(),

      subtitle: courseForm.subtitle.trim(),

      subject: courseForm.subject.trim(),

      exam: courseForm.exam.trim(),

      description: courseForm.description.trim(),

      slug: courseForm.title

        .trim()

        .toLowerCase()

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/^-|-$/g, "")

    };



    if (editingCourseId) {

      await updateDoc(

        doc(db, "courses", editingCourseId),

        courseData

      );



      setCourseList((prev) =>

        prev.map((course) =>

          course.firestoreId === editingCourseId

            ? { ...course, ...courseData }

            : course

        )

      );

    } else {

      const newCourseData = {

        ...courseData,

        order: courseList.length + 1,

        createdAt: serverTimestamp()

      };



      const docRef = await addDoc(

        collection(db, "courses"),

        newCourseData

      );



      setCourseList((prev) => [

        ...prev,

        { ...newCourseData, firestoreId: docRef.id }

      ]);

    }



    setCourseForm({

      title: "",

      subtitle: "",

      subject: "",

      exam: "",

      description: "",

      status: "coming-soon",

      accessType: "free"

    });



    setEditingCourseId(null);

    setShowCourseForm(false);



  } catch (err) {

    console.error("Course saving error:", err);

    setCourseError("Course Save করা যায়নি। আবার চেষ্টা করো।");



  } finally {

    setIsSavingCourse(false);

  }

};



  return (

    <div className="admin-layout">

      <aside className="admin-sidebar">

        <div className="admin-brand">

          <h2>NotePulse</h2>

          <span>SCIENCE ADMIN</span>

        </div>



        <p className="sidebar-label">MAIN MENU</p>



        <nav className="admin-nav">

          <a className="active" href="/admin">Dashboard</a>

          <a href="#courses">Course Management</a>

          <a href="#content">Course Content</a>

          <a href="#pdfs">PDF Management</a>

          <a href="#notices">Notice Board</a>

          <a href="#messages">Student Messages</a>

          <a href="#admins">Admin Management</a>

          <a href="#backup">Backup & Restore</a>

        </nav>



        <div className="sidebar-bottom">

          <span>Logged in as</span>

          <strong>Super Admin</strong>

        </div>

      </aside>



      <main className="admin-main">

<header className="admin-topbar">

  <div>

    <h2>Dashboard Overview</h2>

    <p>Welcome to NotePulse Science Admin Panel.</p>

  </div>



  <span className="admin-role">SUPER ADMIN</span>



<button

  type="button"

  className="admin-logout"

  onClick={onLogout}

  disabled={isLoggingOut}

  aria-busy={isLoggingOut}

>

  {isLoggingOut ? (

    <>

      <span className="loading-spinner" aria-hidden="true" />

      Signing out...

    </>

  ) : (

    "Logout"

  )}

</button>

</header>

        <section className="admin-welcome">

          <div>

            <span>ADMIN CONTROL CENTER</span>

            <h1>Welcome, Super Admin!</h1>

            <p>Manage your educational platform from one place.</p>

          </div>

          <div className="welcome-icon">N</div>

        </section>



        <section className="admin-stats">

          <div className="stat-card">

            <span>Total Courses</span>

            <h2>—</h2>

            <small>Course statistics</small>

          </div>

          <div className="stat-card">

            <span>Running Courses</span>

            <h2>—</h2>

            <small>Active courses</small>

          </div>

          <div className="stat-card">

            <span>PDF Resources</span>

            <h2>—</h2>

            <small>Published resources</small>

          </div>

          <div className="stat-card">

            <span>Student Messages</span>

            <h2>—</h2>

            <small>Inbox messages</small>

          </div>

        </section>

<section className="course-management-panel" id="courses">

  <div className="section-heading">

    <h2>Course Management</h2>

    <p>Manage all your educational courses.</p>

  </div>



<div className="course-management-header">

  <div>

    <h3>All Courses</h3>

    <span>{courseList.length} Courses</span>

  </div>



  <button

    className="add-course-btn"

onClick={() => setShowCourseForm(true)}

  >

    + Add New Course

  </button>

</div>



{showCourseForm && (

  <div className="add-course-form">

<h3>{editingCourseId ? "Edit Course" : "Add New Course"}</h3>



    <label>Course Title</label>

    <input

      name="title"

      value={courseForm.title}

      onChange={handleCourseInputChange}

      type="text"

      placeholder="Enter course title"

    />



    <label>Subtitle</label>

    <input

      name="subtitle"

      value={courseForm.subtitle}

      onChange={handleCourseInputChange}

      type="text"

      placeholder="Enter subtitle"

    />



    <label>Subject</label>

    <input

      name="subject"

      value={courseForm.subject}

      onChange={handleCourseInputChange}

      type="text"

      placeholder="Physics / English / Chemistry"

    />



    <label>Exam</label>

    <input

      name="exam"

      value={courseForm.exam}

      onChange={handleCourseInputChange}

      type="text"

      placeholder="SSC 2027"

    />



    <label>Description</label>

    <textarea

      name="description"

      value={courseForm.description}

      onChange={handleCourseInputChange}

      placeholder="Enter course description"

    />



    <label>Course Status</label>

    <select

      name="status"

      value={courseForm.status}

      onChange={handleCourseInputChange}

    >

      <option value="running">Running</option>

      <option value="coming-soon">Coming Soon</option>

    </select>



    <label>Access Type</label>

    <select

      name="accessType"

      value={courseForm.accessType}

      onChange={handleCourseInputChange}

    >

      <option value="free">Free</option>

      <option value="paid">Paid</option>

    </select>



    {courseError && <p className="course-error">{courseError}</p>}



    <button

      type="button"

      onClick={handleSaveCourse}

      disabled={isSavingCourse}

    >

    {isSavingCourse

  ? "Saving..."

  : editingCourseId

    ? "Update Course"

    : "Save Course"}

    </button>



    <button

      type="button"

      onClick={() => setShowCourseForm(false)}

      disabled={isSavingCourse}

    >

      Cancel

    </button>

  </div>

)}

{isLoadingCourses ? (

  <p>Loading courses...</p>

) : courseError ? (

  <p>{courseError}</p>

) : courseList.length === 0 ? (

  <p>No courses found. Add your first course soon.</p>

) : (

  <div className="course-list">

    {courseList.map((course) => (

      <div className="course-list-item" key={course.firestoreId}>

        <div>

          <h3>{course.title || "Untitled Course"}</h3>

          <p>{course.subject} • {course.exam}</p>

          <small>Status: {course.status}</small>

        </div>

        <span>{course.accessType}</span>

        <button

  type="button"

  className="course-edit-btn"

  onClick={() => handleEditCourse(course)}

>

  Edit

</button>

<button

  type="button"

  className="course-delete-btn"

  onClick={() => handleDeleteCourse(course.firestoreId)}

>

  Delete

</button>

      </div>

    ))}

  </div>

)}

</section>



<section className="admin-management">

  <div className="section-heading">

    <h2>Management Center</h2>

    <p>Choose a section to manage your website.</p>

  </div>



  <div className="management-grid">

    <div className="management-card" id="courses">

      <span>01</span>

      <h3>Course Management</h3>

      <p>Add, edit and manage all courses.</p>

    </div>



    <div className="management-card" id="content">

      <span>02</span>

      <h3>Course Content</h3>

      <p>Manage chapters, videos, slides and exams.</p>

    </div>



    <div className="management-card" id="pdfs">

      <span>03</span>

      <h3>PDF Management</h3>

      <p>Upload and organize study materials.</p>

    </div>



    <div className="management-card" id="notices">

      <span>04</span>

      <h3>Notice Board</h3>

      <p>Create and manage student notices.</p>

    </div>



    <div className="management-card" id="messages">

      <span>05</span>

      <h3>Student Messages</h3>

      <p>Read and manage contact messages.</p>

    </div>



    <div className="management-card" id="admins">

      <span>06</span>

      <h3>Admin Management</h3>

      <p>Manage Super Admin and Co-Admin access.</p>

    </div>



    <div className="management-card" id="backup">

      <span>07</span>

      <h3>Backup & Restore</h3>

      <p>Manage website data backups.</p>

    </div>

  </div>

</section>





<section className="course-content-panel" id="course-content-management">

  <div className="section-heading">

    <h2>Course Content Management</h2>

    <p>Manage multiple video lectures, Class Slides and Practice Slides for every chapter.</p>

  </div>



  <div className="content-course-selector">

    <label htmlFor="content-course-select">Select Course</label>

    <select

      id="content-course-select"

      value={selectedContentCourseId}

      onChange={(e) => {

        setSelectedContentCourseId(e.target.value);

        setSelectedChapterId("");

        setShowNoteForm(false);

        setNewNoteTitle("");

        setGoogleDrivePdfUrl("");

        setNewClassTitle("");

        setNewClassVideoUrl("");

      }}

    >

      <option value="">Choose a Course</option>

      {courseList.map((course) => (

        <option key={course.firestoreId} value={course.firestoreId}>

          {course.title}

        </option>

      ))}

    </select>

  </div>



  {isLoadingContent ? (

    <p>Loading course content...</p>

  ) : selectedContentCourseId ? (

    <div className="content-editor">

      <h3>Course Content Editor</h3>

      <p>Add multiple video lectures and organize PDFs into separate slide categories.</p>



      {/* ADD NEW CHAPTER */}

      <div className="chapter-create-form">

        <h4>Add New Chapter</h4>

        <input

          type="text"

          value={newChapterTitle}

          onChange={(e) => setNewChapterTitle(e.target.value)}

          placeholder="Enter chapter title"

        />

        <button type="button" onClick={handleAddChapter}>

          + Add Chapter

        </button>

      </div>



      {/* ADD CLASS VIDEO */}

      <div className="class-create-form">

        <h4>Add Class Video</h4>



        <select

          value={selectedChapterId}

          onChange={(e) => setSelectedChapterId(e.target.value)}

        >

          <option value="">Select Chapter</option>

          {adminCourseContent.coreClasses.chapters.map((chapter) => (

            <option key={chapter.id} value={chapter.id}>

              {chapter.title}

            </option>

          ))}

        </select>



        <input

          type="text"

          value={newClassTitle}

          onChange={(e) => setNewClassTitle(e.target.value)}

          placeholder="Enter Class Title"

        />



        <input

          type="url"

          value={newClassVideoUrl}

          onChange={(e) => setNewClassVideoUrl(e.target.value)}

          placeholder="Enter YouTube Video URL"

        />



        <button type="button" onClick={handleAddClass}>

          + Add Class

        </button>

      </div>



      {/* CHAPTER LIST */}

      <div className="chapter-list">

        {adminCourseContent.coreClasses.chapters.length === 0 ? (

          <p>No chapters added yet. Create your first chapter above.</p>

        ) : (

          adminCourseContent.coreClasses.chapters.map((chapter) => (

            <div className="chapter-item" key={chapter.id}>

              <h4>{chapter.title}</h4>



              <div className="chapter-class-list">

                {(chapter.classes || []).map((classItem) => (

                  <div className="chapter-class-item" key={classItem.id}>

                    <div>

                      <strong>{classItem.title}</strong>

                      <span>

                        {classItem.published ? "Published" : "Unpublished"}

                      </span>

                    </div>



                    <a

                      href={classItem.videoUrl}

                      target="_blank"

                      rel="noopener noreferrer"

                    >

                      Watch Video

                    </a>



                    <button

                      type="button"

                      onClick={() =>

                        handleToggleClassPublish(chapter.id, classItem.id)

                      }

                      className={

                        classItem.published

                          ? "class-unpublish-btn"

                          : "class-publish-btn"

                      }

                    >

                      {classItem.published ? "Unpublish" : "Publish"}

                    </button>

                  </div>

                ))}

              </div>



              <div className="chapter-info">

                <span>{(chapter.classes || []).length} Classes</span>

                <span>{(chapter.notes || []).filter((note) => (note.type || note.category || "classSlides") === "classSlides").length} Class Slides</span>
                  <span>{(chapter.notes || []).filter((note) => (note.type || note.category) === "practiceSlides").length} Practice Slides</span>

                <span>

                  {chapter.published ? "Published" : "Unpublished"}

                </span>

              </div>



              {/* PDF NOTES LIST */}

              <div className="chapter-note-list">

                {(chapter.notes || []).map((note) => (

                  <div className="chapter-note-item" key={note.id}>

                    <div className="chapter-note-main">
                      <strong>{note.title}</strong>
                      <small>{(note.type || note.category || "classSlides") === "practiceSlides" ? "Practice Slides" : "Class Slides"}</small>
                    </div>

                    <span>

                      {note.published ? "Published" : "Unpublished"}

                    </span>



                    <button

                      type="button"

                      onClick={() =>

                        handleToggleNotePublish(chapter.id, note.id)

                      }

                    >

                      {note.published ? "Unpublish" : "Publish"}

                    </button>

                  </div>

                ))}

              </div>



              {/* CHAPTER ACTIONS */}

              <div className="chapter-actions">

                <button

                  type="button"

                  onClick={() => handleToggleChapterPublish(chapter.id)}

                >

                  {chapter.published ? "Unpublish Chapter" : "Publish Chapter"}

                </button>



                <button

                  type="button"

                  className="chapter-add-note-btn"

                  onClick={() => {

                    setSelectedChapterId(chapter.id);

                    setShowNoteForm(true);

                    setNewNoteTitle("");

                    setGoogleDrivePdfUrl("");

                  }}

                >

                  + Add Note

                </button>



                <button

                  type="button"

                  className="chapter-delete-btn"

                  onClick={() => handleDeleteChapter(chapter.id)}

                >

                  Delete Chapter

                </button>

              </div>

            </div>

          ))

        )}

      </div>



      {/* ADD NOTE FORM - SHOWN ONLY ONCE */}

      {showNoteForm && (

        <div className="note-form">

          <h3>Add Chapter Note</h3>



          <p>

            Selected Chapter:{" "}

            {adminCourseContent.coreClasses.chapters.find(

              (chapter) => chapter.id === selectedChapterId

            )?.title || "Chapter not selected"}

          </p>



          <input

            type="text"

            placeholder="Enter Note Title"

            value={newNoteTitle}

            onChange={(e) => setNewNoteTitle(e.target.value)}

          />



          <label className="note-type-label">

            PDF Type
            <select value={newNoteType} onChange={(e) => setNewNoteType(e.target.value)}>
              <option value="classSlides">Class Slides</option>
              <option value="practiceSlides">Practice Slides</option>
            </select>
          </label>

          <label className="note-upload-label">

            Google Drive PDF Link

            <input

              type="url"

              placeholder="Paste your Google Drive PDF link here"

              value={googleDrivePdfUrl}

              onChange={(e) => setGoogleDrivePdfUrl(e.target.value)}

              required

            />

          </label>



          <div className="note-form-actions">

            <button

              type="button"

              className="note-upload-btn"

              onClick={handleUploadNote}

            >

              Upload Note

            </button>



            <button

              type="button"

              onClick={() => {

                setShowNoteForm(false);

                setNewNoteTitle("");

                setGoogleDrivePdfUrl("");

              }}

            >

              Cancel

            </button>

          </div>

        </div>

      )}



      {/* SAVE COURSE CONTENT */}

      <button

        type="button"

        onClick={handleSaveCourseContent}

      >

        Save Course Content

      </button>

    </div>

  ) : (

    <p>Please select a course to manage its content.</p>

  )}

</section>



<footer className="admin-footer">

  NotePulse Science © 2026. Admin Dashboard.

</footer>

</main>

</div>

);

}



function AdminDashboard() {

  const [status, setStatus] = useState("checking");

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [error, setError] = useState("");

  const isLoggingOutRef = useRef(false);



  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      if (!user) {

        if (!isLoggingOutRef.current) {

          window.location.replace("/admin-login");

        }

        return;

      }



      try {

        const adminRef = doc(db, "admins", user.uid);

        const adminSnap = await getDoc(adminRef);



        if (

          !adminSnap.exists() ||

          adminSnap.data().active !== true ||

          adminSnap.data().role !== "superAdmin"

        ) {

          await signOut(auth);

          window.location.replace("/admin-login");

          return;

        }



        setStatus("authorized");

      } catch (err) {

        console.error("Admin verification error:", err);

        setError("Admin যাচাই করা যায়নি। আবার চেষ্টা করো।");

        setStatus("error");

      }

    });



    return () => unsubscribe();

  }, []);



  const handleLogout = async () => {

    if (isLoggingOut) return;



    isLoggingOutRef.current = true;

    setIsLoggingOut(true);



    try {

      await new Promise((resolve) =>

        requestAnimationFrame(resolve)

      );



      await signOut(auth);



      await new Promise((resolve) =>

        setTimeout(resolve, 1500)

      );



      window.location.replace("/admin-login");

    } catch (err) {

      console.error("Logout error:", err);

      setError("Logout করা যায়নি। আবার চেষ্টা করো।");



      isLoggingOutRef.current = false;

      setIsLoggingOut(false);

    }

  };



  if (status === "checking") {

    return (

      <div className="admin-verification-page">

        <div className="admin-verification-content">

          <span className="loading-spinner" />

          <h2>NotePulse Science</h2>

          <p>Verifying Admin Access...</p>

        </div>

      </div>

    );

  }



  if (status === "error") {

    return <div style={{ padding: 40 }}>{error}</div>;

  }



  if (status !== "authorized") {

    return null;

  }



  return (

    <>

      <AdminDashboardContent

        onLogout={handleLogout}

        isLoggingOut={isLoggingOut}

      />



      {isLoggingOut && (

        <div className="logout-overlay">

          <div className="logout-loading-card">

            <span className="loading-spinner" />

            <h2>Logging Out...</h2>

            <p>Please wait a moment.</p>

          </div>

        </div>

      )}

    </>

  );

}

function RouteTransitionLoader() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (previousPath.current === location.pathname) return;

    previousPath.current = location.pathname;
    setIsVisible(true);

    const timer = window.setTimeout(() => {
      setIsVisible(false);
    }, 550);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  if (!isVisible) return null;

  return (
    <div className="route-transition-overlay" role="status" aria-live="polite">
      <div className="route-transition-card">
        <span className="route-transition-spinner" />
        <strong>Loading NotePulse</strong>
        <span>একটু অপেক্ষা করো...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <RouteTransitionLoader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/:slug" element={<CourseDetailsPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}



export default App;