"use client";

import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { GroupHome } from "@/components/group-home";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutButton } from "@/components/logout-button";
import { 
  Users, 
  Plus, 
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  HelpCircle
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  avatar?: string;
  isAdmin?: boolean;
}

interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  eventDate: string;
  endDate?: string;
  maxParticipants?: number;
  currentParticipants: number;
  entryFee: number;
  depositAmount: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isJoined?: boolean;
  isWaitlisted?: boolean;
  waitlistPosition?: number;
}

interface DashboardLayoutProps {
  groups: Group[];
  selectedGroup?: Group & {
    description?: string;
    adminCount: number;
    avatar?: string;
    coverImage?: string;
    isAdmin?: boolean;
  };
  events: Event[];
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: () => void;
  onJoinEvent?: (eventId: string) => void;
  onLeaveEvent?: (eventId: string) => void;
  onViewEventDetails?: (eventId: string) => void;
  onCreateEvent?: () => void;
  onEditGroup?: () => void;
}

export function DashboardLayout({
  groups,
  selectedGroup,
  events,
  onGroupSelect,
  onCreateGroup,
  onJoinEvent,
  onLeaveEvent,
  onViewEventDetails,
  onCreateEvent,
  onEditGroup
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderNoGroupSelected = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="p-8 max-w-md w-full text-center">
        <Users className="h-16 w-16 text-gray-400 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Rally
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Select a group from the sidebar to get started, or create a new group to begin organizing events.
        </p>
        <div className="space-y-3">
          <Button onClick={onCreateGroup} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Group
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.location.href = '/discover'}
          >
            <Search className="h-4 w-4 mr-2" />
            Discover Groups
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar
        groups={groups}
        selectedGroupId={selectedGroup?.id}
        onGroupSelect={onGroupSelect}
        onCreateGroup={onCreateGroup}
        className="flex-shrink-0"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedGroup ? selectedGroup.name : "Rally"}
              </h1>
              {selectedGroup && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedGroup.memberCount} members
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/discover'}
                title="Discover Groups"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              
              {/* Settings Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {selectedGroup ? (
            <GroupHome
              group={selectedGroup}
              events={events}
              onJoinEvent={onJoinEvent}
              onLeaveEvent={onLeaveEvent}
              onViewEventDetails={onViewEventDetails}
              onCreateEvent={onCreateEvent}
              onEditGroup={onEditGroup}
            />
          ) : (
            renderNoGroupSelected()
          )}
        </main>
      </div>
    </div>
  );
}
