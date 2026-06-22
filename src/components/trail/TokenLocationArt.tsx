import { useEffect, useState } from 'react';
import { LOCATIONS } from '../../data/locations';
import type { PlacedWeaknessToken } from '../../types';

const BASE = import.meta.env.BASE_URL ?? '/';
const resolveUrl = (path: string) => `${BASE}${path.replace(/^\//, '')}`;
const FALLBACK_IMAGE = resolveUrl('images/locations/fallback.png');

const locationById = Object.fromEntries(LOCATIONS.map((l) => [l.id, l]));

export function TokenLocationArt({ token }: { token: PlacedWeaknessToken }) {
  const location = locationById[token.locationId];
  const resolvedImage = location?.image ? resolveUrl(location.image) : FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = useState(resolvedImage);

  useEffect(() => {
    setImgSrc(location?.image ? resolveUrl(location.image) : FALLBACK_IMAGE);
  }, [token.locationId]);
  return (
    <div className="relative h-24 bg-stone-900 overflow-hidden">
      <img
        src={imgSrc}
        alt={location?.name ?? `Location ${token.locationId}`}
        onError={() => setImgSrc(FALLBACK_IMAGE)}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 bg-stone-950/80 rounded-lg px-2 py-1 flex items-center gap-1.5">
        <span className="text-amber-400 font-bold text-sm">#{token.locationId}</span>
        <span className="text-stone-300 text-sm font-medium">{location?.name ?? '—'}</span>
      </div>
    </div>
  );
}
