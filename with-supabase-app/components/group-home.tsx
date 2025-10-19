"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/ui/event-card";
import { Tabs } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  MapPin, 
  Globe, 
  Plus,
  Settings,
  Crown
} from "lucide-react";

interface Group {
  id: string;
  name: string;
  description?: string;
  location?: string;
  website?: string;
  privacy: 'public' | 'private';
  memberCount: number;
  adminCount: number;
  avatar?: string;
  coverImage?: string;
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

interface GroupHomeProps {
  group: Group;
  events: Event[];
  onJoinEvent?: (eventId: string) => void;
  onLeaveEvent?: (eventId: string) => void;
  onViewEventDetails?: (eventId: string) => void;
  onCreateEvent?: () => void;
  onEditGroup?: () => void;
}

export function GroupHome({
  group,
  events,
  onJoinEvent,
  onLeaveEvent,
  onViewEventDetails,
  onCreateEvent,
  onEditGroup
}: GroupHomeProps) {
  const [activeTab, setActiveTab] = useState("home");

  const upcomingEvents = events.filter(e => 
    e.status === 'published' && new Date(e.eventDate) > new Date()
  );
  const pastEvents = events.filter(e => 
    e.status === 'completed' || new Date(e.eventDate) <= new Date()
  );

  const renderHomeTab = () => (
    <div className="space-y-6">
      {/* Group Header */}
      <Card className="overflow-hidden">
        {group.coverImage && (
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            <img
              src={group.coverImage}
              alt={group.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Group Avatar */}
            <div className="flex-shrink-0">
              {group.avatar ? (
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {group.name}
                </h1>
                <Badge variant={group.privacy === 'public' ? 'default' : 'secondary'}>
                  {group.privacy}
                </Badge>
                {group.isAdmin && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Crown className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>

              {group.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {group.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{group.memberCount} members</span>
                </div>
                {group.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{group.location}</span>
                  </div>
                )}
                {group.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a 
                      href={group.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {group.isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEditGroup}
                className="flex-shrink-0"
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Group
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {upcomingEvents.length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Members</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {group.memberCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {group.adminCount}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Events Preview */}
      {upcomingEvents.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Upcoming Events
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab("events")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 2).map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={onJoinEvent}
                onLeave={onLeaveEvent}
                onViewDetails={onViewEventDetails}
                isAdmin={group.isAdmin}
              />
            ))}
          </div>
        </Card>
      )}
    </div>
  );

  const renderEventsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Events
        </h2>
        {(group.isAdmin || true) && ( // Allow all members to create events for now
          <Button onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {upcomingEvents.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={onJoinEvent}
                onLeave={onLeaveEvent}
                onViewDetails={onViewEventDetails}
                isAdmin={group.isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
            Past Events
          </h3>
          <div className="space-y-4">
            {pastEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoin={onJoinEvent}
                onLeave={onLeaveEvent}
                onViewDetails={onViewEventDetails}
                isAdmin={group.isAdmin}
              />
            ))}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <Card className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No events yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first event to get started
          </p>
          <Button onClick={onCreateEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Card>
      )}
    </div>
  );

  const renderMembersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Members
        </h2>
        {group.isAdmin && (
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Manage Members
          </Button>
        )}
      </div>

      <Card className="p-6">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Member Management
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            This feature will be available soon
          </p>
        </div>
      </Card>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        Group Settings
      </h2>

      <Card className="p-6">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Settings Panel
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Group settings will be available soon
          </p>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "home" && renderHomeTab()}
      {activeTab === "events" && renderEventsTab()}
      {activeTab === "members" && renderMembersTab()}
      {activeTab === "settings" && renderSettingsTab()}
    </div>
  );
}
