import re

with open('src/components/Dashboard.tsx', 'r') as f:
    text = f.read()

# Fix ArrowLeft, ArrowRight import
text = re.sub(r'import \{(.*?)\} from \'lucide-react\';', r'import {\1, ArrowLeft, ArrowRight} from \'lucide-react\';', text, count=1, flags=re.DOTALL)

# Fix duplicatedId error
text = re.sub(r'(const handleDuplicateStaticSource = useCallback\(\(id: string\) => \{)\n(\s*handleSetStaticSourcesWithHistory)', r'\1\n    let duplicatedId: string | null = null;\n\2', text, count=1)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(text)

