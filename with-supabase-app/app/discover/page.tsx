"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  Calendar,
  Star,
  TrendingUp,
  Globe,
  Lock,
  ArrowLeft,
  Plus
} from "lucide-react";
import { Group, getGroups } from "@/api/objects/groups";
import { createGroupMembership, getUserGroupMemberships, getGroupMemberCounts } from "@/api/objects/groupMemberships";

// Mock data for demonstration
const mockDiscoverGroups = [
  {
    id: "1",
    name: "SF Running Club",
    description: "A community of runners in San Francisco who love to explore the city on foot. We organize weekly runs, training sessions, and social events.",
    location: "San Francisco, CA",
    memberCount: 45,
    category: "Fitness",
    privacy: "public" as const,
    avatar: undefined,
    isJoined: false,
    isAdmin: false,
  },
  {
    id: "2", 
    name: "Tech Meetup SF",
    description: "Join the largest tech community in San Francisco. We host weekly meetups, workshops, and networking events for developers, designers, and entrepreneurs.",
    location: "San Francisco, CA",
    memberCount: 128,
    category: "Technology",
    privacy: "public" as const,
    avatar: undefined,
    isJoined: false,
    isAdmin: false,
  },
  {
    id: "3",
    name: "Book Club",
    description: "A cozy book club that meets monthly to discuss contemporary fiction, non-fiction, and classic literature. All reading levels welcome!",
    location: "Oakland, CA",
    memberCount: 12,
    category: "Education",
    privacy: "public" as const,
    avatar: undefined,
    isJoined: false,
    isAdmin: false,
  },
  {
    id: "4",
    name: "Photography Enthusiasts",
    description: "Capture the beauty of the Bay Area through photography. We organize photo walks, workshops, and gallery visits.",
    location: "Berkeley, CA",
    memberCount: 67,
    category: "Arts",
    privacy: "public" as const,
    avatar: undefined,
    isJoined: false,
    isAdmin: false,
  },
  {
    id: "5",
    name: "Foodie Adventures",
    description: "Discover the best restaurants, food trucks, and hidden culinary gems in the Bay Area. We organize group dining experiences and cooking classes.",
    location: "San Francisco, CA",
    memberCount: 89,
    category: "Food & Drink",
    privacy: "public" as const,
    avatar: undefined,
    isJoined: false,
    isAdmin: false,
  },
  {
    id: "6",
    name: "Hiking & Nature",
    description: "Explore the beautiful trails and natural landscapes of Northern California. All skill levels welcome for our weekend hiking adventures.",
    location: "Marin County, CA",
    memberCount: 156,
    category: "Outdoor",
    privacy: "public" as const,
    avatar: undefined,
    isJoined: false,
    isAdmin: false,
  },
];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [groups, setGroups] = useState<Group[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userMemberships, setUserMemberships] = useState<string[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }
        setUser(user);

        // Fetch groups
        const groupsData = await getGroups(1, 50); // Get first 50 groups
        setGroups(groupsData.groups);

        // Fetch user memberships
        const memberships = await getUserGroupMemberships(user.id);
        const membershipIds = memberships.map(m => m.group_id);
        setUserMemberships(membershipIds);

        // Fetch member counts for all groups
        const groupIds = groupsData.groups.map(g => g.id);
        const counts = await getGroupMemberCounts(groupIds);
        setMemberCounts(counts);

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, [router, supabase.auth]);

  useEffect(() => {
    let filtered = groups;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Note: Category filtering removed since our Group interface doesn't have category
    // You can add this field to your database schema if needed

    // Sort groups
    switch (sortBy) {
      case "popular":
        // Sort by member count (most popular first)
        filtered = filtered.sort((a, b) => {
          const countA = memberCounts[a.id] || 0;
          const countB = memberCounts[b.id] || 0;
          return countB - countA;
        });
        break;
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "name":
        filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredGroups(filtered);
  }, [searchQuery, sortBy, groups, memberCounts]);

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      await createGroupMembership({
        group_id: groupId,
        user_id: user.id,
      });
      
      // Update local state
      setUserMemberships(prev => [...prev, groupId]);
      
      // Update member count
      setMemberCounts(prev => ({
        ...prev,
        [groupId]: (prev[groupId] || 0) + 1
      }));
      
      alert("Successfully joined the group!");
    } catch (error) {
      console.error('Error joining group:', error);
      alert("Failed to join group. Please try again.");
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      // TODO: Implement leave group functionality
      // For now, just update the local state
      setUserMemberships(prev => prev.filter(id => id !== groupId));
      
      // Update member count
      setMemberCounts(prev => ({
        ...prev,
        [groupId]: Math.max(0, (prev[groupId] || 1) - 1)
      }));
      
      alert("Successfully left the group!");
    } catch (error) {
      console.error('Error leaving group:', error);
      alert("Failed to leave group. Please try again.");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Discover Groups
              </h1>
            </div>
            <Button onClick={() => router.push("/home")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search groups, locations, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Note: Category filtering removed since our Group schema doesn't include categories */}
          {/* You can add a category field to your database schema if needed */}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const isJoined = userMemberships.includes(group.id);
            const memberCount = memberCounts[group.id] || 0;
            
            return (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        {group.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(group.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-green-500" />
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {group.description || "No description available."}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {memberCount} member{memberCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isJoined ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLeaveGroup(group.id)}
                      className="flex-1"
                    >
                      Leave Group
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleJoinGroup(group.id)}
                      className="flex-1"
                    >
                      Join Group
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No groups found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters to find more groups.
            </p>
            <Button onClick={() => {
              setSearchQuery("");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
