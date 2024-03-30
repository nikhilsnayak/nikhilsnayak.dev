import {
  HtmlIcon,
  CssIcon,
  JsIcon,
  ReactIcon,
  NextIcon,
  NodeJsIcon,
  NestIcon,
  TsIcon,
  TailwindIcon,
} from "@/assets/icons";

const skillsIcons = [
  HtmlIcon,
  CssIcon,
  TailwindIcon,
  JsIcon,
  TsIcon,
  ReactIcon,
  NextIcon,
  NodeJsIcon,
  NestIcon,
];

export function Skills() {
  return (
    <div id="skills">
      <h3 className="mb-[0.5em] text-2xl font-bold sm:text-4xl">Skills :</h3>
      <ul className="flex flex-wrap items-center gap-8">
        {skillsIcons.map((Icon, index) => (
          <li className="h-12 w-12" key={index}>
            <Icon />
          </li>
        ))}
      </ul>
    </div>
  );
}
