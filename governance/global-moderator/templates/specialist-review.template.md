# [PROJECT] — [TASK-ID] INDEPENDENT MODERATOR RETURN REVIEW

**Reviewed at:** [ISO timestamp]  
**Disposition (exactly one):** ACCEPT | REMEDIATE | BLOCK  
**Reviewer:** [actual independent moderator role]  
**Specialist / assignment:** [role/ID]  
**Controlling scope:** [original dispatch / accepted parent]  

## 1. Source custody
- Repository: [...]
- Authorized base: [full SHA, branch]
- Submitted candidate SHA: [...]
- **Latest verified remote head:** [...]
- Changed paths/migrations: [...]
- Source drift, unauthorized paths or competing writer: [...]
- Build/CI/test evidence **at this SHA**: [...]

## 2. Acceptance matrix
| Requirement | Evidence | Result PASS/FAIL/NOT_TESTED | Risk |
|---|---|---|---|
| Product outcome | [...] | [...] | [...] |
| Existing accepted architecture/invariants | [...] | [...] | [...] |
| Auth/privacy/transaction ownership | [...] | [...] | [...] |
| Database migration/rollback | [...] | [...] | [...] |
| AI/GEO/source/licensing (as applicable) | [...] | [...] | [...] |
| Performance/load/restore (as applicable) | [...] | [...] | [...] |
| Runtime/physical UAT (as applicable) | [...] | [...] | [...] |
| No unapproved Production/merge/billing | [...] | [...] | [...] |

## 3. Issue classification
[PRODUCT / HARNESS / CUSTODY / ENVIRONMENT / PROVIDER / OWNER_POLICY / LEGAL / PHYSICAL_UAT / SECURITY / RELEASE_GATE]  
[Exact defect or missing evidence, blast radius and what need not be reopened.]

## 4. Formal decision
**ACCEPT / REMEDIATE / BLOCK:** [single decision and scope]  
**Accepted source:** [SHA only if actually accepted]  
**Owner-controlled merge/release:** [PENDING/NOT_AUTHORIZED/explicit authority ref]  
**Required remediation or unblock:** [bounded instructions]  
**Next dependency-safe task:** [ID or NONE]

## 5. Records / Owner progress
- Task register: [updated PR/commit or pending]
- Agent ledger: [...]
- Progress ledger: N/M = X.X% (accepted-work-package coverage only)
- Handoff updated: [COMMITTED/PR_PENDING/CHAT_ONLY and exact path]
- Owner progress communication: [link or embedded pulse]

**A specialist's report and a green CI never alone authorize ACCEPT.**
