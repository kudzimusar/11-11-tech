export const commercialStatusLabels: Record<string, string> = {
  draft: 'Draft', proposed: 'Proposed', awaiting_acceptance: 'Awaiting acceptance', awaiting_payment: 'Awaiting payment', active: 'Active', paused: 'Paused', completed: 'Completed', cancelled: 'Cancelled',
  issued: 'Issued', superseded: 'Superseded', open: 'Open', partially_paid: 'Partially paid', paid: 'Paid', void: 'Void', uncollectible: 'Uncollectible', pending: 'Pending', succeeded: 'Succeeded', failed: 'Failed', refunded: 'Refunded', partially_refunded: 'Partially refunded', offered: 'Offered', accepted: 'Accepted', defaulted: 'Defaulted',
}

export const paymentJourney = ['Project summary','Choose approved payment option','Review agreement package','Acknowledge required documents','Authorize scheduled/recurring charges if applicable','Review amount and schedule','Secure Stripe payment','Return and refresh authoritative state'] as const
