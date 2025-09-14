import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  AlertTriangle,
  Plus,
  Heart,
  Star,
  MapPin,
  Calendar
} from "lucide-react";

interface Post {
  id: string;
  author: string;
  location: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
  isAlert?: boolean;
  alertType?: "pest" | "disease" | "weather";
  image?: string;
}

const CommunityHub = () => {
  const [newPost, setNewPost] = useState("");
  const [posts] = useState<Post[]>([
    {
      id: "1",
      author: "Ram Kumar",
      location: "Patna, Bihar",
      time: "2 hours ago",
      content: "Brown spots appearing on rice crop. What should I do? Has anyone faced this issue before?",
      likes: 12,
      comments: 8,
      isAlert: true,
      alertType: "disease",
    },
    {
      id: "2", 
      author: "Sunita Devi",
      location: "Muzaffarpur, Bihar",
      time: "4 hours ago",
      content: "Used SRI method for rice cultivation. Got 30% increase in yield! Highly recommend to everyone.",
      likes: 45,
      comments: 15,
    },
    {
      id: "3",
      author: "Anil Singh", 
      location: "Gaya, Bihar",
      time: "6 hours ago",
      content: "Heavy rain with strong winds last night. Wheat crop might be damaged. Any suggestions for recovery?",
      likes: 23,
      comments: 12,
      isAlert: true,
      alertType: "weather",
    },
  ]);

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      // Handle new post submission
      setNewPost("");
    }
  };

  const getAlertIcon = (type?: string) => {
    switch (type) {
      case "pest": return "Pest";
      case "disease": return "Disease";
      case "weather": return "Weather";
      default: return "Alert";
    }
  };

  const getAlertColor = (type?: string) => {
    switch (type) {
      case "pest": return "border-warning bg-warning/10";
      case "disease": return "border-destructive bg-destructive/10";
      case "weather": return "border-sky bg-sky/10";
      default: return "border-warning bg-warning/10";
    }
  };

  return (
    <section id="community" className="py-20 bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Community Hub
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share experiences with fellow farmers and help each other grow
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Sidebar - Create Post */}
          <div className="lg:col-span-1">
            <Card className="shadow-field mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create New Post
                </CardTitle>
                <CardDescription>
                  Share with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your experience, problem, or suggestion..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button variant="default" onClick={handlePostSubmit} className="flex-grow">
                    Post
                  </Button>
                  <Button variant="outline" className="px-4">
                    Attach
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card className="shadow-field">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Members</span>
                  <span className="font-bold text-primary">12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Today's Posts</span>
                  <span className="font-bold text-success">48</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Problems Solved</span>
                  <span className="font-bold text-saffron">156</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">New Alerts</span>
                  <span className="font-bold text-destructive">7</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Filter Bar */}
              <div className="flex flex-wrap gap-3">
                <Button variant="default" size="sm">All Posts</Button>
                <Button variant="outline" size="sm">Pest Alert</Button>
                <Button variant="outline" size="sm">Disease Warning</Button>
                <Button variant="outline" size="sm">Weather Update</Button>
                <Button variant="outline" size="sm">Tips</Button>
              </div>

              {/* Posts Feed */}
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className={`shadow-field ${post.isAlert ? `border-l-4 ${getAlertColor(post.alertType)}` : ''}`}
                >
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {post.author.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-foreground">{post.author}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{post.location}</span>
                            <span>•</span>
                            <Calendar className="h-3 w-3" />
                            <span>{post.time}</span>
                          </div>
                        </div>
                      </div>
                      {post.isAlert && (
                        <Badge variant="outline" className="bg-white">
                          {getAlertIcon(post.alertType)} Alert
                        </Badge>
                      )}
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-foreground">{post.content}</p>
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-6">
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {post.isAlert && (
                        <Button variant="saffron" size="sm">
                          Help
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Load More */}
              <div className="text-center">
                <Button variant="outline" size="lg">
                  Load More Posts
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
            Trending Topics Today
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="p-4 text-center hover:shadow-field transition-all duration-300 cursor-pointer">
              <h4 className="font-medium text-sm">Rice Production</h4>
              <p className="text-xs text-muted-foreground">245 discussions</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-field transition-all duration-300 cursor-pointer">
              <h4 className="font-medium text-sm">Pest Control</h4>
              <p className="text-xs text-muted-foreground">132 discussions</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-field transition-all duration-300 cursor-pointer">
              <h4 className="font-medium text-sm">Irrigation Techniques</h4>
              <p className="text-xs text-muted-foreground">89 discussions</p>
            </Card>
            <Card className="p-4 text-center hover:shadow-field transition-all duration-300 cursor-pointer">
              <h4 className="font-medium text-sm">Market Rates</h4>
              <p className="text-xs text-muted-foreground">156 discussions</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityHub;