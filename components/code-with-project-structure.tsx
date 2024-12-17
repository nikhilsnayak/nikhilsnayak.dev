'use client';

import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';
import { ChevronDown, ChevronRight, FileIcon, FolderIcon } from 'lucide-react';

import { cn } from '~/lib/utils';

import { Button } from './ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './ui/resizable';
import { ScrollArea, ScrollBar } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface File {
  name: string;
  type: 'file';
}

interface Folder {
  name: string;
  type: 'folder';
  children: Array<File | Folder>;
}

type ProjectStructure = Array<File | Folder>;

const CodeWithProjectStructureContext = createContext<{
  selectedFilePath: string;
  setSelectedFilePath: Dispatch<SetStateAction<string>>;
} | null>(null);

interface CodeWithProjectStructureProps extends PropsWithChildren {
  projectName: string;
  projectStructure: ProjectStructure;
  defaultSelectedFilePath?: string;
}

function useCodeWithProjectStructure() {
  const context = use(CodeWithProjectStructureContext);

  if (context === null) {
    throw new Error(
      'useCodeWithProjectStructure can only be used inside CodeWithProjectStructureContext provider'
    );
  }

  return context;
}

export function CodeWithProjectStructure({
  children,
  projectName,
  defaultSelectedFilePath,
  projectStructure,
}: CodeWithProjectStructureProps) {
  const fileInfo = extractFileInfo(projectStructure);

  const [selectedFilePath, setSelectedFilePath] = useState(
    defaultSelectedFilePath ?? fileInfo[0].path
  );

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const selectedTab = tabRefs.current.get(selectedFilePath);
    if (selectedTab) {
      selectedTab.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  }, [selectedFilePath]);

  return (
    <CodeWithProjectStructureContext
      value={{
        selectedFilePath,
        setSelectedFilePath,
      }}
    >
      <section className='w-full overflow-hidden rounded-lg border shadow-lg'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel
            defaultSize={20}
            minSize={20}
            className='hidden border-r md:block'
          >
            <aside>
              <h3 className='overflow-hidden text-ellipsis whitespace-nowrap border-b border-border p-4 text-lg font-semibold'>
                {projectName}
              </h3>
              <ScrollArea className='h-[calc(100vh-10rem)]'>
                <div className='p-2'>
                  {projectStructure.map((item) => (
                    <FileSystemNode item={item} level={0} key={item.name} />
                  ))}
                </div>
              </ScrollArea>
            </aside>
          </ResizablePanel>
          <ResizableHandle withHandle className='hidden md:flex' />
          <ResizablePanel>
            <Tabs
              value={selectedFilePath}
              onValueChange={setSelectedFilePath}
              className='w-full'
            >
              <ScrollArea className='w-full border-b'>
                <TabsList className='w-full justify-start rounded-none'>
                  {fileInfo.map((file) => (
                    <TabsTrigger
                      key={file.path}
                      value={file.path}
                      ref={(el: HTMLButtonElement) => {
                        tabRefs.current.set(file.path, el);
                        return () => {
                          tabRefs.current.delete(file.path);
                        };
                      }}
                    >
                      {file.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <ScrollBar orientation='horizontal' />
              </ScrollArea>
              <div className='p-4'>{children}</div>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </section>
    </CodeWithProjectStructureContext>
  );
}

interface FileProps extends Omit<ComponentProps<typeof TabsContent>, 'value'> {
  filePath: string;
}

export function File({ filePath, children, ...rest }: FileProps) {
  return (
    <TabsContent value={filePath} {...rest}>
      {children}
    </TabsContent>
  );
}

function FileSystemNode({
  item,
  level,
  path = '',
}: {
  item: File | Folder;
  level: number;
  path?: string;
}) {
  const { selectedFilePath, setSelectedFilePath } =
    useCodeWithProjectStructure();
  const [isOpen, setIsOpen] = useState(false);

  const currentPath = [...path.split('/').filter(Boolean), item.name].join('/');

  useEffect(() => {
    if (item.type === 'folder') {
      const shouldBeOpen = selectedFilePath.startsWith(currentPath);
      setIsOpen(shouldBeOpen);
    }
  }, [selectedFilePath, item.type, currentPath]);

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      setSelectedFilePath(currentPath);
    }
  };

  const indent = level * 16;

  return (
    <div>
      <Button
        variant='ghost'
        className={cn(
          'h-auto w-full justify-start px-2 py-1 text-sm',
          item.type === 'file' &&
            selectedFilePath === currentPath &&
            'bg-gray-200 dark:bg-gray-700'
        )}
        onClick={handleClick}
      >
        <span
          style={{ paddingLeft: `${indent}px` }}
          className='flex items-center'
        >
          {item.type === 'folder' &&
            (isOpen ? (
              <ChevronDown className='mr-2' size={16} />
            ) : (
              <ChevronRight className='mr-2' size={16} />
            ))}
          {item.type === 'folder' ? (
            <FolderIcon className='mr-2' size={16} />
          ) : (
            <FileIcon className='mr-2' size={16} />
          )}
          {item.name}
        </span>
      </Button>
      {item.type === 'folder' && isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <FileSystemNode
              key={child.name}
              item={child}
              level={level + 1}
              path={currentPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function extractFileInfo(
  structure: ProjectStructure,
  parentPath: string[] = []
): Array<{ name: string; path: string }> {
  const fileInfo: Array<{ name: string; path: string }> = [];

  function traverse(item: File | Folder, itemPath: string[]) {
    if (item.type === 'file') {
      fileInfo.push({ name: item.name, path: itemPath.join('/') });
    } else {
      item.children.forEach((child) =>
        traverse(child, [...itemPath, child.name])
      );
    }
  }

  structure.forEach((item) => traverse(item, [...parentPath, item.name]));

  return fileInfo;
}
