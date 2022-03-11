import styled, { css } from 'styled-components';
import { ThemeColor } from '../themes/theme';

export interface ButtonProps {
  primary?: boolean;
  accent?: ThemeColor;
}

export const Button = styled.button<ButtonProps>`
  background: transparent;
  border-radius: 0.25em;
  border: 2px solid ${props => (props.accent || props.theme.typography.accent).normal};
  color: ${props => (props.accent || props.theme.typography.accent).normal};
  padding: 0.25em 1em;
  cursor: pointer;

  ${(props) => !props.primary && css`
    /* non primary */
    :disabled {
      border-color: ${(props.accent || props.theme.typography.accent).disabled};
      color: ${(props.accent || props.theme.typography.accent).disabled};
      cursor: default;
    }
  `}

  ${(props) => props.primary && css`
    /* primary */
    background: ${(props.accent || props.theme.typography.accent).normal};
    color: ${(props.accent || props.theme.typography.accent).contrast};

    :disabled {
      background: ${(props.accent || props.theme.typography.accent).disabled};
      cursor: default;
    }
  `};
`;
