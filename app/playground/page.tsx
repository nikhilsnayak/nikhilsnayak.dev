import {
  CodeWithProjectStructure,
  File,
} from '~/components/code-with-project-structure';

export default function Playground() {
  return (
    <div>
      <CodeWithProjectStructure
        projectName='Cine Score'
        projectStructure={[
          {
            name: 'src',
            type: 'folder',
            children: [
              { name: 'index.ts', type: 'file' },
              {
                name: 'components',
                type: 'folder',
                children: [
                  { name: 'Button.tsx', type: 'file' },
                  { name: 'Card.tsx', type: 'file' },
                  {
                    name: 'Layout',
                    type: 'folder',
                    children: [
                      { name: 'Header.tsx', type: 'file' },
                      { name: 'Footer.tsx', type: 'file' },
                      { name: 'Sidebar.tsx', type: 'file' },
                    ],
                  },
                  {
                    name: 'Forms',
                    type: 'folder',
                    children: [
                      { name: 'Input.tsx', type: 'file' },
                      { name: 'Checkbox.tsx', type: 'file' },
                      { name: 'Select.tsx', type: 'file' },
                      {
                        name: 'Advanced',
                        type: 'folder',
                        children: [
                          { name: 'DatePicker.tsx', type: 'file' },
                          { name: 'TimePicker.tsx', type: 'file' },
                          { name: 'ColorPicker.tsx', type: 'file' },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'utils',
                type: 'folder',
                children: [
                  { name: 'helpers.ts', type: 'file' },
                  { name: 'constants.ts', type: 'file' },
                  {
                    name: 'api',
                    type: 'folder',
                    children: [
                      { name: 'client.ts', type: 'file' },
                      { name: 'endpoints.ts', type: 'file' },
                    ],
                  },
                ],
              },
              {
                name: 'styles',
                type: 'folder',
                children: [
                  { name: 'global.css', type: 'file' },
                  { name: 'variables.scss', type: 'file' },
                  {
                    name: 'themes',
                    type: 'folder',
                    children: [
                      { name: 'light.css', type: 'file' },
                      { name: 'dark.css', type: 'file' },
                    ],
                  },
                ],
              },
            ],
          },
          {
            name: 'public',
            type: 'folder',
            children: [
              { name: 'favicon.ico', type: 'file' },
              { name: 'robots.txt', type: 'file' },
              {
                name: 'images',
                type: 'folder',
                children: [
                  { name: 'logo.svg', type: 'file' },
                  { name: 'banner.jpg', type: 'file' },
                ],
              },
            ],
          },
          { name: 'package.json', type: 'file' },
          { name: 'tsconfig.json', type: 'file' },
          { name: '.env.local', type: 'file' },
          { name: 'README.md', type: 'file' },
          {
            name: 'tests',
            type: 'folder',
            children: [
              { name: 'unit', type: 'folder', children: [] },
              { name: 'integration', type: 'folder', children: [] },
              { name: 'e2e', type: 'folder', children: [] },
            ],
          },
          {
            name: 'docs',
            type: 'folder',
            children: [
              { name: 'API.md', type: 'file' },
              { name: 'CONTRIBUTING.md', type: 'file' },
              {
                name: 'examples',
                type: 'folder',
                children: [
                  { name: 'basic-usage.md', type: 'file' },
                  { name: 'advanced-config.md', type: 'file' },
                ],
              },
            ],
          },
          { name: '.github', type: 'folder', children: [] },
          { name: 'node_modules', type: 'folder', children: [] },
          { name: '.gitignore', type: 'file' },
          { name: 'LICENSE', type: 'file' },
          { name: 'CHANGELOG.md', type: 'file' },
          { name: 'jest.config.js', type: 'file' },
          { name: '.eslintrc.js', type: 'file' },
          { name: '.prettierrc', type: 'file' },
          { name: 'babel.config.js', type: 'file' },
          { name: 'webpack.config.js', type: 'file' },
          { name: 'docker-compose.yml', type: 'file' },
          { name: 'Dockerfile', type: 'file' },
          { name: '.dockerignore', type: 'file' },
          { name: 'netlify.toml', type: 'file' },
          { name: 'vercel.json', type: 'file' },
          { name: '.npmignore', type: 'file' },
          { name: '.travis.yml', type: 'file' },
          { name: 'CODE_OF_CONDUCT.md', type: 'file' },
          { name: 'SECURITY.md', type: 'file' },
          { name: 'CODEOWNERS', type: 'file' },
          { name: '.editorconfig', type: 'file' },
        ]}
      >
        <File filePath='src/index.ts'></File>
      </CodeWithProjectStructure>
    </div>
  );
}
