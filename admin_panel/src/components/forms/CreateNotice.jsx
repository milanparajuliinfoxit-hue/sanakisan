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
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import { useSaveNoticeMutation, useUpdateNoticeMutation } from "@/redux/api/noticeApi";
import { X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateNotice = ({ selectedNotice, mode, setMode }) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      title: "",
      featuredImage: "",
      content: "",
      publishStatus: "",
      author: "",
      publishDate: "",
    },
  });

  const [saveNotice] = useSaveNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation();

  const [imagePreview, setImagePreview] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);

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
    if (selectedNotice && mode == 'update') {
      const publishDate = new Date(selectedNotice.publishDate).toISOString().split('T')[0];
      fetchImage(selectedNotice.featuredImage);
      setValue("title", selectedNotice.title);
      setValue("author", selectedNotice.author);
      setValue("content", selectedNotice.content);
      setValue("publishStatus", selectedNotice.publishStatus);
      setValue("publishDate", publishDate);
      setValue('featuredImage', selectedNotice.featuredImage);
      titleRef.current?.focus();
    } else {
      reset();
      setImagePreview(null);
      setShowImage(null);
    }
  }, [selectedNotice, setValue, reset]);

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('publishStatus', data.publishStatus);
    formData.append('author', data.author);
    formData.append('publishDate', data.publishDate);
    isImageChanged && formData.append('featuredImage', imagePreview);

    if (mode == 'update') {
      formData.append('id', selectedNotice?.id);
    }

    try {
      const response = mode == 'update' ? await updateNotice(formData).unwrap() : await saveNotice(formData).unwrap();

      if (response?.status) {
        toast.success(response?.message);
        reset();
        removeImage();
        setMode('view');
        window.location.reload();
      }
    } catch (error) {
      toast.error(mode == 'update' ? "Couldn't update notice." : "Couldn't create notice.");
      throw new Error(error);
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Basic Information</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Enter the main details of the notice</p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Title <span className="text-destructive">*</span></label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} ref={titleRef} placeholder="Enter notice title" />
                    {error && <span className="text-xs text-destructive">{error.message}</span>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Author <span className="text-destructive">*</span></label>
              <Controller
                name="author"
                control={control}
                rules={{ required: "Author is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} placeholder="Enter author name" />
                    {error && <span className="text-xs text-destructive">{error.message}</span>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Publish Status</label>
              <Controller
                name="publishStatus"
                control={control}
                rules={{ required: "Publish Status is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    {error && <span className="text-xs text-destructive mt-1">{error.message}</span>}
                  </>
                )}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Publish Date <span className="text-destructive">*</span></label>
              <Controller
                name="publishDate"
                control={control}
                rules={{ required: "Publish Date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input type="date" {...field} />
                    {error && <span className="text-xs text-destructive">{error.message}</span>}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Featured Image</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Upload a cover image for the notice</p>
          </div>
          <div className="p-5">
            <Controller
              name="featuredImage"
              control={control}
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
                    ref={fileInputRef}
                  />
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center h-48 transition-colors",
                      error ? "border-destructive" : "border-border hover:border-primary/50 hover:bg-accent/50"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {showImage ? (
                      <div className="relative w-full h-full p-2">
                        <img
                          src={showImage}
                          alt="Preview"
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          className="absolute top-3 right-3 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Click to upload image</p>
                        <p className="text-xs text-muted-foreground mt-1">Max 1MB · JPG, PNG, WebP</p>
                      </div>
                    )}
                  </div>
                  {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <div className="px-5 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Content</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Write the main content of the notice</p>
          </div>
          <div className="p-5">
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <div className="min-h-[300px]">
                  <ReactQuill
                    theme="snow"
                    {...field}
                    onChange={(value) => field.onChange(value)}
                    className="h-52"
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => { reset(); removeImage(); setMode('create'); }}>
            Cancel
          </Button>
          <Button type="submit">
            {mode == 'update' ? "Update Notice" : "Save Notice"}
          </Button>
        </div>
      </form>
    </div>
  );
};

CreateNotice.propTypes = {
  selectedNotice: PropTypes.object,
  mode: PropTypes.string,
  setMode: PropTypes.func,
};

export default CreateNotice;
