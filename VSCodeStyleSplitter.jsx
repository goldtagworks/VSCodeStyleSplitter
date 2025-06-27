import React, { useState, useRef, useCallback, useEffect, ReactNode } from 'react';

interface SplitterProps {
  onResize?: (width: number) => void;
  isResizing: boolean;
}

interface SplitterLayoutProps {
  children: [ReactNode, ReactNode];
  initialRightWidth?: number;
}

const Splitter: React.FC<SplitterProps> = ({ onResize, isResizing }) => {
  return (
    <div
      className={`splitter ${isResizing ? 'splitter-resizing' : ''}`}
      style={{ minWidth: '4px' }}
    />
  );
};

const SplitterLayout: React.FC<SplitterLayoutProps> = ({ 
  children, 
  initialRightWidth = 304 
}) => {
  const [rightWidth, setRightWidth] = useState<number>(initialRightWidth);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const MIN_RIGHT_WIDTH = 200;
  const MAX_RIGHT_WIDTH = 600;

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = rightWidth;
    
    // 드래그 중 텍스트 선택 방지
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [rightWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = startXRef.current - e.clientX;
    const newWidth = Math.max(
      MIN_RIGHT_WIDTH,
      Math.min(MAX_RIGHT_WIDTH, startWidthRef.current + deltaX)
    );
    
    setRightWidth(newWidth);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="splitter-layout">
      {/* 메인 영역 */}
      <div 
        className="main-area"
        style={{ width: `calc(100% - ${rightWidth + (isResizing ? 3 : 1)}px)` }}
      >
        {children[0]}
      </div>
      
      {/* 스플리터 */}
      <div
        className={`splitter ${isResizing ? 'splitter-resizing' : ''}`}
        onMouseDown={handleMouseDown}
      />
      
      {/* 오른쪽 패널 */}
      <div 
        className="right-panel"
        style={{ width: `${rightWidth}px` }}
      >
        {children[1]}
      </div>
    </div>
  );
};

// 사용 예제
const App: React.FC = () => {
  return (
    <div className="app-container">
      <SplitterLayout initialRightWidth={304}>
        {/* 메인 영역 */}
        <div className="main-content">
          {/* 고정 메뉴 */}
          <div className="fixed-menu">
            <h1>파일 편집 보기 이동 실행 터미널 도움말</h1>
          </div>
          
          {/* 메인 콘텐츠 */}
          <div className="content-area">
            <div className="content-section">
              <h2>메인 편집기 영역</h2>
              <div className="code-editor">
                <div className="code-line import">import React from 'react';</div>
                <div className="code-line comment">// 여기서 코드를 작성하세요</div>
                <div className="code-line keyword">const App = () => {'{'}</div>
                <div className="code-line indent">return (</div>
                <div className="code-line indent-2">&lt;div&gt;Hello World&lt;/div&gt;</div>
                <div className="code-line indent">);</div>
                <div className="code-line keyword">{'}'};</div>
                <br />
                <div className="code-line import">export default App;</div>
              </div>
            </div>
            
            <div className="feature-list">
              <p>• 왼쪽 영역은 자동으로 크기가 조정됩니다</p>
              <p>• 스플리터를 드래그하여 오른쪽 패널 크기를 조정할 수 있습니다</p>
              <p>• 최소 크기: 200px, 최대 크기: 600px</p>
              <p>• 픽셀 기반으로 정확한 크기 제어가 가능합니다</p>
            </div>
          </div>
        </div>
        
        {/* 재생목록 영역 */}
        <div className="playlist-area">
          <div className="playlist-header">
            <h3>재생목록</h3>
          </div>
          
          <div className="playlist-content">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="playlist-item">
                <div className="song-title">음악 제목 {item}</div>
                <div className="artist-name">아티스트 이름 {item}</div>
                <div className="duration">3:45</div>
              </div>
            ))}
          </div>
        </div>
      </SplitterLayout>
    </div>
  );
};

export default App;

// CSS 스타일
const styles = `
.app-container {
  width: 100%;
  height: 100vh;
}

.splitter-layout {
  display: flex;
  height: 100%;
  width: 100%;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f9fafb;
}

.splitter {
  width: 1px;
  min-width: 1px;
  background-color: #e5e7eb;
  cursor: col-resize;
  flex-shrink: 0;
  transition: all 0.2s ease;
  position: relative;
}

.splitter::before {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  right: -1px;
  bottom: 0;
  width: 3px;
  background-color: transparent;
  transition: all 0.2s ease;
}

.splitter:hover {
  width: 3px;
  min-width: 3px;
  background-color: #3b82f6;
}

.splitter:hover::before {
  background-color: rgba(59, 130, 246, 0.1);
}

.splitter-resizing {
  width: 3px;
  min-width: 3px;
  background-color: rgba(59, 130, 246, 0.4);
  opacity: 0.5;
}

.splitter-resizing::before {
  background-color: rgba(59, 130, 246, 0.1);
}

.right-panel {
  flex-shrink: 0;
  background-color: white;
  border-left: 1px solid #e5e7eb;
}

.main-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.fixed-menu {
  height: 48px;
  background-color: #1f2937;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}

.fixed-menu h1 {
  font-size: 14px;
  font-weight: 500;
}

.content-area {
  flex: 1;
  padding: 16px;
  overflow: auto;
}

.content-section {
  margin-bottom: 16px;
}

.content-section h2 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.code-editor {
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
}

.code-line {
  margin: 2px 0;
}

.code-line.import {
  color: #2563eb;
}

.code-line.comment {
  color: #16a34a;
}

.code-line.keyword {
  color: #9333ea;
}

.code-line.indent {
  margin-left: 16px;
  color: #374151;
}

.code-line.indent-2 {
  margin-left: 32px;
  color: #dc2626;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-list p {
  color: #6b7280;
}

.playlist-area {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playlist-header {
  height: 48px;
  background-color: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 16px;
  flex-shrink: 0;
}

.playlist-header h3 {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.playlist-content {
  flex: 1;
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.playlist-item {
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.playlist-item:hover {
  background-color: #f3f4f6;
}

.song-title {
  font-size: 14px;
  font-weight: 500;
}

.artist-name {
  font-size: 12px;
  color: #6b7280;
}

.duration {
  font-size: 12px;
  color: #9ca3af;
}
`;

// 스타일을 head에 추가하는 함수
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
