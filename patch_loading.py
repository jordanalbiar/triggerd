import re

with open("src/components/LoadingSequence.tsx", "r") as f:
    content = f.read()

search = """interface LoadingSequenceProps {
  onComplete: () => void;
}"""

replace = """interface LoadingSequenceProps {
  onComplete: () => void;
  isWaitingForPermissions?: boolean;
}"""

content = content.replace(search, replace)

search_2 = """export const LoadingSequence: React.FC<LoadingSequenceProps> = ({ onComplete }) => {"""
replace_2 = """export const LoadingSequence: React.FC<LoadingSequenceProps> = ({ onComplete, isWaitingForPermissions = false }) => {
  const isWaitingRef = React.useRef(isWaitingForPermissions);
  React.useEffect(() => {
    isWaitingRef.current = isWaitingForPermissions;
  }, [isWaitingForPermissions]);"""

content = content.replace(search_2, replace_2)

search_3 = """      // Step 2: Overlay Engine Initialization (600ms)
      await new Promise((res) => setTimeout(res, 600));
      if (!isMounted) return;
      setProgress(70);
      setStatusText('Mounting Overlay Engines & Bridge Connectors...');
      setCompletedSteps(prev => [...prev, 'Stage Overlay Engine']);"""

replace_3 = """      // Step 2: Overlay Engine Initialization (600ms)
      await new Promise((res) => setTimeout(res, 600));
      if (!isMounted) return;
      
      while (isWaitingRef.current) {
        setProgress(75);
        setStatusText('Waiting for Hardware & Broadcast Authorization...');
        await new Promise((res) => setTimeout(res, 200));
        if (!isMounted) return;
      }
      
      setProgress(80);
      setStatusText('Mounting Overlay Engines & Bridge Connectors...');
      setCompletedSteps(prev => [...prev, 'Stage Overlay Engine']);"""

content = content.replace(search_3, replace_3)

with open("src/components/LoadingSequence.tsx", "w") as f:
    f.write(content)
