// ABOUTME: RSVP form section using Formspree for submissions
// ABOUTME: Collects name, email, guest count, and optional message with validation

'use client';

import React, { useState } from 'react';
import { useForm } from '@formspree/react';
import { motion } from 'motion/react';
import { eventConfig } from '@/data/graduation-event';
import { Section } from './ui/Section';
import { Button } from './ui/Button';
import { generateGoogleCalendarLink, getICSDownloadLink } from '@/lib/calendar';

interface FormData {
  name: string;
  email: string;
  guests: string;
  message: string;
}

export function RSVPSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    guests: '1',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [state, handleSubmit] = useForm(eventConfig.rsvp.formspreeId);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Name validation (min 2 chars)
    if (formData.name.trim().length < 2) {
      newErrors.name = 'Vui lòng nhập tên (ít nhất 2 ký tự)';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    // Guests validation (0-10)
    const guestsNum = parseInt(formData.guests, 10);
    if (isNaN(guestsNum) || guestsNum < 0 || guestsNum > 10) {
      newErrors.guests = 'Số lượng khách phải từ 0 đến 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await handleSubmit(e);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Success state with calendar buttons
  if (state.succeeded) {
    const googleCalendarUrl = generateGoogleCalendarLink(eventConfig);
    const icsDownloadUrl = getICSDownloadLink(eventConfig);

    return (
      <Section id="rsvp" title="Cảm ơn bạn!">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center space-y-6 bg-graduation-card rounded-3xl p-8 shadow-lg"
        >
          <div className="text-6xl">🎉</div>
          <h3 className="text-2xl font-display text-graduation-primary">
            Đã nhận được xác nhận!
          </h3>
          <p className="text-graduation-text/80 font-body">
            Rất mong được gặp bạn tại buổi lễ tốt nghiệp!
          </p>

          <div className="pt-6 space-y-4">
            <p className="font-medium text-graduation-text">
              Thêm sự kiện vào lịch của bạn:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" href={googleCalendarUrl}>
                📅 Google Calendar
              </Button>
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = icsDownloadUrl;
                  link.download = 'khanh-graduation.ics';
                  link.click();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-graduation-accent text-graduation-text hover:bg-graduation-accent/80 focus:ring-graduation-accent shadow-sm"
              >
                📥 Tải file ICS
              </button>
            </div>
          </div>
        </motion.div>
      </Section>
    );
  }

  return (
    <Section id="rsvp" title="Xác nhận tham dự">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-graduation-card rounded-3xl p-8 shadow-lg"
        >
          <p className="text-center text-graduation-text/80 font-body mb-8">
            Vui lòng xác nhận tham dự để chúng tôi có thể chuẩn bị chu đáo nhất!
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-graduation-text mb-2"
              >
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-graduation-primary transition-colors ${
                  errors.name
                    ? 'border-red-500 bg-red-50'
                    : 'border-graduation-muted bg-white'
                }`}
                placeholder="Nguyễn Văn A"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.name}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-graduation-text mb-2"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-graduation-primary transition-colors ${
                  errors.email
                    ? 'border-red-500 bg-red-50'
                    : 'border-graduation-muted bg-white'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Guests Field */}
            <div>
              <label
                htmlFor="guests"
                className="block text-sm font-medium text-graduation-text mb-2"
              >
                Số người đi cùng (bao gồm cả bạn)
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="0"
                max="10"
                className={`w-full px-4 py-3 rounded-2xl border-2 focus:outline-none focus:ring-2 focus:ring-graduation-primary transition-colors ${
                  errors.guests
                    ? 'border-red-500 bg-red-50'
                    : 'border-graduation-muted bg-white'
                }`}
              />
              {errors.guests && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.guests}
                </motion.p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-graduation-text mb-2"
              >
                Lời nhắn (không bắt buộc)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-graduation-muted bg-white focus:outline-none focus:ring-2 focus:ring-graduation-primary transition-colors resize-none"
                placeholder="Gửi lời chúc hoặc câu hỏi..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={state.submitting}
                className="w-full"
              >
                {state.submitting ? 'Đang gửi...' : 'Xác nhận tham dự'}
              </Button>
            </div>

            {/* Formspree Error */}
            {state.errors && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl"
              >
                <p className="text-red-600 text-sm">
                  Đã có lỗi xảy ra. Vui lòng thử lại sau.
                </p>
              </motion.div>
            )}
          </form>

          {eventConfig.rsvp.deadlineISO && (
            <p className="text-center text-graduation-text/60 text-sm mt-6">
              Vui lòng xác nhận trước ngày{' '}
              {new Date(eventConfig.rsvp.deadlineISO).toLocaleDateString('vi-VN')}
            </p>
          )}
        </motion.div>
      </div>
    </Section>
  );
}
