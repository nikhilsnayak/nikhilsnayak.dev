import {
  SiGithub,
  SiLinkedin,
  SiInstagram,
  SiX,
  SiGmail,
} from '@icons-pack/react-simple-icons';

export function Footer() {
  return (
    <footer className='grid place-items-center gap-4 px-2 py-4'>
      <ul className='flex items-center justify-center gap-4'>
        <li className='hover:opacity-70'>
          <a
            href='mailto:nikhilsnayak3473@gmail.com'
            className='dark:text-fluorescent'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='gmail'
          >
            <SiGmail />
          </a>
        </li>
        <li className='hover:opacity-70'>
          <a
            href='https://x.com/_nikhilsnayak_'
            className='dark:text-fluorescent'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='x.com'
          >
            <SiX />
          </a>
        </li>
        <li className='hover:opacity-70'>
          <a
            href='https://github.com/nikhilsnayak'
            className='dark:text-fluorescent'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='github'
          >
            <SiGithub />
          </a>
        </li>
        <li className='hover:opacity-70'>
          <a
            href='https://linkedin.com/in/nikhilsnayak'
            className='dark:text-fluorescent'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='linkedin'
          >
            <SiLinkedin />
          </a>
        </li>
        <li className='hover:opacity-70'>
          <a
            href='https://instagram.com/_nikhilsnayak_'
            className='dark:text-fluorescent'
            target='_blank'
            rel='noopener noreferrer'
            aria-label='instagram'
          >
            <SiInstagram />
          </a>
        </li>
      </ul>
    </footer>
  );
}
