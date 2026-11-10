import CourseLearningPage from "./data/CourseLearningPage.jsx";

import { Link, Routes, Route, useParams, useLocation } from "react-router-dom";

import { useRef, useState, useEffect } from "react";

import { db, auth, storage, adminCreationAuth } from "./firebase";

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



import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  deleteUser
} from "firebase/auth";


import "./App.css";

import AdminLogin from "./AdminLogin";

function FreePdfPage() {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
    const subjects = [
    ...new Set(pdfs.map((pdf) => pdf.subject).filter(Boolean))
  ];

  const filteredPdfs = pdfs.filter((pdf) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      pdf.title?.toLowerCase().includes(search) ||
      pdf.chapter?.toLowerCase().includes(search) ||
      pdf.subject?.toLowerCase().includes(search) ||
      pdf.type?.toLowerCase().includes(search);

    const matchesSubject =
      selectedSubject === "All Subjects" ||
      pdf.subject === selectedSubject;

    return matchesSearch && matchesSubject;
  });

  useEffect(() => {
    const loadPdfs = async () => {
      try {
        const pdfQuery = query(
          collection(db, "freePdfs"),
          where("published", "==", true)
        );

        const snapshot = await getDocs(pdfQuery);

        setPdfs(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );

      } catch (error) {
        console.error("Student PDF loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPdfs();
  }, []);

return (
  <>
    <Navbar />

    <main className="free-pdf-page">
      <div className="free-pdf-container">

        <div className="free-pdf-header">
          <span>NOTEPULSE SCIENCE</span>
          <h1>Free Study Materials</h1>
          <p>Explore and download your free study PDFs.</p>
        </div>

        <div className="free-pdf-toolbar">
  <input
    type="text"
    placeholder="Search PDFs, chapters or subjects..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={selectedSubject}
    onChange={(e) => setSelectedSubject(e.target.value)}
  >
    <option value="All Subjects">All Subjects</option>

    {subjects.map((subject) => (
      <option key={subject} value={subject}>
        {subject}
      </option>
    ))}
  </select>
</div>

<div className="free-pdf-count">
  Showing {filteredPdfs.length} of {pdfs.length} Free PDFs
</div>

        {loading ? (
          <p>Loading PDFs...</p>
        ) : pdfs.length === 0 ? (
          <p>No published PDFs available right now.</p>
        
          ) : filteredPdfs.length === 0 ? (
  <p>No matching PDFs found. Try another search or subject.</p>
) : (
          <div className="free-pdf-grid">
            {filteredPdfs.map((pdf) => (
              <div className="free-pdf-card" key={pdf.id}>

                <div className="free-pdf-icon">PDF</div>

                <span className="free-pdf-subject">
                  {pdf.subject}
                </span>

                <h3>{pdf.title}</h3>

                <p>{pdf.chapter}</p>

                <small>{pdf.type}</small>

                <div className="free-pdf-actions">
                  <a
                    href={pdf.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read PDF
                  </a>

                  <a
                    href={pdf.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
    </>
  );
}

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

const [firestoreNotices, setFirestoreNotices] = useState([]);
const [isLoadingNotices, setIsLoadingNotices] = useState(true);



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

 // LOAD PUBLISHED NOTICES
const loadPublicNotices = async () => {
  try {
    const q = query(
      collection(db, "notices"),
      where("published", "==", true)
    );

    const snapshot = await getDocs(q);

    setFirestoreNotices(
      snapshot.docs.map((item) => ({
        ...item.data(),
        firestoreId: item.id
      }))
    );
  } catch (error) {
    console.error("Homepage notice loading error:", error);
  } finally {
    setIsLoadingNotices(false);
  }
};

loadPublicNotices(); 

}, []);

useEffect(() => {
  const hash = window.location.hash;

  if (!hash) return;

  const targetId = decodeURIComponent(hash.substring(1));

  const timer = setTimeout(() => {
    const target = document.getElementById(targetId);

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, 150);

  return () => clearTimeout(timer);
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
  <div className="hero-layout">

    <div className="hero-content">

      <span className="eyebrow">
        YOUR SSC PREPARATION
      </span>

      <h1>
        Learn Smarter.
        <span>Achieve Better.</span>
      </h1>

      <p>
        SSC প্রস্তুতির নির্ভরযোগ্য সঙ্গী।
        বুঝে শেখো, আত্মবিশ্বাসের সাথে এগিয়ে যাও।
      </p>

      <div className="hero-actions">
        <a className="primary-button" href="#courses">
          Explore Courses →
        </a>
      </div>

    </div>

 <a
  className="hero-youtube-card"
  href="https://youtube.com/@notepulsescience"
  target="_blank"
  rel="noreferrer"
>
  <div className="youtube-card-top">
    <span className="youtube-live-dot"></span>
    <span>NOTEPULSE SCIENCE</span>
    <span className="youtube-card-label">OFFICIAL CHANNEL</span>
  </div>

  <div className="youtube-card-preview">
    <div className="youtube-preview-glow"></div>
    <div className="youtube-play-button">▶</div>
    <span className="youtube-preview-text">LEARN • PRACTICE • SUCCEED</span>
  </div>

  <div className="youtube-card-bottom">
    <div>
      <h3>Learn with NotePulse</h3>
      <p>Make your SSC preparation smarter.</p>
    </div>
    <span className="youtube-visit-button">Watch Now ↗</span>
   </div>
</a>

  </div>
</section>


        <section className="learning-impact">
          <div className="impact-heading">
            <span className="eyebrow">THE NOTEPULSE APPROACH</span>
            <h2>A Better Way to Learn</h2>
            <p>শেখা হোক সহজ, গোছানো এবং লক্ষ্যভিত্তিক।</p>
          </div>

          <div className="impact-grid">
            <div className="impact-card">
              <span className="impact-icon">✦</span>
              <h3>Concept First</h3>
              <p>মুখস্থ নয়, প্রতিটি বিষয় বুঝে শেখার ওপর গুরুত্ব।</p>
            </div>

            <div className="impact-card">
              <span className="impact-icon">◎</span>
              <h3>Chapter-wise Practice</h3>
              <p>প্রতিটি অধ্যায় অনুযায়ী অনুশীলনের সুযোগ।</p>
            </div>

            <div className="impact-card">
              <span className="impact-icon">↗</span>
              <h3>Learning Resources</h3>
              <p>ভিডিও ক্লাস ও প্রয়োজনীয় learning materials এক জায়গায়।</p>
            </div>
          </div>
        </section>


   
        <section className="notice-section">
          <div className="notice-header">
            <div>
              <span className="eyebrow">STAY INFORMED</span>
              <h2>Notice & Announcements</h2>
              <p>NotePulse Science-এর সর্বশেষ খবর ও গুরুত্বপূর্ণ আপডেট।</p>
            </div>

            <span className="live-label">
              <span className="live-dot"></span>
              LATEST UPDATES
            </span>
          </div>

{isLoadingNotices ? (
  <div className="notice-card">
    <div className="notice-content">
      <p>Loading latest notices...</p>
    </div>
  </div>
) : firestoreNotices.length === 0 ? (
  <div className="notice-card">
    <div className="notice-content">
      <p>এখনো কোনো নতুন Notice প্রকাশ করা হয়নি।</p>
    </div>
  </div>
) : (
  firestoreNotices.map((notice) => (
    <div className="notice-card" key={notice.firestoreId}>
      <div className="notice-icon">✦</div>

      <div className="notice-content">
        <span className="notice-category">
          {notice.type || "GENERAL"}
        </span>

        <h3>{notice.title}</h3>

        <p>{notice.message}</p>
      </div>

      <div className="notice-date">LATEST</div>
    </div>
  ))
)}
        </section>






<section className="courses-section" id="courses">
  <div className="section-heading">
    <div className="courses-heading-content">
      <span className="eyebrow">LEARN. PRACTICE. GROW.</span>
      <h2>Explore Our Courses</h2>
      <p>
        তোমার লক্ষ্য অনুযায়ী সঠিক Course বেছে নাও।
        শেখা শুরু হোক নিজের গতিতে।
      </p>
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
        <article
          className="course-card"
          key={course.firestoreId || course.id}
        >
          <div className="course-art">
            <span>
              {(course.subject || "COURSE").toUpperCase()}
            </span>

            <div className="course-art-symbol">
              {course.subject === "Physics" ? "∑" : "Aa"}
            </div>

            <span className="art-brand">NP / SCIENCE</span>
          </div>

          <div className="course-info">
            <div className="course-meta">
              <span>
                {(course.subject || "COURSE").toUpperCase()}
              </span>

              <span
                className={
                  course.status === "running" ? "running" : "coming"
                }
              >
                {course.status === "running"
                  ? "RUNNING"
                  : "COMING SOON"}
              </span>
            </div>

            <h3>{course.title || "Untitled Course"}</h3>

            <p>
              {course.description ||
                "Explore this course and start learning with NotePulse Science."}
            </p>

            <div className="course-bottom">
              <b>
                {course.status === "running"
                  ? course.accessType === "free"
                    ? "100% FREE"
                    : "PAID COURSE"
                  : "COMING SOON"}
              </b>

              <Link
                to={`/courses/${course.slug}`}
                aria-label={`Explore ${course.title || "course"}`}
              >
                <span>Explore</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )}
</section>





<section className="teacher-section" id="teacher">
  <div className="teacher-visual instructor-brand-visual">
    <div className="np-instructor-logo">
      <span>NP</span>
    </div>

    <span className="instructor-brand-name">
      NOTEPULSE SCIENCE
    </span>

    <span className="instructor-brand-line" />

  </div>

  <div className="teacher-copy">
    <span className="eyebrow">MEET OUR INSTRUCTOR</span>

    <h2>
      Jobaidul Islam
      <span className="teacher-designation">
        Physics &amp; English Educator
      </span>
    </h2>

    <p className="teacher-description">
      ২০২৩ সাল থেকে শিক্ষার্থীদের পাঠদান ও বিষয়ভিত্তিক প্রস্তুতিতে
      সহায়তা করে আসছি। বর্তমানে সরাসরি শ্রেণিকক্ষে শিক্ষাদানের
      মাধ্যমে শিক্ষার্থীদের শেখার অভিজ্ঞতাকে আরও কার্যকর করে
      তোলার চেষ্টা করছি।
    </p>

    <div className="teaching-pillars">
      <div>
        <span className="pillar-label">ACADEMIC QUALIFICATION</span>
        <b>SSC 2023</b>
      </div>

      <div>
        <span className="pillar-label">ACADEMIC QUALIFICATION</span>
        <b>HSC 2025</b>
      </div>

      <div>
        <span className="pillar-label">TEACHING EXPERIENCE</span>
        <b>Since 2023</b>
      </div>

      <div>
        <span className="pillar-label">TEACHING METHOD</span>
        <b>Classroom Teaching</b>
      </div>
    </div>

    <div className="teacher-skills">
      <h3>Expertise</h3>

      <div className="teacher-skill-list">
        <span>Physics MCQ Solving</span>
        <span>English Grammar</span>
        <span>Type-wise MCQ Explanation</span>
        <span>Subject-wise Preparation</span>
      </div>
    </div>

    <a className="text-link" href="#contact">
      Get in touch <span aria-hidden="true">↗</span>
    </a>
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

const [courseContentRetry, setCourseContentRetry] = useState(0);

const [courseContentError, setCourseContentError] = useState("");

const [isLoadingCourseContent, setIsLoadingCourseContent] = useState(true);



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
    setIsLoadingCourseContent(true);
    setCourseContentError("");

    try {

      const courseId = course.firestoreId || course.id;

const contentRef = doc(db, "publishedCourseContents", courseId);

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
  setCourseContentError(
    "Course content load করা যায়নি। আবার চেষ্টা করুন।"
  );
}
    }

    finally {
  if (!cancelled) {
    setIsLoadingCourseContent(false);
  }
}

  };



  loadCourseContent();



  return () => {

    cancelled = true;

  };

}, [course, courseContentRetry]);



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

<CourseLearningPage
  course={course}
  courseContent={courseContent}
  isLoading={isLoadingCourseContent}
  error={courseContentError}
  onRetry={() => setCourseContentRetry((prev) => prev + 1)}
/>
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





function AdminDashboardContent({ onLogout, isLoggingOut, adminRole }) {

  const [courseList, setCourseList] = useState([]);

const [activeAdminTab, setActiveAdminTab] = useState("dashboard");

// ADMIN MANAGEMENT STATES
const [adminList, setAdminList] = useState([]);
const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);

const [newAdminEmail, setNewAdminEmail] = useState("");
const [newAdminPassword, setNewAdminPassword] = useState("");

const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
const [updatingAdminId, setUpdatingAdminId] = useState(null);
const [updatingAdminAction, setUpdatingAdminAction] = useState("");
const [adminManagementError, setAdminManagementError] = useState("");
const [adminManagementNotification, setAdminManagementNotification] = useState({
  type: "",
  message: ""
});

const handleCreateCoAdmin = async (e) => {
  e.preventDefault();

  if (adminRole !== "superAdmin") {
    setAdminManagementError("শুধুমাত্র Super Admin এই কাজ করতে পারবেন।");
    return;
  }

  if (!newAdminEmail.trim() || !newAdminPassword.trim()) {
    setAdminManagementError("Email ও Password দিতে হবে।");
    return;
  }

  if (newAdminPassword.length < 6) {
    setAdminManagementError("Password কমপক্ষে ৬ অক্ষরের হতে হবে।");
    return;
  }

  const createStartedAt = Date.now();

  try {
    setIsCreatingAdmin(true);
    setAdminManagementError("");
    setAdminManagementNotification({ type: "", message: "" });

    const credential = await createUserWithEmailAndPassword(
      adminCreationAuth,
      newAdminEmail.trim(),
      newAdminPassword
    );

    await setDoc(doc(db, "admins", credential.user.uid), {
      email: newAdminEmail.trim(),
      role: "coAdmin",
      active: true,
      createdAt: serverTimestamp(),
    });

    await signOut(adminCreationAuth);

    setNewAdminEmail("");
    setNewAdminPassword("");

setAdminList((prev) => [
  ...prev,
  {
    id: credential.user.uid,
    email: newAdminEmail.trim(),
    role: "coAdmin",
    active: true,
  },
]);

    setAdminManagementNotification({
      type: "success",
      message: "Co-Admin সফলভাবে তৈরি হয়েছে!"
    });

  } catch (error) {
    console.error("Co-Admin creation error:", error);

    setAdminManagementError(error.message);

    setAdminManagementNotification({
      type: "error",
      message: "Co-Admin তৈরি করা যায়নি: " + error.message
    });

  } finally {
    const remainingTime = 1000 - (Date.now() - createStartedAt);

    if (remainingTime > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );
    }

    setIsCreatingAdmin(false);
  }
};
const handleToggleAdmin = async (admin) => {
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin এই কাজটি করতে পারবেন।");
    return;
  }

  if (admin.role !== "coAdmin" || updatingAdminId) return;

  const saveStartedAt = Date.now();
  const newStatus = !admin.active;

  try {
    setUpdatingAdminId(admin.id);
setUpdatingAdminAction("toggle");
    setAdminManagementError("");
    setAdminManagementNotification({
      type: "",
      message: ""
    });

    await updateDoc(doc(db, "admins", admin.id), {
      active: newStatus
    });

    setAdminList((prev) =>
      prev.map((item) =>
        item.id === admin.id
          ? { ...item, active: newStatus }
          : item
      )
    );

    setAdminManagementNotification({
      type: "success",
      message: `${admin.email} ${
        newStatus ? "activated" : "deactivated"
      } successfully!`
    });

  } catch (error) {
    console.error("Admin status update error:", error);

    setAdminManagementNotification({
      type: "error",
      message: "Admin status পরিবর্তন করা যায়নি: " + error.message
    });

  } finally {
    const remainingTime = 1000 - (Date.now() - saveStartedAt);

    if (remainingTime > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );
    }

   setUpdatingAdminId(null);
setUpdatingAdminAction("");
  }
};

const handleRevokeAdmin = async (admin) => {
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin এই কাজ করতে পারবেন।");
    return;
  }

  if (admin.role !== "coAdmin" || updatingAdminId) return;

  const confirmed = window.confirm(
    `Are you sure you want to revoke Admin Access for "${admin.email}"?`
  );

  if (!confirmed) return;

  const revokeStartedAt = Date.now();

  try {
  setUpdatingAdminId(admin.id);
setUpdatingAdminAction("revoke");
    setAdminManagementError("");
    setAdminManagementNotification({
      type: "",
      message: ""
    });

    await deleteDoc(doc(db, "admins", admin.id));

    setAdminList((prev) =>
      prev.filter((item) => item.id !== admin.id)
    );

    setAdminManagementNotification({
      type: "success",
      message: `${admin.email}-এর Admin Access সফলভাবে বাতিল হয়েছে!`
    });

  } catch (error) {
    console.error("Admin access revoke error:", error);

    setAdminManagementNotification({
      type: "error",
      message: "Access বাতিল করা যায়নি: " + error.message
    });

  } finally {
    const remainingTime = 1000 - (Date.now() - revokeStartedAt);

    if (remainingTime > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );
    }

   setUpdatingAdminId(null);
setUpdatingAdminAction("");
  }
};
useEffect(() => {
  if (adminRole !== "superAdmin") return;

  const loadAdmins = async () => {
    try {
      setIsLoadingAdmins(true);
      const snapshot = await getDocs(collection(db, "admins"));
      setAdminList(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error) {
      console.error(error);
      setAdminManagementError("Admin list load করা যায়নি।");
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  loadAdmins();
}, [adminRole]);

// CO-ADMIN TAB ACCESS CONTROL
useEffect(() => {
  const allowedTabs = [
    "dashboard",
    "content",
    "pdfs",
    "notices",
    "messages"
  ];

  if (
    adminRole === "coAdmin" &&
    !allowedTabs.includes(activeAdminTab)
  ) {
    setActiveAdminTab("dashboard");
  }
}, [adminRole, activeAdminTab]);

  const [freePdfList, setFreePdfList] = useState([]);
const [freePdfSubject, setFreePdfSubject] = useState("Physics");
const [freePdfChapter, setFreePdfChapter] = useState("");
const [freePdfTitle, setFreePdfTitle] = useState("");
const [freePdfType, setFreePdfType] = useState("Chapter Notes");
const [freePdfDriveUrl, setFreePdfDriveUrl] = useState("");
const [isSavingFreePdf, setIsSavingFreePdf] = useState(false);
const [isLoadingFreePdfs, setIsLoadingFreePdfs] = useState(false);
// NOTICE BOARD STATES
const [noticeList, setNoticeList] = useState([]);
const [noticeTitle, setNoticeTitle] = useState("");
const [noticeMessage, setNoticeMessage] = useState("");
const [noticeType, setNoticeType] = useState("General");
const [editingNoticeId, setEditingNoticeId] = useState(null);
const [isSavingNotice, setIsSavingNotice] = useState(false);
const [isLoadingNotices, setIsLoadingNotices] = useState(false);
// STUDENT MESSAGES STATES
const [messageList, setMessageList] = useState([]);
const [isLoadingMessages, setIsLoadingMessages] = useState(true);
const [messageLoadError, setMessageLoadError] = useState("");
const [deletingMessageId, setDeletingMessageId] = useState(null);
const [messageNotification, setMessageNotification] = useState({
  type: "",
  message: ""
});
const [messageRetry, setMessageRetry] = useState(0);
// LOAD NOTICES FROM FIRESTORE
useEffect(() => {
  const loadNotices = async () => {
    setIsLoadingNotices(true);

    try {
      const snapshot = await getDocs(collection(db, "notices"));

      const notices = snapshot.docs.map((item) => ({
        firestoreId: item.id,
        ...item.data()
      }));

      setNoticeList(notices);
    } catch (error) {
      console.error("Notice loading error:", error);
      alert("Notices load করা যায়নি।");
    } finally {
      setIsLoadingNotices(false);
    }
  };

  loadNotices();
}, [messageRetry]);
// LOAD STUDENT MESSAGES
useEffect(() => {
  const loadMessages = async () => {
    setIsLoadingMessages(true);
    setMessageLoadError("");

    try {
      const q = query(
        collection(db, "contactMessages"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      setMessageList(
        snapshot.docs.map((item) => ({
          ...item.data(),
          firestoreId: item.id
        }))
      );
    } catch (error) {
      console.error("Student messages loading error:", error);
      setMessageLoadError("Student messages load করা যায়নি।");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  loadMessages();
}, []);
// SAVE NOTICE
const handleSaveNotice = async () => {
  if (!noticeTitle.trim() || !noticeMessage.trim()) {
    alert("Notice Title এবং Message দিতে হবে।");
    return;
  }

  setIsSavingNotice(true);

  try {
    const noticeData = {
      title: noticeTitle.trim(),
      message: noticeMessage.trim(),
      type: noticeType,
      updatedAt: serverTimestamp()
    };

if (editingNoticeId) {
  await updateDoc(
    doc(db, "notices", editingNoticeId),
    noticeData
  );

  setNoticeList((prev) =>
    prev.map((notice) =>
      notice.firestoreId === editingNoticeId
        ? { ...notice, ...noticeData }
        : notice
    )
  );
} else {
  const newNotice = {
    ...noticeData,
    published: false,
    createdAt: serverTimestamp()
  };

  const docRef = await addDoc(
    collection(db, "notices"),
    newNotice
  );

  setNoticeList((prev) => [
    ...prev,
    {
      ...newNotice,
      firestoreId: docRef.id
    }
  ]);
}

    setNoticeTitle("");
    setNoticeMessage("");
    setNoticeType("General");
    setEditingNoticeId(null);

    alert("Notice successfully saved!");
  } catch (error) {
    console.error("Notice save error:", error);
    alert("Notice save করা যায়নি।");
  } finally {
    setIsSavingNotice(false);
  }
};


// EDIT NOTICE
const handleEditNotice = (notice) => {
  if (!notice) {
    alert("Notice পাওয়া যায়নি।");
    return;
  }

  const noticeId = notice.firestoreId || notice.id;

  if (!noticeId) {
    alert("Notice ID পাওয়া যায়নি। আবার Refresh করে চেষ্টা করো।");
    console.error("Notice ID missing:", notice);
    return;
  }

  setNoticeTitle(notice.title || "");
  setNoticeMessage(notice.message || "");
  setNoticeType(notice.type || "General");
  setEditingNoticeId(noticeId);
};

// TOGGLE NOTICE PUBLISH
const handleToggleNotice = async (notice) => {
  
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin Notice Publish করতে পারবেন।");
    return;
  }

  try {
    await updateDoc(doc(db, "notices", notice.firestoreId), {
      published: !notice.published,
      updatedAt: serverTimestamp()
    });

    setNoticeList((prev) =>
      prev.map((item) =>
        item.firestoreId === notice.firestoreId
          ? { ...item, published: !item.published }
          : item
      )
    );
  } catch (error) {
    console.error("Notice publish error:", error);
    alert("Notice status change করা যায়নি।");
  }
};

// DELETE NOTICE
const handleDeleteNotice = async (notice) => {
  if (adminRole !== "superAdmin") {
  alert("শুধুমাত্র Super Admin এই কাজটি করতে পারবেন।");
  return;
}
  const confirmed = window.confirm(
    "তুমি কি এই Notice Delete করতে চাও?"
  );

  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "notices", notice.firestoreId));

    setNoticeList((prev) =>
      prev.filter(
        (item) => item.firestoreId !== notice.firestoreId
      )
    );

    alert("Notice deleted successfully!");
  } catch (error) {
    console.error("Notice delete error:", error);
    alert("Notice delete করা যায়নি।");
  }
};

const handleBackupCourseContents = async () => {
  if (adminRole !== "superAdmin") {
    alert("Only Super Admin can create backups.");
    return;
  }

  try {
    const snapshot = await getDocs(
      collection(db, "courseContents")
    );

    const backupData = {
      collection: "courseContents",
      exportedAt: new Date().toISOString(),
      documentCount: snapshot.size,
      documents: snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    };

    const blob = new Blob(
      [JSON.stringify(backupData, null, 2)],
      { type: "application/json" }
    );

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "notepulse-courseContents-backup.json";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

    alert(
      `Backup successful! Documents: ${snapshot.size}`
    );
  } catch (error) {
    console.error("Backup Error:", error);
    alert("Backup failed: " + error.message);
  }
};

// MIGRATE PUBLISHED COURSE CONTENT
const handleMigratePublishedContent = async () => {
  if (adminRole !== "superAdmin") {
    alert("Only Super Admin can migrate content.");
    return;
  }

  try {
    const existingPublished = await getDocs(
      collection(db, "publishedCourseContents")
    );

    if (!existingPublished.empty) {
      alert(
        "Migration stopped! Published collection already contains data."
      );
      return;
    }

    const sourceSnapshot = await getDocs(
      collection(db, "courseContents")
    );

    if (sourceSnapshot.empty) {
      alert("No course content found to migrate.");
      return;
    }

    const confirmed = window.confirm(
      `তুমি কি ${sourceSnapshot.size}টি Course-এর Published Content নতুন Collection-এ Copy করতে চাও? পুরোনো Data পরিবর্তন হবে না।`
    );

    if (!confirmed) return;

    for (const item of sourceSnapshot.docs) {
      const source = item.data();

      const publishedContent = {
        coreClasses: {
          title: source.coreClasses?.title || "Core Classes",
          chapters: (source.coreClasses?.chapters || [])
            .filter((chapter) => chapter.published === true)
            .map((chapter) => ({
              ...chapter,
              classes: (chapter.classes || []).filter(
                (classItem) => classItem.published === true
              ),
              notes: (chapter.notes || []).filter(
                (note) => note.published === true
              )
            }))
        },

        mentorship: {
          title: source.mentorship?.title || "Mentorship",
          classes: (source.mentorship?.classes || []).filter(
            (item) => item.published === true
          )
        },

        exams: {
          title: source.exams?.title || "Course Exams",
          items: (source.exams?.items || []).filter(
            (item) => item.published === true
          )
        },

        sourceUpdatedAt: source.updatedAt || null,
        publishedAt: serverTimestamp()
      };

      await setDoc(
        doc(db, "publishedCourseContents", item.id),
        publishedContent
      );
    }

    alert(
      `Migration successful! ${sourceSnapshot.size} Course copied.`
    );

  } catch (error) {
    console.error("Content Migration Error:", error);
    alert("Migration failed: " + error.message);
  }
};

// DELETE STUDENT MESSAGE
const handleDeleteMessage = async (messageId) => {
  if (deletingMessageId) return;

  const selectedMessage = messageList.find(
    (item) => item.firestoreId === messageId
  );

  if (!selectedMessage) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete the message from "${selectedMessage.name || "Student"}"?`
  );

  if (!confirmed) return;

  const deleteStartedAt = Date.now();

  try {
    setDeletingMessageId(messageId);
    setMessageNotification({
      type: "",
      message: ""
    });

    await deleteDoc(doc(db, "contactMessages", messageId));

    setMessageList((prev) =>
      prev.filter((item) => item.firestoreId !== messageId)
    );

    setMessageNotification({
      type: "success",
      message: "Student message successfully deleted!"
    });

  } catch (error) {
    console.error("Message delete error:", error);

    setMessageNotification({
      type: "error",
      message: "Message delete করা যায়নি: " + error.message
    });

  } finally {
    const remainingTime = 1000 - (Date.now() - deleteStartedAt);

    if (remainingTime > 0) {
      await new Promise((resolve) =>
        setTimeout(resolve, remainingTime)
      );
    }

    setDeletingMessageId(null);
  }
};

  const [selectedContentCourseId, setSelectedContentCourseId] = useState("");

  const [adminCourseContent, setAdminCourseContent] = useState({

  coreClasses: { title: "Core Classes", chapters: [] },

  mentorship: { title: "Mentorship", classes: [] },

  exams: { title: "Course Exams", items: [] }

});



const [isLoadingContent, setIsLoadingContent] = useState(false);
const [isSavingContent, setIsSavingContent] = useState(false);

const [contentNotification, setContentNotification] = useState({
  type: "",
  message: ""
});

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

useEffect(() => {
  const loadFreePdfs = async () => {
    setIsLoadingFreePdfs(true);

    try {
      const snapshot = await getDocs(collection(db, "freePdfs"));

      const pdfs = snapshot.docs.map((item) => ({
        firestoreId: item.id,
        ...item.data()
      }));

      setFreePdfList(pdfs);
    } catch (error) {
      console.error("Free PDF loading error:", error);
    } finally {
      setIsLoadingFreePdfs(false);
    }
  };

  loadFreePdfs();
}, []);

const handleAddFreePdf = async () => {
  if (!freePdfChapter.trim() || !freePdfTitle.trim() || !freePdfDriveUrl.trim()) {
    alert("Chapter, PDF Title এবং Google Drive Link দিতে হবে।");
    return;
  }

  const fileIdMatch =
    freePdfDriveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    freePdfDriveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);

  if (!fileIdMatch) {
    alert("একটি valid Google Drive PDF Link দাও।");
    return;
  }

  setIsSavingFreePdf(true);

  try {
    const fileId = fileIdMatch[1];

    const newPdf = {
      subject: freePdfSubject,
      chapter: freePdfChapter.trim(),
      title: freePdfTitle.trim(),
      type: freePdfType,
      pdfUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
      storageProvider: "googleDrive",
      published: false,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, "freePdfs"), newPdf);

    setFreePdfList((prev) => [
      ...prev,
      { ...newPdf, firestoreId: docRef.id }
    ]);

    setFreePdfChapter("");
    setFreePdfTitle("");
    setFreePdfDriveUrl("");

    alert("Free PDF Successfully Added!");
  } catch (error) {
    console.error("Free PDF adding error:", error);
    alert("PDF যোগ করা যায়নি। আবার চেষ্টা করো।");
  } finally {
    setIsSavingFreePdf(false);
  }
};

const handleSaveCourseContent = async () => {
  if (!selectedContentCourseId || isSavingContent) {
    if (!selectedContentCourseId) {
      alert("আগে একটি Course Select করো।");
    }
    return;
  }

const saveStartedAt = Date.now();

setIsSavingContent(true);

try {
    // STEP 1: SAVE ADMIN DRAFT CONTENT
    await setDoc(
      doc(db, "courseContents", selectedContentCourseId),
      {
        ...adminCourseContent,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );

    // STEP 2: SYNC PUBLISHED CONTENT (SUPER ADMIN ONLY)
    if (adminRole === "superAdmin") {
      const publishedContent = {
        coreClasses: {
          title: adminCourseContent.coreClasses?.title || "Core Classes",

          chapters: (
            adminCourseContent.coreClasses?.chapters || []
          )
            .filter((chapter) => chapter.published === true)
            .map((chapter) => ({
              ...chapter,

              classes: (chapter.classes || []).filter(
                (classItem) => classItem.published === true
              ),

              notes: (chapter.notes || []).filter(
                (note) => note.published === true
              )
            }))
        },

        mentorship: {
          title: adminCourseContent.mentorship?.title || "Mentorship",

          classes: (
            adminCourseContent.mentorship?.classes || []
          ).filter((item) => item.published === true)
        },

        exams: {
          title: adminCourseContent.exams?.title || "Course Exams",

          items: (
            adminCourseContent.exams?.items || []
          ).filter((item) => item.published === true)
        },

        sourceUpdatedAt: serverTimestamp(),
        publishedAt: serverTimestamp()
      };

      await setDoc(
        doc(db, "publishedCourseContents", selectedContentCourseId),
        publishedContent
      );
    }

setContentNotification({
  type: "success",
  message:
    adminRole === "superAdmin"
      ? "Course Content and Published Content Successfully Saved!"
      : "Course Content Successfully Saved!"
});
setTimeout(() => {
  setContentNotification({
    type: "",
    message: ""
  });
}, 4000);

  } catch (error) {
    console.error("Course content saving error:", error);

setContentNotification({
  type: "error",
  message: "Content Save/Sync Error: " + error.message
});
setTimeout(() => {
  setContentNotification({
    type: "",
    message: ""
  });
}, 4000);

  }finally {
  const remainingTime = 1000 - (Date.now() - saveStartedAt);

  if (remainingTime > 0) {
    await new Promise((resolve) =>
      setTimeout(resolve, remainingTime)
    );
  }

  setIsSavingContent(false);
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



 setContentNotification({
  type: "success",
  message: "PDF added successfully! এখন Save Course Content চাপো।"
});

setTimeout(() => {
  setContentNotification({
    type: "",
    message: ""
  });
}, 4000);

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
  setContentNotification({
  type: "success",
  message: "Chapter added successfully! এখন Save Course Content চাপো।"
});

setTimeout(() => {
  setContentNotification({
    type: "",
    message: ""
  });
}, 4000);

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

  setContentNotification({
  type: "success",
  message: "Video Class added successfully! এখন Save Course Content চাপো।"
});

setTimeout(() => {
  setContentNotification({
    type: "",
    message: ""
  });
}, 4000);

};

const handleToggleClassPublish = (chapterId, classId) => {
  if (adminRole !== "superAdmin") return;

  const selectedChapter = adminCourseContent.coreClasses.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  const selectedClass = selectedChapter?.classes?.find(
    (classItem) => classItem.id === classId
  );

  if (!selectedClass) return;

  const newStatus = !selectedClass.published;

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
                  ? { ...classItem, published: newStatus }
                  : classItem
              )
            }
          : chapter
      )
    }
  }));

  setContentNotification({
    type: "success",
    message: newStatus
      ? "Video Class published successfully! এখন Save Course Content চাপো।"
      : "Video Class unpublished successfully! এখন Save Course Content চাপো।"
  });

  setTimeout(() => {
    setContentNotification({
      type: "",
      message: ""
    });
  }, 4000);
};

const handleToggleChapterPublish = (chapterId) => {
  if (adminRole !== "superAdmin") return;

  const selectedChapter = adminCourseContent.coreClasses.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  if (!selectedChapter) return;

  const newStatus = !selectedChapter.published;

  setAdminCourseContent((prev) => ({
    ...prev,
    coreClasses: {
      ...prev.coreClasses,
      chapters: prev.coreClasses.chapters.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, published: newStatus }
          : chapter
      )
    }
  }));

  setContentNotification({
    type: "success",
    message: newStatus
      ? "Chapter published successfully! এখন Save Course Content চাপো।"
      : "Chapter unpublished successfully! এখন Save Course Content চাপো।"
  });

  setTimeout(() => {
    setContentNotification({
      type: "",
      message: ""
    });
  }, 4000);
};
const handleToggleNotePublish = (chapterId, noteId) => {
  if (adminRole !== "superAdmin") return;

  const selectedChapter = adminCourseContent.coreClasses.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  const selectedNote = selectedChapter?.notes?.find(
    (note) => note.id === noteId
  );

  if (!selectedNote) return;

  const newStatus = !selectedNote.published;

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
                  ? { ...note, published: newStatus }
                  : note
              )
            }
          : chapter
      )
    }
  }));

  setContentNotification({
    type: "success",
    message: newStatus
      ? "PDF published successfully! এখন Save Course Content চাপো।"
      : "PDF unpublished successfully! এখন Save Course Content চাপো।"
  });

  setTimeout(() => {
    setContentNotification({
      type: "",
      message: ""
    });
  }, 4000);
};

const handleToggleFreePdfPublish = async (pdf) => {
  
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin PDF Publish করতে পারবেন।");
    return;
  }

  try {
    const updatedStatus = !pdf.published;

    await setDoc(
      doc(db, "freePdfs", pdf.firestoreId),
      {
        published: updatedStatus
      },
      { merge: true }
    );

    setFreePdfList((prev) =>
      prev.map((item) =>
        item.firestoreId === pdf.firestoreId
          ? { ...item, published: updatedStatus }
          : item
      )
    );

    alert(
      updatedStatus
        ? "Free PDF Successfully Published!"
        : "Free PDF Successfully Unpublished!"
    );

  } catch (error) {
    console.error("Free PDF publish error:", error);
    alert("PDF Publish করা যায়নি। আবার চেষ্টা করো।");
  }
};


const handleDeleteFreePdf = async (pdf) => {
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin PDF Delete করতে পারবেন।");
    return;
  }

  const confirmed = window.confirm(
    `তুমি কি "${pdf.title}" PDF Delete করতে চাও?`
  );

  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, "freePdfs", pdf.firestoreId));

    setFreePdfList((prev) =>
      prev.filter(
        (item) => item.firestoreId !== pdf.firestoreId
      )
    );

    alert("Free PDF Successfully Deleted!");
  } catch (error) {
    console.error("Free PDF delete error:", error);
    alert("PDF Delete করা যায়নি। আবার চেষ্টা করো।");
  }
};


const handleDeleteChapter = (chapterId) => {
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin এই কাজটি করতে পারবেন।");
    return;
  }

  const selectedChapter = adminCourseContent.coreClasses.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  if (!selectedChapter) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${selectedChapter.title}"?`
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

  setContentNotification({
    type: "success",
    message: `"${selectedChapter.title}" deleted successfully! এখন Save Course Content চাপো।`
  });

  setTimeout(() => {
    setContentNotification({
      type: "",
      message: ""
    });
  }, 4000);
};

const handleDeleteClass = (chapterId, classId) => {
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin এই কাজটি করতে পারবেন।");
    return;
  }

  const selectedChapter = adminCourseContent.coreClasses.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  const selectedClass = selectedChapter?.classes?.find(
    (item) => item.id === classId
  );

  if (!selectedClass) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${selectedClass.title}"?`
  );

  if (!confirmed) return;

  setAdminCourseContent((prev) => ({
    ...prev,
    coreClasses: {
      ...prev.coreClasses,
      chapters: prev.coreClasses.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              classes: (chapter.classes || []).filter(
                (item) => item.id !== classId
              )
            }
          : chapter
      )
    }
  }));

  setContentNotification({
    type: "success",
    message: `"${selectedClass.title}" deleted successfully! এখন Save Course Content চাপো।`
  });

  setTimeout(() => {
    setContentNotification({
      type: "",
      message: ""
    });
  }, 4000);
};

