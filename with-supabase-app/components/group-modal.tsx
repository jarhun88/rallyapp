"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Crown,
  UserPlus
} from "lucide-react";
import { CreateGroupData } from "@/api/objects/groups";

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  adminCount: number;
  avatar?: string;
  coverImage?: string;
  isAdmin?: boolean;
}

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  joinedAt: string;
}

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  group?: Group;
  members?: Member[];
  onCreateGroup?: (groupData: Partial<Group>) => void;
  onEditGroup?: (groupId: string, groupData: Partial<Group>, newAdmins: string[]) => void;
}

export function GroupModal({
  isOpen,
  onClose,
  mode,
  group,
  members = [],
  onCreateGroup,
  onEditGroup
}: GroupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when modal opens or group changes
  useEffect(() => {
    if (mode === "edit" && group) {
      setFormData({
        name: group.name || "",
        description: group.description || "",
      });
      
      // Set current admins as selected
      const currentAdmins = members.filter(member => member.isAdmin).map(member => member.id);
      setSelectedAdmins(currentAdmins);
    } else {
      // Reset form for create mode
      setFormData({
        name: "",
        description: "",
      });
      setSelectedAdmins([]);
    }
    setError(null);
  }, [mode, group, members]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdminToggle = (memberId: string) => {
    setSelectedAdmins(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        // Call the parent handler to create the group
        await onCreateGroup?.(formData);
      } else if (group) {
        await onEditGroup?.(group.id, formData, selectedAdmins);
      }
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setSelectedAdmins([]);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === "create" ? "Create Group" : "Edit Group"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="space-y-4"> 
          <div>
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter group name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your group..."
              rows={3}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          </div>
        </div>

        {/* Member Management (Edit Mode Only) */}
        {mode === "edit" && members.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Admin Management
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select members to make them group administrators
            </p>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {members.map((member) => (
                <Card key={member.id} className="p-3">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedAdmins.includes(member.id)}
                      onCheckedChange={() => handleAdminToggle(member.id)}
                      disabled={isLoading}
                    />
                    
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        {member.isAdmin && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Crown className="h-3 w-3" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {member.email}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !formData.name.trim()}
            className="flex-1"
          >
            {isLoading
              ? mode === "create"
                ? "Creating..."
                : "Saving..."
              : mode === "create"
              ? "Create Group"
              : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
