import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSavePressMutation, useUpdatePressMutation } from "@/redux/api/pressApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PropTypes from "prop-types";
import axios from "axios";

const CreatePressRelease = ({ selectedPressRelease, mode, setMode }) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      featuredImage: "",
      content: "",
      publishStatus: "draft",
      author: "",
      publishDate: "",
    },
  });

  const [savePress] = useSavePressMutation();
  const [updatePress] = useUpdatePressMutation();

  const [imagePreview, setImagePreview] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(null);
  const [showImage, setShowImage] = useState(null)
  const titleRef = useRef(null);


  const fetchImage = async (feature_image) => {
    try {

      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/${feature_image}`, {
        responseType: 'blob',
      });

      const imageBlob = response.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setImagePreview(imageBlob);
      setShowImage(imageUrl);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };


  useEffect(() => {
    if (selectedPressRelease && mode == 'update') { 
      fetchImage(selectedPressRelease.featuredImage);
      setValue("title", selectedPressRelease.title);
      setValue("author", selectedPressRelease.author);
      setValue("content", selectedPressRelease.content);
      setValue("publishStatus", selectedPressRelease.publishStatus);
      setValue("publishDate", selectedPressRelease.publishDate);
      setValue('featuredImage', selectedPressRelease.featuredImage);
      titleRef.current?.focus();
    } else {
      reset(); 
      setImagePreview(null);
    }
  }, [selectedPressRelease]);

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('publishStatus', data.publishStatus);
    formData.append('author', data.author);
    formData.append('publishDate', data.publishDate);
    isImageChanged && formData.append('featuredImage', imagePreview);


    if (mode == 'update') {
      formData.append('id', selectedPressRelease?.id);
    }

    try {
      const response = mode == 'update' ? await updatePress(formData).unwrap() : await savePress(formData).unwrap();

      if (response?.status) {
        toast.success(response?.message);
        reset();
        removeImage();
        setMode('view');
        window.location.reload();
      }
    } catch (error) {
      toast(`${mode == 'update' ? `Couldn't update press release.` : "Couldn't create press. Something went wrong."}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
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
    setIsImageChanged(true);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1048576) {
        toast.error("File size should not exceed 1MB");
        return;
      }
      setImagePreview(file);
      setShowImage(URL.createObjectURL(file));
      setValue("featuredImage", file.name);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setShowImage(null);
    setValue("featuredImage", "");
  };

  return (
    <div className="flex flex-col space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Title
            </label>
            <Controller
              name="title"              
              control={control}
              rules={{ required: "Title is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field}  ref={titleRef} />
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
              Author
            </label>
            <Controller
              name="author"
              control={control}
              rules={{ required: "Author is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input {...field} />
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
              Publish Status
            </label>
            <Controller
              name="publishStatus"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  {...field}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Publish Date
            </label>
            <Controller
              name="publishDate"
              control={control}
              rules={{ required: "Publish Date is required" }}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input type="date" {...field} />
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
              Featured Image
            </label>
            <Controller
              name="featuredImage"
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

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <Controller
              name="content"
              control={control}
              rules={{
                required: "Content is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <div style={{ height: "300px", position: "relative" }}>
                  <ReactQuill
                    theme="snow"
                    {...field}
                    onChange={(value) => field.onChange(value)}
                    style={{ height: "200px" }}
                  />
                  {error && (
                    <span
                      className="text-red-500 text-sm"
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                      }}
                    >
                      {error.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex  mt-20 gap-4">
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
            {" "}
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

CreatePressRelease.propTypes = {
  selectedPressRelease: PropTypes.object,
  mode: PropTypes.string,
  setMode: PropTypes.func,
}

export default CreatePressRelease;
