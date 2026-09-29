import React from 'react';
import { Alert, Button } from '@mui/material';

export default function Notice({ children, onRetry }) {
  return <Alert severity="error" className="error-notice" action={onRetry ? <Button color="inherit" size="small" onClick={onRetry}>Retry</Button> : null}>{children}</Alert>;
}
