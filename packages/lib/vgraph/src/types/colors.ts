import * as Pbf from 'pbf';
import { VectorGraph } from '../pbf/vgraph';
import * as color_brewer from 'colorbrewer';
import * as LinearLayoutVector from 'linear-layout-vector';
import { parseCSSColor as parseCSS } from 'csscolorparser';

const brewerPaired12 = color_brewer.Paired[12];
const brewerPaired12Length = brewerPaired12.length;
const PairedRepeat = new Array(10000 * brewerPaired12Length);
for (let i = -1, n = PairedRepeat.length; ++i < n; ) {
    PairedRepeat[i] = brewerPaired12[i % brewerPaired12Length];
}

const intToColorIndex = new LinearLayoutVector();
const colorsByIndex = [
    'Paired',
    'Blues',
    'BrBG',
    'BuGn',
    'BuPu',
    'Dark2',
    'GnBu',
    'Greens',
    'Greys',
    'OrRd',
    'Oranges',
    'PRGn',
    'Accent',
    'Pastel1',
    'Pastel2',
    'PiYG',
    'PuBu',
    'PuBuGn',
    'PuOr',
    'PuRd',
    'Purples',
    'RdBu',
    'RdGy',
    'RdPu',
    'RdYlBu',
    'RdYlGn',
    'Reds',
    'Set1',
    'Set2',
    'Set3',
    'Spectral',
    'YlGn',
    'YlGnBu',
    'YlOrBr',
    'YlOrRd',
    'PairedRepeat'
]
    .map(name => color_brewer[name])
    .filter(Boolean)
    .concat({ 0: PairedRepeat }) // Add PairedRepeat
    .reduce(
        (colors, palette) =>
            colors.concat(
                Object.keys(palette)
                    .map(parseInt)
                    .filter(x => x === x) // filter out NaNs
                    .sort((a, b) => b - a) // sort ascending
                    .map((dim, i) => {
                        const indexes = palette[dim];
                        const idx = colors.length + i;
                        intToColorIndex.insert(idx);
                        intToColorIndex.setItemSize(idx, indexes.length);
                        return indexes;
                    })
            ),
        []
    );

const [doesNameIndicateColorColumn] = [/color/i].map(r => r.test.bind(r));

export function isColorColumn(name, type) {
    return type === 'color' || doesNameIndicateColorColumn(name);
}

export function isColorPaletteColumn(values: number[]) {
    let min = Number.POSITIVE_INFINITY,
        max = Number.NEGATIVE_INFINITY;
    for (let i = -1, n = values.length; ++i < n; ) {
        const val = +values[i];
        if (val < min) {
            min = val;
        }
        if (val > max) {
            max = val;
        }
        if (max - min > 12) {
            return false;
        }
    }
    min = intToColorIndex.indexOf((min / 1000) | 0);
    return min > -1 && min < colorsByIndex.length;
}

export function colorVectorMapping({ type, format, bytes, attributeVectorName }) {
    if (attributeVectorName === 'StringAttributeVector') {
        type = 'color';
        format = format || 'css';
    } else if (
        attributeVectorName === 'Int32AttributeVector' ||
        attributeVectorName === 'UInt32AttributeVector'
    ) {
        if (format === 'palette') {
            type = 'color';
            format = 'palette';
        } else if (
            isColorPaletteColumn(VectorGraph[attributeVectorName].read(new Pbf(bytes)).values)
        ) {
            type = 'color';
            format = 'palette';
        }
    }
    return { type, format };
}

export {
    convertNumber as float,
    convertNumber as int32,
    convertNumber as double,
    convertNumber as uint32,
    convertString as string
};

const black = [0, 0, 0, 255];
function convertString(format?: string) {
    return convertCSSString;
}

function convertNumber(format?: string) {
    if (format === 'palette') {
        return convertPaletteInt;
    } else if (format === 'argb') {
        return ARGBToABGR;
    }
    // Otherwise assume RGB?
    return RGBToABGR;
}

/**
 * Converts an Array of CSS color strings to an Array of WebGL buffer-compatible ABGR ints
 * @param {String} hexColor
 * @return {Number}
 */
export function convertCSSString(value: string): number {
    return arrayToABGR(parseCSS(value) || black);
}

export function convertPaletteInt(val: number): number {
    const idx = intToColorIndex.indexOf((val / 1000) | 0);
    const len = intToColorIndex.getItemSize(idx);
    const color = colorsByIndex[idx][val % len];
    return arrayToABGR(parseCSS(color) || black) as any;
}

export function arrayToABGR([r, g, b, a]: number[]) {
    return ((a * 0xff) << 24) | (b << 16) | (g << 8) | r;
}

export function RGBToABGR(x: number) {
    return (
        (0xff << 24) | // a
        ((x >>> 16) & 0xff) | // r -> b/b -> r
        (((x >>> 8) & 0xff) << 8) | // g
        ((x & 0xff) << 16) // b -> r/r -> b
    );
}

export function ARGBToABGR(x: number) {
    return (
        ((x >>> 24) << 24) | // a
        ((x >>> 16) & 0xff) | // r -> b/b -> r
        (((x >>> 8) & 0xff) << 8) | // g
        ((x & 0xff) << 16) // b -> r/r -> b
    );
}

// function numberToARGBArray(x: number) {
//     return [
//         (x >>> 24 ) / 255, // a
//         (x >>> 16 & 0xFF), // r / b
//         (x >>>  8 & 0xFF), // g
//         (x        & 0xFF), // b / r
//     ];
// }