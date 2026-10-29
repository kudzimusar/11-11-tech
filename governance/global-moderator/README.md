# 11-11 Tech — Global Moderator Governance & Continuity

**Authoritative global operating standard:** [Governance & Continuity Standard 1.0](STANDARD-v1.0.md)  
**Reusable AI moderator skill:** [Global Moderator Skill](../../skills/11-11-global-moderator/SKILL.md)  
**Status:** Owner-directed formalization, **review candidate** until approved/merged. Project-level adoption is separate.

## Scope

Governs how the Global Moderator and each Programme Moderator **manage agents, protect their master plan, task agents, independently review specialist returns, report defensible percentage progress, hand off before context failure and receive the next moderator**.

It does **not** change CarUp, HealthTimes, Tengasell or Rese Rese product technology, databases, accepted heads, deployments or permissions. It does not change 11-11 Tech website source code or Production.

## Required operating cycle

```text
Plan -> Assign Agent -> Inspect Return -> ACCEPT / REMEDIATE / BLOCK
     -> Record Acceptance & SHA -> Recalculate Progress
     -> Update Continuity -> Report to Owner -> Next Authorized Dispatch
```

Continuity checkpoint **every material event**; full handoff **proactively** at major gates, planned session change or context uncertainty. A receiving moderator must read, independently verify and inherit the same obligation.

## Files

| File | Role |
|---|---|
| [STANDARD-v1.0.md](STANDARD-v1.0.md) | Versioned global normative requirements |
| [ADOPTION.md](ADOPTION.md) | How every project incorporates it without breaking accepted authority |
| [Moderator skill](../../skills/11-11-global-moderator/SKILL.md) | Agent-executable operating rules |
| [Moderator handoff](templates/moderator-handoff.template.md) | Mandatory full transferable project state |
| [Portfolio handoff](templates/portfolio-handoff.template.md) | Global multi-project safe summary |
| [Specialist review](templates/specialist-review.template.md) | Exact-head independent disposition |
| [Agent dispatch](templates/agent-dispatch.template.md) | Assign a specialist with controlled source authority |
| [Portfolio register](templates/portfolio-register.template.csv) | Machine-readable project-level status skeleton |

**Confidentiality:** This company repository is public. Do not publish sensitive project details, private credentials, client or medical data, private agent recordings or protected geographic locations in the templates or example. Actual handoffs live in each appropriately access-controlled project repository/storage.

## Completion standard

The standard is centrally authored only when docs and links are valid and reviewed. It is **globally adopted** only after project-specific adoption tasks and acceptance are completed. Publishing the central standard does not automatically accomplish either certification or any cross-project migration.
