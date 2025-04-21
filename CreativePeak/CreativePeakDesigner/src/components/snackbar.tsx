import { Snackbar, Alert } from "@mui/material";

type AutoSnackbarProps = {
  open: boolean;
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  onClose: () => void;
};

const AutoSnackbar = ({
  open,
  message,
  severity = "success",
  onClose,
}: AutoSnackbarProps) => {
  return (
    <Snackbar
      open={open}
      onClose={onClose}
      autoHideDuration={5000} // ⏱️ זמן ארוך יותר: 5 שניות
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{
        top: "80px !important", // ⬇️ מרווח קטן מהחלק העליון (ברירת מחדל היא 16px)
      }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%", fontSize: "17px" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default AutoSnackbar;
