import {
  Body,
  Button,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components';

interface BlogAnnouncementEmailProps {
  title: string;
  summary: string;
  url: string;
  recipientName: string;
}

export const BlogAnnouncementEmail = ({
  title = 'How I Built My Portfolio',
  summary = 'Sneak Peak of tech I used to build my portfolio',
  url = 'https://www.nikhilsnayak.dev/blogs/how-i-built-my-portfolio',
  recipientName = 'there',
}: BlogAnnouncementEmailProps) => (
  <Html lang='en'>
    <Head>
      <Font
        fontFamily='Poppins'
        fallbackFontFamily='Verdana'
        webFont={{
          url: 'https://fonts.gstatic.com/s/poppins/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
          format: 'woff2',
        }}
        fontWeight={400}
        fontStyle='normal'
      />
    </Head>
    <Preview>New blog post: {title}</Preview>
    <Tailwind>
      <Body className='bg-white font-sans'>
        <Container className='mx-auto py-5 px-4 max-w-xl'>
          <Heading className='text-2xl font-bold text-center text-gray-800 mb-6'>
            Hey {recipientName}, Something New Just Dropped!
          </Heading>
          <Text className='text-base text-gray-700 mb-4'>
            {
              "I just published a fresh blog post, and I've been eager to share it with you:"
            }
          </Text>
          <Heading as='h2' className='text-xl font-semibold text-blue-600 mb-2'>
            {title}
          </Heading>
          <Text className='text-base text-gray-700 mb-6'>{summary}</Text>
          <Button
            href={url}
            className='bg-blue-600 text-white py-3 px-4 rounded text-base font-medium no-underline text-center block hover:bg-blue-700 transition-colors'
          >
            Check Out the Full Post
          </Button>
          <Hr className='border-gray-300 my-6' />
          <Text className='text-sm text-gray-600 mb-4'>
            {
              "I'd love to hear your thoughts, so don't hesitate to reach out if anything stands out to you!"
            }
          </Text>
          <Text className='text-sm text-gray-500 text-center'>
            {`© ${new Date().getFullYear()} Nikhil S - Blog. Every word written with care.`}
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default BlogAnnouncementEmail;
