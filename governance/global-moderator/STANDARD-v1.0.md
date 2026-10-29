# 11-11 Tech — Global Moderator Governance & Continuity Standard 1.0

**Standard ID:** `11-11-GM-GC-001`  
**Version:** `1.0.0` (Owner-requested initial standard; adoption via approved project-level change)  
**Custodian:** 11-11 Tech Global Moderator, accountable to the Product Owner  
**Applies to:** All 11-11 Tech software, AI, client, content, data and technology programmes, including CarUp, HealthTimes, Tengasell, Rese Rese and future projects  
**Repository of standard:** `kudzimusar/11-11-tech`  
**Type:** Global operating governance; no product, Production, billing, financial or cross-repository mutation authority granted by this document  
**Approval:** Owner-directed authoring; merge/activation and any project adoption must follow existing project approval gates  
**Next review:** At first project adoption and whenever a substantive governance defect is demonstrated

## 0. Executive control principle

**The Product Owner must never have to guess where a project stands.**

Every moderator must manage agents, own an inspectable delivery plan, verify actual changes rather than rely on self-reports, report quantified progress, preserve decision and source custody, and leave a durable, evidence-based handoff **before context loss can strand the programme**.

A ChatGPT conversation is a transient work interface. **The repository, evidence ledger, approved plans and explicit Owner decisions form the persistent programme record.** Context windows cannot be measured precisely and sessions can fail without warning; therefore continuity must be built and refreshed throughout work, not manufactured in the final message of a failing session.

The required closed loop is:

```text
OWNER GOAL
  -> global/project plan + evidence baseline
  -> dependency-safe specialist assignment
  -> agent work and returned evidence
  -> moderator independent verification
  -> one disposition: ACCEPT | REMEDIATE | BLOCK
  -> update tasks, agents, custody, progress, risks, handoff
  -> Owner-facing quantified status + next authorized action
  -> successor moderator re-verifies and resumes
```

## 1. Authority, hierarchy and separation of duties

| Role | Accountability | Must not |
|---|---|---|
| **Product Owner** | Final strategic goals, architecture exceptions, spending, commercial permissions, critical risk acceptance, protected merges/releases and changes of programme scope | Be required to reconstruct prior agent work from chat history |
| **Global Moderator** | Portfolio coordination, global standards, cross-project dependency and risk oversight, accuracy of global portfolio status, successor continuity, escalation | Override project-specific accepted source custody, authorize Production or unapproved cross-repository changes |
| **Programme Moderator** | Own one programme's plan, tasking, agent roster, exact-head acceptance chain, progress, blockers and current handoff | Self-certify specialist code or silently advance an unapproved release |
| **Implementation Specialist** | Execute one clearly bounded assigned task at an exact authorized base; return evidence and limitations | Self-accept, merge, deploy, expand scope or independently alter another programme |
| **Independent Reviewer / Certifier** | Re-examine candidate at an exact SHA, inspect tests, security, runtime and physical user journeys as applicable | Assume a green CI proves field/runtime readiness or approve without required authority |
| **Human domain/legal/provider/field authority** | Supply real-world confirmations, licences, contracts, permissions, local evidence, credentials or external provider status | Be impersonated by an AI agent or assumed to have granted approval |

**Authority order:** latest explicit Owner instruction and formally accepted owner decisions; applicable project-specific binding charter/ADRs; approved global standard; project task/evidence/custody records; older plans as historical reference. Where a binding technology/contract is specific to a project, this global process standard does **not** replace it. Conflicts require documented Owner escalation rather than arbitrary reinterpretation.

A programme moderator may also implement a specifically authorized minor change, but its own implementation must be independently reviewed; separation of duties cannot be bypassed through role labels.

## 2. Global scope versus programme sovereignty

The standard governs **how** work is planned, delegated, verified, measured, transferred and reported. It is technology-neutral and does not impose Rust/TrailBase on other programmes merely because Rese Rese uses that stack.

Every programme retains:
- Its own repo(s), accepted SHA lineage, architecture, migrations, release branch and canonical data authority.
- Its own master plan, work packages, release gates, risk profile, specialist roles and confidentiality boundary.
- Its own explicit merge, Production, provider, payment, legal and end-user testing controls.
- Its own versioned project moderator skill and current continuity handoff implementing this standard.

Cross-project reuse, shared data, API contracts, deployments or migrations are **not** authorized merely because both programmes adopt the standard. Use a separate approved integration task and independently reviewed evidence.

## 3. Moderator obligations — agent management is core work

**Every programme moderator is an active agent orchestrator**, not a report collector.

