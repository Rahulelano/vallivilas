import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash, Edit, Save, X } from "lucide-react";

interface Field {
    name: string;
    label: string;
    type: "text" | "number" | "boolean" | "textarea" | "select" | "image" | "multi-image";
    options?: { label: string; value: string }[];
}

interface SectionManagerProps {
    title: string;
    endpoint: string;
    fields: Field[];
}

const SectionManager = ({ title, endpoint, fields }: SectionManagerProps) => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const token = localStorage.getItem("admin-token");

    const { data: items, isLoading } = useQuery({
        queryKey: [endpoint],
        queryFn: async () => {
            const response = await fetch(`/api/admin/${endpoint}`, {
                headers: { "x-auth-token": token || "" },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ msg: "Server Error" }));
                throw new Error(errorData.msg || "Failed to fetch data");
            }
            return response.json();
        },
    });

    const mutation = useMutation({
        mutationFn: async ({ id, data }: { id?: string; data: any }) => {
            const isNew = !id || id === "new";
            const url = isNew
                ? `/api/admin/${endpoint}`
                : `/api/admin/${endpoint}/${id}`;
            const method = isNew ? "POST" : "PUT";

            const submitData = new FormData();

            // Only send fields that are defined in the component props
            fields.forEach(field => {
                if (field.type !== 'image' && data[field.name] !== undefined) {
                    let value = data[field.name];

                    // If it's a populated object, only send the ID
                    if (typeof value === 'object' && value !== null && value._id) {
                        value = value._id;
                    }

                    // Don't send empty strings for ObjectIds (like category)
                    if (field.name === 'category' && value === "") {
                        return; // Skip empty category
                    }

                    submitData.append(field.name, value);
                }
            });

            if (selectedFile) {
                submitData.append('image', selectedFile);
            } else if (data.image) {
                submitData.append('image', data.image);
            }

            if (galleryFiles.length > 0) {
                galleryFiles.forEach(file => {
                    submitData.append('gallery', file);
                });
            } else if (data.gallery && Array.isArray(data.gallery)) {
                // If no new files but we have existing gallery items to keep
                data.gallery.forEach((img: string) => {
                    submitData.append('existingGallery', img);
                });
            }

            const response = await fetch(url, {
                method,
                headers: {
                    "x-auth-token": token || "",
                },
                body: submitData,
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMsg = "Failed to save";
                try {
                    const errorJson = JSON.parse(text);
                    errorMsg = errorJson.error || errorJson.msg || errorMsg;
                } catch (e) {
                    console.error("Server returned non-JSON error:", text);
                }
                throw new Error(errorMsg);
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });
            toast.success("Saved successfully");
            setIsEditing(null);
            setFormData({});
            setSelectedFile(null);
            setGalleryFiles([]);
        },
        onError: (error: any) => {
            console.error("Save error detail:", error);
            toast.error(error.message || "Failed to save changes");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/admin/${endpoint}/${id}`, {
                method: "DELETE",
                headers: { "x-auth-token": token || "" },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [endpoint] });
            toast.success("Deleted successfully");
        },
    });

    const handleEdit = (item: any) => {
        setIsEditing(item._id);
        setFormData(item);
        setSelectedFile(null);
    };

    const handleSave = () => {
        mutation.mutate({ id: isEditing || undefined, data: formData });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    if (isLoading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-4 sm:p-8 max-w-full lg:max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{title}</h1>
                <button
                    onClick={() => {
                        setIsEditing("new");
                        setFormData({});
                        setSelectedFile(null);
                    }}
                    className="flex items-center gap-2 btn-primary px-4 py-2"
                >
                    <Plus size={20} /> Add New
                </button>
            </div>

            {isEditing && (
                <div className="bg-background p-6 rounded-xl border shadow-sm mb-8 animate-in fade-in zoom-in duration-200">
                    <h2 className="text-xl font-bold mb-4">{isEditing === "new" ? "Add New" : "Edit Item"}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((field) => (
                            <div key={field.name} className="space-y-1">
                                <label className="text-sm font-medium">{field.label}</label>
                                {field.type === "textarea" ? (
                                    <textarea
                                        className="w-full p-2 border rounded-md"
                                        value={formData[field.name] || ""}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    />
                                ) : field.type === "boolean" ? (
                                    <div className="flex items-center gap-2 py-2">
                                        <input
                                            type="checkbox"
                                            checked={formData[field.name] || false}
                                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.checked })}
                                        />
                                        <span>Active</span>
                                    </div>
                                ) : field.type === "image" ? (
                                    <div className="space-y-2">
                                        {(formData[field.name] || selectedFile) && (
                                            formData.type === 'video' || (selectedFile && selectedFile.type.startsWith('video')) ? (
                                                <video
                                                    src={selectedFile ? URL.createObjectURL(selectedFile) : `${formData[field.name]}`}
                                                    className="w-32 h-32 object-cover rounded-md border"
                                                    controls
                                                />
                                            ) : (
                                                <img
                                                    src={selectedFile ? URL.createObjectURL(selectedFile) : `${formData[field.name]}`}
                                                    alt="Preview"
                                                    className="w-32 h-32 object-cover rounded-md border"
                                                />
                                            )
                                        )}
                                        <input
                                            type="file"
                                            className="w-full text-sm"
                                            onChange={handleFileChange}
                                            accept="image/*,video/*"
                                        />
                                    </div>
                                ) : field.type === "multi-image" ? (
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Show existing gallery */}
                                            {formData[field.name] && Array.isArray(formData[field.name]) && formData[field.name].map((img: string, i: number) => (
                                                <div key={i} className="relative w-32 h-32">
                                                    <img
                                                        src={img.startsWith('http') ? img : `${img}`}
                                                        className="w-full h-full object-cover rounded-md border"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newGallery = formData[field.name].filter((_: any, index: number) => index !== i);
                                                            setFormData({ ...formData, [field.name]: newGallery });
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                            {/* Show newly selected gallery files */}
                                            {galleryFiles.map((file, i) => (
                                                <div key={`new-${i}`} className="relative w-32 h-32">
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        className="w-full h-full object-cover rounded-md border"
                                                    />
                                                    <button
                                                        onClick={() => {
                                                            const newFiles = [...galleryFiles];
                                                            newFiles.splice(i, 1);
                                                            setGalleryFiles(newFiles);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            className="w-full text-sm"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setGalleryFiles(Array.from(e.target.files));
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                    </div>
                                ) : field.type === "select" ? (
                                    <select
                                        className="w-full p-2 border rounded-md bg-background"
                                        value={typeof formData[field.name] === 'object' && formData[field.name] !== null ? formData[field.name]._id : formData[field.name] || ""}
                                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                    >
                                        <option value="">Select {field.label}</option>
                                        {field.options?.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type === "number" ? "number" : "text"}
                                        className="w-full p-2 border rounded-md"
                                        value={formData[field.name] || ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                [field.name]: field.type === "number" ? Number(e.target.value) : e.target.value,
                                            })
                                        }
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsEditing(null)} className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted">
                            <X size={20} /> Cancel
                        </button>
                        <button onClick={handleSave} className="flex items-center gap-2 btn-primary px-4 py-2">
                            <Save size={20} /> Save Changes
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-muted">
                            <tr>
                                {fields.map((f) => (
                                    <th key={f.name} className="text-left p-4 font-medium text-sm">
                                        {f.label}
                                    </th>
                                ))}
                                <th className="p-4 text-right sticky right-0 bg-muted shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-xs sm:text-sm">
                            {Array.isArray(items) && items.map((item: any) => (
                                <tr key={item._id} className="hover:bg-muted/50 transition-colors group">
                                    {fields.map((f) => (
                                        <td key={f.name} className="p-4 truncate max-w-[200px]">
                                            {f.type === "boolean" ? (item[f.name] ? "Yes" : "No") :
                                                f.type === "image" ? (
                                                    item.type === 'video' ? (
                                                        <video
                                                            src={item[f.name]?.startsWith('http') ? item[f.name] : `${item[f.name]}`}
                                                            className="w-16 h-16 object-cover rounded-md border"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={item[f.name]?.startsWith('http') ? item[f.name] : `${item[f.name]}`}
                                                            alt=""
                                                            className="w-16 h-16 object-cover rounded-md border"
                                                        />
                                                    )
                                                ) : typeof item[f.name] === 'object' && item[f.name] !== null ? (
                                                    item[f.name].name || item[f.name].title || JSON.stringify(item[f.name])
                                                ) : item[f.name]}
                                        </td>
                                    ))}
                                    <td className="p-4 text-right sticky right-0 bg-background group-hover:bg-muted/50 transition-colors shadow-[-4px_0_10px_-4px_rgba(0,0,0,0.1)]">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-2 hover:text-primary transition-colors bg-background/80 rounded-md border shadow-sm sm:shadow-none sm:border-none sm:bg-transparent">
                                                <Edit size={18} />
                                            </button>
                                            <button onClick={() => deleteMutation.mutate(item._id)} className="p-2 hover:text-red-600 transition-colors bg-background/80 rounded-md border shadow-sm sm:shadow-none sm:border-none sm:bg-transparent">
                                                <Trash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SectionManager;
