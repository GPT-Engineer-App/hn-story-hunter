import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const fetchHNStories = async () => {
  const response = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=100');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['hnStories'],
    queryFn: fetchHNStories,
  });

  const filteredStories = data?.hits.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Top 100 Hacker News Stories</h1>
      <Input
        type="text"
        placeholder="Search stories..."
        className="mb-4 max-w-md mx-auto"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="space-y-4 max-w-4xl mx-auto">
        {isLoading ? (
          Array(10).fill().map((_, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))
        ) : (
          filteredStories.map(story => (
            <div key={story.objectID} className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">{story.title}</h2>
              <p className="text-gray-600 mb-2">Upvotes: {story.points}</p>
              <Button asChild variant="outline" size="sm">
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  Read More <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Index;
