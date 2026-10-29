# [PROGRAMME] — PROGRAMME MODERATOR CONTINUATION HANDOFF

**Handoff ID:** [PROGRAMME]-MOD-HANDOFF-[DATE]-[SEQUENCE]  
**Generated at:** [ISO-8601 timestamp + timezone]  
**Last verified source at:** [ISO-8601 timestamp + timezone]  
**Prepared by role:** [Programme Moderator / approved actor]  
**Handoff status:** [COMMITTED | PR_PENDING | CHAT_ONLY | UNAVAILABLE]  
**Source location / commit:** [access-controlled repo path and exact commit SHA]  
**Successor role:** [role; person identity if genuinely assigned]  
**Global standard:** 11-11 Tech Global Moderator Governance & Continuity Standard 1.0; link to exact adopted commit SHA  
**Confidentiality:** [Public-safe / Internal / Restricted]  

> **No old conversation is required to resume.** This is a timestamped source-backed handoff, not permission to trust its SHAs forever. Before acting, successor must independently reconcile Git, PRs, CI, migrations and current Owner instructions.

## 1. Owner goal and programme boundaries

- **Ultimate business / user goal:** [specific outcomes and population, not “build features”]
- **Repository(s), services and environments:** [permitted host and status]
- **Current delivery stage and release gate:** [...]
- **Technology / architecture frozen and accepted:** [links to versioned decisions]
- **Explicit forbidden actions:** [e.g. Production/merge/billing/client data/unapproved cross-project changes]
- **What is out of scope:** [...]
- **Legal/contractual confidentiality requirements:** [...]

## 2. Evidence-bearing exact source custody

| Authority | Branch / PR | Exact full SHA | Verified when | Result / evidence |
|---|---|---|---|---|
| Current default/main | [...] | [...] | [...] | [...] |
| Last accepted product source | [...] | [...] | [...] | [...] |
| Last accepted schema/migration | [...] | [...] | [...] | [...] |
| Active candidate 1 | [...] | [...] | [...] | [...] |
| Active candidate N | [...] | [...] | [...] | [...] |
| Staging runtime | [...] | [...] | [...] | [...] |
| Production (if read-authorized) | [...] | [...] | [...] | [...] |

Identify branch head drift, unmerged accepted work, migrations not applied, runtime/CI at different SHAs and **unknown** deployment state.

## 3. Progress and gate truth

- **Baselined work packages:** [M, approved version and denominator source]
- **Formally accepted:** [N and exact evidence]
- **Acceptance coverage:** [100 × N/M = X.X%], **not full product completion**
- **Submitted / under review:** [tasks, heads]
- **In progress:** [...]
- **Blocked:** [...]
- **Not assigned / not baselined:** [...]
- **Effort-weighted percent:** [NOT_BASELINED unless approved formula exists]
- **Release gates:** [gate name, status, proof or lack thereof]
- **Physical/user/runtime certification:** [independently evidenced state]

## 4. Agents and accountable work

| Assignment ID | Specialist role / actual agent | Task ID | Authorized base + branch | Candidate / PR | Independent reviewer | State | Next accountable action |
|---|---|---|---|---|---|---|---|
| [...] | [...] | [...] | [...] | [...] | [NOT_ASSIGNED if unknown] | [...] | [...] |

Clearly distinguish a written prompt from a truly dispatched agent, and a completed report from a moderator-accepted task.

## 5. Accepted work — do not rediscover or reopen

For each accepted unit record [task ID, exact SHA, accepted reviewer/Owner disposition, tests, preserved invariants, scope].  
**Do not rerun full discovery** unless credible new evidence contradicts accepted results.

## 6. Current blockers, risks and Owner decisions

| Classification | Exact blocker / unanswered question | Affected package / gate | Accountable resolver | Evidence | Unblock condition |
|---|---|---|---|---|---|
| [PRODUCT / HARNESS / CUSTODY / ENVIRONMENT / PROVIDER / OWNER_POLICY / LEGAL / PHYSICAL / SECURITY] | [...] | [...] | [...] | [...] | [...] |

Explicitly flag missing human/legal/provider approval, data rights, reliability/recovery proof and private evidence.

## 7. Immediate executable next action

**ONE next task:** [ID and objective]  
**Why now:** [dependencies and user goal]  
**Authorized starting point:** [exact branch/accepted parent SHA]  
**Who:** [actual agent role, whether assigned]  
**Permitted modifications:** [...]  
**Mandatory tests/evidence:** [...]  
**Stop conditions:** [...]  
**Additional waiting lanes (not authorized by this handoff):** [...]

## 8. Owner-facing status and citations

Summarize in ≤ 200 words:
- verified accepted percentage and current gate;
- active agents and candidate review;
- blockers and Owner decisions;
- specific next action;
- links to PRs, CI, approved plan and this handoff.

## 9. Successor takeover command (mandatory)

1. Read governing global + project moderator skills, current plan, latest accepted ADRs and this handoff.
2. Fetch **fresh** heads/PRs/CI and reconcile authority.
3. Recompute accepted N/M and current blockers.
4. Announce takeover acknowledgment with **accepted chain, current PRs, agents, percent and next action**.
5. Resume *only* from verified authorized work.
6. Immediately inherit **the obligation to create the next checkpoint and preventive handoff**.
7. If files disagree, mark `CUSTODY_DRIFT`, do not guess or self-authorize repairs.

## 10. Provenance and checkpoint integrity

**Verified directly:** [...]  
**Agent or human reports, not independently verified:** [...]  
**Not checked / unknown:** [...]  
**Newer sources to reconcile:** [...]  
**Location of sensitive evidence:** [controlled ref, no credentials in public Git]  
**Checkpoint storage status:** [COMMITTED + SHA / PR_PENDING + PR / CHAT_ONLY]  

This handoff is an operational continuity artifact. It is not an Owner sign-off to merge, deploy, pay, contact providers or change Production.
