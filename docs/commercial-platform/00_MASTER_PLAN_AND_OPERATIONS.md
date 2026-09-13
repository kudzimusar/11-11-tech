# 11-11 Tech Commercial Client Platform — Master Plan & Operations Manual

Status: canonical implementation and operating reference  
Owner: 11-11 Tech LLC  
Version: 1.0  
Created: 2026-09-13

## 1. Purpose

This programme turns the public 11-11 Tech website into a complete commercial journey without turning the marketing site into an unstructured payment page.

The governing sequence is:

**Discover / Start project → Client & project record → Commercial package → Review & acceptance → Payment → Confirmation → Ongoing client workspace**

Every payment must belong to an identifiable client, organisation, project and commercial document set. Stripe performs payment processing; Supabase is the system of record for commercial state, access, documents, balances and audit history.

This file is both the implementation plan and the operating manual. Future changes to the commercial platform must preserve the invariants in sections 4, 8, 9 and 15.

## 2. Product surfaces

### 2.1 Public website

Public entry points:

- **Start a Project** — new opportunity / existing lead journey.
- **Pay an Invoice** — returning client with a project or invoice reference.
- **Client Login** — secure access to a client workspace.

A visitor may start directly from the public website. Anonymous card payment is not the primary model: before payment the system establishes who is paying, what is being purchased, which agreement applies and which invoice/payment plan the money settles.

### 2.2 Company Admin Workspace

Internal 11-11 Tech surface for authorised company operators only.

Core sections:

- Dashboard
- Leads
- Clients & organisations
- Projects
- Proposals / quotations
- Statements of Work
- Agreements & versions
- Payment plans
- Invoices
- Payments
- Subscriptions / retainers
- Documents
- Change orders
- Milestones
- SLA / support
- Audit trail

The admin workspace is the authority for project formalisation, commercial document publication, payment-plan approval, manual/offline payment recording, client access and project lifecycle management.

### 2.3 Client Workspace

Each authenticated client gets a private workspace scoped to organisations in which they have membership.

Primary navigation:

- Overview
- Projects
- Documents
- Billing
- Support / Messages (later phase)

For every project the client can see:

- agreed project value;
- amount paid;
- amount outstanding;
- next payment and due date;
- current project status;
- quotation / proposal;
- SOW;
- service agreement;
- payment terms and payment schedule;
- NDA / confidentiality where applicable;
- SLA where applicable;
- DPA / data terms where applicable;
- invoices and receipts;
- change orders;
- payment history.

## 3. Public-to-client journey

### A. New client

1. User selects **Start a Project** on the public website.
2. Existing guided intake captures contact, organisation, service/capability, business outcome, scope, budget, timeline, preferred contact, referral source and legal/procurement needs.
3. Submission creates a lead record and a commercial contact/organisation shell where possible.
4. 11-11 Tech reviews the opportunity in Admin.
5. Admin converts/links the lead to a client project.
6. Admin prepares the quotation, SOW, applicable legal modules and payment choices.
7. Client receives a secure email link to the project workspace.
8. Client signs in through Supabase email authentication / magic link.
9. Client reviews the commercial package.
10. Client selects an approved payment option.
11. Client opens every mandatory document and completes the required acknowledgements.
12. For scheduled automatic payments the client explicitly authorises future charges.
13. **Continue to secure payment** becomes enabled.
14. Stripe Checkout collects card/payment details.
15. Stripe webhook confirms the financial event to Supabase.
16. Project/invoice/payment-plan state updates automatically.
17. Client returns to 11-11 Tech confirmation page.
18. Client receives payment confirmation email.
19. Invoice, receipt and final agreement package remain accessible in the client workspace.

### B. Existing client paying an invoice

1. Client chooses **Pay an Invoice** on public site or follows the invoice email link.
2. Client authenticates.
3. System resolves only invoices visible to the authenticated client.
4. Client sees invoice amount, project, balance, due date and associated payment terms.
5. If acceptance is still outstanding, the agreement review gate is shown first.
6. Stripe processes payment.
7. Webhook updates invoice/payment/balance.
8. Client lands on payment confirmation with downloadable documents.

