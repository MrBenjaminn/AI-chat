export enum ButtonVariant  {
  Primary= 'primary',
  Secondary= 'secondary',
  Tertiary= 'tertiary',
}

export enum ButtonSize {
  Small= 'small',
  Default= 'default',
}

export enum ButtonType {
  Button= 'button',
  Submit= 'submit',
  Reset= 'reset',
}

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize | null
  type?: ButtonType
  onlyIcon?: boolean
  disabled?: boolean
  href?: string
  label?: string
}