import re

with open('src/components/CommandManager.tsx', 'r') as f:
    content = f.read()

# Add createPortal import
if 'createPortal' not in content:
    content = content.replace("import React, { useState, useRef, useEffect } from 'react';", "import React, { useState, useRef, useEffect } from 'react';\nimport { createPortal } from 'react-dom';")

# Add showPrefixAccordion state
if 'showPrefixAccordion' not in content:
    content = content.replace("const [customPrefix, setCustomPrefix] = useState<string>('');", "const [customPrefix, setCustomPrefix] = useState<string>('');\n  const [showPrefixAccordion, setShowPrefixAccordion] = useState<boolean>(false);")

# Safely extract and replace the Header Controls Bar
header_start = '      {/* Header Controls Bar */}'
header_end = '      {/* Edit Trigger Code & Settings Modal Window (90% Size) */}'

h_start_idx = content.find(header_start)
h_end_idx = content.find(header_end)

if h_start_idx != -1 and h_end_idx != -1:
    header_block = content[h_start_idx:h_end_idx]
    
    # We want to change it to use createPortal
    new_header_block = header_block
    new_header_block = new_header_block.replace('className="flex flex-col gap-4 mb-6 pb-4 border-b border-brand-border/20 font-mono"', 'className="flex items-center justify-between w-full p-2 bg-[#020b18] border-b border-[#003865] font-mono shadow-inner"')
    new_header_block = new_header_block.replace('<div className="flex flex-col gap-4 p-3 bg-[#020b18] border border-[#003865] rounded-2xl shadow-inner">', '<div className="flex w-full items-center justify-between gap-4 px-2">')
    new_header_block = new_header_block.replace('<div className="flex flex-wrap items-center justify-center gap-2">', '<div className="flex items-center gap-2">')
    new_header_block = new_header_block.replace('<div className="flex flex-wrap items-center justify-center gap-4 border-t border-[#003865] pt-4 mt-2">', '<div className="flex items-center gap-2">')
    
    # make buttons smaller
    new_header_block = new_header_block.replace('px-6 py-3 rounded-xl', 'px-3 py-1.5 rounded-lg')
    new_header_block = new_header_block.replace('text-sm', 'text-xs')

    # Wrap in createPortal
    wrapped_header = f"""      {{/* Portaled Navigation Bar */}}
      {{document.getElementById('cmd-nav-bar-portal') ? createPortal(
        <>
{new_header_block}
        </>,
        document.getElementById('cmd-nav-bar-portal')!
      ) : (
{header_block}
      )}}
"""
    content = content[:h_start_idx] + wrapped_header + content[h_end_idx:]

# Safely extract and replace the Prefix Accordion
prefix_start = '      {/* Command Trigger Prefix & Suffix Presets Control Panel */}'
prefix_end = '      {/* Category Filter Tabs Bar */}'

p_start_idx = content.find(prefix_start)
p_end_idx = content.find(prefix_end)

if p_start_idx != -1 and p_end_idx != -1:
    prefix_block = content[p_start_idx:p_end_idx]
    
    new_prefix_block = prefix_block.replace('className="mb-5 p-4 bg-[#020b18] border border-[#003865] rounded-2xl font-mono text-xs space-y-3.5 shadow-xl"', 'className="p-4 bg-[#04182e] border-b border-[#00f0ff]/30 font-mono text-xs space-y-3.5 shadow-xl"')
    
    wrapped_prefix = f"""      {{/* Portaled Prefix Indicator */}}
      {{document.getElementById('cmd-prefix-indicator-portal') ? createPortal(
        <button onClick={{() => setShowPrefixAccordion(!showPrefixAccordion)}} className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#0a2540] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20 transition cursor-pointer text-xs font-mono font-bold" title="Toggle Prefix Options">
          Prefix: {{customPrefix || 'None'}} {{showPrefixAccordion ? '▲' : '▼'}}
        </button>,
        document.getElementById('cmd-prefix-indicator-portal')!
      ) : null}}

      {{/* Portaled Prefix Accordion */}}
      {{document.getElementById('cmd-prefix-accordion-portal') && showPrefixAccordion ? createPortal(
        <>
{new_prefix_block}
        </>,
        document.getElementById('cmd-prefix-accordion-portal')!
      ) : (
        !document.getElementById('cmd-prefix-accordion-portal') ? (
{prefix_block}
        ) : null
      )}}
"""
    content = content[:p_start_idx] + wrapped_prefix + content[p_end_idx:]

with open('src/components/CommandManager.tsx', 'w') as f:
    f.write(content)
