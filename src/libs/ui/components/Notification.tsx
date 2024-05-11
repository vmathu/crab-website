import {
  Alert,
  AlertProps,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarProps,
} from '@mui/material';

type NotificationProps = {
  snackbarProps?: SnackbarProps;
  alertProps?: AlertProps;
  message: string;
};

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionRight(props: TransitionProps) {
  return <Slide {...props} direction='left' />;
}

export function Notification({
  snackbarProps,
  alertProps,
  message,
}: NotificationProps) {
  return (
    <Snackbar
      {...snackbarProps}
      style={{ right: 0 }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={3000}
      TransitionComponent={TransitionRight}
    >
      <Alert {...alertProps} icon={false} sx={{ borderRadius: '4px 0 0 4px' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