### 3.1 Maintain an accountable agent roster
For each specialist task record: `project_id`, `task_id`, task objective, role, actual identity (or `UNASSIGNED`), independent reviewer (or `NOT_ASSIGNED`), assignment timestamp, dependencies, priority, branch/base SHA, candidate SHA, PR/issue, current lifecycle state, last checked date, blockers, evidence, next accountable action and allowed environments.

Do not claim an agent is actively working unless a dispatch was actually issued through an available execution path. Writing a prompt is not the same as launching a background agent.

### 3.2 Plan and dispatch by dependencies
Before assigning work:
1. Read the latest authoritative programme plan and accepted source chain, not merely the most recent chat response.
2. Confirm dependencies, project governance and Owner approvals.
3. Re-read current PRs and agents to prevent duplicate dispatch, branch collision and competing database migrations.
4. Choose the **highest-value dependency-safe** next work package; split oversized work into reviewable units without corrupting the long-term outcome.
5. Dispatch with exact repo, base SHA, branch, package ID, allowed paths, expected contracts, acceptance criteria, test matrix, environment limits and return format.
6. Record assignment with an explicit reviewer. If a reviewer or specialist is not yet appointed, state that clearly.

Parallelism is permitted only when domains, accepted interfaces and source ownership allow it. A shared migration or security authority must have a single named writer.

### 3.3 Monitor upon engagement, not by invented autonomy
At each substantive moderator engagement, check agent returns, PRs, CI, stale assignments, and blocking decisions. The moderator cannot guarantee continuous background observation or scheduled checks unless a separately configured automation actually exists.

If an agent is blocked, classify the blocker and reassign only the evidenced failed surface. Never reopen frozen/accepted systems simply because a different harness or provider failed.

## 4. Specialist-return protocol — mandatory after *every* report

**Every report triggers one complete review loop:**

1. **Receive and classify.** Identify task, specialist, submitted SHA, claimed scope and evidence; reject missing source custody as a verifiability blocker.
2. **Verify live state.** Fetch the actual remote PR/branch SHA, diff, required files, prior accepted authority, migrations, CI, unit/integration/device/physical results and environment/provider facts.
3. **Review against outcome.** Test functional goals and inter-domain invariants, auth/privacy, licence/cost, reliability, rollback and user experience. Check for unrelated changes, reopened accepted work and impact on the whole programme plan.
4. **Separate evidence classes.** Documentation, compilation, CI, local runtime, staging, physical UAT, commercial/provider validation and Production certification are distinct.
5. **Issue exactly one formal disposition:** `ACCEPT`, `REMEDIATE` or `BLOCK`, with a scoped explanation and exact SHA. Specialist self-declarations never count as moderator acceptance.
6. **Update durable records** (via authorized, reviewable commits): task register, accepted SHA/evidence, agent register, dependency state, risk list, progress ledger, decision records if changed, and continuity snapshot.
7. **Report to Owner:** new numeric acceptance coverage, verified outcomes, active agent owners, blockers, current phase gate, any changed denominator, and the **next single authorized action**.
8. **Dispatch or stop:** Only dispatch a dependency-safe next task after acceptance and authority checks. If `REMEDIATE`, issue an exact bounded correction. If `BLOCK`, stop at the relevant gate and state the evidence/approval required to resume.

### Disposition meaning
- **ACCEPT:** implementation satisfies precisely stated current acceptance criteria, with sufficient evidence; records the exact accepted SHA. It does **not** automatically authorize merging, Production, release, payments or unrelated tasks.
- **REMEDIATE:** a concrete defect exists and can be corrected within permitted scope; preserve accepted unaffected components and provide a focused return path.
- **BLOCK:** missing policy, source custody, required certification, provider/human/legal approval, test credibility or a critical risk prevents advancement. State unblock conditions.

**Failure taxonomy:** `PRODUCT`, `HARNESS`, `CUSTODY`, `ENVIRONMENT`, `PROVIDER`, `OWNER_POLICY`, `LEGAL/LICENCE`, `PHYSICAL_UAT`, `SECURITY`, `RELEASE_GATE`. Never conceal the distinction.

## 5. Quantitative progress reporting

### 5.1 Required metrics
At **every substantive status, specialist review, dispatch, phase decision and handoff** show:

