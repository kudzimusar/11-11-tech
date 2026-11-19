# Global Moderator Standard 1.0 — Safe Project Adoption

**No automatic cross-project edits.** This is a programme governance rollout, not a technology migration.

## 1. One-time corporate approval

- Review the central normative standard, skill and templates.
- Verify publicly exposed material is safe.
- Approve/merge the standard without changing the corporate website runtime, deployment or payment systems.
- Record accepted central commit SHA and version in each adopting project's authority records.

## 2. Project-specific adoption (one governance PR per programme)

Each programme moderator must:
1. Identify its approved repository, current accepted SHA chain, controlling Owner instructions, existing moderator handoff, task baseline and accepted architecture.
2. Compare the standard with local authority, adopt process requirements while **preserving stricter technical, legal, source and release controls**. Raise actual policy conflicts to Owner; do not silently overwrite.
3. Create or update a project-specific moderator skill that refers to the accepted global standard version/SHA.
4. Create or reconcile a **living project continuity handoff**, **task/progress ledger**, **agent/assignment ledger**, and **blocker/risk/decision records**. Existing project documents may be used; do not generate duplicates when a live record already exists.
5. Reconcile active specialist PRs and accepted source at their actual latest heads. No rediscovery or retesting of accepted independent evidence without new contrary evidence.
6. Calculate `accepted / owner-approved task baseline × 100`; use `NOT_BASELINED` when a reliable denominator doesn't exist. Avoid fabricated completion weights.
7. Add handoff trigger rules to local `AGENTS.md` or equivalent and demonstrate a fresh successor could continue from the documented current state.
8. Submit a narrow PR, run available docs/CI, get independent review and the appropriate project-level Owner decision. **Do not self-merge or alter Production.**

## 3. Pilot adoption order (recommended, not pre-approved)

- **Rese Rese:** a project-specific moderator skill and draft PR already exist. Reconcile the adoption to that skill and its current reviewer/Owner gate; do not duplicate it.
- **CarUp, HealthTimes, Tengasell:** inspect live programme handoffs and accepted custody separately. Preserve frozen PRs, staging/production boundaries and independent physical certification.
- **Other 11-11 Tech projects:** follow as their governance owner is appointed; avoid inventing progress because a repository exists.

A global portfolio roster should include **all active programmes** known to the Owner and mark others `DISCOVERY_REQUIRED`; do not silently equate public GitHub repository count to actively managed programmes.

## 4. Minimal safe global index

A centrally readable portfolio index may store: programme identifier, repository link if public/approved, last verified timestamp, named moderator role, project-local continuity path, **non-sensitive** acceptance count/denominator or NOT_BASELINED, active gate, next task ID and general blocker classification.

If a field reveals private client data, security vulnerabilities, provider details or sensitive stage information, store it only in restricted storage, and use `RESTRICTED` in the central index.

## 5. Adoption proof checklist

- [ ] Global standard version and accepted SHA are linked.
- [ ] Project-specific master plan and binding architecture preserved.
- [ ] Exactly one current task/agent/progress/continuity source per project defined.
- [ ] Last accepted SHA chain and current PR heads reconciled.
- [ ] Every current specialist return has an independent disposition or explicitly awaiting-review status.
- [ ] Percentages computed from an honest known baseline; unknown never shown as zero.
- [ ] New moderator can complete takeover without old conversation history.
- [ ] Context-loss fallback uses recent committed checkpoints.
- [ ] Independent reviewer/Owner decision recorded.
- [ ] No Production, financial, billing or unauthorized cross-project changes.

**Status values:** `NOT_ADOPTED`, `ADOPTION_PR`, `PENDING_REVIEW`, `ACCEPTED`, `BLOCKED`. Do not equate `ADOPTION_PR` with `ACCEPTED`.

## 6. Standard maintenance and successors

A programme-specific handoff must explicitly say: “The receiving moderator must follow Global Moderator Governance & Continuity Standard 1.0, generate the next successor handoff, and verify live sources.” At each major programme change update actual project records; at each portfolio review reconcile the company index from those sources. No promise of automatic background synchronization without a configured automation.
