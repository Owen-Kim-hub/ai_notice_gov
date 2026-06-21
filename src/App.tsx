import { useEffect, useState } from "react";
import { DEFAULT_RANGE_DAYS } from "./constants";
import { formatDateKST, getDateDaysBefore } from "./utils/date";
import { downloadAnnouncementsCsv } from "./utils/csv";
import { useAnnouncementExtraction } from "./hooks/useAnnouncementExtraction";
import { AppHeader } from "./components/AppHeader";
import { IntroBanner } from "./components/IntroBanner";
import { ExtractionControls } from "./components/ExtractionControls";
import { PortalList } from "./components/PortalList";
import { SummaryCards } from "./components/SummaryCards";
import { WarningBanner } from "./components/WarningBanner";
import { ResultsSection, ResultsTab } from "./components/ResultsSection";
import { AppFooter } from "./components/AppFooter";

export default function App() {
  // Initialize date range: default from 30 days before the end date, based on KST (Korea Standard Time)
  const now = new Date();
  const defaultEndDate = formatDateKST(now);

  const [startDate, setStartDate] = useState(formatDateKST(getDateDaysBefore(now, DEFAULT_RANGE_DAYS)));
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [keywordInputs, setKeywordInputs] = useState(["중소기업", "", ""]);

  const [activeTab, setActiveTab] = useState<ResultsTab>("results");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentResultPage, setCurrentResultPage] = useState(1);

  const { loading, data, error, extract } = useAnnouncementExtraction();

  const runExtraction = () => {
    extract({
      startDate,
      endDate,
      keywords: keywordInputs.map((value) => value.trim()).filter(Boolean),
    });
  };

  // Trigger initial extraction on mount
  useEffect(() => {
    runExtraction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentResultPage(1);
  }, [data, searchTerm]);

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    const end = new Date(`${value}T00:00:00`);
    if (!Number.isNaN(end.getTime())) {
      setStartDate(formatDateKST(getDateDaysBefore(end, DEFAULT_RANGE_DAYS)));
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    setKeywordInputs((current) =>
      current.map((existing, valueIndex) => (valueIndex === index ? value : existing))
    );
  };

  const handleDownload = () => {
    if (!data) return;
    downloadAnnouncementsCsv(data.results, startDate, endDate);
  };

  // Filtered list based on search term inside results
  const search = searchTerm.toLowerCase();
  const filteredResults = data?.results.filter((item) =>
    item.title?.toLowerCase().includes(search) ||
    item.description?.toLowerCase().includes(search) ||
    item.portal?.toLowerCase().includes(search) ||
    item.department?.toLowerCase().includes(search)
  ) || [];

  return (
    <div id="app-root" className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      <AppHeader />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <IntroBanner />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <ExtractionControls
              startDate={startDate}
              endDate={endDate}
              keywordInputs={keywordInputs}
              loading={loading}
              onStartDateChange={setStartDate}
              onEndDateChange={handleEndDateChange}
              onKeywordChange={handleKeywordChange}
              onExtract={runExtraction}
            />
            <PortalList />
          </div>

          {/* RIGHT: Display and Results Area */}
          <div className="lg:col-span-8 space-y-6">
            <SummaryCards loading={loading} data={data} />

            {data?.warning && <WarningBanner message={data.warning} />}

            <ResultsSection
              activeTab={activeTab}
              loading={loading}
              error={error}
              data={data}
              filteredResults={filteredResults}
              searchTerm={searchTerm}
              currentPage={currentResultPage}
              onTabChange={setActiveTab}
              onSearchChange={setSearchTerm}
              onPageChange={setCurrentResultPage}
              onDownload={handleDownload}
            />
          </div>

        </div>

      </main>

      <AppFooter />
    </div>
  );
}
