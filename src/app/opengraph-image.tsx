import { createSocialImage } from '~/lib/social-image';

export const alt = 'Nikhil S. Software engineer building products and systems with TypeScript.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return createSocialImage({
    title: 'Nikhil S',
    description: 'Software engineer building products and systems with TypeScript.',
  });
}