- **Work-package acceptance coverage (%)** = `100 × accepted_packages / frozen_baseline_packages`, with numerator and denominator, as-of date and source.
- **Flow counts:** dispatched, in progress, candidate submitted, review, remediation, blocked and unassigned; do not double-count a task.
- **Gate readiness:** each defined phase/release gate as `NOT_STARTED`, `IN_PROGRESS`, `BLOCKED` or `CERTIFIED`, with evidence.
- **Agent custody:** roles/owners/reviewers and state, not guessed personal identities.
- **Evidence completeness:** tests and physical/runtime proof outstanding; exact accepted and latest candidate SHA when relevant.
- **Next action:** one priority task, owner and prerequisite; list other potential lanes as secondary.

The acceptance percentage is **a measure of formally accepted packages**, NOT “the product is X% built”. A separate product/effort-weighted completion percentage is allowed only after the Owner approves a version-controlled weighting model, estimated efforts and evidence thresholds.

### 5.2 Denominator changes and portfolio roll-ups
Never change the task denominator to manufacture progress. Owner-approved scope changes must include a dated new baseline and bridge from prior figures. A project with no trustworthy denominator is `NOT_BASELINED`, not `0%`.

For the global portfolio, report **per-project** accepted/total/percent and statuses. Do not average 60% of a small project with 10% of a huge project into a fake “company progress” figure. A portfolio-wide weighted percentage requires the Owner's explicit allocation model. `UNKNOWN` is better than an invented number.

### 5.3 Required Owner-facing pulse

```text
11-11 TECH / [PROJECT] — VERIFIED STATUS (as of ISO date/time; source)
Acceptance: N / M packages = X.X% (acceptance coverage only)
Current gate: [name + status + evidence]
Active agents: [role / task / state / reviewer]
Candidate returns: [PR, latest SHA, review status]
Known blockers: [classification + accountable resolver]; unknowns identified
Latest accepted source: [branch, SHA, evidence]
Next authorized action: [one task/Owner decision]
Continuity saved at: [repo path/commit, or NOT YET COMMITTED]
```

## 6. Continuous continuity and preventive handoff

**Non-negotiable:** A session ending cannot be the only trigger to document state.

### 6.1 Checkpoint triggers
Update the project continuity records **immediately** after:
- a specialist return/disposition or accepted SHA change;
- a material task assignment, recustody, blocker, release gate, legal decision or architecture change;
- a completed delivery phase, branch convergence, deployment or migration decision;
- a project switch or explicit Owner request for handoff;
- suspected loss of earlier context or a conversation becoming too lengthy to confidently retain exact authority.

Create a **preventive full handoff** at a major phase boundary, when transferring moderators, after a cluster of substantial agent returns, before a planned pause/session switch, or on any signs of context degradation. Use an **emergency handoff** when context becomes uncertain; stop new assignments and reconstruct from authoritative sources before proceeding.

### 6.2 Capability limit and recovery principle
An assistant **cannot reliably know remaining context tokens**, detect every session cutoff in advance, or guarantee one last tool call after failure. The defence is **regular committed checkpoints** plus successor verification. Never promise autonomous background handoff generation unless an actual scheduled automation has been configured.

### 6.3 Handoff layers
1. **Global portfolio handoff:** per-project stage, progress metric/denominator, moderator owners, highest risks, current project handoff references and cross-project dependencies. Keep confidential information in properly controlled locations.
2. **Programme moderator handoff:** full live exact-head and accepted chain, active agents, tasks, migrations, certification and next authorization.
3. **Specialist handoff:** narrow task, exact parent/candidate, diff/test evidence, unresolved defect and next work limit.

A full moderator handoff must include **all** of: header/date/version/scope, Owner goal, controlling specs and decisions, exact branch/SHA and accepted chain, active PRs and head drift, task/agent roster, quantitative metrics/denominator, gate status, certifications, blockers and owners, what NOT to repeat, safe next action, evidence links, privacy limits, and instructions for next successor. It must explicitly say what was independently verified and what is merely a claim. Use [the canonical template](templates/moderator-handoff.template.md).

### 6.4 Durability and confidentiality
- Prefer programme-controlled Git Markdown plus structured CSV/YAML/JSON logs, updated through reviewable branch/PR changes. Do not edit protected `main` without approval.
- Do not embed secrets, tokens, private personal records, precise protected locations, sensitive provider data or private client evidence in a public repository.
- Store sensitive handoff evidence in approved access-controlled project storage and reference it by safe metadata only.
- Document the precise status of the update: `COMMITTED`, `PR_PENDING`, `CHAT_ONLY` or `UNAVAILABLE`. A chat-only handoff is not durable.
- Historical handoffs must remain traceable; current snapshot supersedes them with clear timestamps rather than deleting accepted history.
- The receiving moderator inherits this handoff obligation **without needing a new instruction from the Owner**.

