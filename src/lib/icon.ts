import * as data from '@primer/octicons/build/data.json';

interface Icon {
	heights: object;
	toSVG: () => string;
}

interface SVG {
  width: number;
  path: string;
}

type IconMap = { [key: string]: Icon };

const height = '16';
const icons =
  Object.keys(data).reduce((acc: IconMap, key: string, _: number) => {
    const i = (data as { [key: string]: object })[key] as Icon;
    const s = i.heights as { [key: string]: SVG };
    i.toSVG = () => {
      return `<svg width="${s[height].width}" height="${height}">
${s[height].path}
</svg>`;
    };
    acc[key] = i;
    return acc;
  }, {} as IconMap);

export default icons;
