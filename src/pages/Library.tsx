import { useState } from "react";
import { Search, BookOpen, Check, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  available: boolean;
  copies: number;
  isbn: string;
}

const books: Book[] = [
  { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", category: "tech", available: true, copies: 3, isbn: "978-0262033848" },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", category: "tech", available: false, copies: 0, isbn: "978-0132350884" },
  { id: 3, title: "Design Patterns", author: "Gang of Four", category: "tech", available: true, copies: 2, isbn: "978-0201633610" },
  { id: 4, title: "The Pragmatic Programmer", author: "David Thomas", category: "tech", available: true, copies: 5, isbn: "978-0135957059" },
  { id: 5, title: "A Brief History of Time", author: "Stephen Hawking", category: "science", available: true, copies: 4, isbn: "978-0553380163" },
  { id: 6, title: "The Origin of Species", author: "Charles Darwin", category: "science", available: true, copies: 2, isbn: "978-0451529060" },
  { id: 7, title: "Cosmos", author: "Carl Sagan", category: "science", available: false, copies: 0, isbn: "978-0345539434" },
  { id: 8, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "humanities", available: true, copies: 3, isbn: "978-0374533557" },
  { id: 9, title: "Sapiens", author: "Yuval Noah Harari", category: "humanities", available: true, copies: 6, isbn: "978-0062316097" },
  { id: 10, title: "The Art of War", author: "Sun Tzu", category: "humanities", available: true, copies: 4, isbn: "978-1599869773" },
  { id: 11, title: "Meditations", author: "Marcus Aurelius", category: "humanities", available: false, copies: 0, isbn: "978-0140449334" },
  { id: 12, title: "Physics of the Impossible", author: "Michio Kaku", category: "science", available: true, copies: 2, isbn: "978-0307278821" },
];

const categories = [
  { id: "all", label: "All Books" },
  { id: "tech", label: "Technology" },
  { id: "science", label: "Science" },
  { id: "humanities", label: "Humanities" },
];

export default function Library() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || book.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleBorrow = (book: Book) => {
    if (book.available) {
      toast({
        title: "Book Reserved",
        description: `"${book.title}" has been reserved. Pick it up at the library within 24 hours.`,
      });
    } else {
      toast({
        title: "Join Waitlist",
        description: `You've been added to the waitlist for "${book.title}".`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Digital Library</h1>
        <p className="text-muted-foreground">
          Browse and borrow books from our collection
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by title or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="data-[state=active]:bg-card">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No books found</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBooks.map((book, index) => (
                <Card
                  key={book.id}
                  className="animate-slide-up overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="flex h-24 w-16 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight truncate">
                          {book.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {book.author}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ISBN: {book.isbn}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge
                            variant={book.available ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {book.available ? (
                              <>
                                <Check className="mr-1 h-3 w-3" />
                                {book.copies} available
                              </>
                            ) : (
                              <>
                                <Clock className="mr-1 h-3 w-3" />
                                Unavailable
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border p-3 bg-secondary/30">
                      <Button
                        size="sm"
                        variant={book.available ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleBorrow(book)}
                      >
                        {book.available ? "Borrow Book" : "Join Waitlist"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
