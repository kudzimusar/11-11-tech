// Dependency-free static validation for the public 11-11 Tech global moderator
// governance package. Does not read or publish private project handoffs.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const home = dirname(fileURLToPath(import.meta.url));
const repo = resolve(home, '../..');
const files = [
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
const std=readFileSync(join(home,'STANDARD-v1.0.md'),'utf8');
const must = ['ACCEPT','REMEDIATE','BLOCK','agent','handoff','percent','Owner','successor','checkpoint','Production','exact SHA','context'];
for (const term of must) if (!std.toLowerCase().includes(term.toLowerCase())) failures.push('Normative standard missing '+term);
const schema = JSON.parse(readFileSync(join(home,'templates/continuity-manifest.schema.json'),'utf8'));
if (schema.properties?.standard_version?.const !== '1.0.0') failures.push('Invalid schema version');
for (const name of ['handoff_id','accepted_tasks','baseline_tasks','next_action','agent_assignments','storage_status']) {
  if (!schema.required?.includes(name)) failures.push('Schema missing required '+name);
}
if (failures.length) { for(const f of failures) console.error(f); process.exit(1);}
console.log('PASS — Global Moderator Standard v1.0: 10 files, internal links, mandatory clauses and continuity schema');