### C. Returning client

1. Client chooses **Client Login**.
2. Email magic-link authentication.
3. Client lands on Workspace Overview.
4. Outstanding balances, next payments and recent documents are immediately visible.

## 4. Commercial invariants

The following rules are mandatory:

1. **No orphan payment.** Every project payment references an organisation, project and invoice/payment plan.
2. **Agreement before first payment.** Required project terms must be accepted before first payment unless an authorised admin records an externally executed agreement with evidence.
3. **Historical terms are immutable.** Changing a template never rewrites a document version already accepted by a client.
4. **Explicit auto-charge consent.** A saved payment method is not permission to charge arbitrary amounts. Scheduled payment authorisation is separately recorded.
5. **Client isolation.** A client can never read another organisation’s projects, documents, invoices, payments or memberships.
6. **Admin is explicit.** Company-wide access is granted only by an admin membership record, never by email-domain heuristics.
7. **Stripe is not the ledger of record.** Stripe identifiers are stored and reconciled, but Supabase owns the project/invoice/payment state used by the product.
8. **Amounts use minor units.** Money is stored as integer cents/minor units plus ISO currency code.
9. **Document vault is private.** Commercial PDFs are stored in a private Supabase Storage bucket with organisation/project-scoped paths.
10. **Audit material is append-only where practical.** Agreement acceptances and financial events are never silently edited.

## 5. Supported payment models

### 5.1 Pay in full

100% paid at checkout against an invoice.

### 5.2 Deposit + balance

Example: 50% now, 50% before launch. Each scheduled component is a payment-plan installment.

### 5.3 Structured installments

Fixed or percentage installments with dates. Examples: 25% × 4, 20% deposit + remaining monthly installments.

### 5.4 Additional / partial balance payment

Where the project policy allows it, client may make an additional payment against an outstanding invoice or balance, subject to a configured minimum (for example USD 100). Additional payments reduce outstanding principal; default operating rule is to shorten/reduce remaining obligations rather than silently changing contract terms.

### 5.5 Recurring service

True recurring services — maintenance, managed operations, retainers, RPO, AI operations, CRM management — use Stripe subscriptions. A finite project paid over time remains a project installment plan, not a subscription.

### 5.6 Offline/manual payment

Admin may record bank transfer, cash, approved mobile payment or other external payment. Manual entries require amount, currency, date, method, reference and operator identity. They update the same ledger/balance model as Stripe-confirmed payments.

## 6. Legal and document package

Documents are modular. A project attaches only applicable modules.

Baseline package:

- Quotation / Proposal
- Statement of Work (SOW)
- Master Service Terms / Service Agreement
- Payment Terms
- Privacy Notice
- Cancellation / Refund terms
- Change Request policy
- IP & licensing terms (within agreement or addendum)

Conditional modules:

- NDA / Confidentiality Agreement
- SLA
- Data Processing Addendum (DPA)
- Security Addendum
- Acceptable Use Policy
- Maintenance / Support terms
- AI Addendum

### Review gate

The client sees each required document in a readable panel with **View** and **Download PDF** actions. Required documents have a reviewed/opened state and explicit acknowledgement.

Typical acknowledgement set:

- I have reviewed and accept the Quotation and Statement of Work.
- I have read and agree to the Service Terms and Payment Terms.
- I acknowledge the applicable Confidentiality/NDA, SLA and data terms.
- I authorise 11-11 Tech to charge my selected payment method according to the displayed payment schedule. (installment/recurring only)
- I acknowledge the Privacy Policy and applicable data-processing terms.

The payment CTA remains disabled until all required acknowledgements are satisfied.

### Payment terms content

The project-specific payment terms must clearly present:

- contract total;
- currency;
- deposit/first payment;
- installment amounts and dates;
- outstanding balance;
- minimum extra payment if enabled;
- automatic payment authorisation;
- failed-payment handling;
- grace period;
- late charge language and the project-specific rate/amount where legally approved;
- service/project suspension rules;
- cancellation/refund terms;
- taxes/third-party fees where applicable;
- early/additional payment treatment.

