import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  Send, 
  Info, 
  UserPlus,
  Settings as SettingsIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function SupportGroup() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Mock data - replace with actual API
  const group = {
    id,
    name: "Morning Mindfulness",
    description: "Start your day with intention and mindfulness practice",
    category: "Mindfulness",
    members: 23,
    isPrivate: false,
    isMember: true,
    role: "member" // admin, moderator, member
  };

  const members = [
    { id: "1", name: "Sarah M.", initials: "SM", role: "admin" },
    { id: "2", name: "Alex K.", initials: "AK", role: "moderator" },
    { id: "3", name: "Jordan P.", initials: "JP", role: "member" },
    { id: "4", name: "Anonymous", initials: "?", role: "member" }
  ];

  const messages = [
    {
      id: "1",
      author: { name: "Sarah M.", initials: "SM" },
      content: "Good morning everyone! How is everyone feeling today?",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isAnonymous: false
    },
    {
      id: "2",
      author: { name: "Anonymous", initials: "?" },
      content: "Morning! Feeling a bit anxious but trying to stay present.",
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      isAnonymous: true
    },
    {
      id: "3",
      author: { name: "Alex K.", initials: "AK" },
      content: "That's great that you're practicing presence! Remember, anxiety is just a feeling, it will pass.",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isAnonymous: false
    },
    {
      id: "4",
      author: { name: "Jordan P.", initials: "JP" },
      content: "I've been doing the 5-4-3-2-1 grounding exercise when I wake up and it really helps!",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isAnonymous: false
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    toast({
      title: "Message sent",
      description: isAnonymous ? "Your anonymous message has been posted." : "Your message has been posted.",
    });
    setNewMessage("");
  };

  const handleJoinGroup = () => {
    toast({
      title: "Joined group",
      description: `You've joined ${group.name}!`,
    });
  };

  const handleLeaveGroup = () => {
    toast({
      title: "Left group",
      description: `You've left ${group.name}.`,
    });
    navigate("/community");
  };

  if (!group.isMember) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <AppBar 
          title="Support Group" 
          leftAction={
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
        />

        <div className="max-w-3xl mx-auto p-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <Badge variant="secondary">{group.category}</Badge>
              </div>
              <CardTitle className="text-2xl">{group.name}</CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{group.members} members</span>
                </div>
                {group.isPrivate && (
                  <Badge variant="outline">Private</Badge>
                )}
              </div>
              <Button className="w-full" onClick={handleJoinGroup}>
                <UserPlus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <AppBar 
        title={group.name}
        leftAction={
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      />

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full grid grid-cols-3 rounded-none h-12">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="members">Members ({group.members})</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
        </div>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">
                    {message.isAnonymous ? "?" : message.author.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">
                      {message.isAnonymous ? "Anonymous" : message.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(message.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-background p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              Post anonymously
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="p-4 space-y-2">
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                  {member.role === "admin" && (
                    <Badge>Admin</Badge>
                  )}
                  {member.role === "moderator" && (
                    <Badge variant="secondary">Moderator</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About This Group</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Category</h4>
                <Badge variant="secondary">{group.category}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Members</h4>
                <p className="text-sm text-muted-foreground">{group.members} active members</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Group Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Be respectful and supportive</p>
              <p>• Keep discussions relevant to the group topic</p>
              <p>• Maintain confidentiality</p>
              <p>• No medical advice</p>
              <p>• Report concerning content to moderators</p>
            </CardContent>
          </Card>

          {group.role === "admin" && (
            <Button variant="outline" className="w-full">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Manage Group
            </Button>
          )}

          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleLeaveGroup}
          >
            Leave Group
          </Button>
        </TabsContent>
      </Tabs>

      <BottomNav />
    </div>
  );
}
