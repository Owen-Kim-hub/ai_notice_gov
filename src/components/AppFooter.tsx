export function AppFooter() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20 py-8 text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2 text-xs font-noto">
        <p>© 2026 AI 공고 추출기. All Rights Reserved. (국가 R&D 연계 포털 데이터 전처리 모듈)</p>
        <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed select-none font-mono text-[10px]">
          본 전처리 솔루션은 비공개 내부 R&D 평가 연동 및 보정 업무를 촉진하기 위해 제작되었습니다.
          Gemini모델에 의한 Grounded 검색 데이터가 로컬 검증 세트와 융합 정제됩니다.
        </p>
      </div>
    </footer>
  );
}
