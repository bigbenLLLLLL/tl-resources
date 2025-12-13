import TextField, { type TextFieldProps } from '@mui/material/TextField';

export type AppTextFieldProps = TextFieldProps & { fieldName?: string };

export default function AppTextField(props: AppTextFieldProps) {
  return <TextField fullWidth {...props} />;
}
