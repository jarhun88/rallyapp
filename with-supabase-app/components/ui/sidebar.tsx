"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Settings, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  avatar?: string;
  isAdmin?: boolean;
}

interface SidebarProps {
  groups: Group[];
  selectedGroupId?: string;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
  className?: string;
}

export function Sidebar({ 
  groups, 
  selectedGroupId, 
  onGroupSelect, 
  onCreateGroup,
  className 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
        "lg:relative lg:translate-x-0 lg:z-auto",
        "fixed top-0 left-0 h-full z-50",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        isCollapsed ? "lg:w-16" : "lg:w-64",
        className
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  My Groups
                </h2>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateGroup}
                  className={cn(
                    "h-8 w-8 p-0",
                    isCollapsed ? "mx-auto" : ""
                  )}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="hidden lg:flex h-8 w-8 p-0"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  className="lg:hidden h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Groups List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-2">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedGroupId === group.id 
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => {
                    onGroupSelect(group.id);
                    setIsMobileOpen(false);
                  }}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-3">
                      {/* Group Avatar */}
                      <div className="flex-shrink-0">
                        {group.avatar ? (
                          <img
                            src={group.avatar}
                            alt={group.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {group.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {group.name}
                            </p>
                            {group.isAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {group.memberCount} members
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {groups.length === 0 && !isCollapsed && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    No groups yet
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onCreateGroup}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={onCreateGroup}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Group
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
