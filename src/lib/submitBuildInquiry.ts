import { BUILD_INQUIRY_CONTACT } from '@/lib/content';
import {
  formatInquiryCompact,
  formatInquiryPlainText,
  type BuildInquiry,
} from '@/lib/buildInquiry';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/types';

export type SubmitChannel = 'mailto' | 'whatsapp';

export type SubmitInquiryResult =
  | { ok: true; channel: SubmitChannel }
  | { ok: false; message: string };

const MAX_HREF_LENGTH = 1800;

function inquiryPayload(inquiry: BuildInquiry) {
  const { honeypot: _honeypot, ...safe } = inquiry;
  return {
    ...safe,
    source: 'build-landing',
    submittedAt: new Date().toISOString(),
  };
}

export function normalizeWhatsAppDigits(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

function buildWhatsAppDigits(): string {
  return normalizeWhatsAppDigits(BUILD_INQUIRY_CONTACT.whatsappDigits);
}

function openHref(href: string): boolean {
  if (href.length > MAX_HREF_LENGTH) {
    return false;
  }

  const opened = window.open(href, '_blank', 'noopener,noreferrer');
  if (!opened) {
    window.location.href = href;
  }
  return true;
}

function mailtoHref(inquiry: BuildInquiry, body: string): string {
  const subject = `Website brief from ${inquiry.contactName.trim()}`;
  return `mailto:${BUILD_INQUIRY_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function whatsappHref(digits: string, body: string): string {
  return `https://wa.me/${digits}?text=${encodeURIComponent(body)}`;
}

function openMailto(inquiry: BuildInquiry): boolean {
  return openHref(mailtoHref(inquiry, formatInquiryPlainText(inquiry)))
    || openHref(mailtoHref(inquiry, formatInquiryCompact(inquiry)));
}

function openWhatsApp(inquiry: BuildInquiry): boolean {
  const digits = buildWhatsAppDigits();
  if (digits.length < 11) {
    return false;
  }

  return openHref(whatsappHref(digits, formatInquiryPlainText(inquiry)))
    || openHref(whatsappHref(digits, formatInquiryCompact(inquiry)));
}

async function copyBrief(inquiry: BuildInquiry): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatInquiryPlainText(inquiry));
    return true;
  } catch {
    return false;
  }
}

async function tryInsertSupabase(inquiry: BuildInquiry): Promise<void> {
  if (!isSupabaseConfigured) {
    return;
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return;
  }

  const { error } = await client.from('website_inquiries').insert({
    payload: inquiryPayload(inquiry) as Json,
    looking_for: inquiry.lookingFor || null,
    budget_range: inquiry.budget || null,
    contact_email: inquiry.contactEmail.trim(),
    contact_name: inquiry.contactName.trim(),
    contact_phone: inquiry.contactPhone.trim(),
  });

  if (error) {
    console.error('[submitBuildInquiry] Supabase insert failed:', error.message);
  }
}

export async function submitBuildInquiry(
  inquiry: BuildInquiry,
  channel: SubmitChannel,
): Promise<SubmitInquiryResult> {
  if (inquiry.honeypot.trim()) {
    return { ok: true, channel };
  }

  await tryInsertSupabase(inquiry);

  const opened = channel === 'mailto' ? openMailto(inquiry) : openWhatsApp(inquiry);
  if (opened) {
    return { ok: true, channel };
  }

  const copied = await copyBrief(inquiry);
  if (channel === 'whatsapp' && buildWhatsAppDigits().length < 11) {
    return {
      ok: false,
      message: copied
        ? 'The brief was copied to your clipboard. WhatsApp send is not configured yet, so paste it into WhatsApp or use Email.'
        : 'WhatsApp send is not configured yet. Use Email, or copy the brief and send it on WhatsApp.',
    };
  }

  if (copied) {
    return {
      ok: false,
      message:
        channel === 'whatsapp'
          ? 'The brief was copied to your clipboard. Paste it into WhatsApp if the chat did not open.'
          : `The brief was copied to your clipboard. Email it to ${BUILD_INQUIRY_CONTACT.email} if the send did not go through.`,
    };
  }

  return {
    ok: false,
    message:
      channel === 'whatsapp'
        ? 'We could not open WhatsApp automatically. Copy the brief and send it on WhatsApp, or use Email.'
        : `We could not open email automatically. Write to ${BUILD_INQUIRY_CONTACT.email} and we will pick it up from there.`,
  };
}
