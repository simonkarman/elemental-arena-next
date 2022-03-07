import styled, { css } from 'styled-components';
import { Palette } from '../themes/theme';

export interface ButtonProps {
  primary?: boolean;
  accent?: Palette;
}

export const Button = styled.button<ButtonProps>`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${(props) => (props.accent?.color || props.theme.palette.primary.color)};
  color: ${(props) => props.accent?.color || props.theme.palette.primary.color};
  padding: 0.25em 1em;
  cursor: pointer;

  ${(props) => props.primary
    && css`
      background: ${props.accent?.color || props.theme.palette.primary.color};
      color: ${props.accent?.contrast || props.theme.palette.primary.contrast};

      :disabled {
        background: ${props.accent?.disabled || props.theme.palette.primary.disabled};
      }
    `};

  :disabled {
    border-color: ${(props) => props.accent?.disabled || props.theme.palette.primary.disabled};
    cursor: default;
  }
  `;
