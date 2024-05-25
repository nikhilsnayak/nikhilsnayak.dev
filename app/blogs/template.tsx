'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Fragment } from 'react';
import {
  BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getBreadCrumbItems } from '@/lib/utils';

interface BreadcrumbResponsiveProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumb({ items }: BreadcrumbResponsiveProps) {
  return (
    <BreadcrumbRoot>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink
                  asChild
                  className='max-w-20 truncate md:max-w-none'
                >
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className='max-w-20 truncate md:max-w-none'>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index !== items.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
}

export default function BlogsTemplate({
  children,
}: Readonly<React.PropsWithChildren>) {
  const path = usePathname();

  const items = getBreadCrumbItems(path);

  return (
    <div className='space-y-4'>
      {items.length > 1 ? <Breadcrumb items={items} /> : null}
      {children}
    </div>
  );
}
