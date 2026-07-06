import { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useSaveMemberMutation, useUpdateMemberMutation } from "@/redux/api/memberApi";
import { useGetActiveCommitteeTypesQuery } from "@/redux/api/committeeTypeApi";
import { useGetActiveCommitteePositionsQuery } from "@/redux/api/committeePositionApi";
import { toast } from "react-toastify";
import axios from "axios";
import { X, Upload, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const CreateMember = ({ editSelectedItem, mode, setMode }) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      name: "",
      committee_type_id: "",
      committee_position_id: "",
      feature_image: "",
      email: "",
      contact: "",
      tenure: "",
    },
  });
  const nameRef = useRef(null);
  const fileInputRef = useRef(null);
  const [saveMember] = useSaveMemberMutation();
  const [updateMember] = useUpdateMemberMutation();
  const [imagePreview, setImagePreview] = useState(null);
  const [showImage, setShowImage] = useState(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { data: typesRes, isLoading: typesLoading } = useGetActiveCommitteeTypesQuery();
  const { data: positionsRes, isLoading: positionsLoading } = useGetActiveCommitteePositionsQuery();

  const committeeTypes = typesRes?.data || [];
  const committeePositions = positionsRes?.data || [];

  const fetchImage = async (feature_image) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}api/${feature_image}`,
        { responseType: "blob" }
      );
      const imageUrl = URL.createObjectURL(response.data);
      setImagePreview(response.data);
      setShowImage(imageUrl);
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  };

  useEffect(() => {
    if (editSelectedItem) {
      fetchImage(editSelectedItem.feature_image);
      setValue("name", editSelectedItem.name);
      setValue("committee_type_id", String(editSelectedItem.committee_type_id || editSelectedItem.committeeType?.id || ""));
      setValue("committee_position_id", String(editSelectedItem.committee_position_id || editSelectedItem.committeePosition?.id || ""));
      setValue("email", editSelectedItem.email || "");
      setValue("contact", editSelectedItem.contact || "");
      setValue("tenure", editSelectedItem.tenure || "");
      setValue("feature_image", editSelectedItem.feature_image);
      nameRef.current?.focus();
    } else {
      reset();
      setImagePreview(null);
      setShowImage(null);
    }
  }, [editSelectedItem, setValue, reset]);

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append("name", data.name);
    formData.append("committee_type_id", data.committee_type_id);
    formData.append("committee_position_id", data.committee_position_id);
    formData.append("email", data.email || "");
    formData.append("contact", data.contact || "");
    formData.append("tenure", data.tenure || "");
    if (isImageChanged) formData.append("feature_image", imagePreview);
    if (mode === "update") formData.append("id", editSelectedItem?.id);

    try {
      const response =
        mode === "update"
          ? await updateMember(formData).unwrap()
          : await saveMember(formData).unwrap();
      if (response?.status) {
        toast.success(response?.message);
        reset();
        removeImage();
        window.location.reload();
      }
    } catch (error) {
      toast.error("Something went wrong...");
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
      setValue("feature_image", file.name);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setShowImage(null);
    setValue("feature_image", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Master data warnings */}
          {!typesLoading && committeeTypes.length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium">No Committee Types available.</p>
                <p className="mt-0.5 text-amber-700">Please create one first before adding a member.</p>
              </div>
              <Link to="/committee-types" className="flex items-center gap-1 text-xs font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900 flex-shrink-0">
                Go <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}
          {!positionsLoading && committeePositions.length === 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm">
                <p className="font-medium">No Committee Positions available.</p>
                <p className="mt-0.5 text-amber-700">Please create one first before adding a member.</p>
              </div>
              <Link to="/committee-positions" className="flex items-center gap-1 text-xs font-medium text-amber-800 underline underline-offset-2 hover:text-amber-900 flex-shrink-0">
                Go <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          )}

          {/* Personal Information */}
          <div className="rounded-xl border bg-card">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Member Information</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Enter the details of the committee member</p>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Full Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Full name is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Input {...field} ref={nameRef} placeholder="Enter full name" />
                      {error && <span className="text-xs text-destructive">{error.message}</span>}
                    </>
                  )}
                />
              </div>

              {/* Committee Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Committee Type <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="committee_type_id"
                  control={control}
                  rules={{ required: "Committee Type is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={typesLoading || committeeTypes.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={typesLoading ? "Loading…" : committeeTypes.length === 0 ? "No types available" : "Select Committee Type"} />
                        </SelectTrigger>
                        <SelectContent>
                          {committeeTypes.map((t) => (
                            <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && <span className="text-xs text-destructive">{error.message}</span>}
                    </>
                  )}
                />
              </div>

              {/* Committee Position */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Position <span className="text-destructive">*</span>
                </label>
                <Controller
                  name="committee_position_id"
                  control={control}
                  rules={{ required: "Position is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={positionsLoading || committeePositions.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={positionsLoading ? "Loading…" : committeePositions.length === 0 ? "No positions available" : "Select Position"} />
                        </SelectTrigger>
                        <SelectContent>
                          {committeePositions.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {error && <span className="text-xs text-destructive">{error.message}</span>}
                    </>
                  )}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} type="email" placeholder="Enter email address" />
                  )}
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Contact Number</label>
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Enter contact number" />
                  )}
                />
              </div>

              {/* Tenure */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Tenure</label>
                <Controller
                  name="tenure"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="e.g. 2020–2024" />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div className="rounded-xl border bg-card">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Profile Image</h3>
              <p className="text-sm text-muted-foreground mt-0.5">Upload a profile photo</p>
            </div>
            <div className="p-5">
              <Controller
                name="feature_image"
                control={control}
                rules={{ required: mode === "create" ? "An image is required" : false }}
                render={({ field, fieldState: { error } }) => (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => { field.onChange(e); handleImageChange(e); }}
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
                          <img src={showImage} alt="Preview" className="w-full h-full object-contain rounded-lg" />
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

          {/* Actions */}
          <div className="flex items-center gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => { reset(); removeImage(); setMode("view"); }}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                (!typesLoading && committeeTypes.length === 0) ||
                (!positionsLoading && committeePositions.length === 0)
              }
            >
              {mode === "update" ? "Update Member" : "Save Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

CreateMember.propTypes = {
  editSelectedItem: PropTypes.object,
  mode: PropTypes.string,
  setMode: PropTypes.func,
};

export default CreateMember;
