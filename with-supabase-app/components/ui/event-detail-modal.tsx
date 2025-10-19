"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock,
  X,
  UserPlus,
  UserMinus,
  Crown,
  Phone,
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  postEventFee: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isJoined?: boolean;
  isWaitlisted?: boolean;
  waitlistPosition?: number;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  joinedAt: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  isAdmin?: boolean;
}

interface EventDetailModalProps {
  event: Event;
  participants: Participant[];
  waitlist: Participant[];
  isOpen: boolean;
  onClose: () => void;
  onJoin?: (eventId: string) => void;
  onLeave?: (eventId: string) => void;
  onRemoveParticipant?: (eventId: string, participantId: string) => void;
  onMoveFromWaitlist?: (eventId: string, participantId: string) => void;
  isAdmin?: boolean;
  className?: string;
}

export function EventDetailModal({
  event,
  participants,
  waitlist,
  isOpen,
  onClose,
  onJoin,
  onLeave,
  onRemoveParticipant,
  onMoveFromWaitlist,
  isAdmin = false
}: EventDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'participants' | 'waitlist'>('details');

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const isFull = event.maxParticipants && event.currentParticipants >= event.maxParticipants;
  const canJoin = event.status === 'published' && !event.isJoined && !isFull;
  const canLeave = event.isJoined && event.status === 'published';

  const renderDetailsTab = () => (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {event.title}
          </h2>
          <Badge className={cn("mb-4", getStatusColor(event.status))}>
            {event.status}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Event Description */}
      {event.description && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Description
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {event.description}
          </p>
        </div>
      )}

      {/* Event Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatDate(event.eventDate)}
            </p>
            {event.endDate && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ends: {formatDate(event.endDate)}
              </p>
            )}
          </div>
        </div>

        {event.location && (
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-gray-500" />
            <p className="text-gray-900 dark:text-white">{event.location}</p>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-gray-500" />
          <p className="text-gray-900 dark:text-white">
            {event.currentParticipants}
            {event.maxParticipants && ` / ${event.maxParticipants}`} participants
            {isFull && <span className="text-red-600 ml-2">(Full)</span>}
          </p>
        </div>

        {/* Pricing */}
        {(event.entryFee > 0 || event.depositAmount > 0 || event.postEventFee > 0) && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">Pricing</span>
            </div>
            <div className="ml-8 space-y-1">
              {event.entryFee > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Entry Fee: {formatCurrency(event.entryFee)}
                </p>
              )}
              {event.depositAmount > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deposit: {formatCurrency(event.depositAmount)}
                </p>
              )}
              {event.postEventFee > 0 && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Post-Event Fee: {formatCurrency(event.postEventFee)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {event.isJoined && (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span>You're joined to this event</span>
        </div>
      )}

      {event.isWaitlisted && event.waitlistPosition && (
        <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <Clock className="h-4 w-4" />
          <span>You're on the waitlist (position #{event.waitlistPosition})</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        {canJoin && (
          <Button onClick={() => onJoin?.(event.id)} className="flex-1">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Event
          </Button>
        )}

        {canLeave && (
          <Button
            variant="outline"
            onClick={() => onLeave?.(event.id)}
            className="flex-1"
          >
            <UserMinus className="h-4 w-4 mr-2" />
            Leave Event
          </Button>
        )}

        {isFull && !event.isJoined && !event.isWaitlisted && (
          <Button
            variant="outline"
            onClick={() => onJoin?.(event.id)}
            className="flex-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            Join Waitlist
          </Button>
        )}
      </div>
    </div>
  );

  const renderParticipantsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Participants ({participants.length})
        </h3>
        {isAdmin && (
          <Button variant="outline" size="sm">
            Export List
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {participants.map((participant) => (
          <Card key={participant.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {participant.avatar ? (
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {participant.name}
                    </p>
                    {participant.isAdmin && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined {new Date(participant.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPaymentStatusColor(participant.paymentStatus)}>
                  {participant.paymentStatus}
                </Badge>
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveParticipant?.(event.id, participant.id)}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderWaitlistTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Waitlist ({waitlist.length})
        </h3>
        {isAdmin && waitlist.length > 0 && (
          <Button variant="outline" size="sm">
            Clear Waitlist
          </Button>
        )}
      </div>

      {waitlist.length === 0 ? (
        <Card className="p-8 text-center">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No one on the waitlist yet
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {waitlist.map((participant, index) => (
            <Card key={participant.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium">
                    {index + 1}
                  </div>
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {participant.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Added {new Date(participant.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveFromWaitlist?.(event.id, participant.id)}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'details', label: 'Details' },
                { id: 'participants', label: 'Participants' },
                { id: 'waitlist', label: 'Waitlist' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'details' && renderDetailsTab()}
            {activeTab === 'participants' && renderParticipantsTab()}
            {activeTab === 'waitlist' && renderWaitlistTab()}
          </div>
        </div>
      </Card>
    </div>
  );
}
