import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import Card from "../components/common/Card";
import Button from "../components/common/Button";

/**
 * RecapMode Page
 *
 * 일기/저널 기능 - 마크다운 에디터를 통한 회고 작성
 */
const RecapMode = () => {
  const [entries, setEntries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDark, setIsDark] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // localStorage에서 데이터 로드
  useEffect(() => {
    const saved = localStorage.getItem("recapEntries");
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
      // 가장 최근 항목 선택
      if (parsed.length > 0) {
        const latest = parsed[0];
        setSelectedId(latest.id);
        setTitle(latest.title);
        setContent(latest.content);
      }
    }
  }, []);

  // 저장
  const saveEntries = (newEntries) => {
    localStorage.setItem("recapEntries", JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  // 새 일기 생성
  const handleNewEntry = () => {
    const newEntry = {
      id: crypto.randomUUID(),
      title: "새로운 기록",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newEntries = [newEntry, ...entries];
    saveEntries(newEntries);
    setSelectedId(newEntry.id);
    setTitle(newEntry.title);
    setContent(newEntry.content);
  };

  // 일기 선택
  const handleSelectEntry = (entry) => {
    // 현재 내용 저장
    if (selectedId) {
      const updatedEntries = entries.map((e) =>
        e.id === selectedId
          ? { ...e, title, content, updatedAt: new Date().toISOString() }
          : e
      );
      saveEntries(updatedEntries);
    }
    setSelectedId(entry.id);
    setTitle(entry.title);
    setContent(entry.content);
  };

  // 현재 내용 저장
  const handleSave = () => {
    if (!selectedId) return;
    const updatedEntries = entries.map((e) =>
      e.id === selectedId
        ? { ...e, title, content, updatedAt: new Date().toISOString() }
        : e
    );
    saveEntries(updatedEntries);
  };

  // 일기 삭제
  const handleDelete = () => {
    if (!selectedId) return;
    const filtered = entries.filter((e) => e.id !== selectedId);
    saveEntries(filtered);
    if (filtered.length > 0) {
      setSelectedId(filtered[0].id);
      setTitle(filtered[0].title);
      setContent(filtered[0].content);
    } else {
      setSelectedId(null);
      setTitle("");
      setContent("");
    }
  };

  // 날짜 포맷
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
      weekday: "short",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-text-main">
            Recap Mode
          </h1>
          <p className="text-text-muted">
            오늘의 생각과 감정을 기록하세요
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={handleNewEntry}>
          + 새 기록
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex gap-6 h-[calc(100%-5rem)]">
        {/* Left: Entry List */}
        <Card variant="outlined" padding="none" className="w-72 flex-shrink-0 flex flex-col">
          <div className="p-4 border-b border-border-base">
            <h3 className="font-semibold text-text-main">기록 목록</h3>
            <p className="text-xs text-text-muted">{entries.length}개의 기록</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {entries.length === 0 ? (
              <div className="p-4 text-center text-text-muted text-sm">
                아직 기록이 없습니다.<br />
                새 기록을 시작해보세요.
              </div>
            ) : (
              entries.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleSelectEntry(entry)}
                  className={`w-full text-left p-4 border-b border-border-base transition-colors ${
                    selectedId === entry.id
                      ? "bg-primary/10 border-l-2 border-l-primary"
                      : "hover:bg-bg-highlight"
                  }`}
                >
                  <div className="font-medium text-text-main truncate">
                    {entry.title || "제목 없음"}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {formatDate(entry.updatedAt)}
                  </div>
                  <div className="text-xs text-text-muted mt-1 truncate">
                    {entry.content.slice(0, 50) || "내용 없음"}
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Right: Editor */}
        <Card variant="outlined" padding="none" className="flex-1 flex flex-col min-w-0">
          {selectedId ? (
            <>
              {/* Title Input */}
              <div className="p-4 border-b border-border-base">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="w-full text-xl font-semibold bg-transparent text-text-main placeholder-text-muted focus:outline-none"
                />
              </div>

              {/* Markdown Editor */}
              <div className="flex-1 overflow-hidden" data-color-mode={isDark ? "dark" : "light"}>
                <MDEditor
                  value={content}
                  onChange={(val) => setContent(val || "")}
                  height="100%"
                  preview="edit"
                  hideToolbar={false}
                  visibleDragbar={false}
                  style={{
                    height: "100%",
                    backgroundColor: "transparent",
                  }}
                />
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-border-base flex justify-between items-center">
                <Button variant="ghost" size="sm" onClick={handleDelete} className="text-red-500 hover:text-red-600">
                  삭제
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  저장
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <div className="text-4xl mb-4">✍️</div>
                <p>기록을 선택하거나 새 기록을 시작하세요</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RecapMode;
