---
name: goal-fidelity-stage-control
description: Use whenever a programme, agent task, user feedback, change request, product review or release decision risks shifting an approved goal or stage. Keep original acceptance criteria and chronology, classify feedback to the right gate, and preserve existing accepted source.
---

# 11-11 Tech — Goal Fidelity and Stage-Gated Programme Control 1.0.0

**Normative source:** [11-11-GM-GF-001](../../governance/global-moderator/GOAL-FIDELITY-STAGE-CONTROL-v1.0.md). **Companion:** [Global Moderator Governance and Continuity, 11-11-GM-GC-001](../../governance/global-moderator/STANDARD-v1.0.md). **Unified entry:** [AGENT-GOVERNANCE-UNIFIED-v1.0](../../governance/global-moderator/AGENT-GOVERNANCE-UNIFIED-v1.0.md).

## Invariant

The approved programme controls how feedback is handled. A screenshot, suggestion, failed test, urgent deadline or specialist report does not automatically change the Owner's original product goal, sequence, acceptance criteria, architecture or release authority.

## Before acting

1. Read the project's root AGENTS.md, original accepted programme/master plan, binding decisions, current stage and exit criteria, task/agent ledger and current handoff.
2. Verify the actual last accepted source, relevant current PR/CI and source custody; mark unknowns rather than inventing them.
3. Record the requested finding and classify as CURRENT_GATE_BLOCKER, CURRENT_GATE_NONBLOCKER, FUTURE_GATE_REQUIREMENT, CROSS_GATE_DEPENDENCY, SCOPE_CHANGE_PROPOSAL, SECURITY_OR_DATA_INCIDENT or EVIDENCE_GAP.
4. Current blockers: repair within existing specialist work and test exactly the failed criterion. Future features: register and defer to the future gate with an owner and trigger. Scope changes: request explicit Owner authorization and rebaseline approval. Safety incidents: contain narrowly, then return to the original plan.
5. Never reopen accepted functionality or start another competing programme without concrete contradictory evidence.

## Task contract

Every substantive assignment: programme + original outcome, stage/exit criteria, exact source/accepted parent/branch, existing specialist and independent reviewer, permitted modifications, test matrix, rollback, forbidden actions, expected return. A moderator issues exactly ACCEPT/REMEDIATE/BLOCK after independent review and updates project records.

## Reporting

State original goal, current gate, accepted evidence, unmet criteria, new findings classified now/later, next authorized action and release approvals. Progress must be accepted N/M from an approved baseline, or NOT_BASELINED. Distinguish client prototype, production-equivalent test, live product, and full launch.

## Continuity

On every material decision or specialist return, checkpoint task, agent, acceptance and handoff records. On successor takeover, reverify live source and inherit the obligation to create the next preventive handoff. Protect private evidence and Owner permissions.

**Approval:** This is an Owner-directed global process instruction, but its central PR #16 remains Draft until independent review and merge. Individual project adoption is separate and never bypasses local technical/security controls.
