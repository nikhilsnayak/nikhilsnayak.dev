'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getBreadCrumbItems } from '@/lib/utils';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbRoot,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
