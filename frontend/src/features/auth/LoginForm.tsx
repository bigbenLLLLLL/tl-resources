import React, { useState } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AppTextField from '../../components/forms/AppTextField';
import AppButton from '../../components/ui/AppButton';
import { login as loginService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema, type LoginInput } from '../../../../shared/src/index';
import { useApi } from '../../hooks/useApi';
import { ApiError } from '../../utils/ApiErrors';

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

export default function LoginForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<LoginInput>({ email: '', password: '' });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const { execute, loading } = useApi(
    (payload: LoginInput, signal?: AbortSignal) => loginService(payload, signal),
    { autoThrow: true },
  );

  const auth = useAuth();

  const handleChange = (field: keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  };

  const handleCancel = () => navigate('/');
  const handleRegister = () => navigate('/register');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setServerError(null);
    setErrors({});

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const fieldErrs: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof LoginInput | undefined;
        if (path) fieldErrs[path] = issue.message;
      }
      setErrors(fieldErrs);
      return;
    }

    try {
      setServerError(null);
      const data: any = await execute(result.data);
      // data expected { token, id }
      if (data && data.token) {
        // set token via auth provider so app updates reactively
        auth.authenticate(data.token, data.id ? { id: data.id } : undefined);
        navigate('/');
      } else {
        setServerError('Invalid response from server');
      }
    } catch (err: any) {
      // Map field errors if backend returned details
      if (err instanceof ApiError && err.details && typeof err.details === 'object') {
        const fieldErrs: FieldErrors = {};
        const details = err.details as Record<string, unknown>;
        for (const k of Object.keys(details)) {
          const v = details[k];
          if (typeof v === 'string') fieldErrs[k as keyof LoginInput] = v;
        }
        setErrors(fieldErrs);
      }
      setServerError(err?.message || 'Login failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}

      <Stack spacing={2}>
        <AppTextField
          label="Email"
          value={values.email}
          onChange={handleChange('email')}
          error={!!errors.email}
          helperText={errors.email}
        />
        <AppTextField
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          error={!!errors.password}
          helperText={errors.password}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <AppButton color="inherit" onClick={handleCancel}>
            Cancel
          </AppButton>
          <AppButton color="inherit" onClick={handleRegister}>
            Register
          </AppButton>
          <AppButton type="submit" variant="contained" disabled={loading} onClick={handleSubmit}>
            Login
          </AppButton>
        </Stack>
      </Stack>
    </Box>
  );
}
