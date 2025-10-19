"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { EventDetailModal } from "@/components/ui/event-detail-modal";
import { GroupModal } from "@/components/group-modal";
import { EventModal } from "@/components/event-modal";

// Mock data for demonstration
const mockGroups = [
  {
    id: "1",
    name: "SF Running Club",
    memberCount: 45,
    avatar: undefined,
    isAdmin: true,
  },
  {
    id: "2", 
    name: "Tech Meetup SF",
    memberCount: 128,
    avatar: undefined,
    isAdmin: false,
  },
  {
    id: "3",
    name: "Book Club",
    memberCount: 12,
    avatar: undefined,
    isAdmin: false,
  },
];

const mockSelectedGroup = {
  id: "1",
  name: "SF Running Club",
  description: "A community of runners in San Francisco who love to explore the city on foot. We organize weekly runs, training sessions, and social events.",
  location: "San Francisco, CA",  
  privacy: "public" as const,
  memberCount: 45,
  adminCount: 3,
  avatar: undefined,
  coverImage: undefined,
  isAdmin: true,
};

const mockEvents = [
  {
    id: "1",
    title: "Golden Gate Park Run",
    description: "Join us for a scenic 5K run through Golden Gate Park. Perfect for all skill levels!",
    location: "Golden Gate Park, SF",
    eventDate: "2024-01-20T09:00:00Z",
    endDate: "2024-01-20T11:00:00Z",
    maxParticipants: 25,
    currentParticipants: 18,
    entryFee: 0,
    depositAmount: 0,
    status: "published" as const,
    isJoined: true,
    isWaitlisted: false,
  },
  {
    id: "2",
    title: "Marathon Training Session",
    description: "Intensive training session for upcoming marathon. Bring water and energy gels.",
    location: "Crissy Field, SF",
    eventDate: "2024-01-22T07:00:00Z",
    endDate: "2024-01-22T09:30:00Z",
    maxParticipants: 15,
    currentParticipants: 15,
    entryFee: 10,
    depositAmount: 5,
    status: "published" as const,
    isJoined: false,
    isWaitlisted: true,
    waitlistPosition: 3,
  },
  {
    id: "3",
    title: "Social Run & Brunch",
    description: "Easy 3-mile run followed by brunch at our favorite local spot.",
    location: "Mission District, SF",
    eventDate: "2024-01-25T10:00:00Z",
    endDate: "2024-01-25T13:00:00Z",
    maxParticipants: 20,
    currentParticipants: 12,
    entryFee: 25,
    depositAmount: 10,
    status: "published" as const,
    isJoined: false,
    isWaitlisted: false,
  },
  {
    id: "4",
    title: "Trail Running Adventure",
    description: "Explore the beautiful trails of Marin Headlands. Transportation provided.",
    location: "Marin Headlands, CA",
    eventDate: "2024-01-15T08:00:00Z",
    endDate: "2024-01-15T15:00:00Z",
    maxParticipants: 12,
    currentParticipants: 12,
    entryFee: 35,
    depositAmount: 15,
    status: "completed" as const,
    isJoined: true,
    isWaitlisted: false,
  },
];

