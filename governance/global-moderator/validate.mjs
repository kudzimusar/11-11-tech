// Dependency-free static validation for the public 11-11 Tech global moderator
// governance package. Does not read or publish private project handoffs.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const home = dirname(fileURLToPath(import.meta.url));
const repo = resolve(home, '../..');
const files = [
  'AGENTS.md',
  'README.md',
  'governance/global-moderator/AGENT-GOVERNANCE-UNIFIED-v1.0.md',
  'governance/global-moderator/GOAL-FIDELITY-STAGE-CONTROL-v1.0.md',
  'governance/global-moderator/ADOPTION-TRACKER.md',
  'governance/global-moderator/templates/project-agent-governance-entry.template.md',
  'governance/global-moderator/11-11-TECH-GLOBAL-AGENT-GOVERNANCE-v1.0.pdf',
  'governance/global-moderator/README.md',
  'governance/global-moderator/STANDARD-v1.0.md',
  'governance/global-moderator/ADOPTION.md',
  'governance/global-moderator/templates/moderator-handoff.template.md',
  'governance/global-moderator/templates/portfolio-handoff.template.md',
  'governance/global-moderator/templates/specialist-review.template.md',
  'governance/global-moderator/templates/agent-dispatch.template.md',
  'governance/global-moderator/templates/portfolio-register.template.csv',
  'governance/global-moderator/templates/continuity-manifest.schema.json',
  'skills/11-11-global-moderator/SKILL.md',
  'skills/goal-fidelity-stage-control/SKILL.md',
];
const failures = [];
for (const name of files) if (!existsSync(join(repo, name))) failures.push('Missing ' + name);
for (const name of files.filter(f => f.endsWith('.md'))) {
  const absolute = join(repo,name);
  if (!existsSync(absolute)) continue;
  const s = readFileSync(absolute,'utf8');
  for(const [,target] of s.matchAll(/\]\(([^)]+)\)/g)) {
    const path=target.split('#')[0];
    if (!path || /^(https?:|mailto:|\/)/.test(path)) continue;
    const location=resolve(dirname(absolute),path);
    if (!existsSync(location)) failures.push('Broken link '+name+' -> '+target);
  }
}
const goalSkill=readFileSync(join(repo,'skills/goal-fidelity-stage-control/SKILL.md'),'utf8');
if (!goalSkill.startsWith('---') || !goalSkill.includes('name: goal-fidelity-stage-control')) failures.push('Goal Fidelity skill missing frontmatter');
const std=readFileSync(join(home,'STANDARD-v1.0.md'),'utf8');
const must = ['ACCEPT','REMEDIATE','BLOCK','agent','handoff','percent','Owner','successor','checkpoint','Production','exact SHA','context'];
for (const term of must) if (!std.toLowerCase().includes(term.toLowerCase())) failures.push('Normative standard missing '+term);
const pdfFile=join(home,'11-11-TECH-GLOBAL-AGENT-GOVERNANCE-v1.0.pdf');
if (!existsSync(pdfFile)) failures.push('Global agent PDF missing');
else { const b=readFileSync(pdfFile); if(b.length<1000 || !b.subarray(0,8).toString().startsWith('%PDF-1.')) failures.push('Global agent PDF invalid header/size'); if(!b.toString('latin1').trimEnd().endsWith('%%EOF')) failures.push('Global agent PDF missing EOF'); }
const unified=readFileSync(join(home,'AGENT-GOVERNANCE-UNIFIED-v1.0.md'),'utf8');
for(const term of ['Goal Fidelity','Moderator','ACCEPT','REMEDIATE','BLOCK','handoff','NOT_BASELINED'])if(!unified.toLowerCase().includes(term.toLowerCase()))failures.push('Missing global two-rule clause '+term);
const schema = JSON.parse(readFileSync(join(home,'templates/continuity-manifest.schema.json'),'utf8'));
if (schema.properties?.standard_version?.const !== '1.0.0') failures.push('Invalid schema version');
for (const name of ['handoff_id','accepted_tasks','baseline_tasks','next_action','agent_assignments','storage_status']) {
  if (!schema.required?.includes(name)) failures.push('Schema missing required '+name);
}
if (failures.length) { for(const f of failures) console.error(f); process.exit(1);}
console.log('PASS — Global Moderator & Goal Fidelity rules v1.0: source docs, PDF, internal links, mandatory clauses and continuity schema');