const handleDeleteNote = (chapterId, noteId) => {
  if (adminRole !== "superAdmin") {
    alert("শুধুমাত্র Super Admin এই কাজটি করতে পারবেন।");
    return;
  }

  const selectedChapter = adminCourseContent.coreClasses.chapters.find(
    (chapter) => chapter.id === chapterId
  );

  const selectedNote = selectedChapter?.notes?.find(
    (note) => note.id === noteId
  );

  if (!selectedNote) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete "${selectedNote.title}"?`
  );

  if (!confirmed) return;

  setAdminCourseContent((prev) => ({
    ...prev,
    coreClasses: {
      ...prev.coreClasses,
      chapters: prev.coreClasses.chapters.map((chapter) =>
        chapter.id === chapterId
          ? {
              ...chapter,
              notes: (chapter.notes || []).filter(
                (note) => note.id !== noteId
              )
            }
          : chapter
      )
    }
  }));

  setContentNotification({
    type: "success",
    message: `"${selectedNote.title}" deleted successfully! এখন Save Course Content চাপো।`
  });

  setTimeout(() => {
    setContentNotification({
      type: "",
      message: ""
    });
  }, 4000);
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

  <button
    type="button"
    className={activeAdminTab === "dashboard" ? "active" : ""}
    onClick={() => setActiveAdminTab("dashboard")}
  >
    Dashboard
  </button>

  {adminRole === "superAdmin" && (
    <button
      type="button"
      className={activeAdminTab === "courses" ? "active" : ""}
      onClick={() => setActiveAdminTab("courses")}
    >
      Course Management
    </button>
  )}

  <button
    type="button"
    className={activeAdminTab === "content" ? "active" : ""}
    onClick={() => setActiveAdminTab("content")}
  >
    Course Content
  </button>

  <button
    type="button"
    className={activeAdminTab === "pdfs" ? "active" : ""}
    onClick={() => setActiveAdminTab("pdfs")}
  >
    PDF Management
  </button>

  <button
    type="button"
    className={activeAdminTab === "notices" ? "active" : ""}
    onClick={() => setActiveAdminTab("notices")}
  >
    Notice Board
  </button>

  <button
    type="button"
    className={activeAdminTab === "messages" ? "active" : ""}
    onClick={() => setActiveAdminTab("messages")}
  >
    Student Messages
  </button>

  {adminRole === "superAdmin" && (
    <>
      <button
        type="button"
        className={activeAdminTab === "admins" ? "active" : ""}
        onClick={() => setActiveAdminTab("admins")}
      >
        Admin Management
      </button>

      <button
        type="button"
        className={activeAdminTab === "backup" ? "active" : ""}
        onClick={() => setActiveAdminTab("backup")}
      >
        Backup & Restore
      </button>
    </>
  )}

</nav>



<div className="sidebar-bottom">
  <span>Logged in as</span>
  <strong>
    {adminRole === "coAdmin" ? "Co-Admin" : "Super Admin"}
  </strong>
</div>


      </aside>



      <main className="admin-main">

<header className="admin-topbar">

  <div>

    <h2>Dashboard Overview</h2>

    <p>Welcome to NotePulse Science Admin Panel.</p>

  </div>




<span className="admin-role">
  {adminRole === "coAdmin" ? "CO-ADMIN" : "SUPER ADMIN"}
</span>




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

{activeAdminTab === "dashboard" && (
 <>
        <section className="admin-welcome">


<div>
  <span>ADMIN CONTROL CENTER</span>

  <h1>
    Welcome, {adminRole === "coAdmin" ? "Co-Admin" : "Super Admin"}!
  </h1>

  <p>Manage your educational platform from one place.</p>
</div>


          <div className="welcome-icon">N</div>

        </section>



        <section className="admin-stats">

          <div className="stat-card">

            <span>Total Courses</span>

            <h2>{courseList.length}</h2>

            <small>All courses in your course list</small>

          </div>

          <div className="stat-card">

            <span>Running Courses</span>

            <h2>{courseList.filter((course) => course.status === "running").length}</h2>

            <small>Courses currently marked as running</small>

          </div>

          <div className="stat-card">

            <span>PDF Resources</span>

            <h2>—</h2>

            <small>Published resources</small>

          </div>

          <div className="stat-card">

            <span>Student Messages</span>

<h2>{messageList.length}</h2>

            <small>Inbox messages</small>

          </div>

</section>
</>
)}
{activeAdminTab === "courses" && (
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
)}






{activeAdminTab === "notices" && (

<section className="course-content-panel" id="notice-board-management">
    <div className="section-heading">
      <h2>Notice Board Management</h2>
      <p>Create, edit and publish important notices for students.</p>
    </div>

    <div className="content-editor">
      <h3>{editingNoticeId ? "Edit Notice" : "Create New Notice"}</h3>

      <label>Notice Title</label>
      <input
        type="text"
        value={noticeTitle}
        onChange={(e) => setNoticeTitle(e.target.value)}
        placeholder="Enter notice title"
      />

      <label>Notice Message</label>
      <textarea
        rows="5"
        value={noticeMessage}
        onChange={(e) => setNoticeMessage(e.target.value)}
        placeholder="Write your notice here..."
      />

      <label>Notice Category</label>
      <select
        value={noticeType}
        onChange={(e) => setNoticeType(e.target.value)}
      >
        <option value="General">General</option>
        <option value="Important">Important</option>
        <option value="Exam">Exam</option>
        <option value="Class">Class Update</option>
      </select>

      
<button
  type="button"
  className="course-edit-btn"
  onClick={handleSaveNotice}
  disabled={isSavingNotice}
>
  {isSavingNotice
    ? "Saving..."
    : editingNoticeId
    ? "Update Notice"
    : "+ Publish New Notice"}
</button>




      {editingNoticeId && (
        <button
          type="button"
          onClick={() => {
            setEditingNoticeId(null);
            setNoticeTitle("");
            setNoticeMessage("");
            setNoticeType("General");
          }}
        >
          Cancel Edit
        </button>
      )}
    </div>

    <div className="content-editor">
      <h3>All Notices ({noticeList.length})</h3>

      {isLoadingNotices ? (
        <p>Loading notices...</p>
      ) : noticeList.length === 0 ? (
        <p>No notices added yet.</p>
      ) : (
        <div className="course-list">
          {noticeList.map((notice) => (
            <div
              className="course-list-item"
              key={notice.firestoreId}
            >
              <div>
                <h3>{notice.title}</h3>
                <p>{notice.message}</p>
                <small>
                  Category: {notice.type} • Status:{" "}
                  {notice.published ? "Published" : "Draft"}
                </small>
              </div>

              <button
                type="button"
                className="course-edit-btn"
                onClick={() => handleEditNotice(notice)}
              >
                Edit
              </button>

{adminRole === "superAdmin" && (
  <>
    <button
      type="button"
      className="course-edit-btn"
      onClick={() => handleToggleNotice(notice)}
    >
      {notice.published ? "Unpublish" : "Publish"}
    </button>

    <button
      type="button"
      className="course-delete-btn"
      onClick={() => handleDeleteNotice(notice)}
    >
      Delete
    </button>
  </>
)}
            </div>
          ))}
        </div>
        )}
    </div>
  </section>
)}

{activeAdminTab === "messages" && (
  <section className="course-content-panel" id="student-messages-management">
    <div className="section-heading">
      <h2>Student Messages</h2>
      <p>View and manage messages from students.</p>
    </div>

    <div className="content-editor">
      <div className="messages-management-header">
        <div>
          <h3>Inbox</h3>
          <p>Messages submitted through the website contact form.</p>
        </div>

        <span className="messages-count">
          {messageList.length} {messageList.length === 1 ? "Message" : "Messages"}
        </span>
      </div>

{isLoadingMessages ? (
  <div className="learning-empty">
    <div className="course-loading-spinner"></div>
    <h3>Loading Student Messages</h3>
    <p>Please wait while your inbox is loading...</p>
  </div>
) : messageLoadError ? (
  <div className="messages-empty-state">
    <h3>Unable to Load Messages</h3>
    <p>{messageLoadError}</p>

    <button
      type="button"
      onClick={() => setMessageRetry((prev) => prev + 1)}
    >
      Try Again ↻
    </button>
  </div>
      ) : messageList.length === 0 ? (
        <div className="messages-empty-state">
          <span>✉</span>
          <h3>Your inbox is empty</h3>
          <p>New student messages will appear here.</p>
        </div>
     ) : (
  <>
    {messageNotification.message && (
      <div
        className={`content-notification ${messageNotification.type}`}
        role="alert"
      >
        {messageNotification.message}
      </div>
    )}

    <div className="student-message-list">
          {messageList.map((item) => (
            <article className="student-message-card" key={item.firestoreId}>
              <div className="student-message-top">
                <div>
                  <h3>{item.name || "Student"}</h3>
                 <a href={`mailto:${item.email}`}>{item.email}</a>

<a
  className="student-message-reply-btn"
  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(item.email || "")}`}
  target="_blank"
  rel="noopener noreferrer"
