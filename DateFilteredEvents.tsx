import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DateFilteredEventsProps {
  events: any[];
  showTodayOnly?: boolean;
  filterByStatus?: 'live' | 'scheduled' | 'all';
  onBetClick?: (event: any, oddType: 'home' | 'draw' | 'away') => void;
}

export function DateFilteredEvents({
  events,
  showTodayOnly = true,
  filterByStatus = 'all',
  onBetClick,
}: DateFilteredEventsProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState<string>('all');

  // Get today's date at midnight
  const getDateAtMidnight = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  // Get unique sports from events
  const uniqueSports = useMemo(() => {
    const sports = new Set<string>();
    events.forEach((event) => {
      if (event.sport) {
        sports.add(event.sport);
      }
    });
    return Array.from(sports).sort();
  }, [events]);

  // Filter events by date, sport, and status
  const filteredEvents = useMemo(() => {
    const selectedDateMs = getDateAtMidnight(selectedDate);
    
    return events.filter((event) => {
      // Date filter
      const eventTime = event.startTime || event.kickoffTime || event.eventTime || 0;
      const eventDateMs = getDateAtMidnight(new Date(eventTime));
      
      if (showTodayOnly && eventDateMs !== selectedDateMs) {
        return false;
      }
      
      if (!showTodayOnly && eventDateMs !== selectedDateMs) {
        return false;
      }

      // Sport filter
      if (selectedSport !== 'all' && event.sport !== selectedSport) {
        return false;
      }

      // Status filter
      if (filterByStatus !== 'all') {
        const eventStatus = (event.status || '').toLowerCase();
        if (filterByStatus === 'live' && eventStatus !== 'live') {
          return false;
        }
        if (filterByStatus === 'scheduled' && eventStatus !== 'scheduled') {
          return false;
        }
      }

      return true;
    });
  }, [events, selectedDate, selectedSport, filterByStatus, showTodayOnly]);

  // Group events by league
  const eventsByLeague = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    filteredEvents.forEach((event) => {
      const league = event.league || 'Unknown League';
      if (!grouped[league]) {
        grouped[league] = [];
      }
      grouped[league].push(event);
    });

    // Sort leagues by name
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredEvents]);

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSportEmoji = (sport: string) => {
    const sportEmojis: Record<string, string> = {
      'Football': '⚽',
      'Basketball': '🏀',
      'Tennis': '🎾',
      'Cricket': '🏏',
      'Volleyball': '🏐',
      'Formula 1': '🏎️',
      'Hockey': '🏒',
      'UFC': '🥊',
      'Boxing': '🥊',
      'Baseball': '⚾',
      'American Football': '🏈',
      'Rugby': '🏉',
    };
    return sportEmojis[sport] || '🏆';
  };

  return (
    <div className="w-full space-y-6">
      {/* Date Navigation */}
      {!showTodayOnly && (
        <div className="flex items-center justify-between gap-4 bg-gray-800 p-4 rounded-lg">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2 flex-1 justify-center">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-lg font-semibold text-white">
              {formatDate(selectedDate)}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="px-4"
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Sport Filter Bar */}
      {uniqueSports.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 bg-gray-800 p-4 rounded-lg">
          <Button
            variant={selectedSport === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSport('all')}
            className="whitespace-nowrap"
          >
            All Sports
          </Button>
          {uniqueSports.map((sport) => (
            <Button
              key={sport}
              variant={selectedSport === sport ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSport(sport)}
              className="whitespace-nowrap flex items-center gap-2"
            >
              <span>{getSportEmoji(sport)}</span>
              <span>{sport}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Events Display */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No events scheduled for {formatDate(selectedDate)}</p>
        </div>
      ) : (
        eventsByLeague.map(([league, leagueEvents]) => (
          <div key={league} className="space-y-4">
            {/* League Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 rounded-lg flex items-center justify-between">
              <span className="text-white font-bold text-lg">🏆 {league}</span>
              <span className="text-green-100 text-sm">{leagueEvents.length} matches</span>
            </div>

            {/* League Events Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-700 border-b-2 border-gray-600">
                    <th className="px-4 py-3 text-left text-white font-semibold">Match</th>
                    <th className="px-4 py-3 text-center text-white font-semibold">Time</th>
                    <th className="px-4 py-3 text-center text-white font-semibold">Home</th>
                    <th className="px-4 py-3 text-center text-white font-semibold">Draw</th>
                    <th className="px-4 py-3 text-center text-white font-semibold">Away</th>
                    <th className="px-4 py-3 text-center text-white font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueEvents.map((event, index) => (
                    <tr
                      key={event.id || index}
                      className={`border-b border-gray-700 hover:bg-gray-800 transition-colors ${
                        index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-semibold">
                            {event.homeTeam} vs {event.awayTeam}
                          </p>
                          <p className="text-gray-400 text-sm">{event.status}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">
                        {formatTime(event.startTime || event.kickoffTime || event.eventTime || Date.now())}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onBetClick?.(event, 'home')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-semibold transition-colors"
                        >
                          {event.odds?.home || event.homeOdds || '1.5'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onBetClick?.(event, 'draw')}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded font-semibold transition-colors"
                        >
                          {event.odds?.draw || event.drawOdds || '3.5'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onBetClick?.(event, 'away')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-semibold transition-colors"
                        >
                          {event.odds?.away || event.awayOdds || '2.0'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded font-semibold transition-colors">
                          More
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
