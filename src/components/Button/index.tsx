import { isValidElement } from "react";
import { ButtonContainer, ChildStyle } from "./style";
import { ButtonProps, IconComplex } from "./types";

const Button = ({
  icon,
  children,
  loading = false,
  disabled = false,
  size = 'medium',
  type = 'primary',
  variant = 'filled',
  shape = 'box',
  htmlType = 'button',
  component = 'button',
  block = false,
  ...rest
}: ButtonProps): JSX.Element => {
  let startElement;
  let endElement;

  if (icon) {
    if (isValidElement(icon)) {
      startElement = icon;
    } else {
      const typedIcon = icon as IconComplex;
      if (typedIcon.iconStart && !loading) startElement = typedIcon.iconStart;
      if (typedIcon.iconEnd) endElement = typedIcon.iconEnd;
    }
  }

  return (
    <ButtonContainer
      type={htmlType}
      as={component}
      $shape={shape}
      $size={size}
      $type={type}
      $variant={variant}
      $loading={loading}
      disabled={disabled}
      $fullWidth={block}
      {...rest}
    >
      {startElement}<ChildStyle>{children}</ChildStyle>{endElement}
    </ButtonContainer>
  );
};


export { Button };
