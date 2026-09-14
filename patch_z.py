import re

with open("src/components/Dashboard.tsx", "r") as f:
    content = f.read()

search = """        {/* Single-Bar Live Performance Stats Bar */}
        {showPerformanceBar && (
          <div 
            data-tour="performance-bar"
            onMouseEnter={() => setIsPerfBarHovered(true)}
            onMouseLeave={() => setIsPerfBarHovered(false)}
            className={`transition-all duration-300 ease-in-out ${
              isStageExpanded
                ? `fixed bottom-0 left-0 right-0 z-[1000] ${
                    !isPerfBarHovered
                      ? 'translate-y-full opacity-0 pointer-events-none'
                      : 'translate-y-0 opacity-100 pointer-events-auto'
                  }`
                : 'translate-y-0 opacity-100 pointer-events-auto'
            }`}
          >"""

replace = """        {/* Single-Bar Live Performance Stats Bar */}
        {showPerformanceBar && (
          <div 
            data-tour="performance-bar"
            onMouseEnter={() => setIsPerfBarHovered(true)}
            onMouseLeave={() => setIsPerfBarHovered(false)}
            className={`transition-all duration-300 ease-in-out relative z-[999999] ${
              isStageExpanded
                ? `fixed bottom-0 left-0 right-0 ${
                    !isPerfBarHovered
                      ? 'translate-y-full opacity-0 pointer-events-none'
                      : 'translate-y-0 opacity-100 pointer-events-auto'
                  }`
                : 'translate-y-0 opacity-100 pointer-events-auto'
            }`}
          >"""

content = content.replace(search, replace)
with open("src/components/Dashboard.tsx", "w") as f:
    f.write(content)

