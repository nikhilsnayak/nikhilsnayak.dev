'use client';

import dynamic from 'next/dynamic';

export default dynamic(() => import('./todo-final'), { ssr: false });
