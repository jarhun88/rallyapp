"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock
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
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isJoined?: boolean;
  isWaitlisted?: boolean;
  waitlistPosition?: number;
}

interface EventCardProps {
  event: Event;
  onJoin?: (eventId: string) => void;
  onLeave?: (eventId: string) => void;
  onViewDetails?: (eventId: string) => void;
  isAdmin?: boolean;
  className?: string;
}

export function EventCard({ 
  event, 
  onJoin, 
  onLeave, 
  onViewDetails,
  isAdmin = false,
  className 
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  const isFull = event.maxParticipants && event.currentParticipants >= event.maxParticipants;
  const canJoin = event.status === 'published' && !event.isJoined && !isFull;
  const canLeave = event.isJoined && event.status === 'published';

  return (
    <Card className={cn("p-4 hover:shadow-md transition-shadow", className)}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
          <Badge className={cn("ml-2 flex-shrink-0", getStatusColor(event.status))}>
            {event.status}
          </Badge>
        </div>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span>{formatDate(event.eventDate)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 flex-shrink-0" />
            <span>
              {event.currentParticipants}
              {event.maxParticipants && ` / ${event.maxParticipants}`} participants
            </span>
            {isFull && (
              <Badge variant="secondary" className="text-xs">
                Full
              </Badge>
            )}
          </div>

          {/* Pricing */}
          {(event.entryFee > 0 || event.depositAmount > 0) && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <DollarSign className="h-4 w-4 flex-shrink-0" />
              <div className="flex gap-2">
                {event.entryFee > 0 && (
                  <span>Entry: {formatCurrency(event.entryFee)}</span>
                )}
                {event.depositAmount > 0 && (
                  <span>Deposit: {formatCurrency(event.depositAmount)}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Messages */}
        {event.isJoined && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>You're joined</span>
          </div>
        )}

        {event.isWaitlisted && event.waitlistPosition && (
          <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
            <Clock className="h-4 w-4" />
            <span>Waitlist position: #{event.waitlistPosition}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {canJoin && (
            <Button
              size="sm"
              onClick={() => onJoin?.(event.id)}
              className="flex-1"
            >
              Join Event
            </Button>
          )}

          {canLeave && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onLeave?.(event.id)}
              className="flex-1"
            >
              Leave Event
            </Button>
          )}

          {isFull && !event.isJoined && !event.isWaitlisted && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onJoin?.(event.id)}
              className="flex-1"
            >
              Join Waitlist
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails?.(event.id)}
            className="px-3"
          >
            {isAdmin ? "Edit" : "View"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
