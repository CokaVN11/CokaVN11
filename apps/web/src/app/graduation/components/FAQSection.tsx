// ABOUTME: FAQ section with accordion for common questions
// ABOUTME: Helps reduce confusion and answers common attendee questions

'use client';

import React from 'react';
import { Section } from './ui/Section';
import { Accordion } from './ui/Accordion';

export function FAQSection() {
  const faqs = [
    {
      q: 'Tôi có cần đăng ký trước không?',
      a: 'Có, vui lòng điền form RSVP phía trên để chúng tôi có thể chuẩn bị tốt nhất. Thời hạn RSVP là trước ngày 30/11/2025.',
    },
    {
      q: 'Tôi có thể mang theo người đi cùng không?',
      a: 'Có, bạn có thể mang theo người thân hoặc bạn bè. Vui lòng ghi rõ số lượng người đi cùng trong form RSVP.',
    },
    {
      q: 'Trang phục nên mặc như thế nào?',
      a: 'Trang phục lịch sự, thoải mái. Bạn có thể mặc áo sơ mi/váy hoặc trang phục smart casual.',
    },
    {
      q: 'Có chỗ đậu xe không?',
      a: 'Chỗ đậu xe trong trường có hạn. Khuyến khích bạn gửi xe bên ngoài hoặc đi Grab/taxi cho tiện.',
    },
    {
      q: 'Buổi lễ kéo dài bao lâu?',
      a: 'Buổi lễ chính thức từ 10:00 - 12:30. Sau đó sẽ có thời gian chụp ảnh và gặp gỡ thoải mái.',
    },
  ];

  return (
    <Section title="Câu hỏi thường gặp">
      <div className="max-w-3xl mx-auto">
        <Accordion items={faqs} />
      </div>
    </Section>
  );
}
