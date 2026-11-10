import { useState } from "react";

const getSlideType = (note) => {
  const type = note.type || note.category || note.pdfType || "classSlides";
  return type === "practiceSlides" || type === "practice" || type === "practice-slides"
    ? "practiceSlides"
    : "classSlides";
};

const CourseLearningPage = ({
  course,
  courseContent,
  isLoading,
  error,
  onRetry
}) => {
  const [activeTab, setActiveTab] = useState("core");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [activeResourceTab, setActiveResourceTab] = useState("videos");
  const [activePdf, setActivePdf] = useState(null);

  if (!course) return null;
  if (isLoading) {
  return (
    <div className="learning-page">
      <div className="learning-container">
        <div className="learning-empty">
          <div className="course-loading-spinner"></div>
          <h3>Preparing Your Learning Space</h3>
          <p>Your course content is loading. Please wait...</p>
        </div>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="learning-page">
      <div className="learning-container">
        <div className="learning-empty">
          <h3>Unable to Load Course Content</h3>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            Try Again ↻
          </button>
        </div>
      </div>
    </div>
  );
}

  const content = courseContent || {};
  const tabs = [
    { id: "core", label: "Core Classes" },
    { id: "mentorship", label: "Mentorship" },
    { id: "exams", label: "Course Exams" },
  ];

  const chapters = content.coreClasses?.chapters || [];
  const mentorshipClasses = content.mentorship?.classes || [];
  const exams = content.exams?.items || [];
  const publishedChapters = chapters.filter((chapter) => chapter.published);
  const publishedMentorship = mentorshipClasses.filter((item) => item.published);
  const publishedExams = exams.filter((exam) => exam.published);

  const publishedVideos = (chapter) =>
    (chapter.classes || []).filter((item) => item.published);
  const publishedNotes = (chapter, type) =>
    (chapter.notes || []).filter(
      (note) => note.published && getSlideType(note) === type
    );

  const resourceTabs = [
    { id: "videos", label: "▶ Video Lectures" },
    { id: "classSlides", label: "▤ Class Slides" },
    { id: "practiceSlides", label: "✎ Practice Slides" },
  ];

  return (
    <main className="learning-page">
      <div className="learning-container">
        <header className="learning-header">
          <div>
            <span className="learning-eyebrow">YOUR LEARNING SPACE</span>
            <h1>{course.title}</h1>
            <p>{course.subtitle || course.description}</p>
          </div>
        </header>

        <nav className="learning-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? "active" : ""}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedChapter(null);
                setActivePdf(null);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="learning-content">
          {activeTab === "core" && !selectedChapter && (
            <div>
              <div className="learning-section-heading">
                <h2>Core Classes</h2>
                <p>Explore your chapters, video lectures and study slides.</p>
              </div>

              {publishedChapters.length === 0 ? (
                <div className="learning-empty">
                  <h3>Classes Coming Soon</h3>
                  <p>Your classes will appear here when published.</p>
                </div>
              ) : (
                <div className="learning-chapter-list">
                  {publishedChapters.map((chapter) => (
                    <article
                      className="learning-chapter-card"
                      key={chapter.id}
                      onClick={() => {
                        setSelectedChapter(chapter);
                        setActiveResourceTab("videos");
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedChapter(chapter);
                          setActiveResourceTab("videos");
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <h3>{chapter.title}</h3>
                      {chapter.description && <p>{chapter.description}</p>}
                      <div className="learning-resource-count">
                        <span>{publishedVideos(chapter).length} Videos</span>
                        <span>{publishedNotes(chapter, "classSlides").length} Class Slides</span>
                        <span>{publishedNotes(chapter, "practiceSlides").length} Practice Slides</span>
                      </div>
                      <span className="chapter-open-hint">Explore chapter ↗</span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "core" && selectedChapter && (
            <div className="chapter-details-page">
              <button
                type="button"
                className="chapter-back-btn"
                onClick={() => { setSelectedChapter(null); setActivePdf(null); }}
              >
                ← Back to Chapters
              </button>

              <div className="chapter-details-header">
                <span>CHAPTER DETAILS</span>
                <h2>{selectedChapter.title}</h2>
                {selectedChapter.description && <p>{selectedChapter.description}</p>}
              </div>

              <nav className="chapter-resource-tabs" aria-label="Chapter resources">
                {resourceTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={activeResourceTab === tab.id ? "active" : ""}
                    onClick={() => setActiveResourceTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              {activeResourceTab === "videos" && (
                <div className="chapter-resource-list">
                  {publishedVideos(selectedChapter).map((classItem, index) => (
                    <a
                      className="chapter-resource-card"
                      key={classItem.id || `${classItem.title}-${index}`}
                      href={classItem.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="resource-icon">▶</span>
                      <span className="resource-info">
                        <strong>{classItem.title || `Video Lecture ${index + 1}`}</strong>
                        <small>Watch Video Lecture on YouTube</small>
                      </span>
                      <span className="resource-arrow">↗</span>
                    </a>
                  ))}
                  {publishedVideos(selectedChapter).length === 0 && (
                    <div className="learning-empty">
                      <h3>No Published Videos</h3>
                      <p>Video lectures will appear here when published.</p>
                    </div>
                  )}
                </div>
              )}

              {(activeResourceTab === "classSlides" ||
                activeResourceTab === "practiceSlides") && (
                <div className="chapter-resource-list">
                  {publishedNotes(selectedChapter, activeResourceTab).map((note, index) => (
                    <article
                      className="chapter-resource-card"
                      key={note.id || `${note.title}-${index}`}
                    >
                      <span className="resource-icon pdf-icon">PDF</span>
                      <span className="resource-info">
                        <strong>{note.title || `PDF ${index + 1}`}</strong>
                        <small>
                          {activeResourceTab === "classSlides"
                            ? "Class Slides · PDF Study Material"
                            : "Practice Slides · PDF Practice Material"}
                        </small>
                      </span>
                      <span className="resource-link-actions">
                        <button
                          type="button"
                          className="resource-action-link pdf-view-button"
                          onClick={() => setActivePdf(note)}
                          title="View PDF on this website"
                        >
                          View PDF
                        </button>
                        <a
                          className="resource-action-link secondary"
                          href={note.telegramPostUrl || note.downloadUrl || note.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={note.telegramPostUrl ? "Open Telegram download post" : "Download PDF"}
                        >
                          {note.telegramPostUrl ? "Telegram Download ↗" : "Download ↗"}
                        </a>
                      </span>
                    </article>
                  ))}
                  {activePdf && (
                    <section className="inline-pdf-viewer" aria-label="PDF viewer">
                      <div className="inline-pdf-viewer-header">
                        <div>
                          <span>PDF READER</span>
                          <h3>{activePdf.title || "Study Material"}</h3>
                        </div>
                        <button type="button" onClick={() => setActivePdf(null)}>Close Viewer ✕</button>
                      </div>
                      {activePdf.pdfUrl ? (
                        <iframe
                          title={activePdf.title || "PDF Study Material"}
                          src={activePdf.pdfUrl}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          allow="autoplay"
                        />
                      ) : (
                        <p className="pdf-viewer-error">এই PDF-এর Viewer Link পাওয়া যায়নি। Download link ব্যবহার করো।</p>
                      )}
                    </section>
                  )}

                  {publishedNotes(selectedChapter, activeResourceTab).length === 0 && (
                    <div className="learning-empty">
                      <h3>
                        {activeResourceTab === "classSlides"
                          ? "No Published Class Slides"
                          : "No Published Practice Slides"}
                      </h3>
                      <p>
                        {activeResourceTab === "classSlides"
                          ? "Class slide PDFs will appear here when published."
                          : "Practice slide PDFs will appear here when published."}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "mentorship" && (
            <div>
              <div className="learning-section-heading">
                <h2>Mentorship</h2>
                <p>Get guidance to complete your course effectively.</p>
              </div>
              {publishedMentorship.length === 0 ? (
                <div className="learning-empty">
                  <h3>Mentorship Coming Soon</h3>
                  <p>Guidance classes will appear here.</p>
                </div>
              ) : (
                <div className="learning-chapter-list">
                  {publishedMentorship.map((item) => (
                    <article className="learning-chapter-card" key={item.id}>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <span className="learning-content-type">{item.contentType}</span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "exams" && (
            <div>
              <div className="learning-section-heading">
                <h2>Course Exams</h2>
                <p>Test your preparation and track your progress.</p>
              </div>
              {publishedExams.length === 0 ? (
                <div className="learning-empty">
                  <h3>Exams Coming Soon</h3>
                  <p>Published course exams will appear here.</p>
                </div>
              ) : (
                <div className="learning-chapter-list">
                  {publishedExams.map((exam) => (
                    <article className="learning-chapter-card" key={exam.id}>
                      <h3>{exam.title}</h3>
                      <p>{exam.description}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default CourseLearningPage;
