
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

const MAX_FILE_SIZE_MB = 5;
const MAX_STORY = 10000;

const ALLOWED_CATEGORIES = [
  { value: "childhood", label: "Childhood" },
  { value: "school-days", label: "School Days" },
  { value: "friendship", label: "Friendship" },
  { value: "first-love", label: "First Love" },
  { value: "old-technology", label: "Old Technology" },
  { value: "festivals", label: "Festivals" },
  { value: "village-life", label: "Village Life" },
  { value: "internet-era", label: "Internet Era" },
  { value: "36-july-memories", label: "36 July Memories" },
  { value: "other-memories", label: "Other Memories" },
];

const CreateMemory = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    story: "",
    category: "friendship",
    memoryYear: new Date().getFullYear(),
    location: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectFile = (file) => {
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(
        `That image is too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`
      );
      return;
    }

    setError("");
    setImageFile(file);
  };

  const handleFileChange = (e) => {
    selectFile(e.target.files?.[0]);
  };

  const removeImage = () => {
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(
      e.type === "dragenter" || e.type === "dragover"
    );
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      let uploadedImages = [];

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const uploadResponse = await api.post(
          "/v1/uploads/images",
          imageFormData
        );

        const imageData = uploadResponse.data?.data;

        if (!imageData?.url || !imageData?.assetId) {
          throw new Error(
            "Image upload failed. Please try again."
          );
        }

        uploadedImages = [
          {
            url: imageData.url,
            assetId: imageData.assetId,
            altText: imageData.altText || imageFile.name,
          },
        ];
      }

      const memoryPayload = {
        title: formData.title.trim(),
        story: formData.story.trim(),
        category: formData.category,
        memoryYear: formData.memoryYear
          ? Number(formData.memoryYear)
          : undefined,
        location: formData.location.trim(),
        tags: [],
        images: uploadedImages,
      };

      const memoryResponse = await api.post(
        "/v1/memories",
        memoryPayload
      );

      if (memoryResponse.status === 201) {
        navigate("/feed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Couldn't publish your memory. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-sm text-nostalgiaText placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nostalgiaAccent/50 focus:border-nostalgiaAccent transition";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-nostalgiaCard p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200/65">
        <header className="mb-8">
          <h1 className="text-2xl font-black text-nostalgiaText">
            Share your memory
          </h1>

          <p className="text-sm text-nostalgiaMuted mt-1">
            Add a photo and the story behind it.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
          >
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-nostalgiaText mb-2"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              name="title"
              required
              maxLength={120}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Sunset at Cox's Bazar"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-nostalgiaText mb-2"
            >
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClasses}
            >
              {ALLOWED_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="memoryYear"
                className="block text-sm font-medium text-nostalgiaText mb-2"
              >
                Year{" "}
                <span className="text-nostalgiaMuted">
                  (Optional)
                </span>
              </label>

              <input
                id="memoryYear"
                type="number"
                name="memoryYear"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.memoryYear}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-nostalgiaText mb-2"
              >
                Location{" "}
                <span className="text-nostalgiaMuted">
                  (Optional)
                </span>
              </label>

              <input
                id="location"
                type="text"
                name="location"
                maxLength={150}
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Dhaka, Bangladesh"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-nostalgiaText mb-2">
              Photo{" "}
              <span className="font-normal text-nostalgiaMuted">
                (Optional)
              </span>
            </span>

            <input
              ref={fileInputRef}
              id="image"
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="sr-only"
            />

            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white">
                <img
                  src={previewUrl}
                  alt="Selected memory preview"
                  className="w-full max-h-80 object-cover"
                />

                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 text-sm">
                  <span className="truncate text-nostalgiaMuted">
                    {imageFile?.name}
                  </span>

                  <div className="flex gap-4 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      className="font-medium text-nostalgiaAccent hover:underline"
                    >
                      Change
                    </button>

                    <button
                      type="button"
                      onClick={removeImage}
                      className="font-medium text-gray-500 hover:text-red-600 bg-blue-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label
                htmlFor="image"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-2 px-4 py-10 rounded-xl border-2 border-dashed cursor-pointer text-center transition ${
                  dragActive
                    ? "border-nostalgiaAccent bg-nostalgiaAccent/5"
                    : "border-gray-300 bg-white hover:border-nostalgiaAccent/60 hover:bg-nostalgiaAccent/5"
                }`}
              >
                <span className="text-sm text-nostalgiaText">
                  <span className="font-semibold text-nostalgiaAccent">
                    Choose a photo
                  </span>{" "}
                  or drag it here
                </span>

                <span className="text-xs text-nostalgiaMuted">
                  JPG, PNG or WebP, up to {MAX_FILE_SIZE_MB} MB
                </span>
              </label>
            )}
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label
                htmlFor="story"
                className="block text-sm font-medium text-nostalgiaText"
              >
                Story
              </label>

              <span
                className={`text-xs ${
                  formData.story.length > MAX_STORY * 0.9
                    ? "text-red-600"
                    : "text-nostalgiaMuted"
                }`}
              >
                {formData.story.length}/{MAX_STORY}
              </span>
            </div>

            <textarea
              id="story"
              name="story"
              required
              rows={5}
              maxLength={MAX_STORY}
              value={formData.story}
              onChange={handleChange}
              placeholder="What was happening? Who was there? Why does it matter to you?"
              className={`${inputClasses} resize-none leading-relaxed`}
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="sm:w-auto px-6 py-3.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-nostalgiaText hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-nostalgiaAccent hover:bg-[#ff5252] bg-blue-400 text-white text-sm font-semibold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {loading ? "Publishing…" : "Publish memory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMemory;