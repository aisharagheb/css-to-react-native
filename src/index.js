/* eslint-disable no-param-reassign */
const nearley = require('nearley');
const camelizeStyleName = require('fbjs/lib/camelizeStyleName');
const grammar = require('./grammar');

const transforms = [
  'background',
  'border',
  'borderColor',
  'borderRadius',
  'borderWidth',
  'flex',
  'flexFlow',
  'font',
  'fontVariant',
  'fontWeight',
  'margin',
  'padding',
  'shadowOffset',
  'textShadowOffset',
  'transform',
];

const boolRe = /^true|false$/i;

const transformRawValue = (input) => {
  const value = input.trim();

  if (input !== '' && !isNaN(input)) return Number(input);

  const boolMatch = input.match(boolRe);
  if (boolMatch) return boolMatch[0].toLowerCase() === 'true';

  return value;
};

export const getStylesForProperty = (propName, inputValue) => {
  const value = inputValue.trim();

  const propValue = (transforms.indexOf(propName) !== -1)
    ? (new nearley.Parser(grammar.ParserRules, propName).feed(value).results[0])
    : transformRawValue(value);

  return (propValue && propValue.$merge)
    ? propValue.$merge
    : { [propName]: propValue };
};

export const getPropertyName = camelizeStyleName;

export default rules => rules.reduce((accum, rule) => (
  Object.assign(accum, getStylesForProperty(
    getPropertyName(rule[0]),
    rule[1],
  ))
), {});
