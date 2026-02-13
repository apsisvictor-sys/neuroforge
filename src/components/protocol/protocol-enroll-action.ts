export type EnrollmentResponse = {
  enrollment: {
    protocolId: string;
    startDate: string;
  };
};

export async function postProtocolEnrollment(
  protocolId: string,
  fetchImpl: typeof fetch = fetch
): Promise<EnrollmentResponse> {
  const response = await fetchImpl("/api/protocol/enroll", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ protocolId })
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<EnrollmentResponse>;
}

export async function runEnrollClick(input: {
  protocolId: string;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  setMessage: (value: string | null) => void;
  enrollImpl?: (protocolId: string) => Promise<EnrollmentResponse>;
}): Promise<void> {
  if (input.isSubmitting) return;
  input.setIsSubmitting(true);
  input.setMessage(null);
  try {
    const response = await (input.enrollImpl ?? postProtocolEnrollment)(input.protocolId);
    input.setMessage(`Enrolled in ${response.enrollment.protocolId}`);
  } catch (error) {
    input.setMessage((error as Error).message);
  } finally {
    input.setIsSubmitting(false);
  }
}
