// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getMyLinks,
  createLink,
  updateLink,
  deleteLink,
  reorderLinks,
  getSocialLinks,
  createSocialLink,
  deleteSocialLink,
  updateUserProfile,
  updateSocialLink,
  type Link,
  type SocialLink,
} from "../services/api";
import { ICONS_LIST, ICONS_MAP } from "../components/IconMap";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import { toast } from "react-hot-toast";
import { FaPen, FaTrash, FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableLinkItem } from "../components/SortableLinkItem";

const formatUrl = (url: string) => {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
};

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();

  // State for main links
  const [links, setLinks] = useState<Link[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedUrl, setEditedUrl] = useState("");

  // State for social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [selectedIcon, setSelectedIcon] = useState(ICONS_LIST[0].name);
  const [editingSocialId, setEditingSocialId] = useState<string | null>(null);
  const [editedSocialUrl, setEditedSocialUrl] = useState("");
  const [editedSocialIcon, setEditedSocialIcon] = useState("");

  // General state
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);
  const [bio, setBio] = useState(user?.bio || "");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    document.title = "Dashboard | Brevity";
    return () => {
      document.title = "Brevity";
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [userLinks, userSocialLinks] = await Promise.all([
          getMyLinks(token),
          getSocialLinks(token),
        ]);
        setLinks(userLinks.sort((a, b) => a.position - b.position));
        setSocialLinks(userSocialLinks);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  // --- Handlers for Main Links ---
  const handleCreateLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !newTitle || !newUrl) return;
    setIsSubmitting(true);
    try {
      const formattedUrl = formatUrl(newUrl);
      const newLink = await createLink(newTitle, formattedUrl, token);
      setLinks([...links, newLink]);
      setNewTitle("");
      setNewUrl("");
      toast.success("Link created successfully!");
    } catch (err) {
      toast.error("Failed to create link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLink = async (linkId: string) => {
    if (!token) return;
    try {
      const formattedUrl = formatUrl(editedUrl);
      const updatedData = { title: editedTitle, url: formattedUrl };
      const updatedLink = await updateLink(linkId, updatedData, token);
      setLinks(links.map((link) => (link._id === linkId ? updatedLink : link)));
      setEditingLinkId(null);
      toast.success("Link updated!");
    } catch (err) {
      toast.error("Failed to update link.");
    }
  };

  const handleDeleteLink = async () => {
    if (!token || !linkToDelete) return;
    try {
      await deleteLink(linkToDelete, token);
      setLinks(links.filter((link) => link._id !== linkToDelete));
      toast.success("Link deleted.");
    } catch (err) {
      toast.error("Failed to delete link.");
    } finally {
      closeDeleteModal();
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((currentLinks) => {
        const oldIndex = currentLinks.findIndex(
          (link) => link._id === active.id
        );
        const newIndex = currentLinks.findIndex((link) => link._id === over.id);
        const reorderedLinks = arrayMove(currentLinks, oldIndex, newIndex);
        if (token) {
          const orderedLinkIds = reorderedLinks.map((link) => link._id);
          reorderLinks(orderedLinkIds, token).catch(() => {
            toast.error("Failed to save new order.");
            setLinks(currentLinks);
          });
        }
        return reorderedLinks;
      });
    }
  };

  // --- Handlers for Social Links ---
  const handleCreateSocialLink = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!token || !newSocialUrl || !selectedIcon) return;
    try {
      const formattedUrl = formatUrl(newSocialUrl);
      const newSocial = await createSocialLink(
        { url: formattedUrl, iconName: selectedIcon },
        token
      );
      setSocialLinks([...socialLinks, newSocial]);
      setNewSocialUrl("");
      toast.success("Social link added!");
    } catch (err) {
      toast.error("Failed to add social link.");
    }
  };

  const handleDeleteSocialLink = async (id: string) => {
    if (!token) return;
    try {
      await deleteSocialLink(id, token);
      setSocialLinks(socialLinks.filter((sl) => sl._id !== id));
      toast.success("Social link removed.");
    } catch (err) {
      toast.error("Failed to remove social link.");
    }
  };

  const handleUpdateSocialLink = async () => {
    if (!token || !editingSocialId) return;
    try {
      const formattedUrl = formatUrl(editedSocialUrl);
      const updatedData = { url: formattedUrl, iconName: editedSocialIcon };
      const updatedLink = await updateSocialLink(
        editingSocialId,
        updatedData,
        token
      );
      setSocialLinks(
        socialLinks.map((sl) => (sl._id === editingSocialId ? updatedLink : sl))
      );
      handleCancelSocialEdit();
      toast.success("Social link updated!");
    } catch (err) {
      toast.error("Failed to update social link.");
    }
  };

  // --- Handlers for Profile & General UI ---
  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    try {
      await updateUserProfile({ bio }, token);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const handleEditClick = (link: Link) => {
    setEditingLinkId(link._id);
    setEditedTitle(link.title);
    setEditedUrl(link.url);
  };
  const handleCancelEdit = () => setEditingLinkId(null);
  const openDeleteModal = (linkId: string) => {
    setLinkToDelete(linkId);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setLinkToDelete(null);
    setIsDeleteModalOpen(false);
  };
  const handleEditSocialClick = (socialLink: SocialLink) => {
    setEditingSocialId(socialLink._id);
    setEditedSocialUrl(socialLink.url);
    setEditedSocialIcon(socialLink.iconName);
  };
  const handleCancelSocialEdit = () => setEditingSocialId(null);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.username}!</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-surface p-6 rounded-xl border-2 border-border shadow-[8px_8px_0px_#1A1A1A]">
            <h2 className="text-2xl font-semibold mb-4">Profile Settings</h2>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A short description..."
                  maxLength={160}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
              <Button type="submit">Save Profile</Button>
            </form>
          </div>
          <div className="bg-surface p-6 rounded-xl border-2 border-border shadow-[8px_8px_0px_#1A1A1A]">
            <h2 className="text-2xl font-semibold mb-4">Add a New Link</h2>
            <form onSubmit={handleCreateLink} className="space-y-4">
              <div>
                <label
                  htmlFor="newTitle"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <Input
                  id="newTitle"
                  type="text"
                  placeholder="My Portfolio"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  URL
                </label>
                <Input
                  id="newUrl"
                  type="text"
                  placeholder="your-link.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Link"}
              </Button>
            </form>
          </div>
          <div className="bg-surface p-6 rounded-xl border-2 border-border shadow-[8px_8px_0px_#1A1A1A]">
            <h2 className="text-2xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-3 mb-4">
              {socialLinks.map((sl) => (
                <div key={sl._id} className="bg-slate-100 p-2 rounded-lg">
                  {editingSocialId === sl._id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-6 gap-2">
                        {ICONS_LIST.map((iconInfo) => (
                          <button
                            type="button"
                            key={iconInfo.name}
                            onClick={() => setEditedSocialIcon(iconInfo.name)}
                            className={`p-3 rounded-md flex justify-center items-center border-2 transition-all ${
                              editedSocialIcon === iconInfo.name
                                ? "bg-primary border-border"
                                : "bg-slate-100 border-transparent hover:border-border"
                            }`}
                            title={iconInfo.displayName}
                          >
                            <iconInfo.component
                              size={24}
                              className="text-border"
                            />
                          </button>
                        ))}
                      </div>
                      <Input
                        value={editedSocialUrl}
                        onChange={(e) => setEditedSocialUrl(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateSocialLink}
                          className="w-auto flex items-center gap-2 !bg-green-500 hover:!bg-green-600 !text-black"
                        >
                          <FaSave /> Save
                        </Button>
                        <Button
                          onClick={handleCancelSocialEdit}
                          className="w-auto bg-gray-500 hover:bg-gray-600 flex items-center gap-2"
                        >
                          <MdCancel /> Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const iconInfo = ICONS_MAP[sl.iconName];
                          if (iconInfo) {
                            const IconComponent = iconInfo.component;
                            return <IconComponent size={24} />;
                          }
                          return null;
                        })()}
                        <a
                          href={sl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-600 hover:underline truncate"
                        >
                          {sl.url.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSocialClick(sl)}
                          className="p-1 rounded-full hover:bg-slate-200"
                        >
                          <FaPen className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteSocialLink(sl._id)}
                          className="p-1 rounded-full hover:bg-red-100"
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form
              onSubmit={handleCreateSocialLink}
              className="space-y-4 border-t-2 border-dashed pt-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {ICONS_LIST.map((iconInfo) => (
                    <button
                      type="button"
                      key={iconInfo.name}
                      onClick={() => setSelectedIcon(iconInfo.name)}
                      className={`p-3 rounded-md flex justify-center items-center border-2 transition-all ${
                        selectedIcon === iconInfo.name
                          ? "bg-primary border-border"
                          : "bg-slate-100 border-transparent hover:border-border"
                      }`}
                      title={iconInfo.displayName}
                    >
                      <iconInfo.component size={24} className="text-border" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="socialUrl"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Social URL
                </label>
                <Input
                  id="socialUrl"
                  type="text"
                  placeholder="your-profile-url.com"
                  value={newSocialUrl}
                  onChange={(e) => setNewSocialUrl(e.target.value)}
                  required
                />
              </div>
              <Button type="submit">Add Social Link</Button>
            </form>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-surface p-6 rounded-xl border-2 border-border shadow-[8px_8px_0px_#1A1A1A]">
            <h2 className="text-2xl font-semibold mb-2">
              My Links ({links.length})
            </h2>
            <div className="mt-4">
              {links.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map((l) => l._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {links.map((link) => (
                        <SortableLinkItem key={link._id} link={link}>
                          <div className="border-2 border-border p-4 rounded-lg bg-slate-50 cursor-grab active:cursor-grabbing">
                            {editingLinkId === link._id ? (
                              <div className="space-y-3">
                                <Input
                                  value={editedTitle}
                                  onChange={(e) =>
                                    setEditedTitle(e.target.value)
                                  }
                                />
                                <Input
                                  value={editedUrl}
                                  onChange={(e) => setEditedUrl(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleUpdateLink(link._id)}
                                    className="w-auto flex items-center gap-2 !bg-green-500 hover:!bg-green-600 !text-black"
                                  >
                                    <FaSave /> Save
                                  </Button>
                                  <Button
                                    onClick={handleCancelEdit}
                                    className="w-auto bg-gray-500 hover:bg-gray-600 flex items-center gap-2"
                                  >
                                    <MdCancel /> Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-lg text-slate-800 truncate">
                                    {link.title}
                                  </p>
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-primary break-all"
                                  >
                                    {link.url}
                                  </a>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                  <button
                                    onClick={() => handleEditClick(link)}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-blue-600 transition-colors"
                                    title="Edit"
                                  >
                                    <FaPen size={16} />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(link._id)}
                                    className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-red-600 transition-colors"
                                    title="Delete"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </SortableLinkItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                  <p>Your links will appear here.</p>
                  <p>Add one using the form to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h3 className="text-xl font-bold text-center mb-4">Delete Link</h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to permanently delete this link? This action
          cannot be undone.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={closeDeleteModal}
            className="w-full bg-gray-300 !text-black hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteLink}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardPage;