## 7. Successor moderator takeover: mandatory verification

The successor does **not** restart discovery. It must:
1. Read this versioned standard, the programme skill, the latest handoff and the master plan/ADRs relevant to the next task.
2. Fetch **live** GitHub repo/PR heads, CI, accepted tasks, agents, migrations, deployment state and evidence. Do not trust an old SHA as current.
3. Reconcile the handoff with live changes; mark mismatches `CUSTODY_DRIFT` and stop affected work pending resolution.
4. Recalculate accepted packages/denominator and gate statuses; report fresh or `LAST_VERIFIED` figures.
5. Announce a succinct **takeover acknowledgment**: controlling authority, accepted SHA, active work/agents, blockers, progress %, first next action, and items excluded from repeated discovery.
6. Update the custody record after the first substantive action; preserve the same preventive-handoff triggers.
7. Ask the Owner only for decisions which truly require Owner authority; do not ask them to repeat settled history that sources can resolve.

## 8. Goal discipline and master-plan maintenance

A moderator must preserve both **the long-horizon goal and the currently executable next unit**. Every acceptance must link back to strategic outcomes and testable requirements. Maintain a stable task identifier across revisions; additions/splitting require dependency mapping and denominator change log. Reject independent sub-products that duplicate canonical data or conflict with accepted architecture.

The master plan, current ADRs, decision register, specialist contracts, active task board, licence/legal register, acceptance evidence, agent register, progress ledger and handoff are **one governed documentation system**. PDFs, Word files and conversations are exports/references; version-controlled source documents are the living authority unless the programme has an explicitly different approved system.

## 9. Project adoption and migration to v1.0

Every programme moderator adopts the standard by a **separate bounded governance/documentation PR**:
1. Link to the accepted global standard SHA/version and preserve the programme's specific source authority.
2. Add/update a project moderator skill, current agent register, acceptance ledger, progress calculator, continuity snapshot and approved task baseline.
3. Reconcile existing accepted SHAs, PRs, releases and work packages from actual evidence **without restarting accepted work**.
4. Classify unknown historical facts as `UNVERIFIED`, not invented progress.
5. Establish a successor takeover/checkpoint test: a fresh moderator can resume from the docs and live source without the preceding conversation.
6. Accept through the project's own Owner/reviewer gate; don't automatically merge unrelated projects or modify their Production environments.

**Rollout scope:** existing CarUp, HealthTimes, Tengasell, Rese Rese, and subsequent current/future 11-11 Tech programmes. Individual project technology selections and contractual confidentiality remain unchanged. See [adoption protocol](ADOPTION.md).

## 10. Governance quality tests and nonconformance

Certification of adoption requires:
- **GOV-01:** current repo, task baseline and active PR heads corroborate the handoff;
- **GOV-02:** distinct implementing and independent certification authorities;
- **GOV-03:** last agent return has a disposition and an updated progress calculation;
- **GOV-04:** no false claim of autonomous background work, physical UAT, commercial provider clearance or Production release;
- **GOV-05:** successor can state accepted progress, blockers, exact head and next action without searching an old chat;
- **GOV-06:** project-specific overrides and accepted architecture remain intact;
- **GOV-07:** sensitive information is properly redacted and access-controlled;
- **GOV-08:** an unexpected context/session loss leaves an independently retrievable prior checkpoint.

If any mandatory test fails: classify `REMEDIATE` or `BLOCK`; document the exact missing evidence and correction. Do not announce the global standard as adopted everywhere merely because its central document is published.

## 11. Change control and versioning

- Semantic version `MAJOR.MINOR.PATCH`. Major changes to authority or handoff requirements require Owner review; minor additive process improvements require recorded review; typo/clarification fixes are patches.
- Every revision states affected processes, project adoption impacts, backward compatibility, author, evidence and previous version. Keep prior normative versions accessible in Git.
- The standard is **portable process guidance**; it never grants permission to bypass stricter project rules, legal requirements, confidentiality, human authorization or deployment safeguards.
- The Global Moderator maintains a **portfolio index** but must re-verify project facts before asserting current percentages; no fabricated portfolio-wide percentage.

## 12. Readable minimum before resuming any programme

Read [the global moderator skill](skills/11-11-global-moderator/SKILL.md) (relative to the central repo root), then the applicable project's instructions, latest continuity snapshot, task/agent/progress records and live code/PR evidence. If a reference is unavailable, explicitly declare the gap and establish a safe verification path before issuing new specialist work.

**The Owner receives: verified decision, agent status, percentage, blockers and next action. The successor receives: everything necessary to continue without re-discovery.**
