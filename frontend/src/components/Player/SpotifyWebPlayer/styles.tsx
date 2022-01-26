/* tslint:disable:object-literal-sort-keys */
import * as React from 'react';
import { create, NanoRenderer } from 'nano-css';
// @ts-ignore
import { addon as addonJSX } from 'nano-css/addon/jsx';
import { addon as addonKeyframes } from 'nano-css/addon/keyframes';
// @ts-ignore
import { addon as addonNesting } from 'nano-css/addon/nesting';
import { addon as addonRule } from 'nano-css/addon/rule';
// @ts-ignore
import { addon as addonStyle } from 'nano-css/addon/style';
// @ts-ignore
import { addon as addonStyled } from 'nano-css/addon/styled';
import { CssLikeObject } from 'nano-css/types/common';

import { StyledProps, StylesOptions, StylesProps } from './types/common';

interface NanoExtended extends NanoRenderer {
  styled: (
      // eslint-disable-next-line no-unused-vars
    tag: string,
  ) => (
      // eslint-disable-next-line no-unused-vars
    styles: CssLikeObject,
      // eslint-disable-next-line no-unused-vars
    dynamicTemplate?: (props: StyledProps) => CssLikeObject,
      // eslint-disable-next-line no-unused-vars
    block?: string,
  ) => React.FunctionComponent<Partial<StyledProps>>;
}



const nano = create({ h: React.createElement });

addonRule(nano);
addonKeyframes(nano);
addonJSX(nano);
addonStyle(nano);
addonStyled(nano);
addonNesting(nano);

const { keyframes, put, styled } = nano as NanoExtended;

export const px = (value: string | number): string =>
  typeof value === 'number' ? `${value}px` : value;

export function getMergedStyles(styles: StylesProps | undefined): StylesOptions {
  if(localStorage.getItem('lightmode') === 'true'){
    return {
      activeColor: '#008FF7',
      altColor: '#1F1F1F',
      bgColor: '#F2F2F2',
      color: '#1F1F1F',
      errorColor: '#D83010',
      height: 70,
      loaderColor: '#1F1F1F',
      loaderSize: 32,
      sliderColor: '#008FF7',
      sliderHandleBorderRadius: '50%',
      sliderHandleColor: '#008FF7',
      sliderHeight: 4,
      sliderTrackBorderRadius: 50,
      sliderTrackColor: '#CDCECD',
      trackArtistColor: '#1F1F1F',
      trackNameColor: '#1F1F1F',
      ...styles,
    };
  }

  return {
    activeColor: '#008FF7',
    altColor: '#ccc',
    bgColor: '#131218',
    color: '#E0E0E0',
    errorColor: '#D83010',
    height: 70,
    loaderColor: '#E0E0E0',
    loaderSize: 32,
    sliderColor: '#008FF7',
    sliderHandleBorderRadius: '50%',
    sliderHandleColor: '#008FF7',
    sliderHeight: 4,
    sliderTrackBorderRadius: 50,
    sliderTrackColor: '#CDCECD',
    trackArtistColor: '#E4E3E2',
    trackNameColor: '#E4E3E2',
    ...styles,
  };
}

export { keyframes, put, styled };