export default function HomePage() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("1");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<"create" | "edit">("create");
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleCreateGroup = () => {
    setGroupModalMode("create");
    setIsGroupModalOpen(true);
  };

  const handleEditGroup = () => {
    setGroupModalMode("edit");
    setIsGroupModalOpen(true);
  };

  const handleCreateGroupSubmit = (groupData: any) => {
    console.log("Creating group:", groupData);
    // TODO: Implement actual group creation
    alert("Group created successfully! (This is a demo)");
    setIsGroupModalOpen(false);
  };

  const handleEditGroupSubmit = (groupId: string, groupData: any, newAdmins: string[]) => {
    console.log("Editing group:", groupId, groupData, newAdmins);
    // TODO: Implement actual group editing
    alert("Group updated successfully! (This is a demo)");
    setIsGroupModalOpen(false);
  };

  const handleJoinEvent = (eventId: string) => {
    console.log("Joining event:", eventId);
    // TODO: Implement actual join event functionality
    alert(`Successfully joined event ${eventId}! (This is a demo)`);
  };

  const handleLeaveEvent = (eventId: string) => {
    console.log("Leaving event:", eventId);
    // TODO: Implement actual leave event functionality
    alert(`Successfully left event ${eventId}! (This is a demo)`);
  };

  const handleViewEventDetails = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleCreateEvent = () => {
    setIsEventModalOpen(true);
  };

  const handleCreateEventSubmit = (eventData: any) => {
    console.log("Creating event:", eventData);
    // TODO: Implement actual event creation
    alert("Event created successfully! (This is a demo)");
    setIsEventModalOpen(false);
  };

  const handleRemoveParticipant = (eventId: string, participantId: string) => {
    console.log("Removing participant:", participantId, "from event:", eventId);
    // TODO: Implement actual remove participant functionality
    alert(`Successfully removed participant from event ${eventId}! (This is a demo)`);
  };

  const handleMoveFromWaitlist = (eventId: string, participantId: string) => {
    console.log("Moving participant from waitlist:", participantId, "for event:", eventId);
    // TODO: Implement actual move from waitlist functionality
    alert(`Successfully moved participant from waitlist to event ${eventId}! (This is a demo)`);
  };

  // Mock participants and waitlist data
  const mockParticipants = [
    {
      id: "1",
      name: "John Doe",
      avatar: undefined,
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      joinedAt: "2024-01-15T10:00:00Z",
      paymentStatus: "completed" as const,
      isAdmin: false,
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: undefined,
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      joinedAt: "2024-01-16T14:30:00Z",
      paymentStatus: "completed" as const,
      isAdmin: true,
    },
  ];

  const mockWaitlist = [
    {
      id: "3",
      name: "Bob Johnson",
      avatar: undefined,
      email: "bob@example.com",
      phone: "+1 (555) 456-7890",
      joinedAt: "2024-01-17T09:15:00Z",
      paymentStatus: "pending" as const,
      isAdmin: false,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const selectedEvent = selectedEventId ? mockEvents.find(e => e.id === selectedEventId) : null;
  const selectedGroup = selectedGroupId === "1" ? mockSelectedGroup : undefined;

  // Mock members data for the selected group
  const mockMembers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: undefined,
      isAdmin: false,
      joinedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: undefined,
      isAdmin: true,
      joinedAt: "2024-01-16T14:30:00Z",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      avatar: undefined,
      isAdmin: false,
      joinedAt: "2024-01-17T09:15:00Z",
    },
  ];

  return (
    <>
      <DashboardLayout
        groups={mockGroups}
        selectedGroup={selectedGroup}
        events={mockEvents}
        onGroupSelect={handleGroupSelect}
        onCreateGroup={handleCreateGroup}
        onJoinEvent={handleJoinEvent}
        onLeaveEvent={handleLeaveEvent}
        onViewEventDetails={handleViewEventDetails}
        onCreateEvent={handleCreateEvent}
        onEditGroup={handleEditGroup}
      />
      
      {selectedEvent && (
        <EventDetailModal
          event={{
            ...selectedEvent,
            postEventFee: 0, // Add missing property
          }}
          participants={mockParticipants}
          waitlist={mockWaitlist}
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          onJoin={handleJoinEvent}
          onLeave={handleLeaveEvent}
          onRemoveParticipant={handleRemoveParticipant}
          onMoveFromWaitlist={handleMoveFromWaitlist}
          isAdmin={mockSelectedGroup.isAdmin}
        />
      )}

      <GroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        mode={groupModalMode}
        group={groupModalMode === "edit" ? selectedGroup : undefined}
        members={groupModalMode === "edit" ? mockMembers : []}
        onCreateGroup={handleCreateGroupSubmit}
        onEditGroup={handleEditGroupSubmit}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        members={mockMembers}
        onCreateEvent={handleCreateEventSubmit}
      />
    </>
  );
}
