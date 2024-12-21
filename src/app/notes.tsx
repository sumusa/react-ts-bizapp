import { PageTemplate } from "@/components/page-template";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Star, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { AddNoteDialog } from "@/components/add-note-dialog";

const sampleNotes = [
  {
    id: 1,
    title: "Meeting with Suppliers",
    content: "Discuss new product line and pricing strategy",
    date: "2024-03-15",
    tags: ["Meeting", "Important"],
    starred: true,
  },
  {
    id: 2,
    title: "Marketing Campaign Ideas",
    content: "Social media strategy for Ramadan collection",
    date: "2024-03-14",
    tags: ["Marketing", "Planning"],
    starred: false,
  },
];

export default function NotesPage() {
  const notes = useState(sampleNotes)[0];
  const [filter, setFilter] = useState("all"); // all, starred, archived

  return (
    <PageTemplate mainSection="Notes" subSection="All Notes">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notes</h1>
          <AddNoteDialog>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </AddNoteDialog>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              variant={filter === "starred" ? "default" : "outline"}
              onClick={() => setFilter("starred")}
            >
              <Star className="mr-2 h-4 w-4" />
              Starred
            </Button>
            <Button
              variant={filter === "archived" ? "default" : "outline"}
              onClick={() => setFilter("archived")}
            >
              <Trash className="mr-2 h-4 w-4" />
              Archived
            </Button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="hover:bg-muted/50 cursor-pointer">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">
                  {note.title}
                </CardTitle>
                <Star
                  className={`h-4 w-4 ${
                    note.starred ? "fill-yellow-400 text-yellow-400" : ""
                  }`}
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {note.content}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{note.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}
