ULTRAWORK MODE — OVERNIGHT CODEBASE AUDIT & HARDENING
You are a senior staff engineer. Your job tonight is to systematically go through this entire codebase and harden it across every dimension listed below. Work phase by phase, in order. Do not skip phases. Do not rush. Do not move to the next phase until the current one is complete, clean, and verified.

BEFORE ANYTHING — Map the Codebase
Read and understand everything first:

Full file and folder structure
Every feature, route, component, hook, utility, service
Existing patterns, conventions, naming, state management, styling approach
What is tested, what isn't, what is typed, what isn't
Existing error handling patterns

Build a complete mental model before touching a single file. Use context7 MCP for all documentation needs — no web searches.

STRICT CONSTRAINTS — NON-NEGOTIABLE

Do not change UI, design, colors, spacing, layout, or component structure
Do not change business logic or feature behavior
Do not introduce new dependencies unless strictly necessary — justify every one
If anything is ambiguous or risky, flag it with a comment and move on — do not guess
Match existing code conventions exactly at all times


PHASE 1 — TypeScript Strictness

Enable strict mode if not already active
Eliminate every any — replace with proper types or generics
Add missing return types to all functions and hooks
Fix all implicit types and unsafe type assertions
Add missing interface and type definitions
Zero TypeScript errors when done

PHASE 2 — Dead Code Elimination

Remove all unused variables, functions, components, hooks, and utilities
Remove all unused imports across every file
Remove all unreachable code paths
Remove all commented-out code blocks that serve no documentation purpose
Flag anything that looks unused but you're unsure about — don't delete, add a // REVIEW: comment

PHASE 3 — Error Handling

Audit every async function, fetch call, and promise
Add try/catch everywhere it is missing
Handle all unhandled promise rejections
Add error boundaries where components can fail in isolation
Ensure every error state is caught, logged, and handled gracefully — no silent failures
Ensure loading and error states exist wherever async data is consumed

PHASE 4 — Test Coverage (Vitest)

Map every untested utility, component, hook, and critical flow
Write unit tests for all pure logic and utilities — 100% branch coverage
Write component tests for all components — behavior-focused, not implementation
Write hook tests with renderHook — cover state transitions, async, cleanup
Write integration tests for all critical user flows
Cover edge cases: null, undefined, empty, boundary values, network errors
All test names must read as full sentences describing the expected behavior
All mocks must be minimal and cleaned up after each test
Zero skipped tests without a // TODO: justification

PHASE 5 — General Polish & Hardening

Fix any remaining LSP diagnostics, warnings, and lint errors
Ensure consistent error logging patterns throughout
Add missing loading states and skeleton handling where async data is used
Verify all environment variables are properly typed and validated at startup


COMPLETION CRITERIA
Done means all of this is true simultaneously:

tsc reports zero errors
Full test suite passes with zero failures and zero unjustified skips
LSP diagnostics show zero errors across all modified files
No any, no unused imports, no unhandled promises remain
Every critical path has test coverage

Work through it. Take your time. Do it GOD LEVEL !!!!!