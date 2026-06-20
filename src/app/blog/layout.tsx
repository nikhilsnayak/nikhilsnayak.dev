'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';
import { getBreadCrumbItems } from '~/lib/utils';

export default function BlogsLayout({ children }: LayoutProps<'/blog'>) {
  const path = usePathname();
  const items = getBreadCrumbItems(path);

  if (items.length <= 1) {
    return <>{children}</>;
  }

  return (
    <div className='space-y-4'>
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => (
            <Fragment key={item.label}>
              <BreadcrumbItem>
                {item.pathname ? (
                  <BreadcrumbLink
                    className='max-w-20 truncate md:max-w-none'
                    render={
                      <Link
                        href={{
                          pathname: item.pathname,
                        }}
                      >
                        {item.label}
                      </Link>
                    }
                  />
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
      {children}
    </div>
  );
}
