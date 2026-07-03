import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSavePressMutation, useUpdatePressMutation } from "@/redux/api/pressApi";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import axios from "axios";
import { X, Upload, ImageIcon, Send, FileText, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CreatePressRelease = ({ selectedPressRelease, mode, setMode, onSuccess }) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { title: "", featuredImage: "", content: "", publishStatus: "draft", author: "", publishDate: "" },
  });

  const [savePress] = useSavePressMutation();
  const [updatePress] = useUpdatePressMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [showImage, setShowImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [submitting, setSubmitting] = useState(null); // 'draft' | 'publish' | null
  const titleRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchImage = async (feature_image) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}api/${feature_image}`, { responseType: "blob" });
      setImagePreview(response.data);
      setShowImage(URL.createObjectURL(response.data));
    } catch (e) {
      console.error("Error fetching image:", e);
    }
  };

  useEffect(() => {
    if (selectedPressRelease && mode === "update") {
      fetchImage(selectedPressRelease.featuredImage);
      setValue("title", selectedPressRelease.title);
      setValue("author", selectedPressRelease.author);
      setValue("content", selectedPressRelease.content);
      setValue("publishStatus", selectedPressRelease.publishStatus);
      setValue("publishDate", selectedPressRelease.publishDate);
      setValue("featuredImage", selectedPressRelease.featuredImage);
      titleRef.current?.focus();
    } else {
      reset();
      setImagePreview(null);
      setShowImage(null);
      setIsImageChanged(false);
    }
  }, [selectedPressRelease]);

  const processFile = (file) => {
    if (!file) return;
    if (file.size > 1048576) { toast.error("File size should not exceed 1MB"); return; }
    setIsImageChanged(true);
    setImagePreview(file);
    setShowImage(URL.createObjectURL(file));
    setValue("featuredImage", file.name);
  };

  const handleImageChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = () => {
    setImagePreview(null);
    setShowImage(null);
    setIsImageChanged(false);
    setValue("featuredImage", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data, publishStatus) => {
    setSubmitting(publishStatus);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("publishStatus", publishStatus);
    formData.append("author", data.author);
    formData.append("publishDate", data.publishDate);
    if (isImageChanged) formData.append("featuredImage", imagePreview);
    if (mode === "update") formData.append("id", selectedPressRelease?.id);

    try {
      const response = mode === "update"
        ? await updatePress(formData).unwrap()
        : await savePress(formData).unwrap();
      if (response?.status) {
        toast.success(response?.message);
        reset();
        removeImage();
        setMode("view");
        onSuccess?.();
      }
    } catch {
      toast.error(mode === "update" ? "Couldn't update press release." : "Couldn't create press release.");
    } finally {
      setSubmitting(null);
    }
  };

  const handleDraftSubmit = handleSubmit((data) => onSubmit(data, "draft"));
  const handlePublishSubmit = handleSubmit((data) => onSubmit(data, "published"));

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-up">
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Basic Information</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Enter the main details of your press release</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Title <span className="text-destructive">*</span></label>
              <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} ref={titleRef} placeholder="Enter press release title"
                      className={cn("h-10 transition-all", error && "border-destructive focus-visible:ring-destructive")} />
                    {error && <p className="text-xs text-destructive">{error.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Author <span className="text-destructive">*</span></label>
              <Controller
                name="author"
                control={control}
                rules={{ required: "Author is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input {...field} placeholder="Enter author name"
                      className={cn("h-10 transition-all", error && "border-destructive focus-visible:ring-destructive")} />
                    {error && <p className="text-xs text-destructive">{error.message}</p>}
                  </>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Publish Date <span className="text-destructive">*</span></label>
              <Controller
                name="publishDate"
                control={control}
                rules={{ required: "Publish Date is required" }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input type="date" {...field}
                      className={cn("h-10 transition-all", error && "border-destructive focus-visible:ring-destructive")} />
                    {error && <p className="text-xs text-destructive">{error.message}</p>}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Featured Image</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Upload a cover image · JPG, PNG, WebP · Max 1MB</p>
          </div>
          <div className="p-6">
            <Controller
              name="featuredImage"
              control={control}
              rules={{ required: mode === "create" ? "An image is required" : false }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <input type="file" accept="image/*" onChange={(e) => { field.onChange(e); handleImageChange(e); }}
                    className="hidden" ref={fileInputRef} />
                  {showImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-border bg-muted/20 group">
                      <img src={showImage} alt="Preview" className="w-full h-56 object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 rounded-lg text-xs font-medium text-foreground hover:bg-white transition-colors shadow-sm">
                          <Upload className="w-3.5 h-3.5" /> Replace
                        </button>
                        <button type="button" onClick={removeImage}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/90 rounded-lg text-xs font-medium text-white hover:bg-red-500 transition-colors shadow-sm">
                          <X className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        "relative border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center h-48 transition-all duration-200 select-none",
                        isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-accent/40",
                        error && "border-destructive"
                      )}
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
                        isDragging ? "bg-primary/10" : "bg-muted")}>
                        <ImageIcon className={cn("w-6 h-6 transition-colors", isDragging ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Max 1MB</p>
                    </div>
                  )}
                  {error && <p className="text-xs text-destructive mt-1.5">{error.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Content <span className="text-destructive">*</span></h3>
            <p className="text-xs text-muted-foreground mt-0.5">Write the main body of the press release</p>
          </div>
          <div className="p-6">
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <div className="min-h-[320px]">
                    <ReactQuill theme="snow" {...field} onChange={(v) => field.onChange(v)} className="h-64" />
                  </div>
                  {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 pb-6">
          <Button type="button" variant="ghost"
            onClick={() => { reset(); removeImage(); setMode("view"); }}
            className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={handleDraftSubmit}
              disabled={!!submitting}
              className="gap-2 min-w-[130px] h-10">
              {submitting === "draft" ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              Save as Draft
            </Button>
            <Button type="button" onClick={handlePublishSubmit}
              disabled={!!submitting}
              className="gap-2 min-w-[120px] h-10">
              {submitting === "published" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {mode === "update" ? "Update & Publish" : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

CreatePressRelease.propTypes = {
  selectedPressRelease: PropTypes.object,
  mode: PropTypes.string,
  setMode: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default CreatePressRelease;
