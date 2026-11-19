# 11-11-GM-GF-001 — Global Goal Fidelity & Stage-Gated Programme Control

**Version:** 1.0.0  
**Authority:** Owner-directed global operating policy; proposed source on central Draft PR #16 until independently approved and merged.  
**Applies to:** Every active and future 11-11 Tech programme, in combination with the project's approved master plan and stricter source/release/security rules.  
**Companion:** [11-11-GM-GC-001 Global Moderator Governance & Continuity](STANDARD-v1.0.md).

## 1. Invariant

**The approved programme determines how feedback is handled; feedback does not automatically become a new roadmap.** Keep the original business goal, the controlling implementation stages, their approved chronological order, acceptance criteria, and Owner release gates. Avoid reactive workstreams that fracture accepted source or delay the client outcome.

## 2. Mandatory task-entry check

Before review, coding, agent delegation, acceptance or scope advice, the moderator and specialist must establish from source: (1) programme ID and original Owner goal; (2) current approved stage/gate and explicit exit requirements; (3) last accepted evidence/SHA and remaining work; (4) active roles/tasks/PRs and non-overlapping ownership; (5) actual permission to perform the next action. If missing, state UNKNOWN rather than inventing it.

## 3. Required feedback classification

| Class | Decision rule | Permitted action |
|---|---|---|
| CURRENT_GATE_BLOCKER | Breaks an approved exit criterion of the currently active gate | Correct in the existing work package; independently test before acceptance |
| CURRENT_GATE_NONBLOCKER | Useful within stage but not required for exit | Register; do not delay acceptance without Owner direction |
| FUTURE_GATE_REQUIREMENT | Spec already schedules it in a later gate | Register source, owner, trigger and test; do not implement prematurely |
| CROSS_GATE_DEPENDENCY | Earlier-gate authority needed for a later gate | Assign prerequisite to its original gate; keep later work blocked/conditional |
| SCOPE_CHANGE_PROPOSAL | Adds a new product/architecture or changes chronology/criteria | Quantify impact; require explicit Owner approval and revision record |
| SECURITY_OR_DATA_INCIDENT | Immediate risk to users, private data or systems | Bounded containment with proper authority; then resume approved gate |
| EVIDENCE_GAP | Current tests, source or permissions not verified | Inspect or mark NOT_VERIFIED; do not count as PASS |

Client screenshots and specialist suggestions must be logged to the appropriate gate, not assumed to authorize implementation. Urgency may prioritize safe bounded verification; it does not authorize merging, spending, deployments or bypassing accepted gates.

## 4. Gate integrity

- Formal gates remain project-specific. Never impose HealthTimes G1–G6 on CarUp, TengaSell, Rese Rese or another programme.
- Parallel development is acceptable only where approved dependencies, source boundaries and authority are preserved. Work prepared in parallel does **not** certify a preceding gate.
- A client demo, local test, CI green, staging result, independent review, and production release are different milestones. Report them separately.
- Close a stage only against its original acceptance criteria with inspectable evidence, independent review as required and a recorded Owner decision where relevant.
- Once accepted, do not restart discovery or redesign without new contradictory evidence. Correct only the affected surface.

## 5. Every agent prompt and return

Use a task ID, programme goal, controlling gate, original acceptance test(s), exact authorized source and branch, accepted parent, existing specialist and independent reviewer, allowed files/environments, forbidden changes, proof matrix, rollback and exact return. Reviewer returns ACCEPT / REMEDIATE / BLOCK; task acceptance never means automatic merge or release.

## 6. Standard output contract

PROGRAMME | ORIGINAL GOAL | CURRENT STAGE | LAST ACCEPTED EVIDENCE/SHA | NEW FEEDBACK CLASSIFICATION | UNMET CRITERIA | EXISTING AGENT/NEXT TASK | OWNER AUTHORITY | LATEST HANDOFF.

## 7. Version and adoption

Use [the unified front door](AGENT-GOVERNANCE-UNIFIED-v1.0.md), [global moderator standard](STANDARD-v1.0.md), and the project's root AGENTS.md and local programme plan. Each repo must link to the central versioned standard and have a visibly downloadable source document. Project adoption needs reviewable changes and its own existing reviewer/Owner gate; a central Draft PR or personal plugin alone is not global Git adoption.