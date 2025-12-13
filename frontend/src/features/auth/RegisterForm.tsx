import React, { useState } from 'react';
import { Box, Stack, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserSchema, type CreateUserInput } from '../../../../shared/src/index';
import AppTextField from '../../components/forms/AppTextField';
import AppButton from '../../components/ui/AppButton';
import { createUser } from '../../services/userService';

type FieldErrors = Partial<Record<keyof CreateUserInput, string>>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState<CreateUserInput>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange =
    (field: keyof CreateUserInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      setServerError(null);
    };

  const handleCancel = () => navigate('/');

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setServerError(null);
    setErrors({});

    const result = createUserSchema.safeParse(values);
    if (!result.success) {
      const fieldErrs: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0] as keyof CreateUserInput | undefined;
        if (path) fieldErrs[path] = issue.message;
      }
      setErrors(fieldErrs);
      return;
    }

    try {
      setSubmitting(true);
      await createUser(result.data);
      navigate('/login');
    } catch (err: any) {
      // Map backend field errors if present, otherwise show message
      if (err?.data && typeof err.data === 'object' && err.data.errors) {
        setErrors(err.data.errors);
      } else {
        setServerError(err?.message || 'Registration failed');
      }
    } finally {
      setSubmitting(false);
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
          label="First Name"
          value={values.firstName}
          onChange={handleChange('firstName')}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
        <AppTextField
          label="Last Name"
          value={values.lastName}
          onChange={handleChange('lastName')}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
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
          <AppButton onClick={handleCancel} color="inherit">
            Cancel
          </AppButton>
          <AppButton type="submit" variant="contained" disabled={submitting} onClick={handleSubmit}>
            Register
          </AppButton>
        </Stack>
      </Stack>
    </Box>
  );
}
