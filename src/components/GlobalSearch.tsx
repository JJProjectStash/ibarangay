import { useState, useEffect, useRef } from "react";
import {
  Search,
  FileText,
  Calendar,
  MessageSquare,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiExtensions";
import { useDebounce } from "../hooks/useDebounce";

interface SearchResult {
  id: string;
  type: "complaint" | "service" | "event" | "user" | "announcement";
  title: string;
  description: string;
  url: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch = ({ isOpen, onClose }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await api.globalSearch(searchQuery);
      // backend returns { success, query, totalResults, data: { complaints, services, events, announcements, users }}
      const payload = response.data?.data ?? {};
      // Flatten grouped results into a single list of SearchResult
      const flattened: SearchResult[] = [];

      const pushResults = (list: any[], type: SearchResult['type']) => {
        if (!Array.isArray(list)) return;
        list.forEach((item) => {
          flattened.push({
            id: item._id || item.id || item.idStr || String(Math.random()),
            type,
            title: item.title || item.name || item.fullName || item.email || "Untitled",
            description:
              item.description || item.content || item.email || item.category || "",
            url:
              type === 'complaint'
                ? `/complaints/${item._id}`
                : type === 'service'
                ? `/services/${item._id}`
                : type === 'event'
                ? `/events/${item._id}`
                : type === 'announcement'
                ? `/announcements/${item._id}`
                : `/admin/users/${item._id}`,
          });
        });
      };

      pushResults(payload.complaints || [], 'complaint');
      pushResults(payload.services || [], 'service');
      pushResults(payload.events || [], 'event');
      pushResults(payload.announcements || [], 'announcement');
      pushResults(payload.users || [], 'user');

      setResults(flattened);
      setSelectedIndex(0);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelectResult(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    navigate(result.url);
    onClose();
    setQuery("");
    setResults([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return <MessageSquare size={18} className="text-danger" />;
      case "service":
        return <FileText size={18} className="text-primary" />;
      case "event":
        return <Calendar size={18} className="text-success" />;
      case "user":
        return <Users size={18} className="text-info" />;
      case "announcement":
        return <FileText size={18} className="text-warning" />;
      default:
        return <Search size={18} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <Search size={20} />
              </span>
              <input
                ref={inputRef}
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search complaints, services, events, users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="btn btn-link text-muted" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div
            className="modal-body pt-2"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div className="list-group list-group-flush">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    className={`list-group-item list-group-item-action ${
                      index === selectedIndex ? "active" : ""
                    }`}
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="d-flex align-items-start">
                      <div className="me-3 mt-1">{getIcon(result.type)}</div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <h6 className="mb-1">{result.title}</h6>
                          <span className="badge badge-secondary">
                            {result.type}
                          </span>
                        </div>
                        <p className="mb-0 small text-muted">
                          {result.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="text-center py-4 text-muted">
                <p>No results found for "{query}"</p>
              </div>
            ) : (
              <div className="text-center py-4 text-muted">
                <p>Type at least 2 characters to search</p>
              </div>
            )}
          </div>
          <div className="modal-footer border-0 pt-0">
            <small className="text-muted">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
