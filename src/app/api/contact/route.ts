import { ContactPayloadSchema } from '@/lib/schemas/contact';
import { sendContactNotificationEmail } from '@/lib/utils/email';
import { NextRequest, NextResponse } from 'next/server';

function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigin = origin || process.env.ALLOWED_ORIGIN || '*';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '300',
  };
}

function corsResponse(
  statusCode: number,
  body: Record<string, unknown>,
  origin?: string
): NextResponse {
  return NextResponse.json(body, {
    status: statusCode,
    headers: {
      ...getCorsHeaders(origin),
      'Content-Type': 'application/json',
    },
  });
}

function getOriginFromRequest(request: NextRequest): string | undefined {
  return request.headers.get('origin') || undefined;
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = getOriginFromRequest(request);
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = getOriginFromRequest(request);

  try {
    const body = await request.json();

    const validationResult = ContactPayloadSchema.safeParse(body);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return corsResponse(
        400,
        { error: 'Validation Error', message: 'Invalid request body', details: errorDetails },
        origin
      );
    }

    await sendContactNotificationEmail(validationResult.data);

    return corsResponse(201, { message: 'Contact message received successfully' }, origin);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return corsResponse(
        400,
        { error: 'Bad Request', message: 'Invalid JSON in request body' },
        origin
      );
    }

    return corsResponse(
      500,
      { error: 'Internal Server Error', message: 'An error occurred processing your request' },
      origin
    );
  }
}
