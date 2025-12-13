import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';

export type AppButtonProps = MuiButtonProps & { variantStyle?: 'primary' | 'ghost' };

export default function AppButton({ variantStyle = 'primary', children, ...rest }: AppButtonProps) {
  const colorProps =
    variantStyle === 'primary' ? { color: 'primary' as any } : { color: 'inherit' as any };
  return (
    <MuiButton {...colorProps} {...rest}>
      {children}
    </MuiButton>
  );
}
