import { put } from '@vercel/blob';
import { config } from 'dotenv';
import OpenAI from 'openai';

import { getBlogPost } from '~/lib/utils/server';

config({
  path: '.env.local',
});

const slug = process.argv.at(2);

if (!slug) process.exit(1);

const post = getBlogPost(slug);

const openai = new OpenAI();

const speechFile = `${slug}.mp3`;

const truncatedContent = await openai.chat.completions
  .create({
    model: 'gpt-4o-mini-2024-07-18',
    messages: [
      {
        role: 'system',
        content: `
            You are an expert content editor for audio presentations. Please perform the following tasks on the provided content:
            1. Remove all code blocks, technical jargon, and inline code.
            2. Remove any URLs, links, images, or references to websites.
            3. Rewrite the content to be clear, engaging, and easy to understand.
            4. Ensure that the grammar is flawless and the content flows naturally for a spoken format.
            5. Add appropriate emotional cues and tones to make the content pleasant and engaging for listeners.
            6. Important Note: The generated Content can have at most 4096 characters

            Content: ${post.content}
            `,
      },
    ],
  })
  .then((res) => res.choices[0].message.content);

if (!truncatedContent) process.exit(1);

const mp3 = await openai.audio.speech.create({
  model: 'tts-1-hd',
  voice: 'alloy',
  input: truncatedContent,
});

console.log(speechFile);
const buffer = Buffer.from(await mp3.arrayBuffer());
const blob = await put(speechFile, buffer, {
  multipart: true,
  access: 'public',
  addRandomSuffix: false,
});

console.log({ blob });
