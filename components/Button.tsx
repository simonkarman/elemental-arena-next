import styled, { css } from 'styled-components';
import { Palette } from '../themes/theme';

export interface ButtonProps {
  primary?: boolean;
  accent?: Palette;
}

export const Button = styled.button<ButtonProps>`
  background: transparent;
  border-radius: 3px;
  border: 2px solid ${(props) => (props.accent || props.theme.primary).background.normal};
  color: ${(props) => (props.accent || props.theme.primary).background.normal};
  padding: 0.25em 1em;
  cursor: pointer;

  ${(props) => props.primary
    && css`
      background: ${(props.accent || props.theme.primary).background.normal};
      color: ${(props.accent || props.theme.primary).foreground.normal};

      :disabled {
        background: ${(props.accent || props.theme.primary).background.disabled};
      }
    `};

  :disabled {
    border-color: ${(props) => (props.accent || props.theme.primary).background.disabled};
    cursor: default;
  }
  `;
