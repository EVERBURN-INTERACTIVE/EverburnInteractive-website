import { CONTACT_CONTENT } from '@/lib/content';
import {
  formatInquiryPlainText,
  type BuildInquiry,
} from '@/lib/buildInquiry';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/types';

export type SubmitInquiryResult =
  | { ok: true; channel: 'supabase' }
  | { ok: true; channel: 'mailto' }
  | { ok: false; message: string };

function inquiryPayload(inquiry: BuildInquiry) {
  const { honeypot: _honeypot, ...safe } = inquiry;
  return {
    ...safe,
    source: 'build-landing',
    submittedAt: new Date().toISOString(),
  };
}

function openMailto(inquiry: BuildInquiry): boolean {
  const body = formatInquiryPlainText(inquiry);
  const subject = `Website brief from ${inquiry.contactName.trim()}`;
  const href = `mailto:${CONTACT_CONTENT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (href.length > 1800) {
    return false;
  }

  window.location.href = href;
  return true;
}

async function copyBrief(inquiry: BuildInquiry): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(formatInquiryPlainText(inquiry));
    return true;
  } catch {
    return false;
  }
}

export async function submitBuildInquiry(inquiry: BuildInquiry): Promise<SubmitInquiryResult> {
  if (inquiry.honeypot.trim()) {
    return { ok: true, channel: 'supabase' };
  }

  const payload = inquiryPayload(inquiry);

  if (isSupabaseConfigured) {
    const client = getSupabaseBrowserClient();
    if (client) {
      const { error } = await client.from('website_inquiries').insert({
        payload: payload as Json,
        looking_for: inquiry.lookingFor || null,
        budget_range: inquiry.budget || null,
        contact_email: inquiry.contactEmail.trim(),
        contact_name: inquiry.contactName.trim(),
        contact_phone: inquiry.contactPhone.trim(),
      });

      if (!error) {
        return { ok: true, channel: 'supabase' };
      }

      console.error('[submitBuildInquiry] Supabase insert failed:', error.message);
    }
  }

  if (openMailto(inquiry)) {
    return { ok: true, channel: 'mailto' };
  }

  const copied = await copyBrief(inquiry);
  if (copied) {
    return {
      ok: false,
      message: `The brief was copied to your clipboard. Email it to ${CONTACT_CONTENT.email} if the send did not go through.`,
    };
  }

  return {
    ok: false,
    message: `We could not send the brief automatically. Email ${CONTACT_CONTENT.email} and we will pick it up from there.`,
  };
}
