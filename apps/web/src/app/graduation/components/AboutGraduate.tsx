// ABOUTME: About section providing personal context and gratitude
// ABOUTME: Displays graduate bio, degree info, and optional photo

'use client';

import React from 'react';
import { motion } from 'motion/react';
import { eventConfig } from '@/data/graduation-event';
import { Section } from './ui/Section';
import { PolaroidCard } from './ui/PolaroidCard';

export function AboutGraduate() {
  const { graduate } = eventConfig;

  return (
    <Section title="Về buổi lễ">
      <div className="flex flex-col md:flex-row gap-8 items-center max-w-4xl mx-auto">
        {/* Optional Photo */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/3"
        >
          <PolaroidCard variant="standard" caption="Memories">
            <div className="aspect-square bg-gradient-to-br from-graduation-accent/30 to-graduation-primary/20 rounded-2xl flex items-center justify-center">
              <p className="text-graduation-text/60 text-sm italic text-center p-4">
                Thêm ảnh kỷ niệm
              </p>
            </div>
          </PolaroidCard>
        </motion.div>

        {/* Bio Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-2/3 space-y-4 text-graduation-text/90 font-body"
        >
          <p className="text-lg leading-relaxed">
            Sau 4 năm học tập và trưởng thành tại <strong>{graduate.school}</strong>,
            tôi vô cùng vinh dự được chia sẻ niềm vui này cùng gia đình và bạn bè.
          </p>
          <p className="text-lg leading-relaxed">
            Chương trình <strong>{graduate.degree}</strong> đã trang bị cho tôi
            những kiến thức và kỹ năng quý báu để bước vào hành trình mới.
          </p>
          <p className="text-lg leading-relaxed">
            Sự hiện diện của bạn sẽ làm cho ngày này trở nên đặc biệt hơn.
            Rất mong được gặp bạn tại buổi lễ! 🎓✨
          </p>
          <p className="text-base italic text-graduation-primary font-medium mt-6">
            Cảm ơn bạn đã luôn ở bên và ủng hộ tôi!
          </p>
        </motion.div>
      </div>
    </Section>
  );
}
