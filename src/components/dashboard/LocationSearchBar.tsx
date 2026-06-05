'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

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
  const placesLibrary = useMapsLibrary('places');
  const [inputValue, setInputValue] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Initialize Google Maps services when the library is loaded
  useEffect(() => {
    if (!placesLibrary) return;
    
    if (!autocompleteService.current) {
      autocompleteService.current = new placesLibrary.AutocompleteService();
    }
    
    if (!placesService.current) {
      // PlacesService requires a map instance or an HTML element
      const dummyDiv = document.createElement('div');
      placesService.current = new placesLibrary.PlacesService(dummyDiv);
    }
  }, [placesLibrary]);

  /**
   * Fetches place predictions from Google Places API
   */
  const fetchPredictions = useCallback((input: string) => {
    if (!autocompleteService.current || !input) {
      setPredictions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'lk' },
      },
      (results, status) => {
        if (placesLibrary && status === placesLibrary.PlacesServiceStatus.OK && results) {
          setPredictions(results);
        } else {
          setPredictions([]);
        }
      }
    );
  }, [placesLibrary]);

  /**
   * Effect to handle debouncing and prediction fetching
   */
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (inputValue.length > 2) {
      debounceTimer.current = setTimeout(() => {
        fetchPredictions(inputValue);
        setIsDropdownOpen(true);
      }, 300);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, fetchPredictions]);

  /**
   * Handles selection of a place from the dropdown
   */
  const handleSelectPrediction = async (prediction: google.maps.places.AutocompletePrediction) => {
    setInputValue(prediction.description);
    setIsDropdownOpen(false);

    try {
      if (!placesLibrary || !placesLibrary.Place) {
        console.error('Places library not fully loaded');
        return;
      }

      // Use the modern Place class from the library instance
      const place = new placesLibrary.Place({
        id: prediction.place_id
      });

      // Fetch required fields using the modern fetchFields method
      await place.fetchFields({
        fields: ['location', 'displayName']
      });

      if (place.location) {
        const lat = place.location.lat();
        const lng = place.location.lng();
        // Ensure we extract the text from displayName if it's a LocalizedText object
        let displayName = prediction.description;
        if (typeof place.displayName === 'string') {
          displayName = place.displayName;
        } else if (place.displayName && typeof place.displayName === 'object' && 'text' in place.displayName) {
          displayName = (place.displayName as { text: string }).text;
        }
          
        onLocationSelect({ lat, lng }, displayName);
      }
    } catch (err) {
      console.error('Failed to fetch place details:', err);
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
            if (predictions.length > 0) setIsDropdownOpen(true);
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
        <div className="absolute top-full left-0 w-full mt-4 bg-sys-layer-02 border border-white/10 rounded-4 shadow-floating z-50 overflow-hidden">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPrediction(prediction)}
              className="w-full text-left px-16 py-12 hover:bg-accent-primary/10 hover:text-white transition-colors border-b border-white/5 last:border-none flex items-start gap-12"
            >
              <span className="material-symbols-outlined text-[18px] mt-2 text-text-muted">place</span>
              <div>
                <p className="text-[14px] text-white font-medium">{prediction.structured_formatting.main_text}</p>
                <p className="text-[12px] text-text-secondary">{prediction.structured_formatting.secondary_text}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