>
  ✉ Reply via Gmail
</a>
                </div>

<button
  type="button"
  className="course-delete-btn"
  onClick={() => handleDeleteMessage(item.firestoreId)}
  disabled={deletingMessageId !== null}
>
  {deletingMessageId === item.firestoreId ? (
    <span className="save-button-loading">
      <span className="save-button-spinner"></span>
      Deleting...
    </span>
  ) : (
    "Delete"
  )}
</button>
              </div>

              <div className="student-message-subject">
                <span>SUBJECT</span>
                <strong>{item.subject || "No subject"}</strong>
              </div>

              <p className="student-message-body">{item.message}</p>

              <small className="student-message-date">
                {item.createdAt?.toDate
                  ? item.createdAt.toDate().toLocaleString()
                  : "Date unavailable"}
              </small>
            </article>
               ))}
        </div>
      </>
      )}
    </div>
  </section>
)} 

{adminRole === "superAdmin" && activeAdminTab === "admins" && (

<section className="course-content-panel admin-management-panel">
  <h2>Admin Management</h2>
  <p>Manage Super Admin and Co-Admin access.</p>

  <div className="content-editor">
    <h3>Add New Co-Admin</h3>

    <form onSubmit={handleCreateCoAdmin}>
      {adminManagementNotification.message && (
  <div
    className={`content-notification ${adminManagementNotification.type}`}
    role="alert"
  >
    {adminManagementNotification.message}
  </div>
)}
      <input
        type="email"
        placeholder="Co-Admin Email"
        value={newAdminEmail}
        onChange={(e) => setNewAdminEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password (minimum 6 characters)"
        value={newAdminPassword}
        onChange={(e) => setNewAdminPassword(e.target.value)}
        required
        minLength={6}
      />

      {adminManagementError && (
        <p className="admin-error">{adminManagementError}</p>
      )}

<button type="submit" disabled={isCreatingAdmin}>
  {isCreatingAdmin ? (
    <span className="save-button-loading">
      <span className="save-button-spinner"></span>
      Creating Co-Admin...
    </span>
  ) : (
    "Add Co-Admin"
  )}
</button>
    </form>
  </div>

  <div className="content-editor">
    <h3>Admin Accounts</h3>

    {isLoadingAdmins ? (
      <p>Loading admins...</p>
    ) : adminList.length === 0 ? (
      <p>No admin accounts found.</p>
    ) : (
      adminList.map((admin) => (
        <div className="admin-account-row" key={admin.id}>
<div>
  <strong>{admin.email}</strong>

  <p>
    Role:{" "}
    {admin.role === "superAdmin" ? "Super Admin" : "Co-Admin"}
  </p>

  <span>{admin.active ? "Active" : "Inactive"}</span>
</div>

          {admin.role === "coAdmin" && (
            <div>
<button
  type="button"
  onClick={() => handleToggleAdmin(admin)}
  disabled={updatingAdminId !== null}
>
  {updatingAdminId === admin.id ? (
    <span className="save-button-loading">
      <span className="save-button-spinner"></span>
      Updating...
    </span>
  ) : (
    admin.active ? "Deactivate" : "Activate"
  )}
</button>

<button
  type="button"
  onClick={() => handleRevokeAdmin(admin)}
  disabled={updatingAdminId !== null}
>
  {updatingAdminId === admin.id &&
  updatingAdminAction === "revoke" ? (
    <span className="save-button-loading">
      <span className="save-button-spinner"></span>
      Revoking...
    </span>
  ) : (
    "Revoke Access"
  )}
</button>
            </div>
          )}
        </div>
      ))
    )}
  </div>
</section>
)}


{adminRole === "superAdmin" && activeAdminTab === "backup" && (

  <section className="course-content-panel">
    <h2>Backup & Restore</h2>
<div className="content-editor">
  <h3>Course Content Backup</h3>

  <p>
    Download a complete JSON backup of your course contents.
  </p>

  <button
    type="button"
    className="course-edit-btn"
    onClick={handleBackupCourseContents}
  >
    Download Backup
  </button>

<button
  type="button"
  className="course-edit-btn"
  onClick={handleMigratePublishedContent}
>
  Migrate Published Content
</button>  
</div>
  </section>
)}  


{activeAdminTab === "content" && (
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

        setNewNoteType("classSlides");

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



{adminRole === "superAdmin" && (
  <>
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

    <button
      type="button"
      onClick={() =>
        handleDeleteClass(chapter.id, classItem.id)
      }
      className="delete-chapter-btn"
    >
      Delete
    </button>
  </>
)}

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



{adminRole === "superAdmin" && (
  <>
    <button
      type="button"
      onClick={() =>
        handleToggleNotePublish(chapter.id, note.id)
      }
    >
      {note.published ? "Unpublish" : "Publish"}
    </button>

    <button
      type="button"
      onClick={() =>
        handleDeleteNote(chapter.id, note.id)
      }
      className="delete-chapter-btn"
    >
      Delete
    </button>
  </>
)}
                  </div>

                ))}

              </div>