Late-fee language is configurable per contract and must remain subject to applicable law. Legal wording, governing law, liability, indemnity, cross-border privacy, tax and credit-like installment structures require qualified legal review before production use.

## 7. Document identity and branding

Commercial identifiers use stable references, for example:

- Lead: `11T-LEAD-0042` or capability-derived existing lead reference
- Project: `11T-PROJ-0042`
- Quotation: `11T-Q-2026-0042`
- SOW: `11T-SOW-2026-0042`
- Agreement: `11T-AGR-2026-0042`
- Invoice: `11T-INV-2026-0042-01`
- Receipt: `11T-RCT-2026-0042-01`
- Change order: `11T-CO-2026-0042-01`

All 11-11-owned forms, agreement-review surfaces and generated documents use the approved logo from `/public/assets/` and the documented brand system. Client documents use the blue-dominant 11-11 visual language, restrained amber actions, strong typography, accessible contrast and no generic “dashboard template” appearance.

## 8. Supabase data architecture

Core entities:

- `commercial_profiles` — authenticated human profile.
- `commercial_admins` — explicit company admin permission.
- `organizations` — client legal/commercial entity.
- `organization_members` — profile-to-organisation role.
- `projects` — contracted/proposed engagement.
- `project_contacts` — project contact roles.
- `document_templates` — controlled source templates.
- `project_documents` — immutable/versioned project document metadata and storage pointer.
- `agreement_acceptances` — append-only client acknowledgements.
- `payment_plans` — approved payment structure.
- `payment_installments` — dated obligations.
- `invoices` — receivables.
- `payments` — financial events/receipts.
- `subscriptions` — recurring Stripe relationship metadata.
- `change_orders` — post-contract scope/value changes.
- `milestones` — delivery milestones.
- `audit_events` — append-oriented system/operator events.

Existing `leads` remains a protected acquisition table. Commercial records link to leads; the portal does not receive direct read access to the lead table.

## 9. Row-Level Security model

- `anon`: no direct commercial-table access.
- `authenticated` client: rows only where `organization_members.profile_id = auth.uid()` and membership is active.
- `commercial_admins`: authorised company-wide operational access through policies/functions.
- `service_role`: backend/Edge Function operations and webhook reconciliation.

Sensitive writes such as agreement acceptance, payment-plan activation, manual payment recording and Stripe reconciliation should use controlled RPC/Edge Function boundaries rather than broad table update permissions.

## 10. Document storage

Private Supabase Storage bucket: `client-documents`.

Path convention:

`{organization_uuid}/{project_uuid}/{document_uuid}/{version}/{safe_filename}.pdf`

Rules:

- no public bucket;
- authenticated client may read only objects whose organisation matches active membership;
- admins may read/write across client organisations;
- generated document metadata and hash are stored in `project_documents`;
- accepted document versions are never overwritten; a new version creates a new object;
- deleting historical accepted agreement evidence is prohibited by normal UI.

## 11. PDF generation

Generated PDFs are based on controlled templates and project data, not manually edited client-specific copies.

Template inputs include:

- client and organisation identity;
- project title/reference;
- service and scope;
- deliverables/exclusions;
- project value/currency;
- payment plan;
- timeline/milestones;
- legal modules;
- version and issue date;
- acceptance record where applicable.

A final **Agreement Pack** PDF can combine the commercial cover, quotation, SOW, payment schedule, service terms and applicable addenda. Stripe-produced invoice/receipt documents can be linked/stored alongside 11-11-generated contractual PDFs.

## 12. Stripe boundary

Stripe responsibilities:

- secure payment details;
- Checkout/payment collection;
- saved payment method where permitted;
- subscription billing;
- payment status/webhook events;
- Stripe invoice/receipt artifacts where used.

11-11 Tech responsibilities:

- project identity;
- contract and agreement state;
- approved payment options;
- project/invoice references;
- client balances presented in product;
- legal acknowledgement evidence;
- document vault;
- client/admin access.

