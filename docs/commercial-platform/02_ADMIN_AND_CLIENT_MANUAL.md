# 11-11 Tech Commercial Platform — Admin & Client Manual

This is the day-to-day operating guide. For architecture, legal/payment invariants and database rules, use `00_MASTER_PLAN_AND_OPERATIONS.md`. For activation, use `01_DEPLOYMENT_AND_ACTIVATION_RUNBOOK.md`.

## A. Public client entry points

### Start a Project

A new client starts from the public website's existing **Start a Project** journey. The guided form captures contact identity, organisation, service/capability, requirements, budget, timeline, procurement/legal needs, preferred contact and attribution.

A successful lead creates the acquisition record and, through the commercial provisioning trigger, a prospect organisation, draft project shell, project contact and client invitation record.

### Pay an Invoice

An existing client chooses **Pay an invoice**, enters the project/invoice reference and billing email, then continues into secure email authentication. The public page never reveals invoice information from the reference alone.

### Client Login

A returning client chooses **Client login**, receives a Supabase magic link and enters their private workspace.

## B. Company Admin Workspace

Route: `/admin`

Only profiles explicitly listed as active `commercial_admins` may enter.

### Overview

Use this for daily commercial operations:

- confirmed money received;
- outstanding invoices;
- overdue count;
- active projects;
- new enquiries;
- pipeline stage counts;
- recent transactions.

### Leads

Review structured public enquiries. The lead remains the acquisition record; client-facing access is through the commercial organisation/project model, not direct lead-table access.

### Clients

Review client organisations and billing identities.

### Projects

Open a project to operate the commercial engagement.

The project console contains:

1. **Summary** — contract value, amount paid, outstanding balance, lifecycle and readiness.
2. **Payments** — publish one or more approved payment options.
3. **Documents** — create and issue controlled branded PDFs and the Agreement Pack.
4. **Record payment** — register approved offline/external payments.

### Publishing payment options

Common examples:

- **Pay in full** — total project amount.
- **50 / 50** — first 50% at acceptance, remaining 50% on next scheduled date.
- **25% × 4** — four finite project installments.
- **10% deposit + monthly** — finite installment plan; it remains a project payment plan, not a subscription.
- **Monthly service** — true recurring service such as maintenance/managed operations; this becomes a Stripe subscription.

If additional balance payments are permitted, set the minimum (for example USD 100). Do not describe these as lending/credit unless 11-11 Tech deliberately introduces a regulated credit product.

### Issuing documents

Choose the document type, enter its reference/title, mark whether it is required before first payment, and paste only approved wording.

The renderer:

- applies 11-11 Tech branding/logo;
- creates a PDF;
- stores it in the private client vault;
- computes its SHA-256 hash;
- records version/issue metadata;
- supersedes prior current versions while preserving historical versions.

Use **Generate Agreement Pack PDF** after the contractual set is ready. It combines the currently issued quotation/SOW/service/payment/privacy and applicable NDA/SLA/DPA/security/AI addenda into one convenient PDF without replacing the individual records.

### Recording offline payments

Use only after money has actually been received outside Stripe.

Required operating evidence:

- amount/currency;
- approved method;
- external/bank/payment reference where available;
- invoice assignment where applicable.

Never mark a promised payment as received.

## C. Client Workspace

Route: `/client`

The client sees only organisations/projects allowed by their active membership.

### Overview

Answers the primary questions immediately:

- What is the project?
- What is its value?
- How much has been paid?
- What is outstanding?
- What is due next?
- What action is required?

### Documents

Shows all issued project documents available to that client, including contractual documents, Agreement Pack, invoices and receipts.

Accepted documents display their accepted state. Superseded historical records remain part of the commercial history.

### Billing

Shows:

- paid total;
- outstanding total;
- selected payment plan;
- installment schedule and statuses;
- invoices;
- payments/receipt references.

### Agreement & Pay

The required sequence is fixed:

1. choose one of the payment options published by 11-11 Tech;
2. open every required document;
3. tick each required acknowledgement;
4. if the plan has future automatic charges, give separate payment authorization;
5. continue to Stripe-hosted payment.

If required documents are missing, payment remains locked.

## D. What happens after Stripe payment

Stripe returns the client to the 11-11 Tech payment confirmation surface, while the webhook independently performs the authoritative reconciliation.

After confirmed payment the platform:

- writes/updates invoice state;
- writes the payment and receipt reference;
- updates installment/payment-plan state;
- activates the project when appropriate;
- records audit evidence;
- generates branded invoice and receipt PDF records;
- places PDFs in the private document vault;
- sends the configured payment confirmation email;
- exposes the updated paid/outstanding values in the workspace.

The browser redirect alone never marks money as received; only server-side reconciliation does.

## E. Document and contract rules for staff

- Never edit an accepted PDF in place. Create a new version.
- Never delete historical accepted contract evidence from normal operations.
- If scope changes, issue a change order; do not silently alter the old SOW.
- If price changes, make the commercial change explicit and update the proper payment/invoice records.
- Legal templates are operational scaffolding until approved wording is supplied and reviewed by qualified counsel.
- Late fees, interest, cancellation, governing law, liability, indemnity, tax and privacy language must comply with the applicable engagement jurisdiction.

## F. Payment rules for staff

- First payment follows acceptance of all required project terms.
- Saved card does not equal unlimited charging permission.
- Finite project installments require their specific scheduled-charge authorization when configured.
- Recurring services require recurring authorization and use Stripe subscriptions.
- Manual/offline money must be evidenced and recorded by an authorised operator.
- Do not use an unrelated Stripe account.

## G. Typical Health Times example

1. Health Times starts from the public site or receives a project link.
2. 11-11 Tech formalises the project in Admin.
3. Admin publishes quotation, SOW, payment terms, service terms, privacy and any applicable NDA/SLA/DPA.
4. Admin publishes approved payment choices, for example full payment, 50/50 and four installments.
5. Health Times signs in by email.
6. Health Times chooses a payment option.
7. It opens/downloads every required document and checks the acknowledgements.
8. It separately approves scheduled charges if applicable.
9. Stripe securely collects the card/payment.
10. Stripe webhook confirms the transaction to Supabase.
11. The client portal updates paid/owing/next-due values.
12. Invoice and receipt PDFs appear in Documents.
13. The client receives payment confirmation email and can later return through Client Login.
14. 11-11 Tech sees the same authoritative engagement from Admin.

## H. Support / reconciliation protocol

If a client says “I paid but it is not showing”:

1. do not manually invent a successful payment;
2. check Stripe event/payment reference;
3. check `stripe_events` processing status;
4. check `payments` and invoice state;
5. replay/fix reconciliation only after identifying the discrepancy;
6. preserve all audit evidence;
7. use an approved manual payment record only for genuinely external payment evidence.
