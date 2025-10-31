import { ContactPayloadSchema, type ContactMessage } from '@/schemas/contact';
import { saveContactMessage, getContactMessages } from '@/lib/prisma/contact';
import { sendContactNotificationEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS configuration for Vercel deployment
 */
function getCorsHeaders(origin?: string): Record<string, string> {
  const allowedOrigin = origin || process.env.ALLOWED_ORIGIN || '*';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Max-Age': '300',
  };
}

/**
 * Create a CORS-enabled response
 */
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

/**
 * Extract origin from request headers
 */
function getOriginFromRequest(request: NextRequest): string | undefined {
  return request.headers.get('origin') || undefined;
}

/**
 * Handle CORS preflight requests
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = getOriginFromRequest(request);

  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

/**
 * Handle POST requests - Contact form submission
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  console.log('Contact submit request received');

  const origin = getOriginFromRequest(request);
  const ip =
    request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

  try {
    // Parse request body
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = ContactPayloadSchema.safeParse(body);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return corsResponse(
        400,
        {
          error: 'Validation Error',
          message: 'Invalid request body',
          details: errorDetails,
        },
        origin
      );
    }

    // Save contact message to database
    const savedMessage = await saveContactMessage(validationResult.data, ip);

    // Send email notification
    try {
      await sendContactNotificationEmail(validationResult.data);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the entire request if email fails, just log it
      // The contact message was already saved successfully
    }

    // Return success response
    return corsResponse(
      201,
      {
        message: 'Contact message received successfully',
        id: savedMessage.id,
        createdAt: savedMessage.timestamp,
      },
      origin
    );
  } catch (error) {
    console.error('Error processing contact request:', error);

    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      return corsResponse(
        400,
        {
          error: 'Bad Request',
          message: 'Invalid JSON in request body',
        },
        origin
      );
    }

    // Generic error response
    return corsResponse(
      500,
      {
        error: 'Internal Server Error',
        message: 'An error occurred processing your request',
      },
      origin
    );
  }
}

/**
 * Handle GET requests - Retrieve contact messages
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log('Contact retrieve request received');

  const origin = getOriginFromRequest(request);
  const { searchParams } = new URL(request.url);

  try {
    // Parse query parameters
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const offset = searchParams.get('offset')
      ? parseInt(searchParams.get('offset')!, 10)
      : undefined;

    // Validate query parameters
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return corsResponse(
        400,
        {
          error: 'Bad Request',
          message: 'Limit must be a number between 1 and 100',
        },
        origin
      );
    }

    if (offset && (isNaN(offset) || offset < 0)) {
      return corsResponse(
        400,
        {
          error: 'Bad Request',
          message: 'Offset must be a non-negative number',
        },
        origin
      );
    }

    // Retrieve contact messages
    const messages = await getContactMessages(limit, offset);

    // Return success response
    return corsResponse(
      200,
      {
        message: 'Contact messages retrieved successfully',
        data: messages,
        count: messages.length,
      },
      origin
    );
  } catch (error) {
    console.error('Error retrieving contact messages:', error);

    // Generic error response
    return corsResponse(
      500,
      {
        error: 'Internal Server Error',
        message: 'An error occurred retrieving contact messages',
      },
      origin
    );
  }
}
