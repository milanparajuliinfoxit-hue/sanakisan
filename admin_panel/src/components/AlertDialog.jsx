
import PropTypes from "prop-types";
import { CiWarning } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";

const AlertDialog = ({ onCancel, onSubmit, cancelText = 'Cancel', submitText = "Submit", warningMessage, message, isCancel, success = false }) => {

  return (
    <div className="relative z-40" aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div className="fixed inset-0 bg-textLight bg-opacity-50 transition-opacity" aria-hidden="true"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 transition-all ease-in-out duration-200 ">

          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">

                  {success ? <IoIosInformationCircleOutline className="w-6 h-6" /> :
                    <CiWarning className="w-6 h-6" />
                  }


                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-black" id="modal-title">{warningMessage}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{message}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={onSubmit}
                className="inline-flex w-full justify-center rounded-md bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-buttonPrimary sm:ml-3 sm:w-auto">
                {submitText}
              </button>
              {
                isCancel &&
                <button
                  onClick={onCancel}
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-red-700 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                  {cancelText}
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

AlertDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  cancelText: PropTypes.string,
  submitText: PropTypes.string,
  warningMessage: PropTypes.string,
  message: PropTypes.string.isRequired,
  isCancel: PropTypes.bool,
  success: PropTypes.bool,
};

export default AlertDialog;