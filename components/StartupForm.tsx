"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";
import Image from "next/image";

const STORAGE_KEY = "startup_form_draft";

interface StartupFormData {
  title: string;
  description: string;
  category: string;
  link: string;
  pitch: string;
}

interface FormState {
  error: string;
  status: "INITIAL" | "SUCCESS" | "ERROR";
  _id?: string;
}

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<StartupFormData>({
    title: "",
    description: "",
    category: "",
    link: "",
    pitch: "",
  });
  const [pitch, setPitch] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [imageError, setImageError] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = async (
    prevState: FormState,
    formDataFromAction: FormData
  ) => {
    // formDataFromAction is required by useActionState signature but we use controlled inputs
    void formDataFromAction;
    try {
      // Mark all fields as touched for validation display
      setTouched({
        title: true,
        description: true,
        category: true,
        link: true,
        pitch: true,
      });

      const formValues = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        link: formData.link,
        pitch,
      };

      await formSchema.parseAsync(formValues);

      // Create FormData for the action
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title);
      submitFormData.append("description", formData.description);
      submitFormData.append("category", formData.category);
      submitFormData.append("link", formData.link);

      const result = await createPitch(prevState, submitFormData, pitch);

      if (result.status == "SUCCESS") {
        toast.success("Your startup pitch has been created successfully.");
        router.push(`/startup/${result._id}`);
      } else {
        toast.error(result.error || "Failed to create startup pitch");
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          if (path) {
            fieldErrors[path] = err.message;
          }
        });

        setErrors(fieldErrors);
        toast.error("Please check your inputs and try again");

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }
      toast.error("An unexpected error has occurred");

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        setPitch(parsed.pitch || "");
      } catch (error) {
        console.error("Failed to load saved form data:", error);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // Save to localStorage whenever form data changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      const dataToSave = { ...formData, pitch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, pitch, isInitialLoad]);

  // Real-time validation
  const validateField = async (name: string, value: string) => {
    if (!touched[name]) return;

    try {
      const testData = { ...formData, pitch, [name]: value };
      const result = await formSchema.safeParseAsync(testData);

      if (result.success) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      } else {
        const fieldError = result.error.errors.find(
          (err) => err.path[0] === name
        );
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
        } else {
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    } catch (error) {
      // Silently handle validation errors for real-time validation
      console.error("Validation error:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "link") {
      setImageError(false);
    }
    validateField(name, value);
  };

  const handlePitchChange = (value: string | undefined) => {
    const pitchValue = value || "";
    setPitch(pitchValue);
    setTouched((prev) => ({ ...prev, pitch: true }));
    validateField("pitch", pitchValue);
  };

  const handleBlur = (name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof StartupFormData] || pitch);
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  // Clear localStorage on successful submission
  useEffect(() => {
    if (state.status === "SUCCESS") {
      localStorage.removeItem(STORAGE_KEY);
      setFormData({
        title: "",
        description: "",
        category: "",
        link: "",
        pitch: "",
      });
      setPitch("");
      setTouched({});
      setErrors({});
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          onBlur={() => handleBlur("title")}
          className={`startup-form_input ${
            touched.title && errors.title ? "border-red-500" : ""
          }`}
          required
          placeholder="Startup Title (3-100 characters)"
        />
        {touched.title && errors.title && (
          <p className="startup-form_error mt-1 text-sm text-red-500">
            {errors.title}
          </p>
        )}
        {touched.title && !errors.title && formData.title && (
          <p className="mt-1 text-sm text-green-600">✓ Looks good</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          onBlur={() => handleBlur("description")}
          className={`startup-form_textarea ${
            touched.description && errors.description ? "border-red-500" : ""
          }`}
          required
          placeholder="Startup Description (20-500 characters)"
          rows={4}
        />
        <div className="flex justify-between items-center mt-1">
          {touched.description && errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
          {touched.description &&
            !errors.description &&
            formData.description && (
              <p className="text-sm text-green-600">✓ Looks good</p>
            )}
          <p
            className={`text-xs ml-auto ${
              formData.description.length > 500
                ? "text-red-500"
                : formData.description.length > 450
                  ? "text-yellow-500"
                  : "text-gray-500"
            }`}
          >
            {formData.description.length}/500
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category <span className="text-red-500">*</span>
        </label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          onBlur={() => handleBlur("category")}
          className={`startup-form_input ${
            touched.category && errors.category ? "border-red-500" : ""
          }`}
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />
        {touched.category && errors.category && (
          <p className="startup-form_error mt-1 text-sm text-red-500">
            {errors.category}
          </p>
        )}
        {touched.category && !errors.category && formData.category && (
          <p className="mt-1 text-sm text-green-600">✓ Looks good</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL <span className="text-red-500">*</span>
        </label>
        <Input
          id="link"
          name="link"
          value={formData.link}
          onChange={handleInputChange}
          onBlur={() => handleBlur("link")}
          className={`startup-form_input ${
            touched.link && errors.link ? "border-red-500" : ""
          }`}
          required
          placeholder="https://example.com/image.jpg"
          type="url"
        />
        {touched.link && errors.link && (
          <p className="startup-form_error mt-1 text-sm text-red-500">
            {errors.link}
          </p>
        )}
        {touched.link && !errors.link && formData.link && (
          <p className="mt-1 text-sm text-green-600">✓ Valid image URL</p>
        )}
        {formData.link && !errors.link && !imageError && (
          <div className="mt-2 relative w-full max-w-xs h-32">
            <Image
              src={formData.link}
              alt="Preview"
              fill
              className="object-cover rounded border"
              unoptimized
              onError={() => {
                setImageError(true);
              }}
            />
          </div>
        )}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch <span className="text-red-500">*</span>
        </label>

        <MDEditor
          value={pitch}
          onChange={handlePitchChange}
          onBlur={() => handleBlur("pitch")}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves (minimum 10 characters)",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        <div className="flex justify-between items-center mt-1">
          {touched.pitch && errors.pitch && (
            <p className="startup-form_error text-sm text-red-500">
              {errors.pitch}
            </p>
          )}
          {touched.pitch && !errors.pitch && pitch && (
            <p className="text-sm text-green-600">✓ Looks good</p>
          )}
          <p
            className={`text-xs ml-auto ${
              pitch.length < 10 ? "text-red-500" : "text-gray-500"
            }`}
          >
            {pitch.length} characters
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="startup-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