{/* CHAPTER ACTIONS */}


<div className="chapter-actions">

  {adminRole === "superAdmin" && (
    <>
      <button
        type="button"
        onClick={() => handleToggleChapterPublish(chapter.id)}
      >
        {chapter.published ? "Unpublish Chapter" : "Publish Chapter"}
      </button>

      <button
        type="button"
        onClick={() => handleDeleteChapter(chapter.id)}
        className="delete-chapter-btn"
      >
        Delete Chapter
      </button>
    </>
  )}

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

{contentNotification.message && (
  <div
    className={`content-notification ${contentNotification.type}`}
    role="alert"
  >
    {contentNotification.message}
  </div>
)}

<button
  type="button"
  onClick={handleSaveCourseContent}
  disabled={isSavingContent || isLoadingContent}
>

{isSavingContent ? (
  <span className="save-button-loading">
    <span className="save-button-spinner"></span>
    Saving Course Content...
  </span>
) : (
  "Save Course Content"
)}

      </button>

    </div>

  ) : (

    <p>Please select a course to manage its content.</p>

  )}

</section>
)}

{activeAdminTab === "pdfs" && (
<section className="course-content-panel" id="free-pdf-management">

  <div className="section-heading">
    <h2>Free PDF Management</h2>
    <p>Add and organize free study materials for students.</p>
  </div>

  <div className="content-editor">

    <h3>Add New Free PDF</h3>

    <label>Subject</label>
    <select
      value={freePdfSubject}
      onChange={(e) => setFreePdfSubject(e.target.value)}
    >
      <option value="Physics">Physics</option>
      <option value="English">English</option>
      <option value="Biology">Biology</option>
    </select>

    <label>Chapter Name</label>
    <input
      type="text"
      value={freePdfChapter}
      onChange={(e) => setFreePdfChapter(e.target.value)}
      placeholder="Enter chapter name"
    />

    <label>PDF Title</label>
    <input
      type="text"
      value={freePdfTitle}
      onChange={(e) => setFreePdfTitle(e.target.value)}
      placeholder="Enter PDF title"
    />

    <label>PDF Type</label>
    <select
      value={freePdfType}
      onChange={(e) => setFreePdfType(e.target.value)}
    >
      <option value="Chapter Notes">Chapter Notes</option>
      <option value="Lecture Sheets">Lecture Sheets</option>
      <option value="CQ & Creative">CQ & Creative</option>
      <option value="MCQ Practice">MCQ Practice</option>
      <option value="Short Suggestions">Short Suggestions</option>
    </select>

    <label>Google Drive PDF Link</label>
    <input
      type="url"
      value={freePdfDriveUrl}
      onChange={(e) => setFreePdfDriveUrl(e.target.value)}
      placeholder="Paste Google Drive PDF link"
    />

    <button
      type="button"
      onClick={handleAddFreePdf}
      disabled={isSavingFreePdf}
    >
      {isSavingFreePdf ? "Adding PDF..." : "Add Free PDF"}
    </button>

  </div>

  <div className="section-heading">
    <h3>Uploaded Free PDFs</h3>
  </div>

  {isLoadingFreePdfs ? (
    <p>Loading PDFs...</p>
  ) : freePdfList.length === 0 ? (
    <p>No Free PDFs added yet.</p>
  ) : (
<div className="content-editor">
  {freePdfList.map((pdf) => (
    <div className="chapter-note-item" key={pdf.firestoreId}>
      <div className="chapter-note-main">
        <strong>{pdf.title}</strong>
        <small>{pdf.subject} · {pdf.chapter} · {pdf.type}</small>
      </div>

      <span>
        {pdf.published ? "Published" : "Unpublished"}
      </span>

{adminRole === "superAdmin" && (
  <button
    type="button"
    onClick={() => handleToggleFreePdfPublish(pdf)}
  >
    {pdf.published ? "Unpublish" : "Publish"}
  </button>
)}
     {adminRole === "superAdmin" && (
  <button
    type="button"
    onClick={() => handleDeleteFreePdf(pdf)}
  >
    Delete
  </button>
)} 
    </div>
  ))}
</div>
  )}

</section>
)}



<footer className="admin-footer">

  NotePulse Science © 2026. Admin Dashboard.

</footer>

</main>

</div>

);

}



function AdminDashboard() {

  const [adminRole, setAdminRole] = useState("");

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



const adminData = adminSnap.data();

if (
  !adminSnap.exists() ||
  adminData?.active !== true ||
  !["superAdmin", "coAdmin"].includes(adminData?.role)
) {
  await signOut(auth);
  window.location.replace("/admin-login");
  return;
}

setAdminRole(adminData.role);
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
  adminRole={adminRole}
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

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollableHeight > 0
        ? (window.scrollY / scrollableHeight) * 100
        : 0;

      setScrollProgress(progress);
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return isVisible ? (
    <button
      className="back-to-top"
      type="button"
      onClick={scrollToTop}
      style={{
        background: `conic-gradient(#36d399 ${scrollProgress}%, #dce9e2 ${scrollProgress}%)`
      }}
      aria-label="Back to top"
    >
      <span>↑</span>
    </button>
  ) : null;
}

function App() {
  return (
    <>
      <RouteTransitionLoader />
      <BackToTopButton />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/:slug" element={<CourseDetailsPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/free-pdf.html" element={<FreePdfPage />} />
      </Routes>
    </>
  );
}



export default App;