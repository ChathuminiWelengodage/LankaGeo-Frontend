'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface LocationSearchBarProps {
  onLocationSelect: (coords: { lat: number; lng: number }, name: string) => void;
  isLoading?: boolean;
  errorMessage?: string;
  onInputChange?: () => void;
}

/**
 * LocationSearchBar component providing Google Places autocomplete functionality.
 * Restricted to Sri Lanka (LK) and debounced at 300ms.
 */
export default function LocationSearchBar({ 
  onLocationSelect, 
  isLoading = false,
  errorMessage,
  onInputChange
}: LocationSearchBarProps) {
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetches place predictions from Google Places API (New)
   */
  const fetchPredictions = useCallback(async (input: string) => {
    if (!input) {
      setPredictions([]);
      return;
    }

    try {
      const { AutocompleteSuggestion } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
      const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        includedRegionCodes: ['LK'],
      });
      
      setPredictions(suggestions);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    }
  }, []);

  /**
   * Effect to handle debouncing and prediction fetching
   */
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (inputValue.length > 2 && inputValue !== selectedPlace) {
      debounceTimer.current = setTimeout(() => {
        fetchPredictions(inputValue);
        setIsDropdownOpen(true);
      }, 300);
    } else {
      setIsDropdownOpen(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, fetchPredictions, selectedPlace]);

  /**
   * Handles selection of a place from the dropdown
   */
  const handleSelectPrediction = async (suggestion: google.maps.places.AutocompleteSuggestion) => {
    const prediction = suggestion.placePrediction;
    if (!prediction) return;

    const placeName = prediction.text.toString();
    setInputValue(placeName);
    setSelectedPlace(placeName);
    setIsDropdownOpen(false);
    setPredictions([]);

    try {
      const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;
      const place = new Place({ id: prediction.placeId });
      
      await place.fetchFields({ 
        fields: ['location', 'displayName'] 
      });
      
      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();
        onLocationSelect({ lat, lng }, place.displayName || placeName);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  return (
    <div className="relative w-full group">
      <div className={`carbon-input-container h-48 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
        <span className="material-symbols-outlined ml-16 text-text-muted group-focus-within:text-accent-primary transition-colors">
          location_on
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const value = e.target.value;
            setInputValue(value);
            if (value !== selectedPlace) {
              setSelectedPlace(null);
            }
            if (onInputChange) onInputChange();
            if (value.length <= 2) {
              setPredictions([]);
              setIsDropdownOpen(false);
            }
          }}
          placeholder="Search location in Sri Lanka..."
          className={`carbon-input ${errorMessage ? 'border-ruby-alert/50' : ''}`}
          disabled={isLoading}
          onBlur={() => {
            // Delay closing dropdown to allow click events on suggestions
            setTimeout(() => setIsDropdownOpen(false), 200);
          }}
          onFocus={() => {
            if (predictions.length > 0 && inputValue !== selectedPlace) {
              setIsDropdownOpen(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && predictions.length > 0) {
              handleSelectPrediction(predictions[0]);
            }
          }}
        />
        {isLoading && (
          <div className="mr-16">
            <div className="w-16 h-16 border-2 border-accent-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="mt-4 px-4 flex items-center gap-6 animate-in fade-in slide-in-from-top-1 duration-300">
          <span className="material-symbols-outlined text-ruby-alert text-[14px]">error</span>
          <p className="text-ruby-alert text-[12px] font-medium">{errorMessage}</p>
        </div>
      )}

      {isDropdownOpen && predictions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-4 bg-sys-layer-02 border border-white/10 rounded-4 shadow-floating z-50 overflow-y-auto max-h-[320px] custom-scrollbar">
          {predictions.map((suggestion, index) => {
            const prediction = suggestion.placePrediction;
            if (!prediction) return null;
            
            return (
              <button
                key={prediction.placeId || index}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent input blur from firing first
                  handleSelectPrediction(suggestion);
                }}
                className="w-full text-left px-12 py-8 hover:bg-accent-primary/10 hover:text-white transition-colors border-b border-white/5 last:border-none flex items-start gap-10"
              >
                <span className="material-symbols-outlined text-[16px] mt-2 text-text-muted">place</span>
                <div className="min-w-0">
                  <p className="text-[13px] text-white font-medium truncate">{prediction.mainText?.text}</p>
                  <p className="text-[11px] text-text-secondary truncate">{prediction.secondaryText?.text}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
