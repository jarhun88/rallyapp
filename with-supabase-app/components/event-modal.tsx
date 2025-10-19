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
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  UserPlus,
  Crown,
  AlertCircle
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  joinedAt: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onCreateEvent?: (eventData: any) => void;
}

export function EventModal({
  isOpen,
  onClose,
  members,
  onCreateEvent
}: EventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    hosts: [] as string[],
    eventDate: "",
    eventTime: "",
    endDate: "",
    endTime: "",
    registrationDeposit: "",
    feeType: "flat" as "flat" | "total",
    feeAmount: "",
    minParticipants: "",
    maxParticipants: "",
    hasWaitlist: true
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        hosts: [],
        eventDate: "",
        eventTime: "",
        endDate: "",
        endTime: "",
        registrationDeposit: "",
        feeType: "flat",
        feeAmount: "",
        minParticipants: "",
        maxParticipants: "",
        hasWaitlist: true
      });
      setError(null);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHostToggle = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      hosts: prev.hosts.includes(memberId)
        ? prev.hosts.filter(id => id !== memberId)
        : [...prev.hosts, memberId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error("Event title is required");
      }
      if (!formData.eventDate || !formData.eventTime) {
        throw new Error("Event date and time are required");
      }
      if (formData.minParticipants && formData.maxParticipants) {
        const min = parseInt(formData.minParticipants);
        const max = parseInt(formData.maxParticipants);
        if (min > max) {
          throw new Error("Minimum participants cannot be greater than maximum participants");
        }
      }

      const eventData = {
        ...formData,
        registrationDeposit: formData.registrationDeposit ? parseFloat(formData.registrationDeposit) : 0,
        feeAmount: formData.feeAmount ? parseFloat(formData.feeAmount) : 0,
        minParticipants: formData.minParticipants ? parseInt(formData.minParticipants) : null,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : null,
        eventDateTime: new Date(`${formData.eventDate}T${formData.eventTime}`).toISOString(),
        endDateTime: formData.endDate && formData.endTime 
          ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString() 
          : null
      };

      await onCreateEvent?.(eventData);
      onClose();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      hosts: [],
      eventDate: "",
      eventTime: "",
      endDate: "",
      endTime: "",
      registrationDeposit: "",
      feeType: "flat",
      feeAmount: "",
      minParticipants: "",
      maxParticipants: "",
      hasWaitlist: true
    });
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
      title="Create Event"
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Event Details
          </h3>
          
          <div>
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter event title"
              required
              disabled={isLoading}
            />
          </div>

          {/* Host Selection */}
          <div>
            <Label>Event Hosts *</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Select group members to co-host this event
            </p>
            <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 dark:border-gray-600 rounded-md p-3">
              {members.map((member) => (
                <Card key={member.id} className="p-2">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={formData.hosts.includes(member.id)}
                      onCheckedChange={() => handleHostToggle(member.id)}
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
            {formData.hosts.length === 0 && (
              <p className="text-sm text-red-500 mt-1">Please select at least one host</p>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Date & Time
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventDate">Event Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => handleInputChange("eventDate", e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eventTime">Event Time *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => handleInputChange("eventTime", e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="endTime">End Time (Optional)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Pricing & Fees
          </h3>
          
          <div>
            <Label htmlFor="registrationDeposit">Registration Deposit (Optional)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="registrationDeposit"
                type="number"
                step="0.01"
                min="0"
                value={formData.registrationDeposit}
                onChange={(e) => handleInputChange("registrationDeposit", e.target.value)}
                placeholder="0.00"
                disabled={isLoading}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Amount participants pay upfront to secure their spot
            </p>
          </div>

          <div>
            <Label>Event Fee Structure</Label>
            <div className="space-y-3 mt-2">
              <div 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.feeType === "flat" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                onClick={() => !isLoading && handleInputChange("feeType", "flat")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.feeType === "flat" 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {formData.feeType === "flat" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Flat Rate Per Person</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Each participant pays the same amount
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.feeType === "total" 
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
                onClick={() => !isLoading && handleInputChange("feeType", "total")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.feeType === "total" 
                      ? "border-blue-500 bg-blue-500" 
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {formData.feeType === "total" && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">Total Cost Split</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total cost divided among participants
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="feeAmount">
              {formData.feeType === "flat" ? "Amount Per Person" : "Total Cost"}
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="feeAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.feeAmount}
                onChange={(e) => handleInputChange("feeAmount", e.target.value)}
                placeholder="0.00"
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Participants
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minParticipants">Minimum Participants</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="minParticipants"
                  type="number"
                  min="1"
                  value={formData.minParticipants}
                  onChange={(e) => handleInputChange("minParticipants", e.target.value)}
                  placeholder="1"
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                  placeholder="No limit"
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="hasWaitlist"
              checked={formData.hasWaitlist}
              onCheckedChange={(checked) => handleInputChange("hasWaitlist", checked)}
              disabled={isLoading}
            />
            <div>
              <Label htmlFor="hasWaitlist" className="cursor-pointer">
                Enable Waitlist
              </Label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allow participants to join a waitlist when event is full
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
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
            disabled={isLoading || !formData.title.trim() || formData.hosts.length === 0}
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
