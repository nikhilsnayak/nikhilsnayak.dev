'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { getBreadCrumbItems } from '~/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export default function BlogsTemplate({
  children,
}: Readonly<React.PropsWithChildren>) {
  const path = usePathname();

  const items = getBreadCrumbItems(path);

  return (
    <div className='space-y-4'>
      {items.length > 1 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {items.map((item, index) => (
              <Fragment key={item.label}>
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
        </Breadcrumb>
      ) : null}
      {children}
    </div>
  );
}
