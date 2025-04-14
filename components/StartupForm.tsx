"use client";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

const StartupForm = () => {
  const [errors, setErrors] = useState({});
  const [pitch, setPitch] = useState("**Hello world!!!**");

  const isPending = false;
  return (
    <>
      <div>
        <form action={() => {}} className="startup-form">
          <div>
            <label htmlFor="title" className="startup-form_label">
              Title
            </label>
            <Input
              id="title"
              name="title"
              className="startup-form_input"
              required
              placeholder="Startup Title"
            />

            {errors.title && (
              <p className="startup-form_error">{errors.title}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="startup-form_description">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              className="startup-form_input"
              required
              placeholder="Startup Description"
            />

            {errors.description && (
              <p className="startup-form_error">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="startup-form_label">
              Category
            </label>
            <Input
              id="category"
              name="category"
              className="startup-form_input"
              required
              placeholder="Startup Category (Tech, Health, Education...)"
            />

            {errors.category && (
              <p className="startup-form_error">{errors.category}</p>
            )}
          </div>
          <div>
            <label htmlFor="link" className="startup-form_label">
              Image URL
            </label>
            <Input
              id="link"
              name="link"
              className="startup-form_input"
              required
              placeholder="Startup Image URL"
            />

            {errors.link && <p className="startup-form_error">{errors.link}</p>}
          </div>
          <div data-color-mode="light">
            <label htmlFor="pitch" className="startup-form_label">
              Pitch
            </label>
            <MDEditor
              value={pitch}
              onChange={(value) => setPitch(value as string)}
              id="pitch"
              preview="edit"
              height={300}
              className="mt-3 border-2 focus:border-4"
              style={{ borderRadius: 20, overflow: "hidden" }}
              textareaProps={{
                placeholder:
                  "Briefly describe your idea and what problem it solves",
              }}
              previewOptions={{
                disallowedElements: ["style"],
              }}
            />

            {errors.pitch && (
              <p className="startup-form_error">{errors.pitch}</p>
            )}
          </div>
          <Button
            className="startup-form_btn cursor-pointer text-white"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "  Submit Your Pitch"}
            <Send className="ml-2 size-6" />
          </Button>
        </form>
      </div>
    </>
  );
};

export default StartupForm;
