import { useState } from 'react';
import type { MonsterCard } from '../../types';

type Section = 'deck' | 'discard' | 'pool';

interface DeckEditorModalProps {
  deck: MonsterCard[];
  discardPile: MonsterCard[];
  undealtPool: MonsterCard[];
  onRemoveFromDeck: (cardId: string) => void;
  onAddFromDiscard: (cardId: string) => void;
  onAddFromPool: (cardId: string) => void;
  onClose: () => void;
}

function cardLabel(card: MonsterCard): string {
  if (card.bottom) return `${card.top.name} / ${card.bottom.name}`;
  return card.top.name;
}

function CardRow({
  card,
  actionLabel,
  actionClass,
  onAction,
}: {
  card: MonsterCard;
  actionLabel: string;
  actionClass: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-stone-700/50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm text-stone-200 truncate">{cardLabel(card)}</div>
        {card.top.attack != null && (
          <div className="text-xs text-stone-500">ATK {card.top.attack}</div>
        )}
      </div>
      <button
        onClick={onAction}
        className={`shrink-0 py-1 px-3 rounded-lg text-xs font-semibold transition-colors ${actionClass}`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

function SectionHeader({
  label,
  count,
  color,
  open,
  onToggle,
  onRandom,
  randomDisabled,
}: {
  label: string;
  count: number;
  color: string;
  open: boolean;
  onToggle: () => void;
  onRandom?: () => void;
  randomDisabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 text-left"
    >
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${color}`}>{label}</span>
        <span className="bg-stone-700 text-stone-300 rounded-full text-xs px-2 py-0.5">{count}</span>
      </div>
      <div className="flex items-center gap-2">
        {onRandom && (
          <span
            role="button"
            aria-label={`Random ${label}`}
            onClick={(e) => { e.stopPropagation(); if (!randomDisabled) onRandom(); }}
            className={`text-xs px-2 py-1 rounded-lg border transition-colors select-none ${
              randomDisabled
                ? 'text-stone-600 border-stone-700 cursor-not-allowed'
                : 'text-stone-300 border-stone-600 hover:border-amber-500 hover:text-amber-400 cursor-pointer'
            }`}
          >
            🎲 Random
          </span>
        )}
        <span className="text-stone-500 text-sm">{open ? '▲' : '▼'}</span>
      </div>
    </button>
  );
}

export function DeckEditorModal({
  deck,
  discardPile,
  undealtPool,
  onRemoveFromDeck,
  onAddFromDiscard,
  onAddFromPool,
  onClose,
}: DeckEditorModalProps) {
  const [open, setOpen] = useState<Set<Section>>(new Set());

  const toggle = (s: Section) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  const pickRandom = (cards: { id: string }[], action: (id: string) => void) => {
    if (cards.length === 0) return;
    const card = cards[Math.floor(Math.random() * cards.length)];
    action(card.id);
  };

  return (
    <div className="fixed inset-0 bg-stone-950/90 flex items-end sm:items-center justify-center z-50">
      <div className="bg-stone-900 border border-stone-700 rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85dvh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-700 shrink-0">
          <h2 className="text-lg font-bold text-amber-400">Edit Deck</h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-200 text-xl leading-none transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 divide-y divide-stone-700/50">
          {/* ── Deck section ── */}
          <div>
            <SectionHeader
              label="In Deck"
              count={deck.length}
              color="text-stone-200"
              open={open.has('deck')}
              onToggle={() => toggle('deck')}
              onRandom={() => pickRandom(deck, onRemoveFromDeck)}
              randomDisabled={deck.length === 0}
            />
            {open.has('deck') && (
              <div className="pb-3">
                {deck.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">Deck is empty.</p>
                ) : (
                  deck.map((card) => (
                    <CardRow
                      key={card.id}
                      card={card}
                      actionLabel="Remove"
                      actionClass="bg-red-900/60 hover:bg-red-800 text-red-300 border border-red-800"
                      onAction={() => onRemoveFromDeck(card.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* ── Discard section ── */}
          <div>
            <SectionHeader
              label="In Discard"
              count={discardPile.length}
              color="text-stone-400"
              open={open.has('discard')}
              onToggle={() => toggle('discard')}
              onRandom={() => pickRandom(discardPile, onAddFromDiscard)}
              randomDisabled={discardPile.length === 0}
            />
            {open.has('discard') && (
              <div className="pb-3">
                {discardPile.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">Discard pile is empty.</p>
                ) : (
                  discardPile.map((card) => (
                    <CardRow
                      key={card.id}
                      card={card}
                      actionLabel="Add back"
                      actionClass="bg-amber-900/60 hover:bg-amber-800 text-amber-300 border border-amber-800"
                      onAction={() => onAddFromDiscard(card.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* ── Undealt pool section ── */}
          <div>
            <SectionHeader
              label="Undealt Pool"
              count={undealtPool.length}
              color="text-stone-400"
              open={open.has('pool')}
              onToggle={() => toggle('pool')}
              onRandom={() => pickRandom(undealtPool, onAddFromPool)}
              randomDisabled={undealtPool.length === 0}
            />
            {open.has('pool') && (
              <div className="pb-3">
                {undealtPool.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2">No cards in pool.</p>
                ) : (
                  undealtPool.map((card) => (
                    <CardRow
                      key={card.id}
                      card={card}
                      actionLabel="Add"
                      actionClass="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-800"
                      onAction={() => onAddFromPool(card.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-700 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 font-semibold text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
