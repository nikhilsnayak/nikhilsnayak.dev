import { colorMap } from '../constants';
import { getLanguages } from '../functions/queries';

export async function LanguageStats() {
  const languages = await getLanguages();

  return (
    <div className='max-w-xs text-sm'>
      <h3 className='mb-2 font-semibold'>Languages</h3>
      <div className='mb-2 flex h-2 overflow-hidden'>
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: colorMap[lang.name] ?? '#808080',
            }}
            className='h-full'
          />
        ))}
      </div>
      <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs'>
        {languages.map((lang) => (
          <div key={lang.name} className='flex items-center'>
            <span
              className='mr-1 h-2 w-2'
              style={{ backgroundColor: colorMap[lang.name] ?? '#808080' }}
            />
            <span>{lang.name}</span>
            <span className='ml-1 text-gray-800 dark:text-gray-400'>
              {lang.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
