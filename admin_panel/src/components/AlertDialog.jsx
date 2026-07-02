import PropTypes from "prop-types";
import { AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";

const AlertDialog = ({ onCancel, onSubmit, cancelText = 'Cancel', submitText = "Submit", warningMessage, message, isCancel, success = false }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                success ? "bg-blue-100" : "bg-red-100"
              }`}>
                {success ? (
                  <Info className="w-5 h-5 text-blue-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground" id="modal-title">
                  {warningMessage}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{message}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
            {isCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="button"
              variant={success ? "default" : "destructive"}
              onClick={onSubmit}
            >
              {submitText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

AlertDialog.propTypes = {
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  submitText: PropTypes.string,
  warningMessage: PropTypes.string,
  message: PropTypes.string.isRequired,
  isCancel: PropTypes.bool,
  success: PropTypes.bool,
};

export default AlertDialog;
