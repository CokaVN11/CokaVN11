/**
ABOUTME: Database operations for contact messages
Handles saving and retrieving contact messages using Prisma
 */

import { prisma } from './index';
import type { ContactPayload } from '@/schemas/contact';

/**
 * Save a contact message to the database
 * @param data - The contact form data
 * @param ip - The IP address of the sender (optional)
 * @returns The saved contact message with database-generated fields
 */
export async function saveContactMessage(
  data: ContactPayload,
  ip?: string
) {
  try {
    const message = await prisma.contactMessage.create({
      data: {
        ...data,
        ip,
      },
    });

    return {
      id: message.id,
      timestamp: message.timestamp.toISOString(),
      ...data,
    };
  } catch (error) {
    console.error('Error saving contact message:', error);
    throw new Error('Failed to save contact message');
  }
}

/**
 * Get all contact messages from the database
 * @param limit - Maximum number of messages to retrieve (optional)
 * @param offset - Number of messages to skip (optional)
 * @returns Array of contact messages
 */
export async function getContactMessages(limit?: number, offset?: number) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return messages.map((message) => ({
      id: message.id,
      timestamp: message.timestamp.toISOString(),
      name: message.name,
      email: message.email,
      message: message.message,
      ip: message.ip,
    }));
  } catch (error) {
    console.error('Error retrieving contact messages:', error);
    throw new Error('Failed to retrieve contact messages');
  }
}

/**
 * Get a specific contact message by ID
 * @param id - The message ID
 * @returns The contact message or null if not found
 */
export async function getContactMessageById(id: string) {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return null;
    }

    return {
      id: message.id,
      timestamp: message.timestamp.toISOString(),
      name: message.name,
      email: message.email,
      message: message.message,
      ip: message.ip,
    };
  } catch (error) {
    console.error('Error retrieving contact message:', error);
    throw new Error('Failed to retrieve contact message');
  }
}