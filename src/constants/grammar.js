// const words = ['depressed', 'depression', 'oppresion', 'violence', 'violent', 'abuse', 'abused'];
const words = ['things', 'stuff', 'another', 'night', 'test'];
export const grammar = '#JSGF V1.0; grammar colors; public <color> = ' + words.join(' | ') + ' ;'