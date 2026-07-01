import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import PropTypes from 'prop-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSaveMemberMutation, useUpdateMemberMutation } from "@/redux/api/memberApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const CreateMember = ({ editSelectedItem, mode, setMode }) => {
  const {
    control,
    handleSubmit,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      position: "",
      feature_image: "",
      type: "",
      email: "",
      contact: "",
      tenure: "",
      created_by:1
    },
  });
  const nameRef = useRef(null)
  const [saveMember] = useSaveMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(false);


  const fetchImage = async (feature_image) => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/${feature_image}`, {
        responseType: 'blob',
      });

      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setShowImage('imageurl', imageUrl);
      setImagePreview(imageBlob);
      setShowImage(imageUrl);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };



  useEffect(()=>{
    if (editSelectedItem) {
      fetchImage(editSelectedItem.feature_image);
      setValue("name", editSelectedItem.name);
      setValue("position", editSelectedItem.position);
      setValue("type", editSelectedItem.type);
      setValue("email", editSelectedItem.email);
      setValue("contact", editSelectedItem.contact);
      setValue("tenure", editSelectedItem.tenure);
      setValue('feature_image', editSelectedItem.feature_image);
      nameRef.current?.focus();
    }else{
      reset()
      setImagePreview(null)
    }

  }, [editSelectedItem, setValue]);


  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append('name', data.name);
    formData.append('position', data.position);
    formData.append('type', data.type);
    formData.append('email', data.email);
    formData.append('contact', data.contact);
    formData.append('tenure', data.tenure);
    isImageChanged && formData.append('feature_image', imagePreview);


    if (mode == 'update') {
      formData.append('id', editSelectedItem?.id);
    }
    try {
      const response = mode == 'update' ? await updateMember(formData).unwrap() : await saveMember(formData).unwrap();
      if (response?.status) {
        toast.success(response?.message);
        reset();
        removeImage();
        window.location.reload();

      }
    } catch (error) {
      editSelectedItem ? toast.error("Something went wrong on updating team member...") : toast("Something went wrong on creating team member...", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        style: {
          backgroundColor: "#f44336",
          color: "#ffffff",
        },
      });
      throw new Error(error)
    }
  };

  const handleImageChange = (event) => {
    setIsImageChanged(true)
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1048576) {
        toast.error("File size should not exceed 1MB");
        return;
      }
      setImagePreview(file);
      setShowImage(URL.createObjectURL(file))
      setValue("feature_image", file.name);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setShowImage(null);
    setValue("feature_image", "");
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Name
            </label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field}  ref={nameRef}/>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Position
            </label>
            <Controller
              name="position"
              control={control}
             
              render={({ field, }) => (
                <>
                  <Input {...field} />
              
                </>
              )}
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Type
            </label>
            <Controller
              name="type"
              control={control}
              rules={{ required: "Type is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                <Select
                  onValueChange={field.onChange}
                    {...field}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="pastPresidents">
                      Past Presidents
                    </SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                  </SelectContent>
                  </Select>
                  {error && (
                    <span className="text-red-500 text-sm">
                      {error.message}
                    </span>
                  )}
                </>
              )}

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field, }) => (
                <Input {...field}
                  type="email"
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact
            </label>
            <Controller
              name="contact"
              control={control}
              render={({ field }) => (
                <>
                  <Input {...field} />
                 
                </>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tenure
            </label>
            <Controller
              name="tenure"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <Controller
              name="feature_image"
              control={control}
              rules={{ required: "An image is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e);
                      handleImageChange(e);
                    }}
                    className="hidden"
                    ref={(input) => input && (field.ref = input)}
                  />
                  <div
                    className={`w-full p-2 border-2 border-dashed rounded-lg cursor-pointer flex justify-center h-44 ${
                      error ? "border-red-500" : ""
                    }`}
                    onClick={() => field.ref.click()}
                  >
                    {showImage ? (
                      <div className="relative">
                        <img
                          src={showImage}
                          alt="Preview"
                          className="size-40 object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        Click to upload or drag and drop an image
                      </span>
                    )}
                  </div>
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit">
            {mode == 'update' ? "Update" : "Save"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              reset();
              removeImage();
              setMode('create')
            }}
            className="bg-red-700"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

CreateMember.propTypes = {
  editSelectedItem: PropTypes.object,
  mode: PropTypes.string,
  setMode: PropTypes.func
};

export default CreateMember;
