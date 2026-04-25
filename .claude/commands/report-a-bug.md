---
description: Document a bug or unexpected behavior
argument-hint: [describe the bug]
---

# Report a Bug

## Instructions

The user has encountered a bug or unexpected behavior. Your job is to investigate, understand, and document it.

### 1. Understand the Bug

Based on the user's description: `$ARGUMENTS`

- Ask clarifying questions if the description is too vague
- Reproduce or verify the issue by reading relevant code, logs, or running commands
- Identify the root cause (or note if it's still unknown)

### 2. Write the Bug Report

Create a bug report file at `.agents/bugs/DD-MM-short-name.md` where:
- `DD-MM` is today's date (day-month)
- `short-name` is a 2-4 word kebab-case slug describing the bug

Use this format:

```markdown
---
type: bug
created: DD-MM-YYYY
updated: DD-MM-YYYY
tags: [bug, <relevant-area>, <phase-if-applicable>]
status: open
---

# Bug: <Short descriptive title>

## Summary

One paragraph: what's broken, what should happen instead.

## How Discovered

How the bug was found (user report, testing, heartbeat, etc.)

## Steps to Reproduce

1. Step one
2. Step two
3. Expected vs actual result

## Root Cause

What's causing the issue. Reference specific files and line numbers.
If unknown, write "Under investigation" and note what's been ruled out.

## Impact

Who/what is affected. Severity: critical / high / medium / low.

## Fix

If a fix is known or obvious, describe it here. Don't implement it unless asked.
```

### 3. Confirm

- Show the user the file path and a brief summary
- Ask if they want you to fix it now or just track it