Webhook processing must be idempotent. Stripe event IDs are stored and duplicate events do not create duplicate payments.

## 13. Company admin UX

Admin dashboard priorities:

1. Money requiring attention: overdue, failed, upcoming, received.
2. Agreements requiring action: draft, sent, awaiting client, accepted.
3. Commercial funnel: lead → qualified → proposal → accepted → active → complete.
4. Client/project health.

Admin client detail shows identity, projects, documents, agreement state, invoices, payments, subscriptions and outstanding balance in one coherent record.

## 14. Client UX

The client experience must feel simpler than the underlying system.

Workspace Overview should answer immediately:

- What project(s) do I have?
- What have I paid?
- What do I owe?
- What is due next?
- What needs my action?
- Where are my documents?

Project payment journey:

**Project summary → Choose approved payment option → Review agreement package → Tick required acknowledgements → Secure payment → Confirmation → Documents/Billing**

Use clear financial language: **Outstanding balance** or **Project balance**, not “credit”, unless an actual regulated credit product is introduced.

## 15. Lifecycle and status model

Project:

`draft → proposed → awaiting_acceptance → awaiting_payment → active → paused → completed | cancelled`

Document:

`draft → issued → superseded` (accepted versions remain immutable evidence)

Invoice:

`draft → open → partially_paid → paid | void | uncollectible`

Payment:

`pending → succeeded | failed | refunded | partially_refunded`

Payment plan:

`draft → offered → accepted → active → completed | cancelled | defaulted`

## 16. Emails

Transactional messages:

- enquiry received;
- project/proposal ready;
- secure workspace link;
- agreement accepted confirmation;
- payment successful;
- payment failed / action required;
- invoice issued;
- upcoming installment reminder;
- overdue notice;
- subscription confirmation/change;
- project/change-order document issued.

Emails link back to the authoritative client workspace. Sensitive commercial history should not depend solely on email attachments.

## 17. Delivery order

### Phase 1 — Foundation

- canonical docs/manual;
- commercial schema;
- RLS/admin model;
- private storage bucket and policies;
- frontend auth/session boundary.

### Phase 2 — Portal shells

- public Start / Pay / Login entry points;
- client workspace with overview, projects, documents, billing;
- company admin dashboard shell.

### Phase 3 — Contracting

- document templates/metadata;
- project document list/download;
- agreement review gate;
- versioned acceptance evidence;
- branded document generation boundary.

### Phase 4 — Payments

- Stripe Checkout Edge Function;
- webhook reconciliation;
- pay-in-full;
- deposit/installments;
- partial/extra payment policy;
- subscriptions;
- manual payment admin flow.

### Phase 5 — Communication & operations

- transactional email;
- reminders/failed payment handling;
- change orders;
- SLA/support presentation;
- reporting and audit views.

### Phase 6 — Certification

- RLS cross-tenant tests;
- webhook idempotency tests;
- agreement-version immutability tests;
- payment/balance invariant tests;
- responsive/accessibility browser tests;
- production environment checklist.

## 18. Deployment/configuration contract

Required environment/server secrets include, at minimum:

- Supabase project URL
- public Supabase anon key (browser-safe)
- Supabase service-role key (server/Edge Function only)
- Stripe secret key (server only)
- Stripe webhook signing secret (server only)
- Stripe publishable key only if a future embedded Stripe UI needs it
- Resend/email provider credentials (server only)
- public application/client-portal URL

No service-role key, Stripe secret or email-provider secret may ship in frontend JavaScript.

## 19. Definition of done

The platform is production-ready when a representative client can:

1. start from the public website;
2. submit identity/project information;
3. receive/claim secure client access;
4. open its project;
5. see price and approved payment options;
6. read/download the applicable agreement documents;
7. complete mandatory acknowledgements;
8. pay through Stripe;
9. return to an 11-11 confirmation page;
10. see paid/outstanding/next-due values correctly;
11. download invoice/receipt/agreement artifacts;
12. return later and see the same authoritative history;

and an 11-11 admin can see, reconcile and operate the same engagement without bypassing tenant security or rewriting historical agreement evidence.
