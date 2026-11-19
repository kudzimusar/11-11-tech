# 11-11 Tech — Global Agent Governance Contract 1.0

**Universal start-here document — version 1.0.0.**

**Owner instruction:** Two globally applicable *process* requirements govern every 11-11 Tech programme and every agent. They do not replace product-specific stages, technology choices, architecture or approvals.

## The two mandatory rules

**Rule A — Goal Fidelity and Stage Control** ([normative source](GOAL-FIDELITY-STAGE-CONTROL-v1.0.md)): keep the original Owner-approved goal, current formal gate and exact exit criteria; classify new feedback as now/later/dependency/change/incident; do not create competing programmes from one finding.

**Rule B — Active Moderator Governance and Continuity** ([normative source](STANDARD-v1.0.md), ID 11-11-GM-GC-001): own assignments and independent reviews, verify exact source and evidence, issue one ACCEPT/REMEDIATE/BLOCK, report accepted N/M or NOT_BASELINED, update agent/task/progress/decision ledgers, and create a successor-ready *preventive* handoff before context failure. Successor must independently verify live state and make the next handoff.

## One agent-read contract

**Mandatory first read:** local root `AGENTS.md` → local approved master plan + gate registers → this document → both normative global standards → latest local handoff/agent ledger → fresh Git/CI evidence. If local rules are stricter or Owner instructions supersede, preserve local sovereignty and escalate contradictions.

**Mandatory after every material change:** verify actual source/authority; classify feedback by the original gate; inspect specialist work and exact tests; formally ACCEPT / REMEDIATE / BLOCK; update accepted chain, agent roster, blocker/progress records, and the project handoff; report the one next authorized action. Do not invent a percentage or active agent.

**Handoff must cover:** Goal, stage/criteria, accepted source exact SHA, current PR heads, actual agents/reviewers, N/M or NOT_BASELINED, CI and physical UAT limits, blockers and Owner decisions, prohibited actions, source locations, one executable next task, and successor obligation to leave a new handoff.

**Separation:** a global policy instruction does not authorize production, paid services, database writes, migrations, finance/merchant operations, DNS changes, CI bypass, source merge, or any deployment. Each project’s approvals remain distinct.

## Durable implementation in every repository

1. Root `AGENTS.md` must cite this canonical version and both source files, and point to the project's real master plan, skill/agent ledger and latest handoff.
2. `docs/governance/GLOBAL_AGENT_RULES.md` or an existing equivalent must give the project's current gate, local precedence, read-paths and approval status. Do **not** copy globally normative text into independent versions.
3. A repository README or code-agent entrypoint links to these files. A versioned Markdown source is itself a downloadable document through the repository's Raw link. The central release may also include a human-friendly PDF derivative; Markdown remains canonical.
4. Project changes are narrow governance-only pull requests with reviewer and Owner approvals. Keep a portfolio adoption register with `DRAFT`, `IN_REVIEW`, `ACCEPTED`, `NOT_STARTED` or `UNKNOWN` per repository.

## Verification and status

**As of 19 November 2026, central PR #16 is Draft and unmerged.** The Owner has now ordered universal adherence as an operating expectation; Git installation and CI enforcement in other repos remain independently verifiable and pending until their project PRs are accepted and merged. Do not equate a personal skill installation with repo adoption.

**Canonical links:** [Goal Fidelity](GOAL-FIDELITY-STAGE-CONTROL-v1.0.md) | [Global Moderator](STANDARD-v1.0.md) | [Central skill](../../skills/11-11-global-moderator/SKILL.md) | [Adoption protocol](ADOPTION.md) | [Preventive handoff template](templates/moderator-handoff.template.md).