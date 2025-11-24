// ABOUTME: Timeline component showing the flow of the graduation day
// ABOUTME: Displays key moments and activities in chronological order

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Section } from './ui/Section';

interface TimelineItem {
  time: string;
  title: string;
  note: string;
}

export function MiniSchedule() {
  const scheduleItems: TimelineItem[] = [
    {
      time: '09:30',
      title: 'Tập trung',
      note: 'Sinh viên và gia đình có mặt tại hội trường',
    },
    {
      time: '10:00',
      title: 'Lễ trao bằng',
      note: 'Chương trình chính thức bắt đầu',
    },
    {
      time: '11:30',
      title: 'Chụp ảnh kỷ niệm',
      note: 'Thời gian chụp ảnh cùng bạn bè và thầy cô',
    },
    {
      time: '12:30',
      title: 'Kết thúc',
      note: 'Kết thúc buổi lễ và gặp gỡ',
    },
  ];

  return (
    <Section title="Chương trình">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-graduation-primary/30 hidden md:block" />

          {/* Timeline Items */}
          <div className="space-y-8">
            {scheduleItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 items-start"
              >
                {/* Time Badge */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-graduation-primary text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {item.time}
                </div>

                {/* Content */}
                <div className="flex-1 bg-graduation-card rounded-2xl p-5 shadow-md border-2 border-graduation-muted">
                  <h3 className="font-display text-xl text-graduation-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-graduation-text/80 font-body">
                    {item.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
